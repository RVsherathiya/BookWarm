import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import database, { QAThreadItem } from './database';

/**
 * Example component showing how to integrate Q&A storage into your existing app
 * This demonstrates the key functions you requested
 */
const QAIntegrationExample: React.FC = () => {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    initializeDatabase();
  }, []);

  const initializeDatabase = async () => {
    try {
      await database.init();
      setIsInitialized(true);
      console.log('Database initialized successfully');
    } catch (error) {
      console.error('Database initialization failed:', error);
      Alert.alert('Error', 'Failed to initialize database');
    }
  };

  // Example: Add a new thread with multiple Q&As
  const addNewThreadExample = async () => {
    if (!isInitialized) {
      Alert.alert('Error', 'Database not initialized');
      return;
    }

    const sampleQAs: QAThreadItem[] = [
      {
        question: "What is React Native?",
        answer: "React Native is a framework for building mobile applications using React and JavaScript.",
        timestamp: new Date().toISOString()
      },
      {
        question: "How do you store data in React Native?",
        answer: "You can use SQLite with react-native-sqlite-storage or AsyncStorage for simple key-value storage.",
        timestamp: new Date().toISOString()
      },
      {
        question: "What is the maximum number of Q&As per thread?",
        answer: "The system supports up to 10 Q&A pairs per thread.",
        timestamp: new Date().toISOString()
      }
    ];

    try {
      const threadId = await database.addNewThread(sampleQAs);
      Alert.alert('Success', `New thread created with ID: ${threadId}`);
    } catch (error) {
      console.error('Failed to create thread:', error);
      Alert.alert('Error', 'Failed to create thread');
    }
  };

  // Example: List all threads
  const listAllThreadsExample = async () => {
    if (!isInitialized) {
      Alert.alert('Error', 'Database not initialized');
      return;
    }

    try {
      const threads = await database.getAllThreads();
      const threadInfo = threads.map(thread => 
        `Thread ${thread.id}: ${thread.qaData.length} Q&As (${new Date(thread.createdAt).toLocaleDateString()})`
      ).join('\n');
      
      Alert.alert('All Threads', threadInfo || 'No threads found');
    } catch (error) {
      console.error('Failed to get threads:', error);
      Alert.alert('Error', 'Failed to get threads');
    }
  };

  // Example: Fetch a single thread's Q&As
  const fetchSingleThreadExample = async () => {
    if (!isInitialized) {
      Alert.alert('Error', 'Database not initialized');
      return;
    }

    try {
      // Get the first thread if it exists
      const threads = await database.getAllThreads();
      if (threads.length === 0) {
        Alert.alert('Info', 'No threads found. Create a thread first.');
        return;
      }

      const firstThread = await database.getThreadById(threads[0].id);
      if (firstThread) {
        const qaInfo = firstThread.qaData.map((qa, index) => 
          `${index + 1}. Q: ${qa.question}\n   A: ${qa.answer}`
        ).join('\n\n');
        
        Alert.alert(`Thread ${firstThread.id} Q&As`, qaInfo);
      }
    } catch (error) {
      console.error('Failed to fetch thread:', error);
      Alert.alert('Error', 'Failed to fetch thread');
    }
  };

  // Example: Get threads count
  const getThreadsCountExample = async () => {
    if (!isInitialized) {
      Alert.alert('Error', 'Database not initialized');
      return;
    }

    try {
      const count = await database.getThreadsCount();
      Alert.alert('Threads Count', `Total threads: ${count}`);
    } catch (error) {
      console.error('Failed to get count:', error);
      Alert.alert('Error', 'Failed to get threads count');
    }
  };

  if (!isInitialized) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Initializing database...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Q&A Storage Integration Example</Text>
      <Text style={styles.subtitle}>
        This demonstrates the key functions you requested
      </Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={addNewThreadExample}>
          <Text style={styles.buttonText}>1. Add New Thread (3 Q&As)</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={listAllThreadsExample}>
          <Text style={styles.buttonText}>2. List All Threads</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={fetchSingleThreadExample}>
          <Text style={styles.buttonText}>3. Fetch Single Thread Q&As</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={getThreadsCountExample}>
          <Text style={styles.buttonText}>4. Get Threads Count</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.infoTitle}>Key Features:</Text>
        <Text style={styles.infoText}>• Each thread stores up to 10 Q&A pairs as JSON</Text>
        <Text style={styles.infoText}>• New Q&As create new threads (no overwriting)</Text>
        <Text style={styles.infoText}>• Threads are ordered by creation date</Text>
        <Text style={styles.infoText}>• Full CRUD operations available</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 50,
    color: '#666',
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
    marginBottom: 30,
    color: '#666',
  },
  buttonContainer: {
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    marginBottom: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  infoContainer: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  infoText: {
    fontSize: 14,
    marginBottom: 4,
    color: '#666',
  },
});

export default QAIntegrationExample;
