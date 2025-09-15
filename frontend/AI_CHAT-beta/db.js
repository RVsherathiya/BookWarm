import SQLite from 'react-native-sqlite-storage';

// Enable promise-based API
SQLite.enablePromise(true);

// Types for TypeScript support
export interface QAItem {
  question: string;
  answer: string;
  timestamp: string;
}

export interface Thread {
  id: number;
  createdAt: string;
  qaData: QAItem[];
}

class QADatabase {
  private db: SQLite.SQLiteDatabase | null = null;

  async init(): Promise<void> {
    try {
      this.db = await SQLite.openDatabase({
        name: 'QA_Threads.db',
        location: 'default',
      });

      await this.createTables();
      console.log('Q&A Database initialized successfully');
    } catch (error) {
      console.error('Q&A Database initialization failed:', error);
      throw error;
    }
  }

  private async createTables(): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    const createThreadsTableQuery = `
      CREATE TABLE IF NOT EXISTS threads (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        createdAt TEXT NOT NULL,
        qaData TEXT NOT NULL
      )
    `;

    try {
      await this.db.executeSql(createThreadsTableQuery);
      console.log('Threads table created successfully');
    } catch (error) {
      console.error('Threads table creation failed:', error);
      throw error;
    }
  }

  /**
   * Add a new thread with multiple Q&A pairs
   * @param qaItems Array of Q&A items (max 10)
   * @returns Promise<number> The ID of the created thread
   */
  async addNewThread(qaItems: QAItem[]): Promise<number> {
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
      INSERT INTO threads (createdAt, qaData)
      VALUES (?, ?)
    `;

    try {
      const result = await this.db.executeSql(insertQuery, [createdAt, qaDataJson]);
      const insertId = result[0].insertId;
      console.log('New thread created with ID:', insertId);
      return insertId;
    } catch (error) {
      console.error('Failed to create new thread:', error);
      throw error;
    }
  }

  /**
   * Get all threads with their Q&A data
   * @returns Promise<Thread[]> Array of all threads
   */
  async getAllThreads(): Promise<Thread[]> {
    if (!this.db) throw new Error('Database not initialized');

    const selectQuery = `
      SELECT * FROM threads 
      ORDER BY createdAt DESC
    `;

    try {
      const result = await this.db.executeSql(selectQuery);
      const rows = result[0].rows;
      const threads: Thread[] = [];

      for (let i = 0; i < rows.length; i++) {
        const row = rows.item(i);
        threads.push({
          id: row.id,
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

  /**
   * Get a single thread by ID
   * @param threadId The ID of the thread to fetch
   * @returns Promise<Thread | null> The thread or null if not found
   */
  async getThreadById(threadId: number): Promise<Thread | null> {
    if (!this.db) throw new Error('Database not initialized');

    const selectQuery = `
      SELECT * FROM threads 
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
      const thread: Thread = {
        id: row.id,
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

  /**
   * Delete a thread by ID
   * @param threadId The ID of the thread to delete
   * @returns Promise<void>
   */
  async deleteThread(threadId: number): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    const deleteQuery = 'DELETE FROM threads WHERE id = ?';

    try {
      await this.db.executeSql(deleteQuery, [threadId]);
      console.log(`Thread with ID ${threadId} deleted`);
    } catch (error) {
      console.error('Failed to delete thread:', error);
      throw error;
    }
  }

  /**
   * Get threads count
   * @returns Promise<number> Number of threads
   */
  async getThreadsCount(): Promise<number> {
    if (!this.db) throw new Error('Database not initialized');

    const countQuery = 'SELECT COUNT(*) as count FROM threads';

    try {
      const result = await this.db.executeSql(countQuery);
      const count = result[0].rows.item(0).count;
      console.log(`Total threads count: ${count}`);
      return count;
    } catch (error) {
      console.error('Failed to get threads count:', error);
      throw error;
    }
  }

  /**
   * Clear all threads
   * @returns Promise<void>
   */
  async clearAllThreads(): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    const deleteQuery = 'DELETE FROM threads';

    try {
      await this.db.executeSql(deleteQuery);
      console.log('All threads cleared');
    } catch (error) {
      console.error('Failed to clear all threads:', error);
      throw error;
    }
  }

  /**
   * Close the database connection
   * @returns Promise<void>
   */
  async close(): Promise<void> {
    if (this.db) {
      await this.db.close();
      this.db = null;
      console.log('Q&A Database closed');
    }
  }
}

// Export singleton instance
export const qaDatabase = new QADatabase();
export default qaDatabase;
