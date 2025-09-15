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
import { COLORS, FONT_SIZES, SPACING, SUBJECTS, DIFFICULTY_LEVELS } from '../../constants';
import { Button, Input, Card, Loading } from '../../components';
import { aiService, storage } from '../../utils';

const LessonPreparationScreen: React.FC = () => {
  const { t, language } = useLanguage();
  const { user, updateCoins } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [lessonData, setLessonData] = useState({
    title: '',
    subject: '',
    difficulty: '',
    academicLevel: user?.academicLevel || '',
    materials: [] as string[],
  });
  const [generatedLesson, setGeneratedLesson] = useState<any>(null);

  const isRTL = language === 'ar';
  const totalSteps = 3;

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

  const handleGenerateLesson = async () => {
    if (!lessonData.subject || !lessonData.difficulty) {
      Alert.alert(t('common.error'), 'Please fill in all required fields');
      return;
    }

    setIsLoading(true);
    try {
      const response = await aiService.generateContent({
        type: 'lesson',
        subject: lessonData.subject,
        difficulty: lessonData.difficulty as any,
        academicLevel: lessonData.academicLevel,
        materials: lessonData.materials,
      });

      if (response.success) {
        setGeneratedLesson(response.data);
        setCurrentStep(3);
      } else {
        Alert.alert(t('common.error'), response.error || 'Failed to generate lesson plan');
      }
    } catch (error) {
      Alert.alert(t('common.error'), 'Failed to generate lesson plan');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveLesson = async () => {
    if (!generatedLesson) {
      Alert.alert(t('common.error'), 'No lesson plan to save');
      return;
    }

    const lesson = {
      title: lessonData.title || generatedLesson.title,
      subject: lessonData.subject,
      difficulty: lessonData.difficulty,
      academicLevel: lessonData.academicLevel,
      keyPoints: generatedLesson.keyPoints,
      activities: generatedLesson.activities,
      assessment: generatedLesson.assessment,
      homework: generatedLesson.homework,
      duration: generatedLesson.duration,
      coinsUsed: 20,
      createdAt: new Date(),
      isArabic: language === 'ar',
    };

    try {
      await storage.saveLesson(lesson);
      await updateCoins((user?.coins || 0) - lesson.coinsUsed);
      Alert.alert(t('common.success'), 'Lesson plan created successfully!');
      // Navigate back or to lesson list
    } catch (error) {
      Alert.alert(t('common.error'), 'Failed to save lesson plan');
    }
  };

  const renderStep1 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Lesson Details</Text>
      
      <Input
        label="Lesson Title (Optional)"
        value={lessonData.title}
        onChangeText={(text) => setLessonData(prev => ({ ...prev, title: text }))}
        placeholder="Enter lesson title"
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
                  lessonData.subject === subject.id && styles.optionButtonSelected,
                ]}
                onPress={() => setLessonData(prev => ({ ...prev, subject: subject.id }))}
              >
                <Icon name={subject.icon} size={20} color={lessonData.subject === subject.id ? 'white' : COLORS.primary} />
                <Text style={[
                  styles.optionText,
                  lessonData.subject === subject.id && styles.optionTextSelected,
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
                lessonData.difficulty === level.value && styles.optionButtonSelected,
              ]}
              onPress={() => setLessonData(prev => ({ ...prev, difficulty: level.value }))}
            >
              <Text style={[
                styles.optionText,
                lessonData.difficulty === level.value && styles.optionTextSelected,
              ]}>
                {isRTL ? level.nameAr : level.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );

  const renderStep2 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Upload Materials (Optional)</Text>
      <Text style={styles.stepDescription}>
        Upload study materials to help AI generate more relevant lesson content
      </Text>
      
      <TouchableOpacity style={styles.uploadButton}>
        <Icon name="cloud-upload" size={48} color={COLORS.primary} />
        <Text style={styles.uploadText}>Upload Study Materials</Text>
        <Text style={styles.uploadSubtext}>DOC, PDF, or Image format</Text>
      </TouchableOpacity>

      <View style={styles.materialsList}>
        {lessonData.materials.map((material, index) => (
          <View key={index} style={styles.materialItem}>
            <Icon name="description" size={20} color={COLORS.primary} />
            <Text style={styles.materialText}>{material}</Text>
            <TouchableOpacity onPress={() => {
              setLessonData(prev => ({
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
      <Text style={styles.stepTitle}>Generated Lesson Plan</Text>
      <Text style={styles.stepDescription}>
        Review and edit the AI-generated lesson plan
      </Text>

      {generatedLesson && (
        <ScrollView style={styles.lessonContent}>
          <Card style={styles.lessonCard}>
            <Text style={styles.lessonTitle}>{generatedLesson.title}</Text>
            <View style={styles.lessonMeta}>
              <Text style={styles.lessonDuration}>Duration: {generatedLesson.duration} minutes</Text>
            </View>
          </Card>

          <Card style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Key Points</Text>
            {generatedLesson.keyPoints.map((point: string, index: number) => (
              <View key={index} style={styles.pointItem}>
                <Icon name="circle" size={8} color={COLORS.primary} />
                <Text style={styles.pointText}>{point}</Text>
              </View>
            ))}
          </Card>

          <Card style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Activities</Text>
            {generatedLesson.activities.map((activity: string, index: number) => (
              <View key={index} style={styles.activityItem}>
                <Text style={styles.activityNumber}>{index + 1}.</Text>
                <Text style={styles.activityText}>{activity}</Text>
              </View>
            ))}
          </Card>

          <Card style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Assessment</Text>
            {generatedLesson.assessment.map((item: string, index: number) => (
              <View key={index} style={styles.assessmentItem}>
                <Text style={styles.assessmentNumber}>{index + 1}.</Text>
                <Text style={styles.assessmentText}>{item}</Text>
              </View>
            ))}
          </Card>

          <Card style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Homework</Text>
            {generatedLesson.homework.map((item: string, index: number) => (
              <View key={index} style={styles.homeworkItem}>
                <Text style={styles.homeworkNumber}>{index + 1}.</Text>
                <Text style={styles.homeworkText}>{item}</Text>
              </View>
            ))}
          </Card>
        </ScrollView>
      )}
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
      default:
        return renderStep1();
    }
  };

  if (isLoading) {
    return <Loading text="Generating lesson plan..." overlay />;
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => {/* Navigate back */}}>
          <Icon name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Lesson Preparation</Text>
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
            title="Next"
            onPress={handleNext}
            disabled={!lessonData.subject || !lessonData.difficulty}
            style={styles.footerButton}
          />
        )}
        
        {currentStep === 2 && (
          <Button
            title="Generate Lesson Plan"
            onPress={handleGenerateLesson}
            style={styles.footerButton}
          />
        )}
        
        {currentStep === 3 && (
          <Button
            title="Save Lesson Plan"
            onPress={handleSaveLesson}
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
  lessonContent: {
    maxHeight: 500,
  },
  lessonCard: {
    marginBottom: SPACING.md,
  },
  lessonTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  lessonMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  lessonDuration: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
  },
  sectionCard: {
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  pointItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: SPACING.sm,
  },
  pointText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.text,
    marginLeft: SPACING.sm,
    flex: 1,
    lineHeight: 20,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: SPACING.sm,
  },
  activityNumber: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: COLORS.primary,
    marginRight: SPACING.sm,
  },
  activityText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.text,
    flex: 1,
    lineHeight: 20,
  },
  assessmentItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: SPACING.sm,
  },
  assessmentNumber: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: COLORS.primary,
    marginRight: SPACING.sm,
  },
  assessmentText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.text,
    flex: 1,
    lineHeight: 20,
  },
  homeworkItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: SPACING.sm,
  },
  homeworkNumber: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: COLORS.primary,
    marginRight: SPACING.sm,
  },
  homeworkText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.text,
    flex: 1,
    lineHeight: 20,
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

export default LessonPreparationScreen;
