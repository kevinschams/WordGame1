using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using WordGame.Models;
using WordGame.Data;
using System;
using System.Linq;
using System.Text.Json;
using System.Text;

[Authorize]
[ApiController]
[Route("api/gameplay")]
public class GamePlayController : ControllerBase
{
    private readonly ApplicationUser _context;
    private readonly ApplicationDbContext _dbContext;
    private readonly WordList _wordList;

    public GamePlayController(ApplicationUser context)
    {
        _context = context;
        _wordList = LoadWordList();
    }

    private WordList LoadWordList()
    {
        string jsonFilePath = "./wordList.json";
        var json = System.IO.File.ReadAllText(jsonFilePath);
        return JsonSerializer.Deserialize<WordList>(json);
    }

    [HttpGet]
    public IActionResult GetAllGames()
    {
        var userId = User.Identity.Name; // Assuming ApplicationUser has a UserName property
        var games = _context.Games.Where(g => g.ApplicationUserId == userId)
                                  .Select(g => new GameDto
                                  {
                                      GameId = g.GameId,
                                      Status = g.Status,
                                      RemainingGuesses = g.RemainingGuesses
                                  })
                                  .ToList();
        return Ok(games);
    }

    [HttpGet("{gameId}")]
    public IActionResult GetSingleGame(int gameId)
    {
        var userId = User.Identity.Name;
        var game = _context.Games.FirstOrDefault(g => g.GameId == gameId && g.ApplicationUserId == userId);

        if (game == null)
        {
            return NotFound("Game not found.");
        }

        var gameDto = new GameDto
        {
            GameId = game.GameId,
            Status = game.Status,
            RemainingGuesses = game.RemainingGuesses
        };

        return Ok(gameDto);
    }


    [HttpPost]
    public IActionResult CreateNewGame()
    {
        var userId = User.Identity.Name; // Assuming ApplicationUser has a UserName property
        var random = new Random();
        var difficulty = "easy"; // Adjust as needed based on your game logic
        var targetList = GetWordList(difficulty);
        var target = targetList[random.Next(0, targetList.Count)];

        var game = new Game
        {
            ApplicationUserId = userId,
            Status = "Unfinished",
            Target = target,
            Guesses = "",
            View = new string('_', target.Length),
            RemainingGuesses = 8
        };

        _context.Games.Add(game);
        _dbContext.SaveChanges();

        var gameDto = new GameDto
        {
            GameId = game.GameId,
            Status = game.Status,
            RemainingGuesses = game.RemainingGuesses
        };

        return CreatedAtAction(nameof(GetSingleGame), new { gameId = game.GameId }, gameDto);
    }

    private List<string> GetWordList(string difficulty)
    {
        switch (difficulty)
        {
            case "easy":
                return _wordList.Easy;
            case "medium":
                return _wordList.Med;
            case "hard":
                return _wordList.Hard;
            default:
                throw new ArgumentException("Invalid difficulty level.");
        }
    }

  [HttpPost("{gameId}/guesses")]
    public IActionResult MakeGuess(int gameId, [FromQuery] string guess)
    {
        var userId = User.Identity.Name; // Assuming ApplicationUser has a UserName property
        var game = _context.Games.FirstOrDefault(g => g.GameId == gameId && g.ApplicationUserId == userId);
        if (game == null)
        {
            return NotFound("Game not found.");
        }
        if (game.Status != "Unfinished")
        {
            return BadRequest("Cannot make guesses on finished games.");
        }
        if (guess.Length != 1 || !char.IsLetter(guess[0]))
        {
            return BadRequest("Invalid guess. Please provide a single letter.");
        }
        if (game.Guesses.Contains(guess[0]))
        {
            return BadRequest("You've already guessed this letter.");
        }
        var target = game.Target.ToLower();
        var guessChar = char.ToLower(guess[0]);
        var view = game.View.ToCharArray();
        var newView = new StringBuilder(game.View);
        bool found = false;
        for (int i = 0; i < target.Length; i++)
        {
            if (target[i] == guessChar)
            {
                view[i] = guess[0];
                found = true;
            }
        }
        if (!found)
        {
            game.RemainingGuesses--;
        }
        game.Guesses += guessChar;
        game.View = new string(view);
        if (game.View == game.Target)
        {
            game.Status = "Win";
        }
        else if (game.RemainingGuesses == 0)
        {
            game.Status = "Loss";
        }
        _dbContext.SaveChanges();
        return Ok(new GameDto
        {
            GameId = game.GameId,
            Status = game.Status,
            RemainingGuesses = game.RemainingGuesses
        });
    }

    [HttpDelete("{gameId}")]
    public IActionResult DeleteGame(int gameId)
    {
        var userId = User.Identity.Name; // Assuming ApplicationUser has a UserName property
        var game = _context.Games.FirstOrDefault(g => g.GameId == gameId && g.ApplicationUserId == userId);
        if (game == null)
        {
            return NotFound("Game not found.");
        }
        _context.Games.Remove(game);
        _dbContext.SaveChanges();
        return Ok(GetAllGames());
    }

}
