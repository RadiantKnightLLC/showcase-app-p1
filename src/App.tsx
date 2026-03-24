import { useGameWithDb } from "./hooks/useGameWithDb";
import Board from "./components/Board";
import ScoreBoard from "./components/ScoreBoard";
import GameHistory from "./components/GameHistory";
import PlayerSetup from "./components/PlayerSetup";
import { RefreshCw, Award, Database, Users } from "lucide-react";
import "./index.css";

function App() {
  const {
    board,
    winningLine,
    playerX,
    playerO,
    setPlayerNames,
    previousPlayers,
    showSetup,
    scores,
    gameHistory,
    isLoading,
    handleClick,
    resetGame,
    resetStats,
    startNewGame,
    getStatusMessage,
  } = useGameWithDb();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100 flex flex-col items-center justify-center p-4">
      {/* Player Setup Modal */}
      {showSetup && (
        <PlayerSetup 
          onStartGame={setPlayerNames} 
          previousPlayers={previousPlayers}
        />
      )}

      <div className="max-w-4xl w-full bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-6 bg-indigo-600 text-white text-center">
          <h1 className="text-3xl font-bold flex items-center justify-center gap-2">
            <Award className="h-8 w-8" />
            Tic Tac Toe
          </h1>
          <p className="text-indigo-200 mt-1 flex items-center justify-center gap-2">
            <Database className="h-4 w-4" />
            Powered by PGlite + Drizzle ORM
          </p>
        </div>

        <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Game section */}
          <div className="md:col-span-2 flex flex-col items-center">
            <div className="mb-4 text-center">
              <h2 className="text-xl font-semibold text-indigo-800">
                {isLoading ? "Loading..." : getStatusMessage()}
              </h2>
            </div>

            <Board
              squares={board}
              onClick={handleClick}
              winningLine={winningLine}
            />

            <div className="mt-6 flex gap-4">
              <button
                onClick={startNewGame}
                disabled={isLoading || showSetup}
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
              >
                <Users className="h-4 w-4" />
                New Game
              </button>
              <button
                onClick={resetGame}
                disabled={isLoading || showSetup}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
              >
                <RefreshCw className="h-4 w-4" />
                Rematch
              </button>
              <button
                onClick={resetStats}
                disabled={isLoading}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
              >
                Reset All
              </button>
            </div>
          </div>

          {/* Stats section */}
          <div className="flex flex-col gap-6">
            {!showSetup && (
              <ScoreBoard 
                scores={scores} 
                playerX={playerX}
                playerO={playerO}
              />
            )}
            <GameHistory history={gameHistory} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
