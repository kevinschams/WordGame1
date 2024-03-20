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
        // private static ReadWordList(){
        //     string jsonContent = System.IO.File.ReadAllText(jsonFilePath);
        //     return JsonSerializer.Deserialize<WordList>(jsonContent);
        // }

        [HttpGet]
        public IActionResult GetAllGames()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier); 
            // var userId = _userManager.GetUserId(User);
            var games = _context.Games.Where(g => g.ApplicationUserId == userId).Select(g => new GameDto
            {
                GameId = g.GameId,
                ApplicationUserId = g.ApplicationUserId,
                Status = g.Status,
                Guesses = g.Guesses,
                View = g.View,
                RemainingGuesses = g.RemainingGuesses
            }).ToList();
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
                RemainingGuesses = game.RemainingGuesses
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
    if (!found)
    {
        game.RemainingGuesses--;
    }

    // Update game view and status
    game.View = new string(viewChars);
    if (game.View == target)
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

// using Microsoft.AspNetCore.Mvc;
// using Microsoft.AspNetCore.Authorization;
// using WordGame.Models;
// using WordGame.Data;
// using System;
// using System.Linq;
// using System.Text.Json;
// using System.Text;
// using Microsoft.AspNetCore.Identity;
// using Microsoft.EntityFrameworkCore;
// using System.Collections.Generic;

// [Authorize]
// [ApiController]
// [Route("api/[controller]")]
// public class GamePlayController : ControllerBase
// {
//     private readonly UserManager<ApplicationUser> _userManager;
//     private readonly ApplicationDbContext _dbContext;
//     private readonly WordList _wordList;

//     public GamePlayController(UserManager<ApplicationUser> userManager, ApplicationDbContext dbContext){
//         _userManager = userManager;
//         _dbContext = dbContext;
//         _wordList = LoadWordList();
//     }

//     private WordList LoadWordList(){
//         string jsonFilePath = "../Assets/wordList.json";
//         var json = System.IO.File.ReadAllText(jsonFilePath);
//         return JsonSerializer.Deserialize<WordList>(json);
//     }

//     [HttpGet]
//     public IActionResult GetAllGames(){
//         var userId = _userManager.GetUserId(User);
//         var games = _dbContext.Games.Where(g => g.ApplicationUserId == userId)
//                                     .Select(g => new GameDto
//                                     {
//                                         GameId = g.GameId,
//                                         Status = g.Status,
//                                         RemainingGuesses = g.RemainingGuesses
//                                     })
//                                     .ToList();
//         return Ok(games);
//     }

//     [HttpGet("{gameId}")]
//     public IActionResult GetSingleGame(int gameId)
//     {
//         var userId = _userManager.GetUserId(User);
//         var game = _dbContext.Games.FirstOrDefault(g => g.GameId == gameId && g.ApplicationUserId == userId);

//         if (game == null)
//         {
//             return NotFound("Game not found.");
//         }

//         var gameDto = new GameDto
//         {
//             GameId = game.GameId,
//             Status = game.Status,
//             RemainingGuesses = game.RemainingGuesses
//         };

//         return Ok(gameDto);
//     }

// [HttpPost]
// public GameDto CreateNewGame()
// {
//     var userId = _userManager.GetUserId(User);
//     var random = new Random();
//     var difficulty = "easy"; // Adjust as needed based on your game logic
//     var targetList = GetWordList(difficulty);
//     var target = targetList[random.Next(0, targetList.Count)];

//     var game = new Game
//     {
//         ApplicationUserId = userId,
//         Status = "Unfinished",
//         Target = target,
//         Guesses = "",
//         View = new string('_', target.Length),
//         RemainingGuesses = 8
//     };

//     _dbContext.Games.Add(game);
//     _dbContext.SaveChanges();

//     var gameDto = new GameDto
//     {
//         GameId = game.GameId,
//         Status = game.Status,
//         RemainingGuesses = game.RemainingGuesses
//     };

//     return gameDto;
// }

//     // [HttpPost]
//     // public IActionResult CreateNewGame()
//     // {
//     //     var userId = _userManager.GetUserId(User);
//     //     var random = new Random();
//     //     var difficulty = "easy"; // Adjust as needed based on your game logic
//     //     var targetList = GetWordList(difficulty);
//     //     var target = targetList[random.Next(0, targetList.Count)];

//     //     var game = new Game
//     //     {
//     //         ApplicationUserId = userId,
//     //         Status = "Unfinished",
//     //         Target = target,
//     //         Guesses = "",
//     //         View = new string('_', target.Length),
//     //         RemainingGuesses = 8
//     //     };

