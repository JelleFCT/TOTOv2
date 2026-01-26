
import React, { useState, useEffect, useCallback } from 'react';
import { ViewState, Match, Prediction, BonusQuestion, UserPoule } from './types';
import { CLUB_NAME, ANNIVERSARY_YEAR, INITIAL_MATCHES, BONUS_QUESTIONS, MOCK_USERS } from './constants';
import MatchCard from './components/MatchCard';
import Leaderboard from './components/Leaderboard';
import BonusForm from './components/BonusForm';
import AdminPanel from './components/AdminPanel';
import { LayoutDashboard, Trophy, Calendar, ClipboardCheck, Settings, Star, Lock } from 'lucide-react';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('dashboard');
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);

  const [matches, setMatches] = useState<Match[]>(() => {
    const saved = localStorage.getItem('poule_matches');
    return saved ? JSON.parse(saved) : INITIAL_MATCHES;
  });
  
  const [bonusQuestions, setBonusQuestions] = useState<BonusQuestion[]>(() => {
    const saved = localStorage.getItem('poule_bonus_questions');
    return saved ? JSON.parse(saved) : BONUS_QUESTIONS;
  });

  const [userPredictions, setUserPredictions] = useState<Prediction[]>(() => {
    const saved = localStorage.getItem('poule_predictions');
    return saved ? JSON.parse(saved) : [];
  });

  const [bonusAnswers, setBonusAnswers] = useState<Record<string, string>>(() => {
    const saved = localStorage.getItem('poule_bonus_answers');
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    localStorage.setItem('poule_matches', JSON.stringify(matches));
    localStorage.setItem('poule_bonus_questions', JSON.stringify(bonusQuestions));
    localStorage.setItem('poule_predictions', JSON.stringify(userPredictions));
    localStorage.setItem('poule_bonus_answers', JSON.stringify(bonusAnswers));
  }, [matches, bonusQuestions, userPredictions, bonusAnswers]);

  const handlePredict = (matchId: string, homeScore: number, awayScore: number) => {
    setUserPredictions(prev => {
      const existing = prev.filter(p => p.matchId !== matchId);
      return [...existing, { matchId, homeScore, awayScore }];
    });
  };

  const handleAddMatch = (newMatch: Omit<Match, 'id' | 'status'>) => {
    const match: Match = {
      ...newMatch,
      id: Math.random().toString(36).substr(2, 9),
      status: 'upcoming'
    };
    setMatches(prev => [...prev, match]);
  };

  const calculatePoints = useCallback((user: Partial<UserPoule>): number => {
    let points = 0;
    if (user.id === 'me') {
      userPredictions.forEach(pred => {
        const match = matches.find(m => m.id === pred.matchId);
        if (match && match.status === 'finished' && match.actualHomeScore !== undefined && match.actualAwayScore !== undefined) {
          if (pred.homeScore === match.actualHomeScore && pred.awayScore === match.actualAwayScore) {
            points += 5;
          } 
          else {
            const predDiff = pred.homeScore - pred.awayScore;
            const actualDiff = match.actualHomeScore - match.actualAwayScore;
            if ((predDiff > 0 && actualDiff > 0) || (predDiff < 0 && actualDiff < 0) || (predDiff === 0 && actualDiff === 0)) {
              points += 2;
            }
          }
        }
      });
      bonusQuestions.forEach(q => {
        const userAnswer = bonusAnswers[q.id]?.trim().toLowerCase();
        const correctAnswer = q.correctAnswer?.trim().toLowerCase();
        if (correctAnswer && userAnswer === correctAnswer) {
          points += q.points;
        }
      });
    } else {
        return user.totalPoints || 0;
    }
    return points;
  }, [matches, bonusQuestions, userPredictions, bonusAnswers]);

  const currentUser: UserPoule = {
    id: 'me',
    name: 'Jij (Gast)',
    avatar: 'https://picsum.photos/seed/you/100/100',
    predictions: userPredictions,
    bonusAnswers: bonusAnswers,
    totalPoints: calculatePoints({ id: 'me' })
  };

  const allUsers = [...MOCK_USERS, currentUser].sort((a, b) => b.totalPoints - a.totalPoints);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === '1927') {
      setIsAdminAuthenticated(true);
      setPinError(false);
    } else {
      setPinError(true);
      setPinInput('');
    }
  };

  const NavItem = ({ id, icon: Icon, label }: { id: ViewState, icon: any, label: string }) => (
    <button
      onClick={() => setView(id)}
      className={`flex flex-col items-center justify-center py-3 px-4 transition-all duration-200 ${
        view === id ? 'text-red-600 bg-red-50' : 'text-slate-500 hover:text-red-500 hover:bg-slate-50'
      }`}
    >
      <Icon size={24} className={view === id ? 'scale-110' : ''} />
      <span className="text-[10px] mt-1 font-bold uppercase tracking-tighter">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen pb-24 bg-slate-50">
      <header className="bg-red-700 text-white pt-8 pb-12 px-6 rounded-b-[2.5rem] shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
            <Star size={120} className="text-white" />
        </div>
        <div className="absolute top-1/2 left-0 w-full h-1 bg-blue-800 opacity-20 transform -skew-y-3"></div>
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-white rounded-2xl p-1 shadow-lg transform rotate-3">
                 <img src="https://www.vvtwenthe.nl/templates/vvtwenthe/images/logo.png" alt="vv Twenthe Logo" className="w-full h-full object-contain" />
              </div>
              <div>
                <h2 className="text-red-200 font-bold tracking-widest text-xs uppercase">{ANNIVERSARY_YEAR} Jubileum</h2>
                <h1 className="text-3xl font-display font-bold">{CLUB_NAME}</h1>
              </div>
            </div>
            <div className="bg-blue-600 text-white p-2.5 rounded-2xl shadow-lg border-2 border-white/20">
                <Trophy size={28} />
            </div>
          </div>
          <p className="text-red-50 opacity-90 text-sm max-w-xs font-medium">
            Vier het mee! Voorspel de wedstrijden en win de jubileum-trofee.
          </p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto -mt-6 px-4">
        {view === 'dashboard' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-md border border-slate-100 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-red-600"></div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-slate-800 text-lg">Jouw Status</h3>
                <span className="text-red-600 font-bold text-3xl">{currentUser.totalPoints} <span className="text-sm font-normal text-slate-400">pt</span></span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <p className="text-xs text-slate-500 mb-1">Voorspellingen</p>
                  <p className="font-bold text-slate-800">{userPredictions.length} / {matches.length}</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <p className="text-xs text-slate-500 mb-1">Positie</p>
                  <p className="font-bold text-slate-800">#{allUsers.findIndex(u => u.id === 'me') + 1}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-800 text-xl flex items-center">
                  <Trophy size={20} className="mr-2 text-yellow-500" />
                  Top Klassement
              </h3>
              <button onClick={() => setView('leaderboard')} className="text-red-600 text-sm font-semibold hover:underline">Bekijk Alles</button>
            </div>
            <Leaderboard users={allUsers.slice(0, 3)} compact />

            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-800 text-xl flex items-center">
                  <Calendar size={20} className="mr-2 text-blue-600" />
                  Volgende Wedstrijd
              </h3>
              <button onClick={() => setView('matches')} className="text-red-600 text-sm font-semibold hover:underline">Volledig Programma</button>
            </div>
            {matches.filter(m => m.status === 'upcoming').sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime()).slice(0, 1).map(match => (
              <MatchCard 
                key={match.id} 
                match={match} 
                prediction={userPredictions.find(p => p.matchId === match.id)}
                onPredict={handlePredict}
              />
            ))}
          </div>
        )}

        {view === 'matches' && (
          <div className="space-y-4 pt-4">
            <h3 className="font-bold text-slate-800 text-2xl mb-4">Programma {CLUB_NAME} 1</h3>
            {matches.sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime()).map(match => (
              <MatchCard 
                key={match.id} 
                match={match} 
                prediction={userPredictions.find(p => p.matchId === match.id)}
                onPredict={handlePredict}
              />
            ))}
          </div>
        )}

        {view === 'bonus' && (
          <div className="pt-4">
            <BonusForm 
              questions={bonusQuestions} 
              answers={bonusAnswers} 
              onSave={(newAnswers) => setBonusAnswers(newAnswers)} 
            />
          </div>
        )}

        {view === 'leaderboard' && (
          <div className="pt-4">
            <Leaderboard users={allUsers} />
          </div>
        )}

        {view === 'admin' && (
          <div className="pt-4">
            {!isAdminAuthenticated ? (
              <div className="bg-white rounded-[2rem] p-8 shadow-xl border border-slate-100 max-w-md mx-auto text-center mt-12 animate-in fade-in zoom-in">
                <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Lock size={32} />
                </div>
                <h3 className="text-2xl font-bold text-slate-800 mb-2">Beheerders Toegang</h3>
                <p className="text-slate-500 text-sm mb-8">Voer de club pincode in om toegang te krijgen tot de instellingen.</p>
                
                <form onSubmit={handleLogin} className="space-y-4">
                  <input 
                    type="password" 
                    value={pinInput}
                    onChange={(e) => setPinInput(e.target.value)}
                    placeholder="Pincode (Tip: 1927)"
                    className={`w-full text-center py-4 bg-slate-50 rounded-2xl border-2 outline-none transition-all text-2xl font-black tracking-widest ${pinError ? 'border-red-500 shake' : 'border-slate-100 focus:border-red-500'}`}
                    autoFocus
                  />
                  {pinError && <p className="text-red-500 text-xs font-bold">Onjuiste pincode. Probeer het opnieuw.</p>}
                  <button 
                    type="submit"
                    className="w-full py-4 bg-red-600 text-white rounded-2xl font-bold shadow-lg hover:bg-red-700 active:scale-95 transition-all"
                  >
                    Inloggen
                  </button>
                </form>
              </div>
            ) : (
              <AdminPanel 
                matches={matches} 
                bonusQuestions={bonusQuestions}
                onUpdateMatch={(id, home, away) => {
                  setMatches(prev => prev.map(m => m.id === id ? { ...m, actualHomeScore: home, actualAwayScore: away, status: 'finished' } : m));
                }}
                onUpdateBonus={(id, answer) => {
                  setBonusQuestions(prev => prev.map(q => q.id === id ? { ...q, correctAnswer: answer } : q));
                }}
                onAddMatch={handleAddMatch}
                onReset={() => {
                  if(confirm('Weet je zeker dat je alles wilt resetten?')) {
                    setMatches(INITIAL_MATCHES);
                    setBonusQuestions(BONUS_QUESTIONS);
                    setUserPredictions([]);
                    setBonusAnswers({});
                  }
                }}
              />
            )}
          </div>
        )}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 shadow-[0_-4px_15px_rgba(0,0,0,0.08)] grid grid-cols-5 z-50">
        <NavItem id="dashboard" icon={LayoutDashboard} label="Home" />
        <NavItem id="matches" icon={Calendar} label="Programma" />
        <NavItem id="leaderboard" icon={Trophy} label="Stand" />
        <NavItem id="bonus" icon={ClipboardCheck} label="Bonus" />
        <NavItem id="admin" icon={Settings} label="Beheer" />
      </nav>
    </div>
  );
};

export default App;
