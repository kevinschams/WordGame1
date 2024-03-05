using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WordGame.Models;
public class Game
{
    [Key]
    public int GameId { get; set; }
    [ForeignKey("ApplicationUser")]
    public string ApplicationUserId { get; set; }
    public ApplicationUser ApplicationUser { get; set; }

    public string Status { get; set; } = "Unfinished";

    public string Target { get; set; }

    public string Guesses { get; set; }

    public string View { get; set; }

    [Range(0, 8)]
    public int RemainingGuesses { get; set; } = 8;
}
