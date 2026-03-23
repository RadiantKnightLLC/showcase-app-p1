import React, { useState } from "react";
import { Users, Play } from "lucide-react";

interface PlayerSetupProps {
  onStartGame: (playerX: string, playerO: string) => void;
}

const PlayerSetup: React.FC<PlayerSetupProps> = ({ onStartGame }) => {
  const [playerX, setPlayerX] = useState("");
  const [playerO, setPlayerO] = useState("");
  const [error, setError] = useState("");

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
    
    onStartGame(playerX.trim(), playerO.trim());
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
            className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-medium transition-colors"
          >
            <Play className="h-5 w-5" />
            Start Game
          </button>
        </form>
      </div>
    </div>
  );
};

export default PlayerSetup;
