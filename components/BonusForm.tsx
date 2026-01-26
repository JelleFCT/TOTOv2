
import React, { useState } from 'react';
import { BonusQuestion } from '../types';
import { Save, Star } from 'lucide-react';

interface BonusFormProps {
  questions: BonusQuestion[];
  answers: Record<string, string>;
  onSave: (answers: Record<string, string>) => void;
}

const BonusForm: React.FC<BonusFormProps> = ({ questions, answers, onSave }) => {
  const [localAnswers, setLocalAnswers] = useState<Record<string, string>>(answers);
  const [isSaved, setIsSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(localAnswers);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="bg-blue-600 p-6 rounded-[2rem] border border-blue-500 flex items-center space-x-4 shadow-lg">
        <div className="bg-white/20 p-3 rounded-2xl text-white">
          <Star size={32} />
        </div>
        <div>
          <h3 className="font-bold text-white text-xl">Bonusvragen</h3>
          <p className="text-sm text-blue-100">Belangrijke vragen voor het 50-jarig jubileum!</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {questions.map((q) => (
          <div key={q.id} className="bg-white p-6 rounded-[1.5rem] shadow-sm border border-slate-100 group transition-all hover:border-red-200">
            <div className="flex justify-between items-start mb-4">
              <label className="font-bold text-slate-800 pr-4 leading-snug">{q.question}</label>
              <span className="bg-red-50 text-red-600 px-2.5 py-1 rounded-full text-[10px] font-black shrink-0 border border-red-100">{q.points} PT</span>
            </div>
            <input
              type="text"
              value={localAnswers[q.id] || ''}
              onChange={(e) => setLocalAnswers(prev => ({ ...prev, [q.id]: e.target.value }))}
              placeholder="Jouw antwoord..."
              className="w-full px-4 py-4 bg-slate-50 rounded-xl border-2 border-slate-100 focus:ring-4 focus:ring-red-500/10 focus:border-red-500 focus:bg-white outline-none transition-all text-sm font-medium"
            />
          </div>
        ))}

        <button
          type="submit"
          className={`w-full py-4 rounded-2xl font-black flex items-center justify-center space-x-2 transition-all shadow-xl ${
            isSaved ? 'bg-green-600 text-white' : 'bg-red-700 text-white hover:bg-red-800 active:scale-[0.98]'
          }`}
        >
          {isSaved ? (
            <>
              <Save size={20} />
              <span>Opgeslagen!</span>
            </>
          ) : (
            <>
              <Save size={20} />
              <span>Bevestig Bonusvragen</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default BonusForm;
