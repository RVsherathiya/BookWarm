import AsyncStorage from '@react-native-async-storage/async-storage';

export const StorageKeys = {
  USER: 'user',
  LANGUAGE: 'language',
  QUIZZES: 'quizzes',
  CHALLENGES: 'challenges',
  LESSONS: 'lessons',
  WORKSHEETS: 'worksheets',
  PRESENTATIONS: 'presentations',
  CVS: 'cvs',
  PDFS: 'pdfs',
  NOTIFICATIONS: 'notifications',
  COINS: 'coins',
} as const;

export const storage = {
  // Generic storage methods
  async getItem<T>(key: string): Promise<T | null> {
    try {
      const item = await AsyncStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error(`Error getting item ${key}:`, error);
      return null;
    }
  },

  async setItem<T>(key: string, value: T): Promise<boolean> {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(`Error setting item ${key}:`, error);
      return false;
    }
  },

  async removeItem(key: string): Promise<boolean> {
    try {
      await AsyncStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`Error removing item ${key}:`, error);
      return false;
    }
  },

  async clear(): Promise<boolean> {
    try {
      await AsyncStorage.clear();
      return true;
    } catch (error) {
      console.error('Error clearing storage:', error);
      return false;
    }
  },

  // Specific data methods
  async getQuizzes() {
    return this.getItem(StorageKeys.QUIZZES) || [];
  },

  async saveQuiz(quiz: any) {
    const quizzes = await this.getQuizzes();
    const updatedQuizzes = [...quizzes, { ...quiz, id: Date.now().toString() }];
    return this.setItem(StorageKeys.QUIZZES, updatedQuizzes);
  },

  async getChallenges() {
    return this.getItem(StorageKeys.CHALLENGES) || [];
  },

  async saveChallenge(challenge: any) {
    const challenges = await this.getChallenges();
    const updatedChallenges = [...challenges, { ...challenge, id: Date.now().toString() }];
    return this.setItem(StorageKeys.CHALLENGES, updatedChallenges);
  },

  async getLessons() {
    return this.getItem(StorageKeys.LESSONS) || [];
  },

  async saveLesson(lesson: any) {
    const lessons = await this.getLessons();
    const updatedLessons = [...lessons, { ...lesson, id: Date.now().toString() }];
    return this.setItem(StorageKeys.LESSONS, updatedLessons);
  },

  async getWorksheets() {
    return this.getItem(StorageKeys.WORKSHEETS) || [];
  },

  async saveWorksheet(worksheet: any) {
    const worksheets = await this.getWorksheets();
    const updatedWorksheets = [...worksheets, { ...worksheet, id: Date.now().toString() }];
    return this.setItem(StorageKeys.WORKSHEETS, updatedWorksheets);
  },

  async getPresentations() {
    return this.getItem(StorageKeys.PRESENTATIONS) || [];
  },

  async savePresentation(presentation: any) {
    const presentations = await this.getPresentations();
    const updatedPresentations = [...presentations, { ...presentation, id: Date.now().toString() }];
    return this.setItem(StorageKeys.PRESENTATIONS, updatedPresentations);
  },

  async getCVs() {
    return this.getItem(StorageKeys.CVS) || [];
  },

  async saveCV(cv: any) {
    const cvs = await this.getCVs();
    const updatedCVs = [...cvs, { ...cv, id: Date.now().toString() }];
    return this.setItem(StorageKeys.CVS, updatedCVs);
  },

  async getPDFs() {
    return this.getItem(StorageKeys.PDFS) || [];
  },

  async savePDF(pdf: any) {
    const pdfs = await this.getPDFs();
    const updatedPDFs = [...pdfs, { ...pdf, id: Date.now().toString() }];
    return this.setItem(StorageKeys.PDFS, updatedPDFs);
  },

  async getNotifications() {
    return this.getItem(StorageKeys.NOTIFICATIONS) || [];
  },

  async saveNotification(notification: any) {
    const notifications = await this.getNotifications();
    const updatedNotifications = [...notifications, { ...notification, id: Date.now().toString() }];
    return this.setItem(StorageKeys.NOTIFICATIONS, updatedNotifications);
  },

  async markNotificationAsRead(notificationId: string) {
    const notifications = await this.getNotifications();
    const updatedNotifications = notifications.map(notification =>
      notification.id === notificationId
        ? { ...notification, isRead: true }
        : notification
    );
    return this.setItem(StorageKeys.NOTIFICATIONS, updatedNotifications);
  },
};
