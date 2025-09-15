# AI Learning Hub

A React Native app with 4 main learning modes powered by OpenAI GPT-4.

## Features

### 🏠 Home Screen
- Clean, modern design with 4 main buttons
- Gradient backgrounds for each mode
- Intuitive navigation

### 🎯 Learning Modes

1. **Quiz** - AI-powered quizzes on any topic
   - Color: Green (#10a37f)
   - Creates engaging multiple choice questions

2. **Challenge** - AI + Games, Flashcards
   - Color: Orange (#ff6b35)
   - Interactive challenges and memory games

3. **Lesson Preparation** - AI-assisted planning
   - Color: Blue (#6366f1)
   - Detailed lesson plans and teaching strategies

4. **Worksheet** - AI + Manual creation
   - Color: Purple (#8b5cf6)
   - Educational worksheets and practice materials

### 💬 ChatGPT-like Interface
- Real-time streaming responses
- Copy functionality with visual feedback
- Mode-specific system prompts
- Typing indicators
- Clean, modern UI

## Technical Stack

- **React Native** 0.81.4
- **React Navigation** 6.x (Stack Navigator)
- **OpenAI GPT-4** API integration
- **React Native Vector Icons**
- **Linear Gradient** for beautiful UI
- **TypeScript** for type safety

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Update your OpenAI API key in `ChatGPTScreen.tsx`:
   ```typescript
   const OPENAI_API_KEY = 'your-api-key-here';
   ```

3. Run the app:
   ```bash
   # iOS
   npx react-native run-ios
   
   # Android
   npx react-native run-android
   ```

## File Structure

```
├── App.tsx                 # Main app entry point
├── AppNavigator.tsx        # Navigation configuration
├── HomeScreen.tsx          # Home screen with 4 buttons
├── ChatGPTScreen.tsx       # ChatGPT interface for all modes
└── package.json           # Dependencies
```

## Navigation Flow

```
Home Screen
    ↓
[Quiz] [Challenge] [Lesson] [Worksheet]
    ↓
ChatGPT Screen (with mode-specific context)
```

## Features Implemented

✅ React Navigation with stack navigator  
✅ 4 main buttons with modern design  
✅ Mode-specific ChatGPT interfaces  
✅ OpenAI API integration with streaming  
✅ Copy functionality with visual feedback  
✅ Typing indicators  
✅ Responsive design  
✅ TypeScript support  
✅ Clean, ChatGPT-like UI  

## API Integration

Each mode uses a different system prompt to provide specialized assistance:

- **Quiz**: Creates engaging quizzes with multiple choice options
- **Challenge**: Generates flashcards, games, and interactive challenges
- **Lesson**: Helps with lesson planning and teaching strategies
- **Worksheet**: Creates educational materials and practice exercises

The app uses OpenAI's GPT-4o-mini model with streaming for real-time responses.