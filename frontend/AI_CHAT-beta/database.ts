import SQLite from 'react-native-sqlite-storage';

// Enable promise-based API
SQLite.enablePromise(true);

export interface QAItem {
  id: number;
  type: string;
  question: string;
  answer: string;
  created_at: string;
}

// Q&A Thread interfaces
export interface QAThreadItem {
  question: string;
  answer: string;
  timestamp: string;
}

export interface QAThread {
  id: number;
  mode: string;
  createdAt: string;
  qaData: QAThreadItem[];
}

class Database {
  private db: SQLite.SQLiteDatabase | null = null;

  async init(): Promise<void> {
    try {
      this.db = await SQLite.openDatabase({
        name: 'AI_Learning_Hub.db',
        location: 'default',
      });

      await this.createTable();
      console.log('Database initialized successfully');
    } catch (error) {
      console.error('Database initialization failed:', error);
      throw error;
    }
  }

  private async createTable(): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    const createHistoryTableQuery = `
      CREATE TABLE IF NOT EXISTS qa_history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        type TEXT NOT NULL,
        question TEXT NOT NULL,
        answer TEXT NOT NULL,
        created_at TEXT
      )
    `;

    const createThreadsTableQuery = `
      CREATE TABLE IF NOT EXISTS qa_threads (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        mode TEXT NOT NULL,
        createdAt TEXT NOT NULL,
        qaData TEXT NOT NULL
      )
    `;

