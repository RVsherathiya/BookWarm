import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  SafeAreaView,
} from 'react-native';
import qaDatabase, { QAItem, Thread } from './db';

const QAStorageExample: React.FC = () => {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [currentQAs, setCurrentQAs] = useState<QAItem[]>([]);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [selectedThreadId, setSelectedThreadId] = useState<number | null>(null);

  useEffect(() => {
    initializeDatabase();
    loadAllThreads();
  }, []);

  const initializeDatabase = async () => {
    try {
      await qaDatabase.init();
      console.log('Database initialized successfully');
    } catch (error) {
      console.error('Database initialization failed:', error);
      Alert.alert('Error', 'Failed to initialize database');
    }
  };

  const loadAllThreads = async () => {
    try {
      const allThreads = await qaDatabase.getAllThreads();
      setThreads(allThreads);
    } catch (error) {
      console.error('Failed to load threads:', error);
      Alert.alert('Error', 'Failed to load threads');
    }
  };

  const addQAToCurrent = () => {
    if (!question.trim() || !answer.trim()) {
      Alert.alert('Error', 'Please enter both question and answer');
      return;
    }

    const newQA: QAItem = {
      question: question.trim(),
      answer: answer.trim(),
      timestamp: new Date().toISOString(),
    };

    setCurrentQAs(prev => [...prev, newQA]);
    setQuestion('');
    setAnswer('');
  };

  const saveCurrentThread = async () => {
    if (currentQAs.length === 0) {
      Alert.alert('Error', 'Please add at least one Q&A pair');
      return;
    }

    try {
      const threadId = await qaDatabase.addNewThread(currentQAs);
      Alert.alert('Success', `Thread saved with ID: ${threadId}`);
      setCurrentQAs([]);
      loadAllThreads();
    } catch (error) {
      console.error('Failed to save thread:', error);
      Alert.alert('Error', 'Failed to save thread');
    }
  };

  const loadThread = async (threadId: number) => {
    try {
      const thread = await qaDatabase.getThreadById(threadId);
      if (thread) {
        setSelectedThreadId(threadId);
        setCurrentQAs(thread.qaData);
      }
    } catch (error) {
      console.error('Failed to load thread:', error);
      Alert.alert('Error', 'Failed to load thread');
    }
  };

  const deleteThread = async (threadId: number) => {
    try {
      await qaDatabase.deleteThread(threadId);
      Alert.alert('Success', 'Thread deleted successfully');
      setThreads(threads.filter(t => t.id !== threadId));
      if (selectedThreadId === threadId) {
        setSelectedThreadId(null);
        setCurrentQAs([]);
      }
    } catch (error) {
      console.error('Failed to delete thread:', error);
      Alert.alert('Error', 'Failed to delete thread');
    }
  };

  const clearCurrentQAs = () => {
    setCurrentQAs([]);
    setSelectedThreadId(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Text style={styles.title}>Q&A Storage System</Text>
        
        {/* Current Q&A Input */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {selectedThreadId ? `Editing Thread ${selectedThreadId}` : 'Add New Q&A Pairs'}
          </Text>
          
          <TextInput
            style={styles.input}
            placeholder="Enter question..."
            value={question}
            onChangeText={setQuestion}
            multiline
          />
          
          <TextInput
            style={styles.input}
            placeholder="Enter answer..."
            value={answer}
            onChangeText={setAnswer}
            multiline
          />
          
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.addButton} onPress={addQAToCurrent}>
              <Text style={styles.buttonText}>Add Q&A</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.clearButton} onPress={clearCurrentQAs}>
              <Text style={styles.buttonText}>Clear</Text>
            </TouchableOpacity>
          </View>
          
          <Text style={styles.counter}>
            Current Q&As: {currentQAs.length}/10
          </Text>
        </View>

        {/* Current Q&As Display */}
        {currentQAs.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Current Q&As:</Text>
            {currentQAs.map((qa, index) => (
              <View key={index} style={styles.qaItem}>
                <Text style={styles.questionText}>Q: {qa.question}</Text>
                <Text style={styles.answerText}>A: {qa.answer}</Text>
              </View>
            ))}
            
            <TouchableOpacity style={styles.saveButton} onPress={saveCurrentThread}>
              <Text style={styles.buttonText}>
                {selectedThreadId ? 'Update Thread' : 'Save New Thread'}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* All Threads Display */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>All Threads ({threads.length})</Text>
          {threads.map(thread => (
            <View key={thread.id} style={styles.threadItem}>
              <Text style={styles.threadId}>Thread #{thread.id}</Text>
              <Text style={styles.threadDate}>{formatDate(thread.createdAt)}</Text>
              <Text style={styles.threadQACount}>{thread.qaData.length} Q&A pairs</Text>
              
              <View style={styles.threadActions}>
                <TouchableOpacity 
                  style={styles.loadButton} 
                  onPress={() => loadThread(thread.id)}
                >
                  <Text style={styles.buttonText}>Load</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.deleteButton} 
                  onPress={() => deleteThread(thread.id)}
                >
                  <Text style={styles.buttonText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
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
    marginBottom: 20,
    color: '#333',
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
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  addButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    flex: 0.48,
  },
  clearButton: {
    backgroundColor: '#FF3B30',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    flex: 0.48,
  },
  saveButton: {
    backgroundColor: '#34C759',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
  },
  counter: {
    textAlign: 'center',
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
  qaItem: {
    backgroundColor: '#f0f0f0',
    padding: 12,
    marginBottom: 8,
    borderRadius: 6,
  },
  questionText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  answerText: {
    fontSize: 14,
    color: '#666',
  },
  threadItem: {
    backgroundColor: '#f8f8f8',
    padding: 12,
    marginBottom: 8,
    borderRadius: 6,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  threadId: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  threadDate: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  threadQACount: {
    fontSize: 14,
    color: '#007AFF',
    marginTop: 4,
  },
  threadActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  loadButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    flex: 0.48,
    alignItems: 'center',
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    flex: 0.48,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
});

export default QAStorageExample;
