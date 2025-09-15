import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  Alert,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import database, { QAItem, QAThread } from './database';
import { threadManager } from './threadManager';
import Toast from 'react-native-toast-message';
import { RootStackParamList } from './AppNavigator';

type HistoryScreenNavigationProp = StackNavigationProp<RootStackParamList, 'History'>;
type HistoryScreenRouteProp = RouteProp<RootStackParamList, 'History'>;

interface HistoryScreenProps {
  navigation: HistoryScreenNavigationProp;
  route: HistoryScreenRouteProp;
}

// Mode configuration for styling
const modeConfig = {
  quiz: {
    title: 'Quiz',
    icon: 'quiz',
    color: '#10a37f',
    gradientColors: ['#10a37f', '#0d8f6b'],
  },
  challenge: {
    title: 'Challenge',
    icon: 'extension',
    color: '#ff6b35',
    gradientColors: ['#ff6b35', '#e55a2b'],
  },
  'lesson-preparation': {
    title: 'Lesson Preparation',
    icon: 'school',
    color: '#6366f1',
    gradientColors: ['#6366f1', '#4f46e5'],
  },
  worksheet: {
    title: 'Worksheet',
    icon: 'description',
    color: '#8b5cf6',
    gradientColors: ['#8b5cf6', '#7c3aed'],
  },
};