    try {
      await this.db.executeSql(createHistoryTableQuery);
      await this.db.executeSql(createThreadsTableQuery);
      
      // Add migration to handle existing tables without mode column
      await this.migrateTables();
      
      console.log('Tables created and migrated successfully');
    } catch (error) {
      console.error('Table creation failed:', error);
      throw error;
    }
  }

  private async migrateTables(): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    try {
      // Check if mode column exists in qa_threads table
      const checkColumnQuery = `PRAGMA table_info(qa_threads)`;
      const result = await this.db.executeSql(checkColumnQuery);
      const rows = result[0].rows;
      
      let hasModeColumn = false;
      for (let i = 0; i < rows.length; i++) {
        if (rows.item(i).name === 'mode') {
          hasModeColumn = true;
          break;
        }
      }

      // If mode column doesn't exist, add it
      if (!hasModeColumn) {
        console.log('Adding mode column to qa_threads table...');
        await this.db.executeSql(`ALTER TABLE qa_threads ADD COLUMN mode TEXT DEFAULT 'general'`);
        console.log('Mode column added successfully');
      }
    } catch (error) {
      console.error('Table migration failed:', error);
      // Don't throw error for migration failures, as the app should still work
    }
  }

  async saveQuestion(type: string, question: string, answer: string): Promise<number> {
    if (!this.db) throw new Error('Database not initialized');

    // Get current local time as ISO string
    const localTimestamp = new Date().toISOString();

    const insertQuery = `
      INSERT INTO qa_history (type, question, answer, created_at)
      VALUES (?, ?, ?, ?)
    `;

    try {
      const result = await this.db.executeSql(insertQuery, [type, question, answer, localTimestamp]);
      const insertId = result[0].insertId;
      console.log('Question saved with ID:', insertId);
      return insertId;
    } catch (error) {
      console.error('Failed to save question:', error);
      throw error;
    }
  }

  async getQuestionsByType(type: string): Promise<QAItem[]> {
    if (!this.db) throw new Error('Database not initialized');

    const selectQuery = `
      SELECT * FROM qa_history 
      WHERE type = ? 
      ORDER BY created_at DESC
    `;

    try {
      const result = await this.db.executeSql(selectQuery, [type]);
      const rows = result[0].rows;
      const questions: QAItem[] = [];

      for (let i = 0; i < rows.length; i++) {
        questions.push(rows.item(i));
      }

      console.log(`Retrieved ${questions.length} questions for type: ${type}`);
      return questions;
    } catch (error) {
      console.error('Failed to get questions:', error);
      throw error;
    }
  }

  async getAllQuestions(): Promise<QAItem[]> {
    if (!this.db) throw new Error('Database not initialized');

    const selectQuery = `
      SELECT * FROM qa_history 
      ORDER BY created_at DESC
    `;

    try {
      const result = await this.db.executeSql(selectQuery);
      const rows = result[0].rows;
      const questions: QAItem[] = [];

      for (let i = 0; i < rows.length; i++) {
        questions.push(rows.item(i));
      }

      console.log(`Retrieved ${questions.length} total questions`);
      return questions;
    } catch (error) {
      console.error('Failed to get all questions:', error);
      throw error;
    }
  }

  async deleteQuestion(id: number): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    const deleteQuery = 'DELETE FROM qa_history WHERE id = ?';

    try {
      await this.db.executeSql(deleteQuery, [id]);
      console.log('Question deleted with ID:', id);
    } catch (error) {
      console.error('Failed to delete question:', error);
      throw error;
    }
  }

  async clearHistoryByType(type: string): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    const deleteQuery = 'DELETE FROM qa_history WHERE type = ?';

    try {
      await this.db.executeSql(deleteQuery, [type]);
      console.log(`Cleared history for type: ${type}`);
    } catch (error) {
      console.error('Failed to clear history:', error);
      throw error;
    }
  }

  // Q&A Thread methods
  async addNewThread(mode: string, qaItems: QAThreadItem[]): Promise<number> {
    if (!this.db) throw new Error('Database not initialized');
    
    if (qaItems.length === 0) {
      throw new Error('At least one Q&A item is required');
    }
    
    if (qaItems.length > 10) {
      throw new Error('Maximum 10 Q&A items allowed per thread');
    }

    // Add timestamps to Q&A items if not provided
    const qaItemsWithTimestamps = qaItems.map(item => ({
      ...item,
      timestamp: item.timestamp || new Date().toISOString()
    }));

    const createdAt = new Date().toISOString();
    const qaDataJson = JSON.stringify(qaItemsWithTimestamps);

    const insertQuery = `
      INSERT INTO qa_threads (mode, createdAt, qaData)
      VALUES (?, ?, ?)
    `;

    try {
      const result = await this.db.executeSql(insertQuery, [mode, createdAt, qaDataJson]);
      const insertId = result[0].insertId;
      console.log('New thread created with ID:', insertId, 'for mode:', mode);
      return insertId;
    } catch (error) {
      console.error('Failed to create new thread:', error);
      throw error;
    }
  }

  async getAllThreads(): Promise<QAThread[]> {
    if (!this.db) throw new Error('Database not initialized');

    const selectQuery = `
      SELECT * FROM qa_threads 
      ORDER BY createdAt DESC
    `;

    try {
      const result = await this.db.executeSql(selectQuery);
      const rows = result[0].rows;
      const threads: QAThread[] = [];

      for (let i = 0; i < rows.length; i++) {
        const row = rows.item(i);
        threads.push({
          id: row.id,
          mode: row.mode || 'general', // Default to 'general' if mode is null/undefined
          createdAt: row.createdAt,
          qaData: JSON.parse(row.qaData)
        });
      }

      console.log(`Retrieved ${threads.length} threads`);
      return threads;
    } catch (error) {
      console.error('Failed to get all threads:', error);
      throw error;
    }
  }

  async getThreadsByMode(mode: string): Promise<QAThread[]> {
    if (!this.db) throw new Error('Database not initialized');

    const selectQuery = `
      SELECT * FROM qa_threads 
      WHERE mode = ? OR mode IS NULL
      ORDER BY createdAt DESC
    `;

    try {
      const result = await this.db.executeSql(selectQuery, [mode]);
      const rows = result[0].rows;
      const threads: QAThread[] = [];

      for (let i = 0; i < rows.length; i++) {
        const row = rows.item(i);
        threads.push({
          id: row.id,
          mode: row.mode || mode, // Use provided mode if row.mode is null
          createdAt: row.createdAt,
          qaData: JSON.parse(row.qaData)
        });
      }

      console.log(`Retrieved ${threads.length} threads for mode: ${mode}`);
      return threads;
    } catch (error) {
      console.error('Failed to get threads by mode:', error);
      throw error;
    }
  }

  async getThreadById(threadId: number): Promise<QAThread | null> {
    if (!this.db) throw new Error('Database not initialized');

    const selectQuery = `
      SELECT * FROM qa_threads 
      WHERE id = ?
    `;

    try {
      const result = await this.db.executeSql(selectQuery, [threadId]);
      const rows = result[0].rows;

      if (rows.length === 0) {
        console.log(`Thread with ID ${threadId} not found`);
        return null;
      }

      const row = rows.item(0);
      const thread: QAThread = {
        id: row.id,
        mode: row.mode,
        createdAt: row.createdAt,
        qaData: JSON.parse(row.qaData)
      };

      console.log(`Retrieved thread with ID: ${threadId}`);
      return thread;
    } catch (error) {
      console.error('Failed to get thread by ID:', error);
      throw error;
    }
  }

  async deleteThread(threadId: number): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    const deleteQuery = 'DELETE FROM qa_threads WHERE id = ?';

    try {
      await this.db.executeSql(deleteQuery, [threadId]);
      console.log(`Thread with ID ${threadId} deleted`);
    } catch (error) {
      console.error('Failed to delete thread:', error);
      throw error;
    }
  }

  async clearAllThreads(): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    const deleteQuery = 'DELETE FROM qa_threads';

    try {
      await this.db.executeSql(deleteQuery);
      console.log('All threads cleared');
    } catch (error) {
      console.error('Failed to clear all threads:', error);
      throw error;
    }
  }

  async clearThreadsByMode(mode: string): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    const deleteQuery = 'DELETE FROM qa_threads WHERE mode = ?';

    try {
      await this.db.executeSql(deleteQuery, [mode]);
      console.log(`Threads cleared for mode: ${mode}`);
    } catch (error) {
      console.error('Failed to clear threads by mode:', error);
      throw error;
    }
  }

  async close(): Promise<void> {
    if (this.db) {
      await this.db.close();
      this.db = null;
      console.log('Database closed');
    }
  }
}

// Export singleton instance
export const database = new Database();
export default database;
