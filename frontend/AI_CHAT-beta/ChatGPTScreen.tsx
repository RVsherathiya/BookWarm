import React, { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
  ActivityIndicator,
  Clipboard,
  Dimensions,
  FlatList,
  Platform,
  StatusBar,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import database, { QAItem } from './database';
import threadManager from './threadManager';
import { OPENAI_API_KEY } from './utils';
// OpenAI API configuration
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  isStreaming?: boolean;
}

interface ChatGPTScreenProps {
  navigation: any;
  route: any;
}

interface ParsedTextSegment {
  type: 'title' | 'description' | 'options' | 'other' | 'normal';
  text: string;
}

const { width: screenWidth } = Dimensions.get('window');

// Function to parse text with special prefixes - line by line
const parseTextWithPrefixes = (text: string): ParsedTextSegment[] => {
  const segments: ParsedTextSegment[] = [];
  const lines = text.split('\n');
  let currentOptionsSegment: ParsedTextSegment | null = null;
  
  for (const line of lines) {
    const trimmedLine = line.trim();
    
    if (trimmedLine.startsWith(':_title')) {
      currentOptionsSegment = null; // Reset options tracking
      segments.push({
        type: 'title',
        text: trimmedLine.substring(7).trim() // Remove ':_title' prefix
      });
    } else if (trimmedLine.startsWith(':_description')) {
      currentOptionsSegment = null; // Reset options tracking
      segments.push({
        type: 'description',
        text: trimmedLine.substring(13).trim() // Remove ':_description' prefix
      });
    } else if (trimmedLine.startsWith(':_options')) {
      currentOptionsSegment = {
        type: 'options',
        text: trimmedLine.substring(9).trim() // Remove ':_options' prefix
      };
      segments.push(currentOptionsSegment);
    } else if (trimmedLine.startsWith(':_other')) {
      currentOptionsSegment = null; // Reset options tracking
      segments.push({
        type: 'other',
        text: trimmedLine.substring(7).trim() // Remove ':_other' prefix
      });
    } else if (trimmedLine) {
      // Check if this line is part of options (starts with number, dash, or bullet)
      const isOptionLine = /^[\d\)\-\*\+]/.test(trimmedLine);
      if (isOptionLine && currentOptionsSegment) {
        // Append to the current options segment
        currentOptionsSegment.text += '\n' + trimmedLine;
      } else {
        currentOptionsSegment = null; // Reset options tracking
        segments.push({
          type: 'normal',
          text: trimmedLine
        });
      }
    }
  }
  
  return segments;
};

