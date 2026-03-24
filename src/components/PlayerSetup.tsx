import React, { useState, useEffect } from "react";
import { Users, Play, History } from "lucide-react";

interface PlayerSetupProps {
  onStartGame: (playerX: string, playerO: string) => void;
  previousPlayers?: { playerX: string; playerO: string } | null;
}

const PlayerSetup: React.FC<PlayerSetupProps> = ({ onStartGame, previousPlayers }) => {
  const [playerX, setPlayerX] = useState("");
  const [playerO, setPlayerO] = useState("");
  const [error, setError] = useState("");

  // Load previous player names from localStorage on mount
  useEffect(() => {
    const savedX = localStorage.getItem("tictactoe-last-player-x");
    const savedO = localStorage.getItem("tictactoe-last-player-o");
    if (savedX) setPlayerX(savedX);
    if (savedO) setPlayerO(savedO);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!playerX.trim() || !playerO.trim()) {
      setError("Please enter names for both players");
      return;
    }
    
    if (playerX.trim() === playerO.trim()) {
      setError("Players must have different names");
      return;
    }
    
    // Save to localStorage for next time
    localStorage.setItem("tictactoe-last-player-x", playerX.trim());
    localStorage.setItem("tictactoe-last-player-o", playerO.trim());
    
    onStartGame(playerX.trim(), playerO.trim());
  };

  const usePreviousPlayers = () => {
    if (previousPlayers) {
      localStorage.setItem("tictactoe-last-player-x", previousPlayers.playerX);
      localStorage.setItem("tictactoe-last-player-o", previousPlayers.playerO);
      onStartGame(previousPlayers.playerX, previousPlayers.playerO);
    }
  };

  // Check if we have previous players from localStorage or props
  const hasPreviousPlayers = previousPlayers || 
    (localStorage.getItem("tictactoe-last-player-x") && localStorage.getItem("tictactoe-last-player-o"));

  const getPreviousPlayerNames = () => {
    if (previousPlayers) {
      return `${previousPlayers.playerX} vs ${previousPlayers.playerO}`;
    }
    const x = localStorage.getItem("tictactoe-last-player-x");
    const o = localStorage.getItem("tictactoe-last-player-o");
    if (x && o) return `${x} vs ${o}`;
    return null;
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-full mb-4">
            <Users className="h-8 w-8 text-indigo-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">New Game</h2>
          <p className="text-gray-600 mt-1">Enter player names to begin</p>
        </div>

        {/* Quick option to use previous players */}
        {hasPreviousPlayers && (
          <div className="mb-6 p-4 bg-indigo-50 rounded-lg border border-indigo-200">
            <div className="flex items-center gap-2 mb-2 text-indigo-800">
              <History className="h-4 w-4" />
              <span className="font-medium">Previous Players</span>
            </div>
            <button
              onClick={usePreviousPlayers}
              className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg transition-colors"
            >
              <Play className="h-4 w-4" />
              Play Again: {getPreviousPlayerNames()}
            </button>
            <div className="mt-3 text-center text-sm text-gray-500">
              — or enter new names below —
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Player X
            </label>
            <input
              type="text"
              value={playerX}
              onChange={(e) => {
                setPlayerX(e.target.value);
                setError("");
              }}
              placeholder="Enter name..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              maxLength={20}
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Player O
            </label>
            <input
              type="text"
              value={playerO}
              onChange={(e) => {
                setPlayerO(e.target.value);
                setError("");
              }}
              placeholder="Enter name..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
              maxLength={20}
            />
          </div>

          {error && (
            <div className="text-red-600 text-sm bg-red-50 p-2 rounded">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-medium transition-colors"
          >
            <Play className="h-5 w-5" />
            Start New Game
          </button>
        </form>
      </div>
    </div>
  );
};

export default PlayerSetup;
