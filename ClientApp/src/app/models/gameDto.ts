export interface GameDto {
    gameId: number;
    applicationUserId: string;
    status: string;
    guesses: number;
    view: string;
    remainingGuesses: number;
    target: string;
}
