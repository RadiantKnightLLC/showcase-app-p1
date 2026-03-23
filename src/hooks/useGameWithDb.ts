import { useState, useEffect, useCallback } from "react";
import { getDb, initDatabase } from "../db/client";
import { games } from "../db/schema";
import { desc } from "drizzle-orm";
import type { Game } from "../db/schema";
import { calculateWinner, checkDraw } from "../utils/gameLogic";

interface UseGameWithDbReturn {
  // Game state
  board: (string | null)[];
  xIsNext: boolean;
  gameStatus: "playing" | "won" | "draw";
  winningLine: number[] | null;
  
  // Player names
  playerX: string;
  playerO: string;
  setPlayerNames: (x: string, o: string) => void;
  
  // UI State
  showSetup: boolean;
  
  // Scores and history
  scores: { X: number; O: number; draws: number };
  gameHistory: Game[];
  
  // Loading state
  isLoading: boolean;
  
  // Actions
  handleClick: (index: number) => void;
  resetGame: () => void;
  resetStats: () => Promise<void>;
  startNewGame: () => void;
  
  // Status message
  getStatusMessage: () => string;
}

export function useGameWithDb(): UseGameWithDbReturn {
  // Initialize database on mount
  const [isLoading, setIsLoading] = useState(true);
  
  // Game state
  const [board, setBoard] = useState<(string | null)[]>(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [gameStatus, setGameStatus] = useState<"playing" | "won" | "draw">("playing");
  const [winningLine, setWinningLine] = useState<number[] | null>(null);
  
  // Player names
  const [playerX, setPlayerX] = useState("");
  const [playerO, setPlayerO] = useState("");
  const [showSetup, setShowSetup] = useState(true);
  
  // Scores and history
  const [scores, setScores] = useState({ X: 0, O: 0, draws: 0 });
  const [gameHistory, setGameHistory] = useState<Game[]>([]);
  
  // Set player names from setup
  const setPlayerNames = (x: string, o: string) => {
    setPlayerX(x);
    setPlayerO(o);
    setShowSetup(false);
  };
  
  // Start a new game (show setup)
  const startNewGame = () => {
    resetGame();
    setShowSetup(true);
  };
  
  // Initialize database and load history
  useEffect(() => {
    async function init() {
      try {
        await initDatabase();
        await loadGameHistory();
        await calculateScores();
      } catch (error) {
        console.error("Failed to initialize database:", error);
      } finally {
        setIsLoading(false);
      }
    }
    init();
  }, []);
  
  // Load game history from database
  const loadGameHistory = async () => {
    try {
      const db = await getDb();
      const history = await db.select().from(games).orderBy(desc(games.createdAt));
      setGameHistory(history);
    } catch (error) {
      console.error("Failed to load game history:", error);
    }
  };
  
  // Calculate scores from database
  const calculateScores = async () => {
    try {
      const db = await getDb();
      const allGames = await db.select().from(games);
      
      const newScores = { X: 0, O: 0, draws: 0 };
      allGames.forEach(game => {
        if (game.winner === null) {
          newScores.draws++;
        } else if (game.winner === game.playerX) {
          newScores.X++;
        } else {
          newScores.O++;
        }
      });
      setScores(newScores);
    } catch (error) {
      console.error("Failed to calculate scores:", error);
    }
  };
  
  // Save completed game to database
  const saveGame = async (winner: string | null) => {
    try {
      const db = await getDb();
      await db.insert(games).values({
        playerX,
        playerO,
        winner,
        boardState: board,
        moves: board.filter(cell => cell !== null).length,
      });
      await loadGameHistory();
      await calculateScores();
    } catch (error) {
      console.error("Failed to save game:", error);
    }
  };
  
  // Check for winner or draw
  useEffect(() => {
    if (gameStatus !== "playing") return;
    
    const result = calculateWinner(board);
    
    if (result) {
      setGameStatus("won");
      setWinningLine(result.line);
      // Save game to database with actual player name as winner
      const winnerName = result.winner === "X" ? playerX : playerO;
      saveGame(winnerName);
    } else if (checkDraw(board)) {
      setGameStatus("draw");
      saveGame(null);
    }
  }, [board, gameStatus, playerX, playerO]);
  
  // Handle square click
  const handleClick = useCallback((index: number) => {
    if (board[index] || gameStatus !== "playing") return;
    
    const newBoard = [...board];
    newBoard[index] = xIsNext ? "X" : "O";
    
    setBoard(newBoard);
    setXIsNext(!xIsNext);
  }, [board, xIsNext, gameStatus]);
  
  // Reset the game (keep same players)
  const resetGame = useCallback(() => {
    setBoard(Array(9).fill(null));
    setXIsNext(true);
    setGameStatus("playing");
    setWinningLine(null);
  }, []);
  
  // Reset all stats (clear database)
  const resetStats = async () => {
    try {
      const db = await getDb();
      await db.delete(games);
      setScores({ X: 0, O: 0, draws: 0 });
      setGameHistory([]);
      resetGame();
      setShowSetup(true);
    } catch (error) {
      console.error("Failed to reset stats:", error);
    }
  };
  
  // Get current game status message
  const getStatusMessage = () => {
    if (gameStatus === "won") {
      const winner = !xIsNext ? playerX : playerO;
      return `${winner} wins!`;
    } else if (gameStatus === "draw") {
      return "It's a draw!";
    } else {
      return `${xIsNext ? playerX : playerO}'s turn`;
    }
  };
  
  return {
    board,
    xIsNext,
    gameStatus,
    winningLine,
    playerX,
    playerO,
    setPlayerNames,
    showSetup,
    scores,
    gameHistory,
    isLoading,
    handleClick,
    resetGame,
    resetStats,
    startNewGame,
    getStatusMessage,
  };
}
