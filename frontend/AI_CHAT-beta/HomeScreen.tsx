import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  ScrollView,
  Platform,
  StatusBar,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';

const { width: screenWidth } = Dimensions.get('window');

interface HomeScreenProps {
  navigation: any;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const buttons = [
    {
      id: 'quiz',
      title: 'Quiz',
      subtitle: 'AI-powered quizzes',
      icon: 'quiz',
      gradientColors: ['#10a37f', '#0d8a6b'],
    },
    {
      id: 'challenge',
      title: 'Challenge',
      subtitle: 'AI + Games, Flashcards',
      icon: 'extension',
      gradientColors: ['#ff6b35', '#e55a2b'],
    },
    {
      id: 'lesson-preparation',
      title: 'Lesson Preparation',
      subtitle: 'AI-assisted planning',
      icon: 'school',
      gradientColors: ['#6366f1', '#4f46e5'],
    },
    {
      id: 'worksheet',
      title: 'Worksheet',
      subtitle: 'AI + Manual creation',
      icon: 'assignment',
      gradientColors: ['#8b5cf6', '#7c3aed'],
    },
  ];

  const handleButtonPress = (mode: string) => {
    navigation.navigate('ChatGPT', { mode });
  };

  return (
    <LinearGradient colors={['#f7f7f8', '#ffffff']} style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>

            <View style={styles.headerTop}>
              {/* <TouchableOpacity
                style={styles.iconTestButton}
                onPress={() => navigation.navigate('IconTest')}
                activeOpacity={0.7}
              >
                <Icon name="bug-report" size={20} color="#10a37f" />
              </TouchableOpacity> */}
              
              {/* <TouchableOpacity
                style={styles.historyButton}
                onPress={() => navigation.navigate('History', { mode: 'all' })}
                activeOpacity={0.7}
              >
                <Icon name="history" size={24} color="#10a37f" />
              </TouchableOpacity> */}
            </View>
            <View style={styles.logoContainer}>
                <Icon name="smart-toy" size={32} color="#10a37f" />
              </View>
            <Text style={styles.headerTitle}>AI Learning Hub</Text>
            <Text style={styles.headerSubtitle}>
              Choose your learning experience
            </Text>
          </View>

          {/* Buttons */}
          <View style={styles.buttonsContainer}>
            {buttons.map((button) => (
              <TouchableOpacity
                key={button.id}
                style={styles.buttonWrapper}
                onPress={() => handleButtonPress(button.id)}
                activeOpacity={0.85}
              >
                <LinearGradient
                  colors={button.gradientColors}
                  style={styles.button}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <View style={styles.buttonContent}>
                    <View style={styles.iconContainer}>
                      <Icon name={button.icon} size={28} color="#ffffff" />
                    </View>
                    <View style={styles.textContainer}>
                      <Text style={styles.buttonTitle}>{button.title}</Text>
                      <Text style={styles.buttonSubtitle}>
                        {button.subtitle}
                      </Text>
                    </View>
                    <View style={styles.arrowContainer}>
                      <Icon
                        name="arrow-forward-ios"
                        size={18}
                        color="#ffffff"
                      />
                    </View>
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Powered by OpenAI GPT-4</Text>
          </View>
        </ScrollView>
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
  scrollContent: {
    paddingBottom: 30,
    paddingTop: Platform.OS === 'android' ? 10 : 0,
  },
  header: {
    alignItems: 'center',
    paddingTop: Platform.OS === 'android' ? 20 : 40,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 16,
  },
  iconTestButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  historyButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  logoContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: '#202123',
    marginBottom: 8,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 15,
    color: '#6e6e80',
    textAlign: 'center',
  },
  buttonsContainer: {
    paddingHorizontal: 20,
  },
  buttonWrapper: {
    width: '100%',
    height: 100,
    marginBottom: 18,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 4,
  },
  button: {
    flex: 1,
    borderRadius: 16,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  buttonTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 3,
  },
  buttonSubtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.9)',
  },
  arrowContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    paddingVertical: 30,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 13,
    color: '#6e6e80',
  },
});

export default HomeScreen;
