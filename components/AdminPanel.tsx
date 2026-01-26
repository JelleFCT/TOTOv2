
import React, { useState } from 'react';
import { Match, BonusQuestion } from '../types';
import { CheckCircle2, RotateCcw, ShieldAlert, Plus, Calendar as CalendarIcon, Users } from 'lucide-react';

interface AdminPanelProps {
  matches: Match[];
  bonusQuestions: BonusQuestion[];
  onUpdateMatch: (id: string, home: number, away: number) => void;
  onUpdateBonus: (id: string, answer: string) => void;
  onAddMatch: (match: Omit<Match, 'id' | 'status'>) => void;
  onReset: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ matches, bonusQuestions, onUpdateMatch, onUpdateBonus, onAddMatch, onReset }) => {
  const [newOpponent, setNewOpponent] = useState('');
  const [newDate, setNewDate] = useState('');
  const [isHome, setIsHome] = useState(true);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOpponent || !newDate) return;
    onAddMatch({
      opponent: newOpponent,
      date: newDate,
      isHome
    });
    setNewOpponent('');
    setNewDate('');
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-bold text-slate-800 text-2xl">Club Beheer</h3>
        <button 
            onClick={onReset}
            className="flex items-center space-x-1 text-slate-400 text-[10px] font-black uppercase hover:text-red-600 p-2 transition-colors"
        >
            <RotateCcw size={12} />
            <span>Reset Seizoen</span>
        </button>
      </div>

      <div className="bg-blue-50 p-5 rounded-[1.5rem] border border-blue-100 flex items-start space-x-4">
        <ShieldAlert className="text-blue-600 shrink-0 mt-0.5" size={20} />
        <p className="text-blue-900 text-xs font-medium leading-relaxed">
            <strong>Beheerdersmodus:</strong> Voer hier de officiële uitslagen en bonus-antwoorden in. De ranglijst wordt direct bijgewerkt voor alle deelnemers.
        </p>
      </div>

      {/* Nieuwe Match Toevoegen */}
      <section className="bg-white p-6 rounded-[2rem] shadow-md border border-slate-100">
        <h4 className="font-bold text-slate-700 text-lg mb-4 flex items-center">
            <Plus className="mr-2 text-green-500" size={20} />
            Nieuwe Wedstrijd Toevoegen
        </h4>
        <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
                <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                    type="text" 
                    placeholder="Tegenstander" 
                    value={newOpponent}
                    onChange={(e) => setNewOpponent(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 rounded-xl border-2 border-slate-100 focus:border-red-500 outline-none font-medium"
                />
            </div>
            <div className="relative">
                <CalendarIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                    type="date" 
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 rounded-xl border-2 border-slate-100 focus:border-red-500 outline-none font-medium"
                />
            </div>
            <div className="flex items-center space-x-4">
                <button 
                    type="button"
                    onClick={() => setIsHome(true)}
                    className={`flex-1 py-3 rounded-xl font-bold transition-all ${isHome ? 'bg-red-600 text-white' : 'bg-slate-100 text-slate-400'}`}
                >
                    Thuis
                </button>
                <button 
                    type="button"
                    onClick={() => setIsHome(false)}
                    className={`flex-1 py-3 rounded-xl font-bold transition-all ${!isHome ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400'}`}
                >
                    Uit
                </button>
            </div>
            <button 
                type="submit"
                className="bg-slate-800 text-white py-3 rounded-xl font-bold hover:bg-slate-700 transition-all flex items-center justify-center space-x-2"
            >
                <Plus size={20} />
                <span>Toevoegen</span>
            </button>
        </form>
      </section>

      {/* Wedstrijden Beheer */}
      <section>
        <h4 className="font-bold text-slate-700 text-lg mb-4 flex items-center">
            <span className="w-1.5 h-6 bg-red-600 rounded-full mr-2"></span>
            Wedstrijduitslagen Invullen
        </h4>
        <div className="space-y-3">
            {matches.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(match => (
            <div key={match.id} className="bg-white p-5 rounded-[1.5rem] shadow-sm border border-slate-100 flex items-center justify-between transition-all hover:shadow-md">
                <div className="flex-1">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{new Date(match.date).toLocaleDateString('nl-NL')}</p>
                <p className="font-bold text-slate-800">{match.isHome ? 'vv Twenthe' : match.opponent} <span className="text-slate-300 font-normal mx-1">vs</span> {match.isHome ? match.opponent : 'vv Twenthe'}</p>
                </div>

                <div className="flex items-center space-x-3">
                <div className="flex items-center bg-slate-50 p-1 rounded-xl border border-slate-100">
                    <input 
                        type="number"
                        placeholder="H"
                        className="w-10 h-10 text-center bg-transparent font-black text-slate-800 outline-none"
                        defaultValue={match.actualHomeScore}
                        id={`home-${match.id}`}
                    />
                    <span className="text-slate-300 font-bold">:</span>
                    <input 
                        type="number"
                        placeholder="A"
                        className="w-10 h-10 text-center bg-transparent font-black text-slate-800 outline-none"
                        defaultValue={match.actualAwayScore}
                        id={`away-${match.id}`}
                    />
                </div>
                <button 
                    onClick={() => {
                    const h = parseInt((document.getElementById(`home-${match.id}`) as HTMLInputElement).value);
                    const a = parseInt((document.getElementById(`away-${match.id}`) as HTMLInputElement).value);
                    if (!isNaN(h) && !isNaN(a)) {
                        onUpdateMatch(match.id, h, a);
                    }
                    }}
                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${match.status === 'finished' ? 'bg-red-600 text-white shadow-lg' : 'bg-slate-100 text-slate-400 hover:bg-blue-600 hover:text-white hover:shadow-lg'}`}
                >
                    <CheckCircle2 size={20} />
                </button>
                </div>
            </div>
            ))}
        </div>
      </section>

      {/* Bonusvragen Beheer */}
      <section>
        <h4 className="font-bold text-slate-700 text-lg mb-4 flex items-center">
            <span className="w-1.5 h-6 bg-blue-600 rounded-full mr-2"></span>
            Bonusvragen Antwoorden
        </h4>
        <div className="space-y-3">
            {bonusQuestions.map(q => (
                <div key={q.id} className="bg-white p-5 rounded-[1.5rem] shadow-sm border border-slate-100 transition-all hover:shadow-md">
                    <div className="flex justify-between items-start mb-3">
                        <p className="font-bold text-slate-800 text-sm leading-tight flex-1 pr-4">{q.question}</p>
                        <span className="text-[10px] font-black text-blue-600 uppercase bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">{q.points} PT</span>
                    </div>
                    <div className="flex items-center space-x-3">
                        <input 
                            type="text"
                            placeholder="Het officiële antwoord..."
                            className="flex-1 px-4 py-2.5 bg-slate-50 rounded-xl border border-slate-100 font-medium text-sm outline-none focus:border-blue-500 transition-colors"
                            defaultValue={q.correctAnswer}
                            id={`bonus-${q.id}`}
                        />
                        <button 
                            onClick={() => {
                                const ans = (document.getElementById(`bonus-${q.id}`) as HTMLInputElement).value;
                                onUpdateBonus(q.id, ans);
                            }}
                            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${q.correctAnswer ? 'bg-blue-600 text-white shadow-lg' : 'bg-slate-100 text-slate-400 hover:bg-red-600 hover:text-white hover:shadow-lg'}`}
                        >
                            <CheckCircle2 size={20} />
                        </button>
                    </div>
                </div>
            ))}
        </div>
      </section>
    </div>
  );
};

export default AdminPanel;
