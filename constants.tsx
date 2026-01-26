
import { Match, BonusQuestion, UserPoule } from './types';

export const CLUB_NAME = "vv Twenthe";
export const ANNIVERSARY_YEAR = "2024/2025";

export const INITIAL_MATCHES: Match[] = [
  { id: '1', opponent: 'Goor United', date: '2024-09-07', isHome: true, status: 'upcoming' },
  { id: '2', opponent: 'SV Delden', date: '2024-09-14', isHome: false, status: 'upcoming' },
  { id: '3', opponent: 'Markelo FC', date: '2024-09-21', isHome: true, status: 'upcoming' },
  { id: '4', opponent: 'Rood Zwart', date: '2024-09-28', isHome: false, status: 'upcoming' },
  { id: '5', opponent: 'WVV \'34', date: '2024-10-05', isHome: true, status: 'upcoming' },
  { id: '6', opponent: 'Bentelo SV', date: '2024-10-12', isHome: false, status: 'upcoming' },
];

export const BONUS_QUESTIONS: BonusQuestion[] = [
  { id: 'b1', question: 'Wie wordt de topscorer van vv Twenthe 1?', points: 15 },
  { id: 'b2', question: 'Op welke positie eindigen we in de competitie?', points: 20 },
  { id: 'b3', question: 'Wie wint de "Speler van het Seizoen" award?', points: 15 },
  { id: 'b4', question: 'Hoeveel "clean sheets" houdt onze keeper dit seizoen?', points: 10 },
];

export const MOCK_USERS: UserPoule[] = [
  { id: 'u2', name: 'Marco van B.', avatar: 'https://picsum.photos/seed/marco/100/100', predictions: [], bonusAnswers: {}, totalPoints: 45 },
  { id: 'u3', name: 'Sarah Legend', avatar: 'https://picsum.photos/seed/sarah/100/100', predictions: [], bonusAnswers: {}, totalPoints: 32 },
  { id: 'u4', name: 'Dennis B.', avatar: 'https://picsum.photos/seed/dennis/100/100', predictions: [], bonusAnswers: {}, totalPoints: 28 },
  { id: 'u5', name: 'Johan C.', avatar: 'https://picsum.photos/seed/johan/100/100', predictions: [], bonusAnswers: {}, totalPoints: 10 },
];