//     //     _dbContext.Games.Add(game);
//     //     _dbContext.SaveChanges();

//     //     var gameDto = new GameDto
//     //     {
//     //         GameId = game.GameId,
//     //         Status = game.Status,
//     //         RemainingGuesses = game.RemainingGuesses
//     //     };

//     //     return CreatedAtAction(nameof(GetSingleGame), new { gameId = game.GameId }, gameDto);
//     // }

//     private List<string> GetWordList(string difficulty)
//     {
//         switch (difficulty)
//         {
//             case "easy":
//                 return _wordList.Easy;
//             case "medium":
//                 return _wordList.Med;
//             case "hard":
//                 return _wordList.Hard;
//             default:
//                 throw new ArgumentException("Invalid difficulty level.");
//         }
//     }

//     [HttpPost("{gameId}/guesses")]
//     public IActionResult MakeGuess(int gameId, [FromQuery] string guess)
//     {
//         var userId = _userManager.GetUserId(User);
//         var game = _dbContext.Games.FirstOrDefault(g => g.GameId == gameId && g.ApplicationUserId == userId);
//         if (game == null)
//         {
//             return NotFound("Game not found.");
//         }
//         if (game.Status != "Unfinished")
//         {
//             return BadRequest("Cannot make guesses on finished games.");
//         }
//         if (guess.Length != 1 || !char.IsLetter(guess[0]))
//         {
//             return BadRequest("Invalid guess. Please provide a single letter.");
//         }
//         if (game.Guesses.Contains(guess[0]))
//         {
//             return BadRequest("You've already guessed this letter.");
//         }
//         var target = game.Target.ToLower();
//         var guessChar = char.ToLower(guess[0]);
//         var view = game.View.ToCharArray();
//         var newView = new StringBuilder(game.View);
//         bool found = false;
//         for (int i = 0; i < target.Length; i++)
//         {
//             if (target[i] == guessChar)
//             {
//                 view[i] = guess[0];
//                 found = true;
//             }
//         }
//         if (!found)
//         {
//             game.RemainingGuesses--;
//         }
//         game.Guesses += guessChar;
//         game.View = new string(view);
//         if (game.View == game.Target)
//         {
//             game.Status = "Win";
//         }
//         else if (game.RemainingGuesses == 0)
//         {
//             game.Status = "Loss";
//         }
//         _dbContext.SaveChanges();
//         return Ok(new GameDto
//         {
//             GameId = game.GameId,
//             Status = game.Status,
//             RemainingGuesses = game.RemainingGuesses
//         });
//     }

//     [HttpDelete("{gameId}")]
//     public IActionResult DeleteGame(int gameId)
//     {
//         var userId = _userManager.GetUserId(User);
//         var game = _dbContext.Games.FirstOrDefault(g => g.GameId == gameId && g.ApplicationUserId == userId);
//         if (game == null)
//         {
//             return NotFound("Game not found.");
//         }
//         _dbContext.Games.Remove(game);
//         _dbContext.SaveChanges();
//         return Ok(GetAllGames());
//     }
// }

// // using Microsoft.AspNetCore.Mvc;
// // using Microsoft.AspNetCore.Authorization;
// // using WordGame.Models;
// // using WordGame.Data;
// // using System;
// // using System.Linq;
// // using System.Text.Json;
// // using System.Text;
// // using System.Security.Claims;

// // [Authorize]
// // [ApiController]
// // [Route("api/gameplay")]
// // public class GamePlayController : ControllerBase
// // {
// //     private readonly ApplicationUser _context;
// //     private readonly ApplicationDbContext _dbContext;
// //     private readonly WordList _wordList;


// //     public GamePlayController(ApplicationUser applicationUser, ApplicationDbContext dbContext)
// //     {
// //         _context = applicationUser;
// //         _dbContext = dbContext;
// //         _wordList = LoadWordList();
// //     }


// //     private WordList LoadWordList()
// //     {
// //         string jsonFilePath = "./wordList.json";
// //         var json = System.IO.File.ReadAllText(jsonFilePath);
        
// //         return JsonSerializer.Deserialize<WordList>(json);
// //     }

// //     [HttpGet]
// //     public IActionResult GetAllGames()
// //     {
// //         var userId = User.Identity.Name; // Assuming ApplicationUser has a UserName property
// //         var games = _context.Games.Where(g => g.ApplicationUserId == userId)
// //                                   .Select(g => new GameDto
// //                                   {
// //                                       GameId = g.GameId,
// //                                       Status = g.Status,
// //                                       RemainingGuesses = g.RemainingGuesses
// //                                   })
// //                                   .ToList();
// //         return Ok(games);
// //     }

