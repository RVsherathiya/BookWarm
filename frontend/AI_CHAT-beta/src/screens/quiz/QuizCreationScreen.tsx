import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { COLORS, FONT_SIZES, SPACING, SUBJECTS, DIFFICULTY_LEVELS, QUESTION_TYPES } from '../../constants';
import { Button, Input, Card, Loading } from '../../components';
import { aiService, storage } from '../../utils';

const QuizCreationScreen: React.FC = () => {
  const { t, language } = useLanguage();
  const { user, updateCoins } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [quizData, setQuizData] = useState({
    title: '',
    subject: '',
    difficulty: '',
    academicLevel: user?.academicLevel || '',
    questionCount: '',
    isAI: false,
    materials: [] as string[],
  });
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState({
    question: '',
    type: 'multiple_choice',
    options: ['', '', '', ''],
    correctAnswer: 0,
    explanation: '',
  });

  const isRTL = language === 'ar';
  const totalSteps = quizData.isAI ? 3 : 4;

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleGenerateAI = async () => {
    if (!quizData.subject || !quizData.difficulty || !quizData.questionCount) {
      Alert.alert(t('common.error'), 'Please fill in all required fields');
      return;
    }

    setIsLoading(true);
    try {
      const response = await aiService.generateContent({
        type: 'quiz',
        subject: quizData.subject,
        difficulty: quizData.difficulty as any,
        academicLevel: quizData.academicLevel,
        materials: quizData.materials,
        additionalParams: {
          questionCount: parseInt(quizData.questionCount),
        },
      });

      if (response.success) {
        setQuestions(response.data.questions);
        setCurrentStep(3);
      } else {
        Alert.alert(t('common.error'), response.error || 'Failed to generate quiz');
      }
    } catch (error) {
      Alert.alert(t('common.error'), 'Failed to generate quiz');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddQuestion = () => {
    if (!currentQuestion.question.trim()) {
      Alert.alert(t('common.error'), 'Please enter a question');
      return;
    }

    const newQuestion = {
      ...currentQuestion,
      id: Date.now().toString(),
    };

    setQuestions([...questions, newQuestion]);
    setCurrentQuestion({
      question: '',
      type: 'multiple_choice',
      options: ['', '', '', ''],
      correctAnswer: 0,
      explanation: '',
    });
  };

  const handleSaveQuiz = async () => {
    if (questions.length === 0) {
      Alert.alert(t('common.error'), 'Please add at least one question');
      return;
    }

    const quiz = {
      title: quizData.title || `${SUBJECTS.find(s => s.id === quizData.subject)?.name} Quiz`,
      subject: quizData.subject,
      difficulty: quizData.difficulty,
      academicLevel: quizData.academicLevel,
      questions,
      coinsUsed: quizData.isAI ? 10 : 5,
      createdAt: new Date(),
      isArabic: language === 'ar',
    };

    try {
      await storage.saveQuiz(quiz);
      await updateCoins((user?.coins || 0) - quiz.coinsUsed);
      Alert.alert(t('common.success'), 'Quiz created successfully!');
      // Navigate back or to quiz list
    } catch (error) {
      Alert.alert(t('common.error'), 'Failed to save quiz');
    }
  };

  const renderStep1 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Quiz Details</Text>
      
      <Input
        label="Quiz Title (Optional)"
        value={quizData.title}
        onChangeText={(text) => setQuizData(prev => ({ ...prev, title: text }))}
        placeholder="Enter quiz title"
      />

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Subject</Text>
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
        <Text style={styles.label}>Difficulty Level</Text>
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

      <Input
        label="Number of Questions"
        value={quizData.questionCount}
        onChangeText={(text) => setQuizData(prev => ({ ...prev, questionCount: text }))}
        placeholder="Enter number of questions"
        keyboardType="numeric"
      />

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
    </View>
  );

  const renderStep2 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Upload Materials (Optional)</Text>
      <Text style={styles.stepDescription}>
        Upload study materials to help AI generate more relevant questions
      </Text>
      
      <TouchableOpacity style={styles.uploadButton}>
        <Icon name="cloud-upload" size={48} color={COLORS.primary} />
        <Text style={styles.uploadText}>Upload Study Materials</Text>
        <Text style={styles.uploadSubtext}>DOC, PDF, or Image format</Text>
      </TouchableOpacity>

      <View style={styles.materialsList}>
        {quizData.materials.map((material, index) => (
          <View key={index} style={styles.materialItem}>
            <Icon name="description" size={20} color={COLORS.primary} />
            <Text style={styles.materialText}>{material}</Text>
            <TouchableOpacity onPress={() => {
              setQuizData(prev => ({
                ...prev,
                materials: prev.materials.filter((_, i) => i !== index)
              }));
            }}>
              <Icon name="close" size={20} color={COLORS.error} />
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </View>
  );

  const renderStep3 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Review Generated Questions</Text>
      <Text style={styles.stepDescription}>
        Review and edit the AI-generated questions
      </Text>

      <ScrollView style={styles.questionsList}>
        {questions.map((question, index) => (
          <Card key={question.id} style={styles.questionCard}>
            <Text style={styles.questionNumber}>Question {index + 1}</Text>
            <Text style={styles.questionText}>{question.question}</Text>
            {question.type === 'multiple_choice' && (
              <View style={styles.optionsList}>
                {question.options.map((option: string, optionIndex: number) => (
                  <Text key={optionIndex} style={[
                    styles.optionText,
                    optionIndex === question.correctAnswer && styles.correctOption
                  ]}>
                    {String.fromCharCode(65 + optionIndex)}. {option}
                  </Text>
                ))}
              </View>
            )}
            <TouchableOpacity style={styles.editButton}>
              <Icon name="edit" size={16} color={COLORS.primary} />
              <Text style={styles.editButtonText}>Edit</Text>
            </TouchableOpacity>
          </Card>
        ))}
      </ScrollView>
    </View>
  );

  const renderStep4 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Add Question Manually</Text>
      
      <Input
        label="Question"
        value={currentQuestion.question}
        onChangeText={(text) => setCurrentQuestion(prev => ({ ...prev, question: text }))}
        placeholder="Enter your question"
        multiline
        numberOfLines={3}
      />

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Question Type</Text>
        <View style={styles.optionsContainer}>
          {QUESTION_TYPES.map((type) => (
            <TouchableOpacity
              key={type.id}
              style={[
                styles.optionButton,
                currentQuestion.type === type.id && styles.optionButtonSelected,
              ]}
              onPress={() => setCurrentQuestion(prev => ({ ...prev, type: type.id }))}
            >
              <Text style={[
                styles.optionText,
                currentQuestion.type === type.id && styles.optionTextSelected,
              ]}>
                {isRTL ? type.nameAr : type.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {currentQuestion.type === 'multiple_choice' && (
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Options</Text>
          {currentQuestion.options.map((option, index) => (
            <Input
              key={index}
              value={option}
              onChangeText={(text) => {
                const newOptions = [...currentQuestion.options];
                newOptions[index] = text;
                setCurrentQuestion(prev => ({ ...prev, options: newOptions }));
              }}
              placeholder={`Option ${String.fromCharCode(65 + index)}`}
            />
          ))}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Correct Answer</Text>
            <View style={styles.optionsContainer}>
              {currentQuestion.options.map((_, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.optionButton,
                    currentQuestion.correctAnswer === index && styles.optionButtonSelected,
                  ]}
                  onPress={() => setCurrentQuestion(prev => ({ ...prev, correctAnswer: index }))}
                >
                  <Text style={[
                    styles.optionText,
                    currentQuestion.correctAnswer === index && styles.optionTextSelected,
                  ]}>
                    {String.fromCharCode(65 + index)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      )}

      <Input
        label="Explanation (Optional)"
        value={currentQuestion.explanation}
        onChangeText={(text) => setCurrentQuestion(prev => ({ ...prev, explanation: text }))}
        placeholder="Explain why this is the correct answer"
        multiline
        numberOfLines={2}
      />

      <Button
        title="Add Question"
        onPress={handleAddQuestion}
        style={styles.addButton}
      />
    </View>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return renderStep1();
      case 2:
        return renderStep2();
      case 3:
        return renderStep3();
      case 4:
        return renderStep4();
      default:
        return renderStep1();
    }
  };

  if (isLoading) {
    return <Loading text="Generating quiz..." overlay />;
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => {/* Navigate back */}}>
          <Icon name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Create Quiz</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${(currentStep / totalSteps) * 100}%` }]} />
        </View>
        <Text style={styles.progressText}>Step {currentStep} of {totalSteps}</Text>
      </View>

      <ScrollView style={styles.content}>
        {renderCurrentStep()}
      </ScrollView>

      <View style={styles.footer}>
        {currentStep > 1 && (
          <Button
            title={t('common.back')}
            onPress={handleBack}
            variant="outline"
            style={styles.footerButton}
          />
        )}
        
        {currentStep === 1 && (
          <Button
            title={quizData.isAI ? "Generate with AI" : "Next"}
            onPress={quizData.isAI ? handleGenerateAI : handleNext}
            disabled={!quizData.subject || !quizData.difficulty || !quizData.questionCount}
            style={styles.footerButton}
          />
        )}
        
        {currentStep === 2 && (
          <Button
            title="Generate Quiz"
            onPress={handleGenerateAI}
            style={styles.footerButton}
          />
        )}
        
        {currentStep === 3 && (
          <Button
            title="Save Quiz"
            onPress={handleSaveQuiz}
            style={styles.footerButton}
          />
        )}
        
        {currentStep === 4 && (
          <Button
            title="Save Quiz"
            onPress={handleSaveQuiz}
            disabled={questions.length === 0}
            style={styles.footerButton}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
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
  title: {
    fontSize: FONT_SIZES.xl,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  progressContainer: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.surface,
  },
  progressBar: {
    height: 4,
    backgroundColor: COLORS.border,
    borderRadius: 2,
    marginBottom: SPACING.sm,
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 2,
  },
  progressText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  content: {
    flex: 1,
    padding: SPACING.lg,
  },
  stepContainer: {
    flex: 1,
  },
  stepTitle: {
    fontSize: FONT_SIZES.xl,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  stepDescription: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    marginBottom: SPACING.lg,
    lineHeight: 20,
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
    borderRadius: 12,
    padding: SPACING.xl,
    alignItems: 'center',
    backgroundColor: 'rgba(0, 122, 255, 0.05)',
    marginBottom: SPACING.lg,
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
  materialsList: {
    marginTop: SPACING.md,
  },
  materialItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.sm,
    backgroundColor: COLORS.background,
    borderRadius: 8,
    marginBottom: SPACING.sm,
  },
  materialText: {
    flex: 1,
    fontSize: FONT_SIZES.sm,
    color: COLORS.text,
    marginLeft: SPACING.sm,
  },
  questionsList: {
    maxHeight: 400,
  },
  questionCard: {
    marginBottom: SPACING.md,
  },
  questionNumber: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: COLORS.primary,
    marginBottom: SPACING.xs,
  },
  questionText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  optionsList: {
    marginBottom: SPACING.sm,
  },
  correctOption: {
    color: COLORS.success,
    fontWeight: '600',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
  },
  editButtonText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.primary,
    marginLeft: 4,
  },
  addButton: {
    marginTop: SPACING.lg,
  },
  footer: {
    flexDirection: 'row',
    padding: SPACING.lg,
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  footerButton: {
    flex: 1,
    marginHorizontal: 4,
  },
});

export default QuizCreationScreen;
