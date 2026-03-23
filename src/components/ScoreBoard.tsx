import React from "react";
import { Trophy, User, Users } from "lucide-react";

interface ScoreBoardProps {
  scores: {
    X: number;
    O: number;
    draws: number;
  };
  playerX: string;
  playerO: string;
  onPlayerXChange: (name: string) => void;
  onPlayerOChange: (name: string) => void;
}

const ScoreBoard: React.FC<ScoreBoardProps> = ({ 
  scores, 
  playerX, 
  playerO,
  onPlayerXChange,
  onPlayerOChange
}) => {
  return (
    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
      <h2 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
        <Trophy className="h-5 w-5 text-yellow-500" />
        Score Board
      </h2>

      <div className="space-y-2">
        <div className="flex justify-between items-center p-2 bg-indigo-50 rounded">
          <div className="flex items-center gap-2 flex-1">
            <User className="h-4 w-4 text-indigo-600" />
            <input
              type="text"
              value={playerX}
              onChange={(e) => onPlayerXChange(e.target.value)}
              className="bg-transparent font-medium text-indigo-900 w-full outline-none border-b border-indigo-300 focus:border-indigo-600"
              placeholder="Player X"
              maxLength={20}
            />
          </div>
          <span className="text-lg font-bold text-indigo-600 ml-2">{scores.X}</span>
        </div>

        <div className="flex justify-between items-center p-2 bg-purple-50 rounded">
          <div className="flex items-center gap-2 flex-1">
            <User className="h-4 w-4 text-purple-600" />
            <input
              type="text"
              value={playerO}
              onChange={(e) => onPlayerOChange(e.target.value)}
              className="bg-transparent font-medium text-purple-900 w-full outline-none border-b border-purple-300 focus:border-purple-600"
              placeholder="Player O"
              maxLength={20}
            />
          </div>
          <span className="text-lg font-bold text-purple-600 ml-2">{scores.O}</span>
        </div>

        <div className="flex justify-between items-center p-2 bg-gray-100 rounded">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-gray-600" />
            <span className="font-medium">Draws</span>
          </div>
          <span className="text-lg font-bold text-gray-600">
            {scores.draws}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ScoreBoard;
