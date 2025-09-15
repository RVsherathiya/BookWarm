export interface Quiz {
  id: string;
  title: string;
  subject: string;
  difficulty: 'easy' | 'medium' | 'hard';
  academicLevel: string;
  questions: QuizQuestion[];
  coinsUsed: number;
  createdAt: Date;
  isArabic: boolean;
  materials?: string[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  type: 'multiple_choice' | 'true_false' | 'fill_blank';
  options?: string[];
  correctAnswer: string | number;
  image?: string;
  audio?: string;
  video?: string;
}

export interface Challenge {
  id: string;
  title: string;
  subject: string;
  difficulty: 'easy' | 'medium' | 'hard';
  academicLevel: string;
  type: 'ordering' | 'matching' | 'flashcards';
  questions: ChallengeQuestion[];
  timePerQuestion: number;
  coinsUsed: number;
  createdAt: Date;
  isArabic: boolean;
  materials?: string[];
}

export interface ChallengeQuestion {
  id: string;
  question: string;
  answer: string;
  image?: string;
  audio?: string;
  video?: string;
}

export interface LessonPlan {
  id: string;
  title: string;
  subject: string;
  academicLevel: string;
  keyPoints: string[];
  activities: string[];
  assessment: string[];
  homework: string[];
  coinsUsed: number;
  createdAt: Date;
  isArabic: boolean;
  materials?: string[];
}

export interface Worksheet {
  id: string;
  title: string;
  subject: string;
  academicLevel: string;
  questions: WorksheetQuestion[];
  coinsUsed: number;
  createdAt: Date;
  isArabic: boolean;
  materials?: string[];
}

export interface WorksheetQuestion {
  id: string;
  question: string;
  type: 'multiple_choice' | 'fill_blank' | 'matching' | 'open_ended' | 'practice_problem';
  options?: string[];
  correctAnswer?: string;
  image?: string;
}

export interface Presentation {
  id: string;
  title: string;
  subject: string;
  academicLevel: string;
  template: string;
  slides: PresentationSlide[];
  coinsUsed: number;
  createdAt: Date;
  isArabic: boolean;
  materials?: string[];
}

export interface PresentationSlide {
  id: string;
  title: string;
  content: string;
  image?: string;
  order: number;
}

export interface CV {
  id: string;
  title: string;
  template: string;
  personalInfo: PersonalInfo;
  experience: Experience[];
  education: Education[];
  skills: string[];
  coinsUsed: number;
  createdAt: Date;
}

export interface PersonalInfo {
  name: string;
  email: string;
  phone: string;
  address: string;
  summary: string;
}

export interface Experience {
  id: string;
  title: string;
  company: string;
  startDate: string;
  endDate?: string;
  description: string;
  isCurrent: boolean;
}

export interface Education {
  id: string;
  degree: string;
  institution: string;
  startDate: string;
  endDate?: string;
  description: string;
}

export interface PDFDocument {
  id: string;
  title: string;
  content: string;
  coinsUsed: number;
  createdAt: Date;
  lastModified: Date;
}

export interface CoinPackage {
  id: string;
  name: string;
  description: string;
  coins: number;
  price: number;
  currency: string;
  isActive: boolean;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'quiz_invite' | 'challenge_invite' | 'general';
  isRead: boolean;
  createdAt: Date;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  icon: string;
  coinsRequired: number;
  isAvailable: boolean;
}

export interface AcademicLevel {
  id: string;
  name: string;
  nameAr: string;
}

export interface Subject {
  id: string;
  name: string;
  nameAr: string;
  icon: string;
}

export interface DifficultyLevel {
  id: string;
  name: string;
  nameAr: string;
  value: 'easy' | 'medium' | 'hard';
}
