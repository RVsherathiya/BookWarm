import { Service, AcademicLevel, Subject, DifficultyLevel, CoinPackage } from '../types';

export const ACADEMIC_LEVELS: AcademicLevel[] = [
  { id: '1', name: 'Elementary School', nameAr: 'المدرسة الابتدائية' },
  { id: '2', name: 'Middle School', nameAr: 'المدرسة المتوسطة' },
  { id: '3', name: 'High School', nameAr: 'المدرسة الثانوية' },
  { id: '4', name: 'University', nameAr: 'الجامعة' },
];

export const SUBJECTS: Subject[] = [
  { id: '1', name: 'Mathematics', nameAr: 'الرياضيات', icon: 'calculate' },
  { id: '2', name: 'Science', nameAr: 'العلوم', icon: 'science' },
  { id: '3', name: 'English', nameAr: 'اللغة الإنجليزية', icon: 'translate' },
  { id: '4', name: 'Arabic', nameAr: 'اللغة العربية', icon: 'menu-book' },
  { id: '5', name: 'History', nameAr: 'التاريخ', icon: 'history' },
  { id: '6', name: 'Geography', nameAr: 'الجغرافيا', icon: 'public' },
  { id: '7', name: 'Physics', nameAr: 'الفيزياء', icon: 'speed' },
  { id: '8', name: 'Chemistry', nameAr: 'الكيمياء', icon: 'biotech' },
  { id: '9', name: 'Biology', nameAr: 'الأحياء', icon: 'eco' },
  { id: '10', name: 'Computer Science', nameAr: 'علوم الحاسوب', icon: 'computer' },
];

export const DIFFICULTY_LEVELS: DifficultyLevel[] = [
  { id: '1', name: 'Easy', nameAr: 'سهل', value: 'easy' },
  { id: '2', name: 'Medium', nameAr: 'متوسط', value: 'medium' },
  { id: '3', name: 'Hard', nameAr: 'صعب', value: 'hard' },
];

export const SERVICES: Service[] = [
  {
    id: '1',
    name: 'Create Quiz',
    description: 'Create MCQ quizzes with AI assistance',
    icon: 'quiz',
    coinsRequired: 10,
    isAvailable: true,
  },
  {
    id: '2',
    name: 'Create Challenge',
    description: 'Create interactive challenges and games',
    icon: 'games',
    coinsRequired: 15,
    isAvailable: true,
  },
  {
    id: '3',
    name: 'Lesson Preparation',
    description: 'AI-powered lesson planning and preparation',
    icon: 'school',
    coinsRequired: 20,
    isAvailable: true,
  },
  {
    id: '4',
    name: 'Create Worksheet',
    description: 'Generate worksheets and practice materials',
    icon: 'assignment',
    coinsRequired: 12,
    isAvailable: true,
  },
  {
    id: '5',
    name: 'Create Presentation',
    description: 'Create engaging presentations with templates',
    icon: 'slideshow',
    coinsRequired: 25,
    isAvailable: true,
  },
  {
    id: '6',
    name: 'Create CV',
    description: 'Build professional CVs with templates',
    icon: 'person',
    coinsRequired: 8,
    isAvailable: true,
  },
  {
    id: '7',
    name: 'PDF Editor',
    description: 'Edit and create PDF documents',
    icon: 'picture-as-pdf',
    coinsRequired: 5,
    isAvailable: true,
  },
];

export const COIN_PACKAGES: CoinPackage[] = [
  {
    id: '1',
    name: 'Starter Pack',
    description: 'Perfect for trying out our services',
    coins: 50,
    price: 5.000,
    currency: 'KWD',
    isActive: true,
  },
  {
    id: '2',
    name: 'Teacher Pack',
    description: 'Great for regular use',
    coins: 150,
    price: 12.000,
    currency: 'KWD',
    isActive: true,
  },
  {
    id: '3',
    name: 'Professional Pack',
    description: 'For heavy users and institutions',
    coins: 300,
    price: 20.000,
    currency: 'KWD',
    isActive: true,
  },
  {
    id: '4',
    name: 'Premium Pack',
    description: 'Maximum value for power users',
    coins: 500,
    price: 30.000,
    currency: 'KWD',
    isActive: true,
  },
];

export const CV_TEMPLATES = [
  {
    id: '1',
    name: 'Classic',
    description: 'Traditional and professional',
    preview: 'classic_preview.png',
  },
  {
    id: '2',
    name: 'Modern',
    description: 'Clean and contemporary design',
    preview: 'modern_preview.png',
  },
  {
    id: '3',
    name: 'Creative',
    description: 'Perfect for creative professionals',
    preview: 'creative_preview.png',
  },
  {
    id: '4',
    name: 'Academic',
    description: 'Ideal for educators and researchers',
    preview: 'academic_preview.png',
  },
];

export const PRESENTATION_TEMPLATES = [
  {
    id: '1',
    name: 'Education',
    description: 'Perfect for educational content',
    preview: 'education_template.png',
  },
  {
    id: '2',
    name: 'Business',
    description: 'Professional business presentations',
    preview: 'business_template.png',
  },
  {
    id: '3',
    name: 'Creative',
    description: 'Eye-catching creative designs',
    preview: 'creative_template.png',
  },
  {
    id: '4',
    name: 'Minimal',
    description: 'Clean and minimal design',
    preview: 'minimal_template.png',
  },
];

export const QUESTION_TYPES = [
  { id: 'multiple_choice', name: 'Multiple Choice', nameAr: 'اختيار من متعدد' },
  { id: 'true_false', name: 'True/False', nameAr: 'صحيح/خطأ' },
  { id: 'fill_blank', name: 'Fill in the Blank', nameAr: 'ملء الفراغ' },
];

export const CHALLENGE_TYPES = [
  { id: 'ordering', name: 'Ordering Game', nameAr: 'لعبة الترتيب' },
  { id: 'matching', name: 'Matching Game', nameAr: 'لعبة المطابقة' },
  { id: 'flashcards', name: 'Flashcards', nameAr: 'بطاقات تعليمية' },
];

export const COLORS = {
  primary: '#007AFF',
  secondary: '#5856D6',
  success: '#34C759',
  warning: '#FF9500',
  error: '#FF3B30',
  background: '#F2F2F7',
  surface: '#FFFFFF',
  text: '#000000',
  textSecondary: '#8E8E93',
  border: '#E1E5E9',
  shadow: '#000000',
};

export const FONT_SIZES = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};