// //     [HttpGet("{gameId}")]
// //     public IActionResult GetSingleGame(int gameId)
// //     {
// //         var userId = User.Identity.Name;
// //         var game = _context.Games.FirstOrDefault(g => g.GameId == gameId && g.ApplicationUserId == userId);

// //         if (game == null)
// //         {
// //             return NotFound("Game not found.");
// //         }

// //         var gameDto = new GameDto
// //         {
// //             GameId = game.GameId,
// //             Status = game.Status,
// //             RemainingGuesses = game.RemainingGuesses
// //         };

// //         return Ok(gameDto);
// //     }


// //     [HttpPost]
// //     public IActionResult CreateNewGame()
// //     {
// //         var userId = User.Identity.Name; // Assuming ApplicationUser has a UserName property
// //         var random = new Random();
// //         var difficulty = "easy"; // Adjust as needed based on your game logic
// //         var targetList = GetWordList(difficulty);
// //         var target = targetList[random.Next(0, targetList.Count)];

// //         var game = new Game
// //         {
// //             ApplicationUserId = userId,
// //             Status = "Unfinished",
// //             Target = target,
// //             Guesses = "",
// //             View = new string('_', target.Length),
// //             RemainingGuesses = 8
// //         };

// //         _context.Games.Add(game);
// //         _dbContext.SaveChanges();

// //         var gameDto = new GameDto
// //         {
// //             GameId = game.GameId,
// //             Status = game.Status,
// //             RemainingGuesses = game.RemainingGuesses
// //         };

// //         return CreatedAtAction(nameof(GetSingleGame), new { gameId = game.GameId }, gameDto);
// //     }

// //     private List<string> GetWordList(string difficulty)
// //     {
// //         switch (difficulty)
// //         {
// //             case "easy":
// //                 return _wordList.Easy;
// //             case "medium":
// //                 return _wordList.Med;
// //             case "hard":
// //                 return _wordList.Hard;
// //             default:
// //                 throw new ArgumentException("Invalid difficulty level.");
// //         }
// //     }

// //   [HttpPost("{gameId}/guesses")]
// //     public IActionResult MakeGuess(int gameId, [FromQuery] string guess)
// //     {
// //         var userId = User.Identity.Name; // Assuming ApplicationUser has a UserName property
// //         var game = _context.Games.FirstOrDefault(g => g.GameId == gameId && g.ApplicationUserId == userId);
// //         if (game == null)
// //         {
// //             return NotFound("Game not found.");
// //         }
// //         if (game.Status != "Unfinished")
// //         {
// //             return BadRequest("Cannot make guesses on finished games.");
// //         }
// //         if (guess.Length != 1 || !char.IsLetter(guess[0]))
// //         {
// //             return BadRequest("Invalid guess. Please provide a single letter.");
// //         }
// //         if (game.Guesses.Contains(guess[0]))
// //         {
// //             return BadRequest("You've already guessed this letter.");
// //         }
// //         var target = game.Target.ToLower();
// //         var guessChar = char.ToLower(guess[0]);
// //         var view = game.View.ToCharArray();
// //         var newView = new StringBuilder(game.View);
// //         bool found = false;
// //         for (int i = 0; i < target.Length; i++)
// //         {
// //             if (target[i] == guessChar)
// //             {
// //                 view[i] = guess[0];
// //                 found = true;
// //             }
// //         }
// //         if (!found)
// //         {
// //             game.RemainingGuesses--;
// //         }
// //         game.Guesses += guessChar;
// //         game.View = new string(view);
// //         if (game.View == game.Target)
// //         {
// //             game.Status = "Win";
// //         }
// //         else if (game.RemainingGuesses == 0)
// //         {
// //             game.Status = "Loss";
// //         }
// //         _dbContext.SaveChanges();
// //         return Ok(new GameDto
// //         {
// //             GameId = game.GameId,
// //             Status = game.Status,
// //             RemainingGuesses = game.RemainingGuesses
// //         });
// //     }

// //     [HttpDelete("{gameId}")]
// //     public IActionResult DeleteGame(int gameId)
// //     {
// //         var userId = User.Identity.Name; // Assuming ApplicationUser has a UserName property
// //         var game = _context.Games.FirstOrDefault(g => g.GameId == gameId && g.ApplicationUserId == userId);
// //         if (game == null)
// //         {
// //             return NotFound("Game not found.");
// //         }
// //         _context.Games.Remove(game);
// //         _dbContext.SaveChanges();
// //         return Ok(GetAllGames());
// //     }

// // }
