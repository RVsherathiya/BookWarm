# SQLite Integration for AI Learning Hub

## Overview
This app now includes SQLite storage for AI Q&A history, allowing users to view and manage their previous conversations with the AI assistant.

## Features

### 📊 Database Schema
- **Table**: `qa_history`
- **Fields**:
  - `id` (INTEGER, PRIMARY KEY, AUTOINCREMENT)
  - `type` (TEXT) - Mode type: quiz, challenge, lesson, worksheet
  - `question` (TEXT) - User's question
  - `answer` (TEXT) - AI's response
  - `created_at` (DATETIME) - Timestamp

### 🔧 Database Functions
- `saveQuestion(type, question, answer)` - Save Q&A to database
- `getQuestionsByType(type)` - Get history for specific mode
- `getAllQuestions()` - Get all Q&A history
- `deleteQuestion(id)` - Delete specific Q&A
- `clearHistoryByType(type)` - Clear history for specific mode

### 🎨 UI Components

#### History Toggle
- **History Button**: Located in chat header (history icon)
- **Toggle**: Switches between chat and history view

#### History Display
- **Expandable Items**: Tap to expand/collapse Q&A
- **Chronological Order**: Most recent first
- **Date/Time**: Shows when Q&A was created
- **Clean Design**: Matches app's modern aesthetic

#### History Management
- **Clear History**: Delete all Q&A for current mode
- **Close History**: Return to chat view
- **Empty State**: Helpful message when no history exists

## Usage

### Automatic Saving
- Every Q&A is automatically saved to SQLite
- No user action required
- Data persists between app sessions

### Viewing History
1. Open any chat mode (Quiz, Challenge, Lesson, Worksheet)
2. Tap the history icon in the header
3. Browse through previous Q&A
4. Tap items to expand and see full answers

### Managing History
- **Clear All**: Tap delete icon in history header
- **Close**: Tap X icon to return to chat
- **Expand**: Tap any Q&A item to see full answer

## Technical Implementation

### Database Setup
```typescript
// database.ts
import SQLite from 'react-native-sqlite-storage';

// Initialize database
await database.init();

// Save Q&A
await database.saveQuestion('quiz', 'What is React?', 'React is a JavaScript library...');

// Get history
const history = await database.getQuestionsByType('quiz');
```

### Integration Points
- **ChatGPTScreen**: Main integration point
- **Auto-save**: After each AI response
- **History Loading**: On screen mount
- **Real-time Updates**: After each new Q&A

## File Structure
```
├── database.ts              # Database setup and functions
├── ChatGPTScreen.tsx        # Main chat screen with SQLite integration
└── SQLITE_INTEGRATION.md    # This documentation
```

## Dependencies
- `react-native-sqlite-storage` - SQLite database
- `@types/react-native-sqlite-storage` - TypeScript types

## Benefits
- **Persistent Storage**: Q&A saved locally
- **Mode-Specific History**: Separate history for each mode
- **Offline Access**: View history without internet
- **Clean UI**: Seamlessly integrated design
- **Performance**: Fast local database queries

## Future Enhancements
- Search functionality
- Export history
- Favorite Q&A
- Categories/tags
- Sync across devices