const HistoryScreen: React.FC<HistoryScreenProps> = ({ navigation, route }) => {
  const { mode } = route.params;
  const [threads, setThreads] = useState<QAThread[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showThreadDetails, setShowThreadDetails] = useState<number | null>(null);

  const currentMode = modeConfig[mode as keyof typeof modeConfig] || {
    title: mode,
    icon: 'help',
    color: '#666',
    gradientColors: ['#666', '#555'],
  };

  // Load threads for current mode
  const loadThreads = useCallback(async () => {
    try {
      setIsLoading(true);
      // Ensure database is initialized first
      await database.init();
      const threadsData = await threadManager.getAllThreadsForMode(mode);
      setThreads(threadsData);
    } catch (error) {
      console.error('Failed to load threads:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to load threads',
        position: 'bottom',
      });
    } finally {
      setIsLoading(false);
    }
  }, [mode]);

  // Clear all threads for current mode with confirmation
  const clearAllThreads = useCallback(async () => {
    Alert.alert(
      'Clear All Threads',
      `Are you sure you want to delete all ${currentMode.title} Q&A threads?`,
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
              await database.clearThreadsByMode(mode);
              await loadThreads();
              Toast.show({
                type: 'success',
                text1: 'Success',
                text2: `All ${currentMode.title} threads cleared successfully`,
                position: 'bottom',
              });
            } catch (error) {
              console.error('Failed to clear threads:', error);
              Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Failed to clear threads',
                position: 'bottom',
              });
            }
          },
        },
      ]
    );
  }, [loadThreads, mode, currentMode.title]);

  // Delete a specific thread
  const deleteThread = useCallback(async (threadId: number) => {
    Alert.alert(
      'Delete Thread',
      'Are you sure you want to delete this thread?',
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
              await threadManager.deleteThread(threadId);
              await loadThreads();
              Toast.show({
                type: 'success',
                text1: 'Success',
                text2: 'Thread deleted successfully',
                position: 'bottom',
              });
            } catch (error) {
              console.error('Failed to delete thread:', error);
              Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Failed to delete thread',
                position: 'bottom',
              });
            }
          },
        },
      ]
    );
  }, [loadThreads]);

  // Load threads on component mount
  useEffect(() => {
    loadThreads();
  }, [loadThreads]);

  // Add test thread for debugging
  const addTestThread = async () => {
    try {
      await database.init();
      const testQAs = [
        {
          question: "What is React Native?",
          answer: "React Native is a framework for building mobile applications using React and JavaScript.",
          timestamp: new Date().toISOString()
        },
        {
          question: "How do you store data in React Native?",
          answer: "You can use SQLite with react-native-sqlite-storage or AsyncStorage for simple key-value storage.",
          timestamp: new Date().toISOString()
        }
      ];
      const threadId = await database.addNewThread(mode, testQAs);
      console.log('Test thread created with ID:', threadId);
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: `Test thread created with ID: ${threadId}`,
        position: 'bottom',
      });
      await loadThreads();
    } catch (error) {
      console.error('Failed to create test thread:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to create test thread',
        position: 'bottom',
      });
    }
  };

  // Format date with relative time
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return 'Invalid Date';
    }
    
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
      return diffInMinutes < 1 ? 'Just now' : `${diffInMinutes}m ago`;
    } else if (diffInHours < 24) {
      const diffInHoursInt = Math.floor(diffInHours);
      return `${diffInHoursInt}h ago`;
    } else if (diffInHours < 24 * 7) {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}d ago`;
    } else {
      return date.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      }) + ' ' + date.toLocaleTimeString(undefined, { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true
      });
    }
  };

  // Thread Item Component
  const ThreadItem = React.memo(({ thread }: { thread: QAThread }) => {
    const isExpanded = showThreadDetails === thread.id;

    const toggleExpanded = () => {
      setShowThreadDetails(isExpanded ? null : thread.id);
    };

    return (
      <View style={styles.threadItem}>
        <TouchableOpacity
          style={styles.threadItemHeader}
          onPress={toggleExpanded}
        >
          <View style={styles.threadInfoContainer}>
            <View style={styles.threadHeaderRow}>
              <Text style={styles.threadTitle}>Thread #{thread.id}</Text>
              <Text style={styles.threadDate}>{formatDate(thread.createdAt)}</Text>
            </View>
            <Text style={styles.threadQACount}>
              {thread.qaData.length} Q&A pairs
            </Text>
            <Text style={styles.threadFirstQuestion} numberOfLines={1}>
              {thread.qaData[0]?.question || 'No questions'}
            </Text>
          </View>
          <View style={styles.threadActions}>
            <Icon
              name={isExpanded ? "expand-less" : "expand-more"}
              size={20}
              color="#666"
            />
          </View>
        </TouchableOpacity>

        {isExpanded && (
          <View style={styles.threadDetailsContainer}>
            {thread.qaData.map((qa, index) => (
              <View key={index} style={styles.qaPairContainer}>
                <Text style={styles.qaQuestion}>
                  Q{index + 1}: {qa.question}
                </Text>
                <Text style={styles.qaAnswer}>
                  A: {qa.answer}
                </Text>
              </View>
            ))}
            <View style={styles.threadActionButtons}>
              <TouchableOpacity
                style={styles.deleteThreadButton}
                onPress={() => deleteThread(thread.id)}
              >
                <Icon name="delete" size={16} color="#dc2626" />
                <Text style={styles.deleteThreadText}>Delete Thread</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    );
  });

  const renderEmptyState = () => (
    <View style={styles.emptyHistoryContainer}>
      <Icon name="forum" size={64} color="#ccc" />
      <Text style={styles.emptyHistoryText}>No Q&A threads found</Text>
      <Text style={styles.emptyHistorySubtext}>
        Start asking questions in {currentMode.title} to create your first thread
      </Text>
    </View>
  );

  const renderLoading = () => (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color={currentMode.color} />
      <Text style={styles.loadingText}>Loading threads...</Text>
    </View>
  );

  return (
    <LinearGradient
      colors={['#f7f7f8', '#ffffff']}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View style={styles.headerLeft}>
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => navigation.goBack()}
              >
                <Icon name="arrow-back" size={24} color="#666" />
              </TouchableOpacity>
              <View style={[styles.headerLogo, { backgroundColor: `${currentMode.color}20` }]}>
                <Icon name={currentMode.icon} size={24} color={currentMode.color} />
              </View>
              <Text style={styles.headerTitle}>{currentMode.title} Threads</Text>
            </View>
            <View style={styles.headerButtons}>
              {/* <TouchableOpacity
                style={styles.testButton}
                onPress={addTestThread}
              >
                <Text style={styles.testButtonText}>Test</Text>
              </TouchableOpacity> */}
              {threads.length > 0 && (
                <TouchableOpacity
                  style={styles.clearHistoryButton}
                  onPress={clearAllThreads}
                >
                  <Icon name="delete-sweep" size={20} color="#666" />
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>

        {/* Content */}
        <View style={styles.content}>
          {/* <View style={styles.debugInfo}>
            <Text style={styles.debugText}>Loading: {isLoading ? 'Yes' : 'No'}</Text>
            <Text style={styles.debugText}>Threads: {threads.length}</Text>
            <Text style={styles.debugText}>Mode: {mode}</Text>
          </View> */}
          
          {isLoading ? (
            renderLoading()
          ) : threads.length > 0 ? (
            <FlatList
              data={threads}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => <ThreadItem thread={item} />}
              style={styles.threadsList}
              contentContainerStyle={styles.threadsListContent}
              showsVerticalScrollIndicator={false}
            />
          ) : (
            renderEmptyState()
          )}
        </View>
      </SafeAreaView>
      <Toast />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    paddingVertical: Platform.OS === 'android' ? 10 : 0,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
    backgroundColor: '#ffffff',
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  backButton: {
    padding: 8,
    marginRight: 8,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },
  headerLogo: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#202123',
    flex: 1,
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  clearHistoryButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },
  testButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#007AFF',
    marginRight: 8,
  },
  testButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  debugInfo: {
    backgroundColor: '#f0f0f0',
    padding: 8,
    margin: 8,
    borderRadius: 4,
  },
  debugText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    marginTop: 12,
  },
  threadsList: {
    flex: 1,
  },
  threadsListContent: {
    padding: 16,
  },
  threadItem: {
    backgroundColor: '#f7f7f8',
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e5e5e5',
  },
  threadItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 16,
  },
  threadInfoContainer: {
    flex: 1,
    marginRight: 12,
  },
  threadHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  threadTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#202123',
  },
  threadDate: {
    fontSize: 12,
    color: '#6e6e80',
  },
  threadQACount: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '500',
    marginBottom: 4,
  },
  threadFirstQuestion: {
    fontSize: 14,
    color: '#6e6e80',
    fontStyle: 'italic',
  },
  threadActions: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  threadDetailsContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e5e5',
  },
  qaPairContainer: {
    marginTop: 12,
    padding: 12,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e5e5',
  },
  qaQuestion: {
    fontSize: 14,
    fontWeight: '600',
    color: '#202123',
    marginBottom: 6,
  },
  qaAnswer: {
    fontSize: 14,
    color: '#6e6e80',
    lineHeight: 20,
  },
  threadActionButtons: {
    marginTop: 12,
    alignItems: 'flex-end',
  },
  deleteThreadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    backgroundColor: '#fef2f2',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  deleteThreadText: {
    fontSize: 12,
    color: '#dc2626',
    marginLeft: 4,
    fontWeight: '500',
  },
  emptyHistoryContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 32,
  },
  emptyHistoryText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6e6e80',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyHistorySubtext: {
    fontSize: 14,
    color: '#6e6e80',
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default HistoryScreen;
