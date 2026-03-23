import React from "react";
import { History, Clock } from "lucide-react";
import type { Game } from "../db/schema";

interface GameHistoryProps {
  history: Game[];
}

const GameHistory: React.FC<GameHistoryProps> = ({ history }) => {
  // Format date to a readable string
  const formatDate = (date: Date | string) => {
    const d = new Date(date);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(d);
  };

  // Get result text based on winner
  const getResultText = (game: Game) => {
    if (game.winner) {
      return (
        <>
          <span className="font-bold">{game.winner}</span>
          <span className="text-gray-500"> defeated </span>
          <span className="font-medium">
            {game.winner === game.playerX ? game.playerO : game.playerX}
          </span>
        </>
      );
    }
    return (
      <>
        <span className="font-medium">{game.playerX}</span>
        <span className="text-gray-500"> vs </span>
        <span className="font-medium">{game.playerO}</span>
        <span className="text-gray-500"> - Draw</span>
      </>
    );
  };

  // Get appropriate color class based on winner
  const getResultColorClass = (game: Game) => {
    if (!game.winner) return "text-gray-600";
    return "text-green-600";
  };

  return (
    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
      <h2 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
        <History className="h-5 w-5 text-blue-500" />
        Game History
      </h2>

      <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
        {history.length === 0 ? (
          <p className="text-gray-500 text-sm italic">No games played yet</p>
        ) : (
          [...history].reverse().map((game) => (
            <div
              key={game.id}
              className="p-2 bg-white rounded border border-gray-200 text-sm"
            >
              <div className="flex justify-between items-start mb-1">
                <span className={`${getResultColorClass(game)}`}>
                  {getResultText(game)}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs text-gray-500">
                <span>{game.moves} moves</span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {formatDate(game.createdAt)}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default GameHistory;
