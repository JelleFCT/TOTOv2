
import React, { useState, useEffect } from 'react';
import { Match, Prediction } from '../types';
import { CLUB_NAME } from '../constants';
import { generateMatchInsight } from '../geminiService';
import { Sparkles, MapPin } from 'lucide-react';

interface MatchCardProps {
  match: Match;
  prediction?: Prediction;
  onPredict: (matchId: string, home: number, away: number) => void;
}

const MatchCard: React.FC<MatchCardProps> = ({ match, prediction, onPredict }) => {
  const [home, setHome] = useState(prediction?.homeScore ?? 0);
  const [away, setAway] = useState(prediction?.awayScore ?? 0);
  const [insight, setInsight] = useState<string | null>(null);
  const [loadingInsight, setLoadingInsight] = useState(false);

  useEffect(() => {
    setHome(prediction?.homeScore ?? 0);
    setAway(prediction?.awayScore ?? 0);
  }, [prediction]);

  const handleInsight = async () => {
    setLoadingInsight(true);
    const text = await generateMatchInsight(match.opponent, match.isHome);
    setInsight(text);
    setLoadingInsight(false);
  };

  const isFinished = match.status === 'finished';

  return (
    <div className="bg-white rounded-2xl p-5 shadow-md border border-slate-100 hover:shadow-lg transition-all">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center text-[10px] font-bold uppercase tracking-wider text-slate-400">
          <MapPin size={12} className="mr-1 text-red-500" />
          {match.isHome ? 'Thuis @ vv Twenthe' : `Uit @ ${match.opponent}`}
          <span className="mx-2 text-slate-300">|</span>
          {new Date(match.date).toLocaleDateString('nl-NL', { month: 'short', day: 'numeric' })}
        </div>
        {isFinished && (
          <span className="bg-red-50 text-red-600 px-2 py-0.5 rounded text-[10px] font-bold uppercase border border-red-100">Gespeeld</span>
        )}
      </div>

      <div className="flex items-center justify-between mb-6">
        <div className="flex-1 text-center">
          <div className="w-14 h-14 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-2 text-red-700 font-bold border-2 border-red-50 shadow-sm">
            {match.isHome ? 'VVT' : match.opponent.substring(0, 3).toUpperCase()}
          </div>
          <p className="font-bold text-sm text-slate-800 line-clamp-1">{match.isHome ? CLUB_NAME : match.opponent}</p>
        </div>

        <div className="px-4 text-center flex flex-col items-center">
            {isFinished ? (
                <div className="flex items-center space-x-2">
                    <span className="text-3xl font-black text-slate-800">{match.actualHomeScore}</span>
                    <span className="text-slate-300">-</span>
                    <span className="text-3xl font-black text-slate-800">{match.actualAwayScore}</span>
                </div>
            ) : (
                <span className="text-slate-200 font-black text-xl italic text-red-500">VS</span>
            )}
        </div>

        <div className="flex-1 text-center">
          <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-2 text-blue-700 font-bold border-2 border-blue-50 shadow-sm">
            {match.isHome ? match.opponent.substring(0, 3).toUpperCase() : 'VVT'}
          </div>
          <p className="font-bold text-sm text-slate-800 line-clamp-1">{match.isHome ? match.opponent : CLUB_NAME}</p>
        </div>
      </div>

      {!isFinished && (
        <div className="bg-slate-50 rounded-2xl p-4 mb-4 border border-slate-100">
          <p className="text-[10px] font-bold uppercase text-slate-400 mb-3 text-center">Jouw Voorspelling</p>
          <div className="flex items-center justify-center space-x-4">
            <input 
              type="number" 
              min="0"
              value={home} 
              onChange={(e) => {
                const val = parseInt(e.target.value) || 0;
                setHome(val);
                onPredict(match.id, val, away);
              }}
              className="w-14 h-14 text-center text-2xl font-black bg-white rounded-xl border-2 border-slate-200 focus:ring-4 focus:ring-red-500/10 focus:border-red-500 outline-none transition-all"
            />
            <span className="text-slate-300 font-bold text-2xl">:</span>
            <input 
              type="number" 
              min="0"
              value={away} 
              onChange={(e) => {
                const val = parseInt(e.target.value) || 0;
                setAway(val);
                onPredict(match.id, home, val);
              }}
              className="w-14 h-14 text-center text-2xl font-black bg-white rounded-xl border-2 border-slate-200 focus:ring-4 focus:ring-red-500/10 focus:border-red-500 outline-none transition-all"
            />
          </div>
        </div>
      )}

      {isFinished && prediction && (
         <div className="bg-red-50 rounded-xl p-3 mb-4 text-center border border-red-100">
            <p className="text-[10px] font-bold uppercase text-red-600 mb-1 tracking-wider">Jouw Voorspelling: {prediction.homeScore} - {prediction.awayScore}</p>
            <p className="text-sm font-bold text-red-800">
                {(prediction.homeScore === match.actualHomeScore && prediction.awayScore === match.actualAwayScore) 
                    ? "🎉 Perfecte Score! +5 Punten" 
                    : "👍 Juiste Winnaar! +2 Punten"}
            </p>
         </div>
      )}

      <button 
        onClick={handleInsight}
        disabled={loadingInsight}
        className="w-full flex items-center justify-center space-x-2 py-2.5 text-blue-600 bg-blue-50 rounded-xl text-xs font-bold hover:bg-blue-100 transition-colors border border-blue-100"
      >
        <Sparkles size={14} className="text-blue-500" />
        <span>{loadingInsight ? 'AI denkt na...' : 'Club Insight'}</span>
      </button>

      {insight && (
        <div className="mt-3 p-3 bg-white rounded-xl text-xs text-slate-600 border border-slate-100 shadow-inner italic leading-relaxed animate-in fade-in slide-in-from-top-1">
          "{insight}"
        </div>
      )}
    </div>
  );
};

export default MatchCard;
