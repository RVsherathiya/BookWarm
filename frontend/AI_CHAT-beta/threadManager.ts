import database, { QAThreadItem, QAThread } from './database';

export interface ThreadSession {
  currentThreadId: number | null;
  currentQAs: QAThreadItem[];
  mode: string;
  maxQAsPerThread: number;
}

class ThreadManager {
  private sessions: Map<string, ThreadSession> = new Map();
  private readonly MAX_QAS_PER_THREAD = 10;

  /**
   * Get or create a session for a specific mode
   */
  getSession(mode: string): ThreadSession {
    if (!this.sessions.has(mode)) {
      this.sessions.set(mode, {
        currentThreadId: null,
        currentQAs: [],
        mode,
        maxQAsPerThread: this.MAX_QAS_PER_THREAD,
      });
    }
    return this.sessions.get(mode)!;
  }

  /**
   * Add a Q&A pair to the current session
   * Returns true if added to current thread, false if thread is full
   */
  addQAToSession(mode: string, question: string, answer: string): boolean {
    const session = this.getSession(mode);
    
    console.log(`Adding Q&A to session for mode: ${mode}, current count: ${session.currentQAs.length}`);
    
    const qaItem: QAThreadItem = {
      question,
      answer,
      timestamp: new Date().toISOString(),
    };

    // Check if current thread is full
    if (session.currentQAs.length >= this.MAX_QAS_PER_THREAD) {
      console.log('Session is full, cannot add more Q&As');
      return false; // Thread is full, need to create new one
    }

    session.currentQAs.push(qaItem);
    console.log(`Q&A added successfully. New count: ${session.currentQAs.length}`);
    return true;
  }

  /**
   * Save current session as a new thread
   * Returns the thread ID
   */
  async saveCurrentSession(mode: string): Promise<number> {
    const session = this.getSession(mode);
    
    if (session.currentQAs.length === 0) {
      console.log('No Q&A pairs to save for mode:', mode);
      throw new Error('No Q&A pairs to save');
    }

    try {
      console.log('Saving session for mode:', mode, 'with Q&As:', session.currentQAs.length);
      console.log('Q&A data being saved:', session.currentQAs.map(qa => ({
        question: qa.question.substring(0, 50),
        answer: qa.answer.substring(0, 50)
      })));
      
      const threadId = await database.addNewThread(mode, session.currentQAs);
      session.currentThreadId = threadId;
      
      // Clear current QAs after saving to prevent duplicate data
      const clearedCount = session.currentQAs.length;
      session.currentQAs = [];
      
      console.log(`Session saved successfully with thread ID: ${threadId}, cleared ${clearedCount} Q&As`);
      return threadId;
    } catch (error) {
      console.error('Failed to save thread:', error);
      throw error;
    }
  }

  /**
   * Check if current session is full
   */
  isSessionFull(mode: string): boolean {
    const session = this.getSession(mode);
    return session.currentQAs.length >= this.MAX_QAS_PER_THREAD;
  }

  /**
   * Get current session Q&A count
   */
  getCurrentSessionCount(mode: string): number {
    const session = this.getSession(mode);
    return session.currentQAs.length;
  }

  /**
   * Clear current session (but don't save)
   */
  clearCurrentSession(mode: string): void {
    const session = this.getSession(mode);
    session.currentQAs = [];
    session.currentThreadId = null;
    console.log('Session cleared for mode:', mode);
  }

  /**
   * Get all threads for a mode
   */
  async getAllThreadsForMode(mode: string): Promise<QAThread[]> {
    try {
      console.log('Getting all threads for mode:', mode);
      const threadsForMode = await database.getThreadsByMode(mode);
      console.log('Threads for mode:', mode, threadsForMode.length);
      return threadsForMode;
    } catch (error) {
      console.error('Failed to get threads for mode:', error);
      throw error;
    }
  }

  /**
   * Get a specific thread by ID
   */
  async getThreadById(threadId: number): Promise<QAThread | null> {
    try {
      return await database.getThreadById(threadId);
    } catch (error) {
      console.error('Failed to get thread by ID:', error);
      throw error;
    }
  }

  /**
   * Delete a thread
   */
  async deleteThread(threadId: number): Promise<void> {
    try {
      await database.deleteThread(threadId);
    } catch (error) {
      console.error('Failed to delete thread:', error);
      throw error;
    }
  }

  /**
   * Clear all threads for a specific mode
   */
  async clearThreadsByMode(mode: string): Promise<void> {
    try {
      await database.clearThreadsByMode(mode);
      // Also clear the current session for this mode
      this.clearCurrentSession(mode);
    } catch (error) {
      console.error('Failed to clear threads by mode:', error);
      throw error;
    }
  }

  /**
   * Get current session info for display
   */
  getSessionInfo(mode: string): {
    currentQAs: QAThreadItem[];
    count: number;
    isFull: boolean;
    currentThreadId: number | null;
  } {
    const session = this.getSession(mode);
    return {
      currentQAs: [...session.currentQAs],
      count: session.currentQAs.length,
      isFull: session.currentQAs.length >= this.MAX_QAS_PER_THREAD,
      currentThreadId: session.currentThreadId,
    };
  }

  /**
   * Load a thread into current session for editing
   */
  loadThreadIntoSession(mode: string, thread: QAThread): void {
    const session = this.getSession(mode);
    session.currentQAs = [...thread.qaData];
    session.currentThreadId = thread.id;
  }

  /**
   * Clear all sessions
   */
  clearAllSessions(): void {
    this.sessions.clear();
  }
}

// Export singleton instance
export const threadManager = new ThreadManager();
export default threadManager;
