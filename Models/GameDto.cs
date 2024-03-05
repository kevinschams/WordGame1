namespace WordGame.Models;
public class GameDto
{
    public int GameId { get; set; }
    
    public string ApplicationUserId { get; set; }
    
    public string Status { get; set; }
    
    public string Guesses { get; set; }
    
    public string View { get; set; }
    
    public int RemainingGuesses { get; set; }
}
