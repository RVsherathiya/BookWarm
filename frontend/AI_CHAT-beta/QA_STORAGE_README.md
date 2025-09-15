# Q&A Storage System for React Native

A comprehensive SQLite-based Q&A storage system that allows you to store question-answer pairs in threads, with each thread containing up to 10 Q&A pairs stored as JSON.

## Features

- **Thread-based Storage**: Each session/thread stores multiple Q&A pairs in a single database row
- **JSON Storage**: Q&A pairs are stored as JSON in the database for flexibility
- **10 Q&A Limit**: Each thread can contain up to 10 question-answer pairs
- **No Overwriting**: New Q&As create new threads instead of overwriting existing ones
- **Full CRUD Operations**: Create, read, update, and delete threads
- **TypeScript Support**: Full type definitions for better development experience

## Database Schema

### Threads Table
```sql
CREATE TABLE qa_threads (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  createdAt TEXT NOT NULL,
  qaData TEXT NOT NULL  -- JSON string containing Q&A pairs
);
```

### Q&A Data Structure
```typescript
interface QAThreadItem {
  question: string;
  answer: string;
  timestamp: string;
}

interface QAThread {
  id: number;
  createdAt: string;
  qaData: QAThreadItem[];
}
```

## Files Created

1. **`db.js`** - Standalone Q&A database helper (recommended for new projects)
2. **`database.ts`** - Updated existing database with Q&A thread functionality
3. **`QAStorageExample.tsx`** - Full-featured UI component demonstrating all functionality
4. **`QAIntegrationExample.tsx`** - Simple integration example showing key functions

## Quick Start

### Option 1: Using the Standalone Helper (Recommended)

```typescript
import qaDatabase, { QAItem } from './db';

// Initialize database
await qaDatabase.init();

// Add a new thread with multiple Q&As
const qaItems: QAItem[] = [
  {
    question: "What is React Native?",
    answer: "A framework for building mobile apps with React",
    timestamp: new Date().toISOString()
  },
  {
    question: "How do you store data?",
    answer: "Using SQLite with react-native-sqlite-storage",
    timestamp: new Date().toISOString()
  }
];

const threadId = await qaDatabase.addNewThread(qaItems);

// Get all threads
const allThreads = await qaDatabase.getAllThreads();

// Get a specific thread
const thread = await qaDatabase.getThreadById(threadId);

// Delete a thread
await qaDatabase.deleteThread(threadId);
```

### Option 2: Using the Updated Existing Database

```typescript
import database, { QAThreadItem } from './database';

// Initialize database (includes both old and new functionality)
await database.init();

// Add a new thread
const qaItems: QAThreadItem[] = [
  {
    question: "Sample question?",
    answer: "Sample answer",
    timestamp: new Date().toISOString()
  }
];

const threadId = await database.addNewThread(qaItems);
```

## API Reference

### Core Functions

#### `addNewThread(qaItems: QAItem[]): Promise<number>`
Creates a new thread with the provided Q&A items.
- **Parameters**: Array of Q&A items (max 10)
- **Returns**: Thread ID
- **Throws**: Error if more than 10 items or empty array

#### `getAllThreads(): Promise<Thread[]>`
Retrieves all threads ordered by creation date (newest first).
- **Returns**: Array of all threads

#### `getThreadById(threadId: number): Promise<Thread | null>`
Fetches a specific thread by ID.
- **Parameters**: Thread ID
- **Returns**: Thread object or null if not found

#### `deleteThread(threadId: number): Promise<void>`
Deletes a thread by ID.
- **Parameters**: Thread ID to delete

#### `getThreadsCount(): Promise<number>`
Gets the total number of threads.
- **Returns**: Count of threads

#### `clearAllThreads(): Promise<void>`
Removes all threads from the database.

## Usage Examples

### Adding Multiple Q&As at Once
```typescript
const qaItems = [
  { question: "Q1", answer: "A1", timestamp: new Date().toISOString() },
  { question: "Q2", answer: "A2", timestamp: new Date().toISOString() },
  { question: "Q3", answer: "A3", timestamp: new Date().toISOString() }
];

const threadId = await qaDatabase.addNewThread(qaItems);
console.log(`Created thread with ID: ${threadId}`);
```

### Listing All Threads
```typescript
const threads = await qaDatabase.getAllThreads();
threads.forEach(thread => {
  console.log(`Thread ${thread.id}: ${thread.qaData.length} Q&As`);
  console.log(`Created: ${thread.createdAt}`);
});
```

### Fetching a Single Thread
```typescript
const thread = await qaDatabase.getThreadById(1);
if (thread) {
  thread.qaData.forEach((qa, index) => {
    console.log(`${index + 1}. Q: ${qa.question}`);
    console.log(`   A: ${qa.answer}`);
  });
}
```

## Integration with Your App

### 1. Add to Navigation
```typescript
// In your navigation stack
import QAStorageExample from './QAStorageExample';

// Add as a screen
<Stack.Screen name="QAStorage" component={QAStorageExample} />
```

### 2. Use in Existing Components
```typescript
import { database } from './database';

// In your component
const saveQASession = async (questions: string[], answers: string[]) => {
  const qaItems = questions.map((q, i) => ({
    question: q,
    answer: answers[i] || '',
    timestamp: new Date().toISOString()
  }));
  
  const threadId = await database.addNewThread(qaItems);
  return threadId;
};
```

## Error Handling

The system includes comprehensive error handling:

- **Database not initialized**: Check if `init()` was called
- **Empty Q&A array**: At least one Q&A item required
- **Too many Q&As**: Maximum 10 items per thread
- **Thread not found**: Returns null for non-existent threads
- **Database errors**: Proper error logging and re-throwing

## Best Practices

1. **Initialize once**: Call `init()` when your app starts
2. **Handle errors**: Always wrap database calls in try-catch
3. **Validate input**: Check Q&A arrays before saving
4. **Close connections**: Call `close()` when app terminates
5. **Use timestamps**: Include timestamps for better organization

## Dependencies

- `react-native-sqlite-storage`: ^6.0.1
- `@types/react-native-sqlite-storage`: ^6.0.5

## Troubleshooting

### Common Issues

1. **Database not found**: Ensure `init()` is called before other operations
2. **JSON parsing errors**: Check that qaData is valid JSON
3. **Thread limit exceeded**: Verify Q&A arrays don't exceed 10 items
4. **TypeScript errors**: Ensure proper type imports

### Debug Mode

Enable console logging by checking the console for:
- Database initialization messages
- Thread creation confirmations
- Error details and stack traces

## License

This Q&A storage system is part of your React Native app and follows the same license terms.
