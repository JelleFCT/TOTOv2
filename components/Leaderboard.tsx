
import React, { useState, useEffect } from 'react';
import { UserPoule } from '../types';
import { generateLeaderboardRoast } from '../geminiService';
import { Trophy, MessageSquareQuote } from 'lucide-react';

interface LeaderboardProps {
  users: UserPoule[];
  compact?: boolean;
}

const Leaderboard: React.FC<LeaderboardProps> = ({ users, compact = false }) => {
  const [roast, setRoast] = useState<string | null>(null);

  useEffect(() => {
    if (!compact && users.length >= 2) {
      const fetchRoast = async () => {
        const text = await generateLeaderboardRoast(users[0].name, users[users.length - 1].name);
        setRoast(text);
      };
      fetchRoast();
    }
  }, [users, compact]);

  return (
    <div className="space-y-4">
      {!compact && roast && (
        <div className="bg-red-50 p-4 rounded-2xl border border-red-100 flex items-start space-x-3 shadow-sm">
            <MessageSquareQuote className="text-red-600 shrink-0" size={20} />
            <p className="text-sm italic text-red-800 font-medium leading-relaxed">{roast}</p>
        </div>
      )}

      <div className="bg-white rounded-[1.5rem] shadow-md border border-slate-100 overflow-hidden">
        {users.map((user, index) => (
          <div 
            key={user.id} 
            className={`flex items-center p-4 border-b border-slate-50 last:border-0 transition-colors ${user.id === 'me' ? 'bg-red-50/50' : ''}`}
          >
            <div className={`w-8 text-center font-black ${index < 3 ? 'text-red-600' : 'text-slate-300'}`}>
              {index + 1}
            </div>
            
            <div className="relative">
                <img 
                src={user.avatar} 
                alt={user.name} 
                className={`w-11 h-11 rounded-full border-2 shadow-sm mr-3 object-cover ${user.id === 'me' ? 'border-red-500' : 'border-white'}`} 
                />
                {index === 0 && (
                    <div className="absolute -top-1 -right-1 bg-yellow-400 rounded-full p-0.5 border border-white">
                        <Trophy size={10} className="text-white" />
                    </div>
                )}
            </div>
            
            <div className="flex-1">
              <p className={`font-bold text-sm ${user.id === 'me' ? 'text-red-800 underline decoration-red-200' : 'text-slate-800'}`}>
                {user.name === 'You (Twenthe Guest)' ? 'Jij (Gast)' : user.name}
              </p>
              {!compact && (
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                  {user.predictions?.length || 0} Gespeeld
                </p>
              )}
            </div>

            <div className="text-right">
              <span className={`text-xl font-black ${user.id === 'me' ? 'text-red-700' : 'text-slate-700'}`}>
                {user.totalPoints}
              </span>
              <span className="text-[10px] text-slate-400 font-bold ml-1 uppercase">pt</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Leaderboard;
