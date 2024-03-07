export interface GameDto {
    gameId: number;
    applicationUserId: string;
    status: string;
    guesses: string;
    view: string;
    remainingGuesses: number;
}