const ChatGPTScreen: React.FC<ChatGPTScreenProps> = ({ navigation, route }) => {
  const { mode } = route.params;
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedMessageIndex, setCopiedMessageIndex] = useState<number | null>(null);
  const [history, setHistory] = useState<QAItem[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [lastFailedMessage, setLastFailedMessage] = useState<string | null>(null);
  const scrollViewRef = useRef<ScrollView>(null);

  // Mode configurations
  const modeConfig = {
    quiz: {
      title: 'Quiz',
      icon: 'quiz',
      color: '#10a37f',
      initialPrompt: `You are a helpful quiz assistant. Always format your responses using these prefixes:

:_title [Main heading/title of the response]
:_description [Explanatory or descriptive text]
:_options
[Multiple choice options, each on a new line, prefixed with - or number]
:_other [Any additional info, notes, or details]

Rules:
1. Every response must include at least one :_title and one :_description.
2. If the response involves choices, list them under :_options.
3. If additional context is needed, use :_other.
4. Do not mix tags in one line. Each line must start with exactly one prefix.

Create engaging quizzes on any topic. Ask one question at a time and provide multiple choice options.`,
      placeholder: 'Ask for a quiz on any topic...',
    },
    challenge: {
      title: 'Challenge',
      icon: 'extension',
      color: '#ff6b35',
      initialPrompt: `You are a challenge and games assistant. Always format your responses using these prefixes:

:_title [Main heading/title of the response]
:_description [Explanatory or descriptive text]
:_options
[Challenge options, each on a new line, prefixed with - or number]
:_other [Any additional info, notes, or details]

Rules:
1. Every response must include at least one :_title and one :_description.
2. If the response involves choices, list them under :_options.
3. If additional context is needed, use :_other.
4. Do not mix tags in one line. Each line must start with exactly one prefix.

Create flashcards, memory games, and interactive challenges to help with learning.`,
      placeholder: 'Create a challenge or flashcard set...',
    },
    'lesson-preparation': {
      title: 'Lesson Preparation',
      icon: 'school',
      color: '#6366f1',
      initialPrompt: `You are a lesson preparation assistant. Always format your responses using these prefixes:

:_title [Main heading/title of the response]
:_description [Explanatory or descriptive text]
:_options
[Lesson plan options, each on a new line, prefixed with - or number]
:_other [Any additional info, notes, or details]

Rules:
1. Every response must include at least one :_title and one :_description.
2. If the response involves choices, list them under :_options.
3. If additional context is needed, use :_other.
4. Do not mix tags in one line. Each line must start with exactly one prefix.

Help create detailed lesson plans, learning objectives, and teaching strategies.`,
      placeholder: 'Help me prepare a lesson on...',
    },
    worksheet: {
      title: 'Worksheet',
      icon: 'assignment',
      color: '#8b5cf6',
      initialPrompt: `You are a worksheet creation assistant. Always format your responses using these prefixes:

:_title [Main heading/title of the response]
:_description [Explanatory or descriptive text]
:_options
[Worksheet options, each on a new line, prefixed with - or number]
:_other [Any additional info, notes, or details]

Rules:
1. Every response must include at least one :_title and one :_description.
2. If the response involves choices, list them under :_options.
3. If additional context is needed, use :_other.
4. Do not mix tags in one line. Each line must start with exactly one prefix.

Generate educational worksheets, exercises, and practice materials.`,
      placeholder: 'Create a worksheet for...',
    },
  };

  const currentMode = modeConfig[mode as keyof typeof modeConfig] || {
    title: 'AI Assistant',
    icon: 'help',
    color: '#666',
    initialPrompt: 'You are a helpful AI assistant. How can I help you today?',
    placeholder: 'Ask me anything...',
  };

  // Test API connection
  const testApiConnection = useCallback(async () => {
    try {
      const response = await fetch(OPENAI_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [{ role: 'user', content: 'Hello' }],
          max_tokens: 5,
        }),
      });
      
      console.log('API Test Response Status:', response.status);
      if (response.status === 503) {
        console.log('API is temporarily unavailable (503)');
      }
      return response.status;
    } catch (error) {
      console.error('API Test Error:', error);
      return null;
    }
  }, []);

  // Initialize database and load history
  useEffect(() => {
    const initializeDatabase = async () => {
      try {
        await database.init();
        await loadHistory();
        // Test API connection on startup
        await testApiConnection();
      } catch (error) {
        console.error('Database initialization failed:', error);
      }
    };

    initializeDatabase();
  }, [testApiConnection]);

  // Save current session when component unmounts
  useEffect(() => {
    return () => {
      // Save any pending Q&As when leaving the screen
      const sessionInfo = threadManager.getSessionInfo(mode);
      if (sessionInfo.count > 0) {
        threadManager.saveCurrentSession(mode).catch(error => {
          console.error('Failed to save session on unmount:', error);
        });
      }
    };
  }, [mode]);

  // Load history for current mode
  const loadHistory = useCallback(async () => {
    try {
      const historyData = await threadManager.getAllThreadsForMode(mode);
      // Convert threads to the old format for compatibility
      const formattedHistory = historyData.flatMap(thread => 
        thread.qaData.map((qa, index) => ({
          id: parseInt(`${thread.id}${index}`),
          type: mode,
          question: qa.question,
          answer: qa.answer,
          created_at: qa.timestamp
        }))
      );
      setHistory(formattedHistory);
    } catch (error) {
      console.error('Failed to load history:', error);
    }
  }, [mode]);

  // Save question and answer to thread
  const saveToThread = useCallback(async (question: string, answer: string) => {
    try {
      // Add Q&A to current session
      const added = threadManager.addQAToSession(mode, question, answer);
      
      if (!added) {
        // Session is full, save current session and start new one
        await threadManager.saveCurrentSession(mode);
        // Add the new Q&A to the new session
        threadManager.addQAToSession(mode, question, answer);
      }
      
      await loadHistory(); // Refresh history
    } catch (error) {
      console.error('Failed to save to thread:', error);
    }
  }, [mode, loadHistory]);

  // Copy text to clipboard - memoized to prevent re-creation
  const copyToClipboard = useCallback(async (text: string, messageIndex: number) => {
    try {
      await Clipboard.setString(text);
      setCopiedMessageIndex(messageIndex);
      // Hide the feedback after 2 seconds
      setTimeout(() => {
        setCopiedMessageIndex(null);
      }, 2000);
    } catch (error) {
      Alert.alert('Error', 'Failed to copy text');
    }
  }, []);

  // ChatGPT-style Typing Indicator - memoized component
  const ChatGPTTypingIndicator = React.memo(() => (
    <View style={styles.chatgptTypingContainer}>
      <View style={styles.chatgptTypingBubble}>
        <View style={styles.chatgptTypingDots}>
          <View style={[styles.chatgptTypingDot, { backgroundColor: currentMode.color }]} />
          <View style={[styles.chatgptTypingDot, { backgroundColor: currentMode.color }]} />
          <View style={[styles.chatgptTypingDot, { backgroundColor: currentMode.color }]} />
        </View>
      </View>
    </View>
  ));

  // History Item Component
  const HistoryItem = React.memo(({ item }: { item: QAItem }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const formatDate = (dateString: string) => {
      const date = new Date(dateString);
      // Use device's local timezone
      return date.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      }) + ' ' + date.toLocaleTimeString(undefined, { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true
      });
    };

    return (
      <View style={styles.historyItem}>
        <TouchableOpacity
          style={styles.historyItemHeader}
          onPress={() => setIsExpanded(!isExpanded)}
        >
          <View style={styles.historyQuestionContainer}>
            <Text style={styles.historyQuestion} numberOfLines={isExpanded ? undefined : 2}>
              {item.question}
            </Text>
            <Text style={styles.historyDate}>{formatDate(item.created_at)}</Text>
          </View>
          <Icon
            name={isExpanded ? "expand-less" : "expand-more"}
            size={20}
            color="#666"
          />
        </TouchableOpacity>
        
        {isExpanded && (
          <View style={styles.historyAnswerContainer}>
            <Text style={styles.historyAnswer}>{item.answer}</Text>
          </View>
        )}
      </View>
    );
  });

  // Component to render parsed text segments
  const ParsedTextRenderer = React.memo(({ text }: { text: string }) => {
    const segments = parseTextWithPrefixes(text);
    
    return (
      <View>
        {segments.map((segment, index) => {
          if (segment.type === 'title') {
            return (
              <Text key={index} style={styles.parsedTitle}>
                {segment.text}
              </Text>
            );
          } else if (segment.type === 'description') {
            return (
              <Text key={index} style={styles.parsedDescription}>
                {segment.text}
              </Text>
            );
          } else if (segment.type === 'options') {
            // Split options by newlines and render each as a list item
            const options = segment.text.split('\n').filter(opt => opt.trim());
            return (
              <View key={index} style={styles.optionsContainer}>
                {options.map((option, optIndex) => (
                  <View key={optIndex} style={styles.optionItem}>
                    <Text style={styles.parsedOptions}>
                      {option.trim()}
                    </Text>
                  </View>
                ))}
              </View>
            );
          } else if (segment.type === 'other') {
            return (
              <Text key={index} style={styles.parsedOther}>
                {segment.text}
              </Text>
            );
          } else {
            return (
              <Text key={index} style={styles.parsedNormal}>
                {segment.text}
              </Text>
            );
          }
        })}
      </View>
    );
  });

  // ChatGPT-style Message Bubble with copy functionality
  const ChatGPTMessageBubble = React.memo(({ message, index }: { message: Message; index: number }) => {
    const isUser = message.role === 'user';
    const isCopied = copiedMessageIndex === index;
    
    const handleCopyPress = useCallback(() => {
      copyToClipboard(message.content, index);
    }, [message.content, index, copyToClipboard]);

    if (isUser) {
      return (
        <View style={styles.userMessageContainer}>
          <View style={styles.userMessageWrapper}>
            <View style={styles.userMessageContent}>
              <View style={styles.userMessageHeader}>
                <View style={styles.userAvatar}>
                  <Icon name="person" size={18} color="#ffffff" />
                </View>
                <Text style={styles.userMessageRole}>You</Text>
              </View>
              <View style={styles.userMessageBubble}>
                <Text style={styles.userMessageText}>
                  {message.content}
                  {message.isStreaming && (
                    <Text style={styles.userMessageCursor}>|</Text>
                  )}
                </Text>
              </View>
            </View>
          </View>
        </View>
      );
    }

    return (
      <View style={styles.assistantMessageContainer}>
        <View style={styles.assistantMessageContent}>
          <View style={styles.assistantMessageHeader}>
            <View style={styles.assistantAvatar}>
              <Icon name={currentMode.icon} size={20} color={currentMode.color} />
            </View>
            <Text style={styles.assistantMessageRole}>{currentMode.title}</Text>
            <TouchableOpacity
              style={styles.copyButton}
              onPress={handleCopyPress}
            >
              {isCopied ? (
                <View style={styles.copiedFeedback}>
                  <Icon name="check" size={16} color={currentMode.color} />
                  <Text style={[styles.copiedText, { color: currentMode.color }]}>Copied</Text>
                </View>
              ) : (
                <Icon name="content-copy" size={16} color="#666" />
              )}
            </TouchableOpacity>
          </View>
          
          <View style={styles.assistantMessageBubble}>
            <ParsedTextRenderer text={message.content} />
            {message.isStreaming && (
              <Text style={[styles.assistantMessageCursor, { color: currentMode.color }]}>
                |
              </Text>
            )}
          </View>
        </View>
      </View>
    );
  });

  // Memoized scroll to end function to prevent re-creation
  const scrollToEnd = useCallback(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, []);

  // Optimized input change handler
  const handleInputChange = useCallback((text: string) => {
    setInputText(text);
  }, []);

  const sendMessage = useCallback(async () => {
    if (!inputText.trim()) {
      Alert.alert('Error', 'Please enter a message');
      return;
    }

    const userMessage: Message = {
      role: 'user',
      content: inputText.trim(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setLastFailedMessage(null); // Clear any previous failed message
    setIsLoading(true);

    // Add empty assistant message for streaming
    const assistantMessage: Message = {
      role: 'assistant',
      content: '',
      isStreaming: true,
    };
    setMessages(prev => [...prev, assistantMessage]);

    try {
      // Use XMLHttpRequest for streaming in React Native
      const xhr = new XMLHttpRequest();
      
      xhr.open('POST', OPENAI_API_URL, true);
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.setRequestHeader('Authorization', `Bearer ${OPENAI_API_KEY}`);
      xhr.setRequestHeader('User-Agent', 'OpenAI-ReactNative/1.0');
      xhr.timeout = 30000; // 30 second timeout

      let buffer = '';

      xhr.onprogress = () => {
        const responseText = xhr.responseText;
        const newData = responseText.slice(buffer.length);
        buffer = responseText;

        // Process new data chunks
        const lines = newData.split('\n');
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') {
              // Mark streaming as complete
              setMessages(prev => 
                prev.map((msg, index) => 
                  index === prev.length - 1 && msg.isStreaming
                    ? { ...msg, isStreaming: false }
                    : msg
                )
              );
              return;
            }

            try {
              const parsed = JSON.parse(data);
              const content = parsed.choices?.[0]?.delta?.content;
              
              if (content) {
                setMessages(prev => 
                  prev.map((msg, index) => 
                    index === prev.length - 1 && msg.isStreaming
                      ? { ...msg, content: msg.content + content }
                      : msg
                  )
                );
              }
            } catch (e) {
              // Ignore parsing errors for incomplete chunks
            }
          }
        }
      };

      xhr.onload = () => {
        if (xhr.status === 200) {
          // Mark streaming as complete and save to database
          setMessages(prev => {
            const updatedMessages = prev.map((msg, index) => 
              index === prev.length - 1 && msg.isStreaming
                ? { ...msg, isStreaming: false }
                : msg
            );
            
            // Save the complete Q&A to database
            const userMessage = updatedMessages[updatedMessages.length - 2];
            const assistantMessage = updatedMessages[updatedMessages.length - 1];
            
            if (userMessage && assistantMessage && !assistantMessage.isStreaming) {
              saveToThread(userMessage.content, assistantMessage.content);
            }
            
            return updatedMessages;
          });
        } else {
          console.error('API Error Details:', {
            status: xhr.status,
            statusText: xhr.statusText,
            responseText: xhr.responseText,
            readyState: xhr.readyState
          });
          throw new Error(`HTTP ${xhr.status}: ${xhr.statusText || 'Unknown error'}`);
        }
      };

      xhr.onerror = () => {
        throw new Error('Network error occurred');
      };

      xhr.ontimeout = () => {
        throw new Error('Request timeout - please try again');
      };

      // Create system message with mode-specific prompt
      const systemMessage = {
        role: 'system',
        content: currentMode.initialPrompt,
      };

      const requestData = {
        model: 'gpt-4o-mini',
        messages: [systemMessage, ...messages, userMessage],
        max_tokens: 1000,
        temperature: 0.7,
        stream: true,
      };

      console.log('Sending request to OpenAI:', {
        url: OPENAI_API_URL,
        model: requestData.model,
        messageCount: requestData.messages.length,
        hasApiKey: !!OPENAI_API_KEY
      });

      xhr.send(JSON.stringify(requestData));

    } catch (error) {
      console.error('OpenAI API Error:', error);
      
      let errorMessage = 'Failed to get response from OpenAI';
      if (error instanceof Error) {
        if (error.message.includes('401')) {
          errorMessage = 'Invalid API key. Please check your OpenAI API key.';
        } else if (error.message.includes('429')) {
          errorMessage = 'Rate limit exceeded. Please try again later.';
        } else if (error.message.includes('500')) {
          errorMessage = 'OpenAI server error. Please try again later.';
        } else if (error.message.includes('503')) {
          errorMessage = 'OpenAI service is temporarily unavailable. Please try again in a few minutes.';
        } else if (error.message.includes('Network error')) {
          errorMessage = 'Network connection failed. Please check your internet connection.';
        } else {
          errorMessage = error.message;
        }
      }

      // Remove the streaming message and show error
      setMessages(prev => prev.slice(0, -1));
      setLastFailedMessage(inputText.trim());
      Alert.alert('Error', errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [inputText, messages, copyToClipboard, currentMode]);

  const clearChat = useCallback(() => {
    Alert.alert(
      'Clear Chat',
      `Are you sure you want to clear the current ${currentMode.title} conversation?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: () => setMessages([]),
        },
      ]
    );
  }, [currentMode.title]);

  const clearHistory = useCallback(async () => {
    Alert.alert(
      'Clear History',
      `Are you sure you want to delete all previous ${currentMode.title} Q&A?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await database.clearHistoryByType(mode);
              await loadHistory();
              Alert.alert('Success', `${currentMode.title} history cleared successfully`);
            } catch (error) {
              console.error('Failed to clear history:', error);
              Alert.alert('Error', `Failed to clear ${currentMode.title} history`);
            }
          },
        },
      ]
    );
  }, [mode, loadHistory, currentMode.title]);

  const retryLastMessage = useCallback(() => {
    if (lastFailedMessage) {
      setInputText(lastFailedMessage);
      setLastFailedMessage(null);
      // Trigger send message after a short delay
      setTimeout(() => {
        sendMessage();
      }, 100);
    }
  }, [lastFailedMessage, sendMessage]);

  // Memoized messages list to prevent unnecessary re-renders
  const messagesList = useMemo(() => {
    return messages.map((message, index) => (
      <ChatGPTMessageBubble key={index} message={message} index={index} />
    ));
  }, [messages, copiedMessageIndex]);

  return (
    <LinearGradient
      colors={['#f7f7f8', '#ffffff']}
      style={styles.container}
    >
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.chatgptHeader}>
          <View style={styles.chatgptHeaderContent}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Icon name="arrow-back" size={24} color="#202123" />
            </TouchableOpacity>
            <View style={styles.chatgptHeaderLeft}>
              <View style={[styles.chatgptLogo, { backgroundColor: `${currentMode.color}20` }]}>
                <Icon name={currentMode.icon} size={24} color={currentMode.color} />
              </View>
              <Text style={styles.chatgptHeaderTitle}>{currentMode.title}</Text>
            </View>
            <View style={styles.headerButtons}>
              {!showHistory && (
                <>
                  <TouchableOpacity 
                    style={styles.historyButton} 
                    onPress={() => navigation.navigate('History', { mode })}
                  >
                    <Icon name="history" size={20} color="#666" />
                  </TouchableOpacity>
                </>
              )}
              {lastFailedMessage && (
                <TouchableOpacity 
                  style={styles.retryButton} 
                  onPress={retryLastMessage}
                >
                  <Icon name="refresh" size={20} color="#007AFF" />
                </TouchableOpacity>
              )}
              {messages.length > 0 && (
                <TouchableOpacity 
                  style={styles.chatgptClearButton} 
                  onPress={clearChat}
                >
                  <Icon name="clear-all" size={20} color="#666" />
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>

      <ScrollView 
        ref={scrollViewRef}
        style={styles.messagesContainer} 
        contentContainerStyle={styles.messagesContent}
        onContentSizeChange={scrollToEnd}
      >
        {showHistory ? (
          <View style={styles.historyContainer}>
            <View style={styles.historyHeader}>
              <Text style={styles.historyTitle}>Previous Q&A</Text>
              <View style={styles.historyHeaderButtons}>
                {history.length > 0 && (
                  <TouchableOpacity
                    style={styles.clearHistoryButton}
                    onPress={clearHistory}
                  >
                    <Icon name="delete-sweep" size={20} color="#666" />
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  style={styles.closeHistoryButton}
                  onPress={() => setShowHistory(false)}
                >
                  <Icon name="close" size={20} color="#666" />
                </TouchableOpacity>
              </View>
            </View>
            {history.length > 0 ? (
              <FlatList
                data={history}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => <HistoryItem item={item} />}
                style={styles.historyList}
                showsVerticalScrollIndicator={false}
              />
            ) : (
              <View style={styles.emptyHistoryContainer}>
                <Icon name="history" size={48} color="#ccc" />
                <Text style={styles.emptyHistoryText}>No previous Q&A found</Text>
                <Text style={styles.emptyHistorySubtext}>
                  Start asking questions to build your history
                </Text>
              </View>
            )}
          </View>
        ) : (
          <>
            {messages.length === 0 ? (
              <View style={styles.chatgptEmptyState}>
                <View style={[styles.chatgptEmptyIcon, { backgroundColor: `${currentMode.color}20` }]}>
                  <Icon name={currentMode.icon} size={64} color={currentMode.color} />
                </View>
                <Text style={styles.chatgptEmptyTitle}>
                  {currentMode.title} Assistant
                </Text>
                <View style={styles.chatgptEmptySubtext}>
                  <ParsedTextRenderer text={"Hello, I am your AI assistant. How can I help you today?"} />
                </View>
              </View>
            ) : (
              messagesList
            )}
            {isLoading && <ChatGPTTypingIndicator />}
          </>
        )}
      </ScrollView>

        <View style={styles.chatgptInputContainer}>
          <View style={styles.chatgptInputWrapper}>
            <TextInput
              style={styles.chatgptTextInput}
              value={inputText}
              onChangeText={handleInputChange}
              placeholder={currentMode.placeholder}
              placeholderTextColor="#999"
              multiline
              maxLength={1000}
            />
            <TouchableOpacity
              style={[
                styles.chatgptSendButton, 
                { backgroundColor: currentMode.color },
                (!inputText.trim() || isLoading) && styles.chatgptSendButtonDisabled
              ]}
              onPress={sendMessage}
              disabled={!inputText.trim() || isLoading}
            >
              <Icon 
                name="send" 
                size={20} 
                color="#fff" 
              />
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0,
    paddingBottom: Platform.OS === 'android' ? 35 : 0,
    paddingVertical: Platform.OS === 'android' ? 10 : 0,
  },
  // ChatGPT Header Styles
  chatgptHeader: {
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  chatgptHeaderContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  chatgptHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  chatgptLogo: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  chatgptHeaderTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#202123',
  },
  chatgptClearButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },
  // Messages Container
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    paddingVertical: 16,
  },
  // ChatGPT Empty State
  chatgptEmptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 32,
  },
  chatgptEmptyIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  chatgptEmptyTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#202123',
    textAlign: 'center',
    marginBottom: 8,
  },
  chatgptEmptySubtext: {
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  // User Message Styles
  userMessageContainer: {
    marginBottom: 24,
    paddingHorizontal: 16,
    alignItems: 'flex-end',
  },
  userMessageWrapper: {
    maxWidth: '85%',
  },
  userMessageContent: {
    alignItems: 'flex-end',
  },
  userMessageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    alignSelf: 'flex-end',
  },
  userAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    shadowColor: '#007AFF',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  userMessageRole: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6e6e80',
  },
  userMessageBubble: {
    backgroundColor: '#007AFF',
    borderRadius: 20,
    borderBottomRightRadius: 6,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: '#007AFF',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  userMessageText: {
    fontSize: 16,
    lineHeight: 22,
    color: '#ffffff',
    fontWeight: '500',
  },
  userMessageCursor: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 18,
  },

  // Assistant Message Styles
  assistantMessageContainer: {
    marginBottom: 24,
    paddingHorizontal: 16,
    alignItems: 'flex-start',
  },
  assistantMessageContent: {
    maxWidth: '90%',
  },
  assistantMessageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  assistantAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  assistantMessageRole: {
    fontSize: 14,
    fontWeight: '600',
    color: '#202123',
    flex: 1,
  },
  copyButton: {
    padding: 4,
    borderRadius: 4,
  },
  copiedFeedback: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  copiedText: {
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
  },
  assistantMessageBubble: {
    backgroundColor: '#f7f7f8',
    borderRadius: 18,
    borderBottomLeftRadius: 6,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#e5e5e5',
  },
  assistantMessageText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#202123',
  },
  assistantMessageCursor: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  // ChatGPT Typing Indicator
  chatgptTypingContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  chatgptTypingBubble: {
    backgroundColor: '#f0f0f0',
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignSelf: 'flex-start',
  },
  chatgptTypingDots: {
    flexDirection: 'row',
  },
  chatgptTypingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 2,
  },
  // ChatGPT Input Styles
  chatgptInputContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e5e5e5',
  },
  chatgptInputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: '#f7f7f8',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#e5e5e5',
  },
  chatgptTextInput: {
    flex: 1,
    fontSize: 16,
    color: '#202123',
    maxHeight: 120,
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  chatgptSendButton: {
    padding: 12,
    borderRadius: 20,
    marginLeft: 8,
  },
  chatgptSendButtonDisabled: {
    backgroundColor: '#d1d5db',
  },
  // Header Buttons
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  historyButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    marginRight: 8,
  },
  retryButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#e3f2fd',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  // History Styles
  historyContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  historyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#202123',
  },
  historyHeaderButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  clearHistoryButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    marginRight: 8,
  },
  closeHistoryButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },
  historyList: {
    flex: 1,
    marginTop: 8,
  },
  historyItem: {
    backgroundColor: '#f7f7f8',
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e5e5e5',
  },
  historyItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 16,
  },
  historyQuestionContainer: {
    flex: 1,
    marginRight: 12,
  },
  historyQuestion: {
    fontSize: 16,
    fontWeight: '500',
    color: '#202123',
    lineHeight: 22,
    marginBottom: 4,
  },
  historyDate: {
    fontSize: 12,
    color: '#6e6e80',
  },
  historyAnswerContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e5e5',
  },
  historyAnswer: {
    fontSize: 14,
    color: '#202123',
    lineHeight: 20,
    marginTop: 8,
  },
  emptyHistoryContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyHistoryText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6e6e80',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyHistorySubtext: {
    fontSize: 14,
    color: '#6e6e80',
    textAlign: 'center',
    lineHeight: 20,
  },
  // Text parsing styles
  parsedTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#202123',
    textAlign: 'center',
    marginVertical: 8,
    lineHeight: 28,
  },
  parsedDescription: {
    fontSize: 14,
    color: '#6e6e80',
    lineHeight: 20,
    marginVertical: 4,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  parsedOptions: {
    fontSize: 16,
    color: '#202123',
    lineHeight: 22,
    marginVertical: 2,
    fontWeight: '500',
  },
  parsedOther: {
    fontSize: 14,
    color: '#8b5cf6',
    lineHeight: 20,
    marginVertical: 4,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  parsedNormal: {
    fontSize: 16,
    color: '#202123',
    lineHeight: 24,
  },
  optionsContainer: {
    marginVertical: 8,
    alignItems: 'center',
  },
  optionItem: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginVertical: 2,
    borderLeftWidth: 3,
    borderLeftColor: '#007AFF',
    minWidth: 200,
    alignItems: 'center',
  },
});

export default ChatGPTScreen;
