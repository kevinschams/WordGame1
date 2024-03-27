using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using WordGame.Data;
using WordGame.Models;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text.Json;
using System.Security.Claims;

namespace WordGame.Controllers
{
    [Authorize] // Ensure only authenticated users can access endpoints on this controller
    [ApiController]
    [Route("api/[controller]")]
    public class GamePlayController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<IdentityUser> _userManager;
        private readonly WordList _wordList;


        public GamePlayController(ApplicationDbContext context, UserManager<IdentityUser> userManager)
        {

            _context = context;
            _userManager = userManager;

            // Load word list from JSON file
            // string jsonFilePath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "wordlist.json");
            string jsonFilePath = "../WordGame1/Assets/wordlist.json";
            // Console.WriteLine(jsonFilePath);
            string json = System.IO.File.ReadAllText(jsonFilePath);
            _wordList = JsonSerializer.Deserialize<WordList>(json);
            // _wordList = ReadWordList();
        }


        // [HttpGet]
        // public IActionResult GetAllGames()
        // {
        //     var userId = User.FindFirstValue(ClaimTypes.NameIdentifier); 
        //     // var userId = _userManager.GetUserId(User);

        //     var games = _context.Games.Where(g => g.ApplicationUserId == userId).Select(g => new GameDto
        //     {
        //         GameId = g.GameId,
        //         ApplicationUserId = g.ApplicationUserId,
        //         Status = g.Status,
        //         Guesses = g.Guesses,
        //         View = g.View,
        //         RemainingGuesses = g.RemainingGuesses,
        //         Target = g.Target
        //     }).ToList();
        //     return Ok(games);
        // }
        [HttpGet]
        public IActionResult GetAllGames()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier); 

            var games = _context.Games
                .Where(g => g.ApplicationUserId == userId)
                .Select(g => new GameDto
                {
                    GameId = g.GameId,
                    ApplicationUserId = g.ApplicationUserId,
                    Status = g.Status,
                    Guesses = g.Guesses,
                    View = g.View,
                    RemainingGuesses = g.RemainingGuesses,
                    Target = g.Status == "Win" || g.Status == "Loss" ? g.Target : null // Only include the Target property if status is 'Win' or 'Loss'
                })
                .ToList();

            return Ok(games);
        }


        [HttpGet("{gameId}")]
        public IActionResult GetSingleGame(int gameId)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier); 
            // var userId = _userManager.GetUserId(User);
            var game = _context.Games.FirstOrDefault(g => g.GameId == gameId && g.ApplicationUserId == userId);
            if (game == null)
                return NotFound(); // Game not found or not owned by the user
            var gameDto = new GameDto
            {
                GameId = game.GameId,
                ApplicationUserId = game.ApplicationUserId,
                Status = game.Status,
                Guesses = game.Guesses,
                View = game.View,
                RemainingGuesses = game.RemainingGuesses,
                Target = game.Status == "Win" || game.Status == "Loss" ? game.Target : null
            };
            return Ok(gameDto);
        }

        [HttpPost]
        public IActionResult CreateNewGame()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier); 
            // var userId = _userManager.GetUserId(User);
            var random = new Random();
            var difficulty = "med"; // Adjust as needed based on your game logic
            var targetList = GetWordList(difficulty);
            var target = targetList[random.Next(0, targetList.Count)];

            var game = new Game
            {
                ApplicationUserId = userId,
                // Status = "Unfinished",
                Target = target,
                Guesses = "",
                View = new string('_', target.Length),
                RemainingGuesses = 8
            };

            var word = "";
            if(game.Status == "Win" || game.Status == "Loss"){
                word = game.Target;
            }
            _context.Games.Add(game);
            _context.SaveChanges();


            var gameDto = new GameDto
            {
                GameId = game.GameId,
                ApplicationUserId = game.ApplicationUserId,
                Status = game.Status,
                Guesses = game.Guesses,
                View = game.View,
                RemainingGuesses = game.RemainingGuesses,
                Target = word
            };

            // return CreatedAtAction(nameof(GetSingleGame), new { gameId = game.GameId }, gameDto);
            return Ok(gameDto);
        }

        [HttpPost("{gameId}/guesses")]
    public IActionResult MakeGuess(int gameId, [FromQuery] string guess)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var game = _context.Games.FirstOrDefault(g => g.GameId == gameId && g.ApplicationUserId == userId);
        if (game == null)
            return NotFound(); // Game not found or not owned by the user

        // Check if the guess is correct and update the view property
        var target = game.Target.ToLower();
        var guessChar = char.ToLower(guess[0]);
        var viewChars = game.View.ToCharArray();
        bool found = false;
        for (int i = 0; i < target.Length; i++)
        {
            if (target[i] == guessChar)
            {
                viewChars[i] = guess[0];
                found = true;
            }
        }

        // Update game state based on guess
        // if (!found)
        if(true)
        {
            game.RemainingGuesses--;
        }

        // Update game view and status
        game.View = new string(viewChars);
        if (game.View == game.Target)
        {
            game.Status = "Win";
        }
        else if (game.RemainingGuesses == 0)
        {
            game.Status = "Loss";
        }
                
        var word = "";
            if(game.Status == "Win" || game.Status == "Loss"){
                word = game.Target;
            }
        // Save changes to the database
        _context.SaveChanges();

        // Create a new GameDto object with updated properties
        var gameDto = new GameDto
        {
            GameId = game.GameId,
            ApplicationUserId = game.ApplicationUserId,
            Status = game.Status,
            Guesses = game.Guesses,
            View = game.View,
            RemainingGuesses = game.RemainingGuesses,
            Target = word
        };

        // Return the updated GameDto object
        return Ok(gameDto);
    }

        [HttpDelete("{gameId}")]
        public IActionResult DeleteGame(int gameId)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier); 
            // var userId = _userManager.GetUserId(User);
            var game = _context.Games.FirstOrDefault(g => g.GameId == gameId && g.ApplicationUserId == userId);
            if (game == null)
                return NotFound(); // Game not found or not owned by the user

            _context.Games.Remove(game);
            _context.SaveChanges();

            return NoContent();
        }

        // Helper method to get word list based on difficulty
        private List<string> GetWordList(string difficulty)
        {
            switch (difficulty.ToLower())
            {
                case "easy":
                    return _wordList.Easy;
                case "easy_med":
                    return _wordList.EasyMed;
                case "med":
                    return _wordList.Med;
                case "med_hard":
                    return _wordList.MedHard;
                case "hard":
                    return _wordList.Hard;
                default:
                    return _wordList.Easy; // Default to easy if difficulty is not recognized
            }
        }

    }
    
}

