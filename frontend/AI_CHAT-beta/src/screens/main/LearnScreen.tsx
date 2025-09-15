import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  TextInput,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useLanguage } from '../../contexts/LanguageContext';
import { COLORS, FONT_SIZES, SPACING, SUBJECTS, DIFFICULTY_LEVELS } from '../../constants';
import { QuizCreationScreen, QuizHistoryScreen } from '../quiz';
import { ChallengeCreationScreen, ChallengeHistoryScreen } from '../challenge';
import { Modal } from '../../components';

const LearnScreen: React.FC = () => {
  const { t, language } = useLanguage();
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [showChallengeModal, setShowChallengeModal] = useState(false);
  const [showQuizHistory, setShowQuizHistory] = useState(false);
  const [showChallengeHistory, setShowChallengeHistory] = useState(false);
  const [quizData, setQuizData] = useState({
    subject: '',
    difficulty: '',
    questionCount: '',
    isAI: false,
  });
  const [challengeData, setChallengeData] = useState({
    subject: '',
    difficulty: '',
    type: '',
    questionCount: '',
    timePerQuestion: '',
    isAI: false,
  });

  const isRTL = language === 'ar';

  const handleCreateQuiz = () => {
    setShowQuizModal(true);
  };

  const handleCreateChallenge = () => {
    setShowChallengeModal(true);
  };

  const handleViewQuizHistory = () => {
    setShowQuizHistory(true);
  };

  const handleViewChallengeHistory = () => {
    setShowChallengeHistory(true);
  };

  const handleQuizSubmit = () => {
    // Handle quiz creation logic here
    console.log('Creating quiz:', quizData);
    setShowQuizModal(false);
    setQuizData({ subject: '', difficulty: '', questionCount: '', isAI: false });
  };

  const handleChallengeSubmit = () => {
    // Handle challenge creation logic here
    console.log('Creating challenge:', challengeData);
    setShowChallengeModal(false);
    setChallengeData({ subject: '', difficulty: '', type: '', questionCount: '', timePerQuestion: '', isAI: false });
  };

  const renderQuizModal = () => (
    <Modal
      visible={showQuizModal}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={() => setShowQuizModal(false)}>
            <Icon name="close" size={24} color={COLORS.text} />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>{t('learn.createQuiz')}</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView style={styles.modalContent}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t('learn.subject')}</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.optionsContainer}>
                {SUBJECTS.map((subject) => (
                  <TouchableOpacity
                    key={subject.id}
                    style={[
                      styles.optionButton,
                      quizData.subject === subject.id && styles.optionButtonSelected,
                    ]}
                    onPress={() => setQuizData(prev => ({ ...prev, subject: subject.id }))}
                  >
                    <Icon name={subject.icon} size={20} color={quizData.subject === subject.id ? 'white' : COLORS.primary} />
                    <Text style={[
                      styles.optionText,
                      quizData.subject === subject.id && styles.optionTextSelected,
                    ]}>
                      {isRTL ? subject.nameAr : subject.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t('learn.difficulty')}</Text>
            <View style={styles.optionsContainer}>
              {DIFFICULTY_LEVELS.map((level) => (
                <TouchableOpacity
                  key={level.id}
                  style={[
                    styles.optionButton,
                    quizData.difficulty === level.value && styles.optionButtonSelected,
                  ]}
                  onPress={() => setQuizData(prev => ({ ...prev, difficulty: level.value }))}
                >
                  <Text style={[
                    styles.optionText,
                    quizData.difficulty === level.value && styles.optionTextSelected,
                  ]}>
                    {isRTL ? level.nameAr : level.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t('learn.numberOfQuestions')}</Text>
            <TextInput
              style={styles.textInput}
              value={quizData.questionCount}
              onChangeText={(text) => setQuizData(prev => ({ ...prev, questionCount: text }))}
              placeholder="Enter number of questions"
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Generation Method</Text>
            <View style={styles.methodContainer}>
              <TouchableOpacity
                style={[
                  styles.methodButton,
                  !quizData.isAI && styles.methodButtonSelected,
                ]}
                onPress={() => setQuizData(prev => ({ ...prev, isAI: false }))}
              >
                <Icon name="edit" size={20} color={!quizData.isAI ? 'white' : COLORS.primary} />
                <Text style={[
                  styles.methodText,
                  !quizData.isAI && styles.methodTextSelected,
                ]}>
                  {t('learn.manual')}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.methodButton,
                  quizData.isAI && styles.methodButtonSelected,
                ]}
                onPress={() => setQuizData(prev => ({ ...prev, isAI: true }))}
              >
                <Icon name="smart-toy" size={20} color={quizData.isAI ? 'white' : COLORS.primary} />
                <Text style={[
                  styles.methodText,
                  quizData.isAI && styles.methodTextSelected,
                ]}>
                  {t('learn.aiAssisted')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {quizData.isAI && (
            <View style={styles.inputGroup}>
              <Text style={styles.label}>{t('learn.uploadMaterials')}</Text>
              <TouchableOpacity style={styles.uploadButton}>
                <Icon name="cloud-upload" size={24} color={COLORS.primary} />
                <Text style={styles.uploadText}>Upload Study Materials</Text>
                <Text style={styles.uploadSubtext}>DOC, PDF, or Image format</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>

        <View style={styles.modalFooter}>
          <TouchableOpacity
            style={[styles.submitButton, (!quizData.subject || !quizData.difficulty || !quizData.questionCount) && styles.submitButtonDisabled]}
            onPress={handleQuizSubmit}
            disabled={!quizData.subject || !quizData.difficulty || !quizData.questionCount}
          >
            <Text style={styles.submitButtonText}>{t('learn.generateQuiz')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  const renderChallengeModal = () => (
    <Modal
      visible={showChallengeModal}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={() => setShowChallengeModal(false)}>
            <Icon name="close" size={24} color={COLORS.text} />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>{t('learn.createChallenge')}</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView style={styles.modalContent}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t('learn.subject')}</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.optionsContainer}>
                {SUBJECTS.map((subject) => (
                  <TouchableOpacity
                    key={subject.id}
                    style={[
                      styles.optionButton,
                      challengeData.subject === subject.id && styles.optionButtonSelected,
                    ]}
                    onPress={() => setChallengeData(prev => ({ ...prev, subject: subject.id }))}
                  >
                    <Icon name={subject.icon} size={20} color={challengeData.subject === subject.id ? 'white' : COLORS.primary} />
                    <Text style={[
                      styles.optionText,
                      challengeData.subject === subject.id && styles.optionTextSelected,
                    ]}>
                      {isRTL ? subject.nameAr : subject.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t('learn.difficulty')}</Text>
            <View style={styles.optionsContainer}>
              {DIFFICULTY_LEVELS.map((level) => (
                <TouchableOpacity
                  key={level.id}
                  style={[
                    styles.optionButton,
                    challengeData.difficulty === level.value && styles.optionButtonSelected,
                  ]}
                  onPress={() => setChallengeData(prev => ({ ...prev, difficulty: level.value }))}
                >
                  <Text style={[
                    styles.optionText,
                    challengeData.difficulty === level.value && styles.optionTextSelected,
                  ]}>
                    {isRTL ? level.nameAr : level.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Challenge Type</Text>
            <View style={styles.optionsContainer}>
              <TouchableOpacity
                style={[
                  styles.optionButton,
                  challengeData.type === 'ordering' && styles.optionButtonSelected,
                ]}
                onPress={() => setChallengeData(prev => ({ ...prev, type: 'ordering' }))}
              >
                <Text style={[
                  styles.optionText,
                  challengeData.type === 'ordering' && styles.optionTextSelected,
                ]}>
                  Ordering Game
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.optionButton,
                  challengeData.type === 'matching' && styles.optionButtonSelected,
                ]}
                onPress={() => setChallengeData(prev => ({ ...prev, type: 'matching' }))}
              >
                <Text style={[
                  styles.optionText,
                  challengeData.type === 'matching' && styles.optionTextSelected,
                ]}>
                  Matching Game
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.optionButton,
                  challengeData.type === 'flashcards' && styles.optionButtonSelected,
                ]}
                onPress={() => setChallengeData(prev => ({ ...prev, type: 'flashcards' }))}
              >
                <Text style={[
                  styles.optionText,
                  challengeData.type === 'flashcards' && styles.optionTextSelected,
                ]}>
                  Flashcards
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t('learn.numberOfQuestions')}</Text>
            <TextInput
              style={styles.textInput}
              value={challengeData.questionCount}
              onChangeText={(text) => setChallengeData(prev => ({ ...prev, questionCount: text }))}
              placeholder="Enter number of questions"
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Time per Question (seconds)</Text>
            <TextInput
              style={styles.textInput}
              value={challengeData.timePerQuestion}
              onChangeText={(text) => setChallengeData(prev => ({ ...prev, timePerQuestion: text }))}
              placeholder="Enter time in seconds"
              keyboardType="numeric"
            />
          </View>
        </ScrollView>

        <View style={styles.modalFooter}>
          <TouchableOpacity
            style={[styles.submitButton, (!challengeData.subject || !challengeData.difficulty || !challengeData.type || !challengeData.questionCount) && styles.submitButtonDisabled]}
            onPress={handleChallengeSubmit}
            disabled={!challengeData.subject || !challengeData.difficulty || !challengeData.type || !challengeData.questionCount}
          >
            <Text style={styles.submitButtonText}>{t('learn.generateChallenge')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>{t('learn.title')}</Text>
          <Text style={styles.subtitle}>Create engaging learning content</Text>
        </View>

        <View style={styles.content}>
          <TouchableOpacity style={styles.actionCard} onPress={handleCreateQuiz}>
            <View style={styles.actionIcon}>
              <Icon name="quiz" size={32} color={COLORS.primary} />
            </View>
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>{t('learn.createQuiz')}</Text>
              <Text style={styles.actionDescription}>
                Create multiple choice quizzes with AI assistance
              </Text>
            </View>
            <Icon name="arrow-forward-ios" size={20} color={COLORS.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionCard} onPress={handleViewQuizHistory}>
            <View style={styles.actionIcon}>
              <Icon name="history" size={32} color={COLORS.success} />
            </View>
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>Quiz History</Text>
              <Text style={styles.actionDescription}>
                View and manage your created quizzes
              </Text>
            </View>
            <Icon name="arrow-forward-ios" size={20} color={COLORS.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionCard} onPress={handleCreateChallenge}>
            <View style={styles.actionIcon}>
              <Icon name="games" size={32} color={COLORS.secondary} />
            </View>
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>{t('learn.createChallenge')}</Text>
              <Text style={styles.actionDescription}>
                Create interactive challenges and games
              </Text>
            </View>
            <Icon name="arrow-forward-ios" size={20} color={COLORS.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionCard} onPress={handleViewChallengeHistory}>
            <View style={styles.actionIcon}>
              <Icon name="history" size={32} color={COLORS.warning} />
            </View>
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>Challenge History</Text>
              <Text style={styles.actionDescription}>
                View and manage your created challenges
              </Text>
            </View>
            <Icon name="arrow-forward-ios" size={20} color={COLORS.textSecondary} />
          </TouchableOpacity>
        </View>
      </ScrollView>

      {renderQuizModal()}
      {renderChallengeModal()}
      
      {/* Quiz History Modal */}
      <Modal
        visible={showQuizHistory}
        animationType="slide"
        presentationStyle="fullScreen"
        onClose={() => setShowQuizHistory(false)}
      >
        <QuizHistoryScreen />
      </Modal>

      {/* Challenge History Modal */}
      <Modal
        visible={showChallengeHistory}
        animationType="slide"
        presentationStyle="fullScreen"
        onClose={() => setShowChallengeHistory(false)}
      >
        <ChallengeHistoryScreen />
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: SPACING.lg,
    paddingTop: 60,
    paddingBottom: SPACING.lg,
    backgroundColor: COLORS.primary,
  },
  title: {
    fontSize: FONT_SIZES.xxxl,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: FONT_SIZES.md,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  content: {
    padding: SPACING.lg,
  },
  actionCard: {
    backgroundColor: COLORS.surface,
    padding: SPACING.lg,
    borderRadius: 12,
    marginBottom: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: COLORS.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  actionIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  actionDescription: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingTop: 60,
    paddingBottom: SPACING.md,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  modalTitle: {
    fontSize: FONT_SIZES.xl,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  modalContent: {
    flex: 1,
    padding: SPACING.lg,
  },
  inputGroup: {
    marginBottom: SPACING.lg,
  },
  label: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    marginRight: SPACING.sm,
    marginBottom: SPACING.sm,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.primary,
    backgroundColor: COLORS.surface,
  },
  optionButtonSelected: {
    backgroundColor: COLORS.primary,
  },
  optionText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.primary,
    marginLeft: SPACING.xs,
  },
  optionTextSelected: {
    color: 'white',
  },
  textInput: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    fontSize: FONT_SIZES.md,
    backgroundColor: COLORS.surface,
    color: COLORS.text,
  },
  methodContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  methodButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.md,
    marginHorizontal: SPACING.xs,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.primary,
    backgroundColor: COLORS.surface,
  },
  methodButtonSelected: {
    backgroundColor: COLORS.primary,
  },
  methodText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.primary,
    marginLeft: SPACING.sm,
  },
  methodTextSelected: {
    color: 'white',
  },
  uploadButton: {
    borderWidth: 2,
    borderColor: COLORS.primary,
    borderStyle: 'dashed',
    borderRadius: 8,
    padding: SPACING.lg,
    alignItems: 'center',
    backgroundColor: 'rgba(0, 122, 255, 0.05)',
  },
  uploadText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.primary,
    fontWeight: '500',
    marginTop: SPACING.sm,
  },
  uploadSubtext: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  modalFooter: {
    padding: SPACING.lg,
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  submitButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.md,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: COLORS.textSecondary,
  },
  submitButtonText: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: 'white',
  },
});

export default LearnScreen;
