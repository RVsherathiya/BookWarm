import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Toast from 'react-native-toast-message';
import threadManager from './threadManager';
import database from './database';

/**
 * Complete usage example showing how the Q&A thread system works
 * This demonstrates the integration between ChatGPTScreen and HistoryScreen
 */
const QAThreadUsageExample: React.FC = () => {
  const [threads, setThreads] = useState<any[]>([]);
  const [sessionInfo, setSessionInfo] = useState({ count: 0, isFull: false });

  useEffect(() => {
    initializeDatabase();
    loadThreads();
  }, []);

  const initializeDatabase = async () => {
    try {
      await database.init();
      console.log('Database initialized successfully');
    } catch (error) {
      console.error('Database initialization failed:', error);
      Alert.alert('Error', 'Failed to initialize database');
    }
  };

  const loadThreads = async () => {
    try {
      const allThreads = await threadManager.getAllThreadsForMode('example');
      setThreads(allThreads);
    } catch (error) {
      console.error('Failed to load threads:', error);
    }
  };

  const updateSessionInfo = () => {
    const info = threadManager.getSessionInfo('example');
    setSessionInfo({
      count: info.count,
      isFull: info.isFull,
    });
  };

  // Simulate adding Q&As to a session (like in ChatGPTScreen)
  const addSampleQAs = async () => {
    try {
      // Add multiple Q&As to the current session
      const sampleQAs = [
        { question: "What is React Native?", answer: "A framework for building mobile apps with React" },
        { question: "How do you store data?", answer: "Using SQLite with react-native-sqlite-storage" },
        { question: "What is the maximum Q&As per thread?", answer: "10 Q&A pairs per thread" }
      ];

      for (const qa of sampleQAs) {
        threadManager.addQAToSession('example', qa.question, qa.answer);
      }

      updateSessionInfo();
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: `Added ${sampleQAs.length} Q&As to current session`,
        position: 'bottom',
      });
    } catch (error) {
      console.error('Failed to add Q&As:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to add Q&As',
        position: 'bottom',
      });
    }
  };

  // Auto-save current session (like in ChatGPTScreen)
  const autoSaveCurrentSession = async () => {
    try {
      const threadId = await threadManager.saveCurrentSession('example');
      updateSessionInfo();
      await loadThreads();
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: `Session auto-saved as thread ${threadId}`,
        position: 'bottom',
      });
    } catch (error) {
      console.error('Failed to auto-save session:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to auto-save session',
        position: 'bottom',
      });
    }
  };

  // Clear current session
  const clearCurrentSession = () => {
    threadManager.clearCurrentSession('example');
    updateSessionInfo();
    Toast.show({
      type: 'success',
      text1: 'Success',
      text2: 'Current session cleared',
      position: 'bottom',
    });
  };

  // Delete a thread (like in HistoryScreen)
  const deleteThread = async (threadId: number) => {
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
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Text style={styles.title}>Q&A Thread System Demo</Text>
        <Text style={styles.subtitle}>
          This demonstrates how the system works in your ChatGPTScreen and HistoryScreen
        </Text>

        {/* Current Session Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Current Session</Text>
          <Text style={styles.sessionInfo}>
            Q&As in current session: {sessionInfo.count}/10
          </Text>
          {sessionInfo.isFull && (
            <Text style={styles.fullWarning}>
              ⚠️ Session is full! Save to create a new thread.
            </Text>
          )}
          
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.addButton} onPress={addSampleQAs}>
              <Text style={styles.buttonText}>Add Sample Q&As</Text>
            </TouchableOpacity>
            
            {sessionInfo.count > 0 && (
              <TouchableOpacity style={styles.saveButton} onPress={autoSaveCurrentSession}>
                <Text style={styles.buttonText}>Auto-Save Session</Text>
              </TouchableOpacity>
            )}
            
            {sessionInfo.count > 0 && (
              <TouchableOpacity style={styles.clearButton} onPress={clearCurrentSession}>
                <Text style={styles.buttonText}>Clear Session</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* All Threads */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>All Threads ({threads.length})</Text>
          {threads.length > 0 ? (
            threads.map(thread => (
              <View key={thread.id} style={styles.threadItem}>
                <View style={styles.threadHeader}>
                  <Text style={styles.threadTitle}>Thread #{thread.id}</Text>
                  <Text style={styles.threadDate}>{formatDate(thread.createdAt)}</Text>
                </View>
                <Text style={styles.threadQACount}>
                  {thread.qaData.length} Q&A pairs
                </Text>
                <Text style={styles.threadFirstQuestion}>
                  First Q: {thread.qaData[0]?.question || 'No questions'}
                </Text>
                
                <View style={styles.threadActions}>
                  <TouchableOpacity 
                    style={styles.viewButton}
                    onPress={() => {
                      Alert.alert(
                        `Thread ${thread.id} Details`,
                        thread.qaData.map((qa, i) => 
                          `${i + 1}. Q: ${qa.question}\n   A: ${qa.answer}`
                        ).join('\n\n')
                      );
                    }}
                  >
                    <Text style={styles.buttonText}>View Details</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={styles.deleteButton}
                    onPress={() => deleteThread(thread.id)}
                  >
                    <Text style={styles.buttonText}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          ) : (
            <Text style={styles.emptyText}>No threads found. Add Q&As and save a session to create threads.</Text>
          )}
        </View>

        {/* How It Works */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>How It Works</Text>
          <View style={styles.infoContainer}>
            <Text style={styles.infoText}>1. In ChatGPTScreen: Q&As are added to current session</Text>
            <Text style={styles.infoText}>2. After each response, session auto-saves as a thread</Text>
            <Text style={styles.infoText}>3. Each Q&A pair creates its own thread automatically</Text>
            <Text style={styles.infoText}>4. In HistoryScreen: View all threads with expandable details</Text>
            <Text style={styles.infoText}>5. No manual save needed - everything auto-saves</Text>
          </View>
        </View>
      </ScrollView>
      <Toast />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    color: '#666',
  },
  section: {
    backgroundColor: 'white',
    padding: 16,
    marginBottom: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  sessionInfo: {
    fontSize: 16,
    color: '#007AFF',
    marginBottom: 8,
    fontWeight: '500',
  },
  fullWarning: {
    fontSize: 14,
    color: '#dc2626',
    marginBottom: 12,
    fontWeight: '500',
  },
  buttonRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  addButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  saveButton: {
    backgroundColor: '#34C759',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  clearButton: {
    backgroundColor: '#FF3B30',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  threadItem: {
    backgroundColor: '#f8f9fa',
    padding: 12,
    marginBottom: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  threadHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  threadTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  threadDate: {
    fontSize: 12,
    color: '#666',
  },
  threadQACount: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '500',
    marginBottom: 4,
  },
  threadFirstQuestion: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
    marginBottom: 8,
  },
  threadActions: {
    flexDirection: 'row',
    gap: 8,
  },
  viewButton: {
    backgroundColor: '#6c757d',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  deleteButton: {
    backgroundColor: '#dc3545',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  emptyText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  infoContainer: {
    marginTop: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
    lineHeight: 20,
  },
});

export default QAThreadUsageExample;
