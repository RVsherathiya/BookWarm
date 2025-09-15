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
import { COLORS, FONT_SIZES, SPACING, SUBJECTS, DIFFICULTY_LEVELS, CHALLENGE_TYPES } from '../../constants';
import { Button, Input, Card, Loading } from '../../components';
import { aiService, storage } from '../../utils';

const ChallengeCreationScreen: React.FC = () => {
  const { t, language } = useLanguage();
  const { user, updateCoins } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [challengeData, setChallengeData] = useState({
    title: '',
    subject: '',
    difficulty: '',
    academicLevel: user?.academicLevel || '',
    type: '',
    questionCount: '',
    timePerQuestion: '',
    isAI: false,
    materials: [] as string[],
  });
  const [challenges, setChallenges] = useState<any[]>([]);
  const [currentChallenge, setCurrentChallenge] = useState({
    question: '',
    answer: '',
    image: '',
    audio: '',
    video: '',
  });

  const isRTL = language === 'ar';
  const totalSteps = challengeData.isAI ? 3 : 4;

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
    if (!challengeData.subject || !challengeData.difficulty || !challengeData.type || !challengeData.questionCount) {
      Alert.alert(t('common.error'), 'Please fill in all required fields');
      return;
    }

    setIsLoading(true);
    try {
      const response = await aiService.generateContent({
        type: 'challenge',
        subject: challengeData.subject,
        difficulty: challengeData.difficulty as any,
        academicLevel: challengeData.academicLevel,
        materials: challengeData.materials,
        additionalParams: {
          type: challengeData.type,
          questionCount: parseInt(challengeData.questionCount),
          timePerQuestion: parseInt(challengeData.timePerQuestion),
        },
      });

      if (response.success) {
        setChallenges(response.data.questions);
        setCurrentStep(3);
      } else {
        Alert.alert(t('common.error'), response.error || 'Failed to generate challenge');
      }
    } catch (error) {
      Alert.alert(t('common.error'), 'Failed to generate challenge');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddChallenge = () => {
    if (!currentChallenge.question.trim() || !currentChallenge.answer.trim()) {
      Alert.alert(t('common.error'), 'Please enter both question and answer');
      return;
    }

    const newChallenge = {
      ...currentChallenge,
      id: Date.now().toString(),
    };

    setChallenges([...challenges, newChallenge]);
    setCurrentChallenge({
      question: '',
      answer: '',
      image: '',
      audio: '',
      video: '',
    });
  };

  const handleSaveChallenge = async () => {
    if (challenges.length === 0) {
      Alert.alert(t('common.error'), 'Please add at least one challenge item');
      return;
    }

    const challenge = {
      title: challengeData.title || `${SUBJECTS.find(s => s.id === challengeData.subject)?.name} Challenge`,
      subject: challengeData.subject,
      difficulty: challengeData.difficulty,
      academicLevel: challengeData.academicLevel,
      type: challengeData.type,
      questions: challenges,
      timePerQuestion: parseInt(challengeData.timePerQuestion),
      coinsUsed: challengeData.isAI ? 15 : 10,
      createdAt: new Date(),
      isArabic: language === 'ar',
    };

    try {
      await storage.saveChallenge(challenge);
      await updateCoins((user?.coins || 0) - challenge.coinsUsed);
      Alert.alert(t('common.success'), 'Challenge created successfully!');
      // Navigate back or to challenge list
    } catch (error) {
      Alert.alert(t('common.error'), 'Failed to save challenge');
    }
  };

  const renderStep1 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Challenge Details</Text>
      
      <Input
        label="Challenge Title (Optional)"
        value={challengeData.title}
        onChangeText={(text) => setChallengeData(prev => ({ ...prev, title: text }))}
        placeholder="Enter challenge title"
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
        <Text style={styles.label}>Difficulty Level</Text>
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
          {CHALLENGE_TYPES.map((type) => (
            <TouchableOpacity
              key={type.id}
              style={[
                styles.optionButton,
                challengeData.type === type.id && styles.optionButtonSelected,
              ]}
              onPress={() => setChallengeData(prev => ({ ...prev, type: type.id }))}
            >
              <Text style={[
                styles.optionText,
                challengeData.type === type.id && styles.optionTextSelected,
              ]}>
                {isRTL ? type.nameAr : type.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <Input
        label="Number of Questions"
        value={challengeData.questionCount}
        onChangeText={(text) => setChallengeData(prev => ({ ...prev, questionCount: text }))}
        placeholder="Enter number of questions"
        keyboardType="numeric"
      />

      <Input
        label="Time per Question (seconds)"
        value={challengeData.timePerQuestion}
        onChangeText={(text) => setChallengeData(prev => ({ ...prev, timePerQuestion: text }))}
        placeholder="Enter time in seconds"
        keyboardType="numeric"
      />

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Generation Method</Text>
        <View style={styles.methodContainer}>
          <TouchableOpacity
            style={[
              styles.methodButton,
              !challengeData.isAI && styles.methodButtonSelected,
            ]}
            onPress={() => setChallengeData(prev => ({ ...prev, isAI: false }))}
          >
            <Icon name="edit" size={20} color={!challengeData.isAI ? 'white' : COLORS.primary} />
            <Text style={[
              styles.methodText,
              !challengeData.isAI && styles.methodTextSelected,
            ]}>
              {t('learn.manual')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.methodButton,
              challengeData.isAI && styles.methodButtonSelected,
            ]}
            onPress={() => setChallengeData(prev => ({ ...prev, isAI: true }))}
          >
            <Icon name="smart-toy" size={20} color={challengeData.isAI ? 'white' : COLORS.primary} />
            <Text style={[
              styles.methodText,
              challengeData.isAI && styles.methodTextSelected,
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
        Upload study materials to help AI generate more relevant challenges
      </Text>
      
      <TouchableOpacity style={styles.uploadButton}>
        <Icon name="cloud-upload" size={48} color={COLORS.primary} />
        <Text style={styles.uploadText}>Upload Study Materials</Text>
        <Text style={styles.uploadSubtext}>DOC, PDF, or Image format</Text>
      </TouchableOpacity>

      <View style={styles.materialsList}>
        {challengeData.materials.map((material, index) => (
          <View key={index} style={styles.materialItem}>
            <Icon name="description" size={20} color={COLORS.primary} />
            <Text style={styles.materialText}>{material}</Text>
            <TouchableOpacity onPress={() => {
              setChallengeData(prev => ({
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
      <Text style={styles.stepTitle}>Review Generated Challenges</Text>
      <Text style={styles.stepDescription}>
        Review and edit the AI-generated challenges
      </Text>

      <ScrollView style={styles.challengesList}>
        {challenges.map((challenge, index) => (
          <Card key={challenge.id} style={styles.challengeCard}>
            <Text style={styles.challengeNumber}>Challenge {index + 1}</Text>
            <Text style={styles.challengeQuestion}>{challenge.question}</Text>
            <Text style={styles.challengeAnswer}>Answer: {challenge.answer}</Text>
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
      <Text style={styles.stepTitle}>Add Challenge Manually</Text>
      
      <Input
        label="Question/Challenge"
        value={currentChallenge.question}
        onChangeText={(text) => setCurrentChallenge(prev => ({ ...prev, question: text }))}
        placeholder="Enter your challenge question"
        multiline
        numberOfLines={3}
      />

      <Input
        label="Answer"
        value={currentChallenge.answer}
        onChangeText={(text) => setCurrentChallenge(prev => ({ ...prev, answer: text }))}
        placeholder="Enter the answer"
        multiline
        numberOfLines={2}
      />

      <View style={styles.mediaContainer}>
        <Text style={styles.label}>Add Media (Optional)</Text>
        <View style={styles.mediaButtons}>
          <TouchableOpacity style={styles.mediaButton}>
            <Icon name="image" size={20} color={COLORS.primary} />
            <Text style={styles.mediaButtonText}>Add Image</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.mediaButton}>
            <Icon name="mic" size={20} color={COLORS.secondary} />
            <Text style={styles.mediaButtonText}>Add Audio</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.mediaButton}>
            <Icon name="videocam" size={20} color={COLORS.success} />
            <Text style={styles.mediaButtonText}>Add Video</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Button
        title="Add Challenge"
        onPress={handleAddChallenge}
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
    return <Loading text="Generating challenge..." overlay />;
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => {/* Navigate back */}}>
          <Icon name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Create Challenge</Text>
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
            title={challengeData.isAI ? "Generate with AI" : "Next"}
            onPress={challengeData.isAI ? handleGenerateAI : handleNext}
            disabled={!challengeData.subject || !challengeData.difficulty || !challengeData.type || !challengeData.questionCount || !challengeData.timePerQuestion}
            style={styles.footerButton}
          />
        )}
        
        {currentStep === 2 && (
          <Button
            title="Generate Challenge"
            onPress={handleGenerateAI}
            style={styles.footerButton}
          />
        )}
        
        {currentStep === 3 && (
          <Button
            title="Save Challenge"
            onPress={handleSaveChallenge}
            style={styles.footerButton}
          />
        )}
        
        {currentStep === 4 && (
          <Button
            title="Save Challenge"
            onPress={handleSaveChallenge}
            disabled={challenges.length === 0}
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
  challengesList: {
    maxHeight: 400,
  },
  challengeCard: {
    marginBottom: SPACING.md,
  },
  challengeNumber: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: COLORS.primary,
    marginBottom: SPACING.xs,
  },
  challengeQuestion: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  challengeAnswer: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.success,
    fontWeight: '500',
    marginBottom: SPACING.sm,
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
  mediaContainer: {
    marginBottom: SPACING.lg,
  },
  mediaButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  mediaButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.sm,
    marginHorizontal: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.background,
  },
  mediaButtonText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.text,
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

export default ChallengeCreationScreen;
