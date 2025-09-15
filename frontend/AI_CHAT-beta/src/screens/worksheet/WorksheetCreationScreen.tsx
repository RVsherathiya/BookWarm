import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  TextInput,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useLanguage } from '../../contexts/LanguageContext';
import {
  COLORS,
  FONT_SIZES,
  SPACING,
  SUBJECTS,
  DIFFICULTY_LEVELS,
  ACADEMIC_LEVELS,
} from '../../constants';
import { Button, Input, Card, Loading } from '../../components';

const WorksheetCreationScreen: React.FC = () => {
  const { t, language } = useLanguage();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [worksheetData, setWorksheetData] = useState({
    subject: '',
    difficulty: '',
    academicLevel: '',
    numberOfQuestions: '',
    worksheetType: 'mixed', // mixed, multiple-choice, fill-blank, matching, open-ended
    materials: '',
    questions: [] as any[],
  });

  const isRTL = language === 'ar';

  const worksheetTypes = [
    { id: 'mixed', name: t('worksheet.mixed'), nameAr: 'مختلط' },
    {
      id: 'multiple-choice',
      name: t('worksheet.multipleChoice'),
      nameAr: 'اختيار متعدد',
    },
    {
      id: 'fill-blank',
      name: t('worksheet.fillBlank'),
      nameAr: 'ملء الفراغات',
    },
    { id: 'matching', name: t('worksheet.matching'), nameAr: 'مطابقة' },
    {
      id: 'open-ended',
      name: t('worksheet.openEnded'),
      nameAr: 'أسئلة مفتوحة',
    },
  ];

  const handleNext = () => {
    if (currentStep === 1) {
      if (
        !worksheetData.subject ||
        !worksheetData.difficulty ||
        !worksheetData.academicLevel
      ) {
        Alert.alert(t('common.error'), t('worksheet.fillRequiredFields'));
        return;
      }
    }
    if (currentStep === 2) {
      if (!worksheetData.numberOfQuestions || !worksheetData.worksheetType) {
        Alert.alert(t('common.error'), t('worksheet.fillRequiredFields'));
        return;
      }
    }
    setCurrentStep(currentStep + 1);
  };

  const handlePrevious = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleGenerateAI = async () => {
    setLoading(true);
    try {
      // Mock AI generation - replace with actual AI service
      await new Promise(resolve => setTimeout(resolve, 2000));

      const mockQuestions = generateMockQuestions();
      setWorksheetData(prev => ({ ...prev, questions: mockQuestions }));
      setCurrentStep(4);
    } catch (error) {
      Alert.alert(t('common.error'), t('worksheet.generationFailed'));
    } finally {
      setLoading(false);
    }
  };

  const generateMockQuestions = () => {
    const questions = [];
    const numQuestions = parseInt(worksheetData.numberOfQuestions);

    for (let i = 0; i < numQuestions; i++) {
      questions.push({
        id: i + 1,
        question: `Sample question ${i + 1} for ${worksheetData.subject}`,
        type: worksheetData.worksheetType,
        answer: `Sample answer ${i + 1}`,
        points: 1,
      });
    }

    return questions;
  };

  const handleSave = () => {
    // Save worksheet to local storage
    Alert.alert(t('common.success'), t('worksheet.savedSuccessfully'));
    // Navigate back or to history
  };

  const renderStep1 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>{t('worksheet.basicInfo')}</Text>

      <Card style={styles.inputCard}>
        <Text style={styles.inputLabel}>{t('worksheet.subject')} *</Text>
        <View style={styles.pickerContainer}>
          <Text style={styles.pickerText}>
            {worksheetData.subject || t('worksheet.selectSubject')}
          </Text>
          <Icon name="arrow-drop-down" size={24} color={COLORS.gray} />
        </View>
      </Card>

      <Card style={styles.inputCard}>
        <Text style={styles.inputLabel}>{t('worksheet.difficulty')} *</Text>
        <View style={styles.pickerContainer}>
          <Text style={styles.pickerText}>
            {worksheetData.difficulty || t('worksheet.selectDifficulty')}
          </Text>
          <Icon name="arrow-drop-down" size={24} color={COLORS.gray} />
        </View>
      </Card>

      <Card style={styles.inputCard}>
        <Text style={styles.inputLabel}>{t('worksheet.academicLevel')} *</Text>
        <View style={styles.pickerContainer}>
          <Text style={styles.pickerText}>
            {worksheetData.academicLevel || t('worksheet.selectAcademicLevel')}
          </Text>
          <Icon name="arrow-drop-down" size={24} color={COLORS.gray} />
        </View>
      </Card>
    </View>
  );

  const renderStep2 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>{t('worksheet.worksheetDetails')}</Text>

      <Card style={styles.inputCard}>
        <Text style={styles.inputLabel}>
          {t('worksheet.numberOfQuestions')} *
        </Text>
        <Input
          value={worksheetData.numberOfQuestions}
          onChangeText={text =>
            setWorksheetData(prev => ({ ...prev, numberOfQuestions: text }))
          }
          placeholder={t('worksheet.enterNumberOfQuestions')}
          keyboardType="numeric"
        />
      </Card>

      <Card style={styles.inputCard}>
        <Text style={styles.inputLabel}>{t('worksheet.worksheetType')} *</Text>
        <View style={styles.typeContainer}>
          {worksheetTypes.map(type => (
            <TouchableOpacity
              key={type.id}
              style={[
                styles.typeOption,
                worksheetData.worksheetType === type.id &&
                  styles.typeOptionSelected,
              ]}
              onPress={() =>
                setWorksheetData(prev => ({ ...prev, worksheetType: type.id }))
              }
            >
              <Text
                style={[
                  styles.typeOptionText,
                  worksheetData.worksheetType === type.id &&
                    styles.typeOptionTextSelected,
                ]}
              >
                {isRTL ? type.nameAr : type.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </Card>

      <Card style={styles.inputCard}>
        <Text style={styles.inputLabel}>{t('worksheet.materials')}</Text>
        <TextInput
          style={styles.textArea}
          value={worksheetData.materials}
          onChangeText={text =>
            setWorksheetData(prev => ({ ...prev, materials: text }))
          }
          placeholder={t('worksheet.uploadMaterials')}
          multiline
          numberOfLines={4}
        />
      </Card>
    </View>
  );

  const renderStep3 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>{t('worksheet.generateQuestions')}</Text>

      <Card style={styles.generateCard}>
        <Icon name="auto-awesome" size={48} color={COLORS.primary} />
        <Text style={styles.generateTitle}>{t('worksheet.aiGeneration')}</Text>
        <Text style={styles.generateDescription}>
          {t('worksheet.aiGenerationDesc')}
        </Text>

        <Button
          title={t('worksheet.generateWithAI')}
          onPress={handleGenerateAI}
          style={styles.generateButton}
          loading={loading}
        />
      </Card>
    </View>
  );

  const renderStep4 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>{t('worksheet.reviewQuestions')}</Text>

      {worksheetData.questions.map((question, index) => (
        <Card key={question.id} style={styles.questionCard}>
          <Text style={styles.questionNumber}>Q{index + 1}</Text>
          <Text style={styles.questionText}>{question.question}</Text>
          <Text style={styles.questionType}>{question.type}</Text>
        </Card>
      ))}

      <View style={styles.actionButtons}>
        <Button
          title={t('worksheet.saveWorksheet')}
          onPress={handleSave}
          style={styles.saveButton}
        />
      </View>
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

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />

      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => {
            /* Navigate back */
          }}
        >
          <Icon name="arrow-back" size={24} color={COLORS.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('worksheet.createWorksheet')}</Text>
        <View style={styles.headerRight} />
      </View>

      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              { width: `${(currentStep / 4) * 100}%` },
            ]}
          />
        </View>
        <Text style={styles.progressText}>
          {t('common.step')} {currentStep} {t('common.of')} 4
        </Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {renderCurrentStep()}
      </ScrollView>

      {currentStep < 4 && (
        <View style={styles.navigationButtons}>
          {currentStep > 1 && (
            <Button
              title={t('common.previous')}
              onPress={handlePrevious}
              style={styles.previousButton}
              variant="outline"
            />
          )}
          <Button
            title={t('common.next')}
            onPress={handleNext}
            style={styles.nextButton}
          />
        </View>
      )}

      {loading && <Loading />}
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  headerTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  headerRight: {
    width: 24,
  },
  progressContainer: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.white,
  },
  progressBar: {
    height: 4,
    backgroundColor: COLORS.lightGray,
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
    color: COLORS.gray,
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
    marginBottom: SPACING.lg,
    textAlign: 'center',
  },
  inputCard: {
    marginBottom: SPACING.md,
  },
  inputLabel: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  pickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    borderRadius: 8,
    backgroundColor: COLORS.white,
  },
  pickerText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
  },
  typeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  typeOption: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    borderRadius: 20,
    backgroundColor: COLORS.white,
  },
  typeOptionSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  typeOptionText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.text,
  },
  typeOptionTextSelected: {
    color: COLORS.white,
    fontWeight: '600',
  },
  textArea: {
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    borderRadius: 8,
    padding: SPACING.md,
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
    backgroundColor: COLORS.white,
    textAlignVertical: 'top',
  },
  generateCard: {
    alignItems: 'center',
    padding: SPACING.xl,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    marginBottom: SPACING.lg,
  },
  generateTitle: {
    fontSize: FONT_SIZES.xl,
    fontWeight: 'bold',
    color: COLORS.text,
    marginTop: SPACING.md,
    marginBottom: SPACING.sm,
  },
  generateDescription: {
    fontSize: FONT_SIZES.md,
    color: COLORS.gray,
    textAlign: 'center',
    marginBottom: SPACING.lg,
    lineHeight: 24,
  },
  generateButton: {
    paddingHorizontal: SPACING.xl,
  },
  questionCard: {
    marginBottom: SPACING.md,
    padding: SPACING.md,
  },
  questionNumber: {
    fontSize: FONT_SIZES.sm,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: SPACING.xs,
  },
  questionText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  questionType: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray,
    fontStyle: 'italic',
  },
  actionButtons: {
    marginTop: SPACING.lg,
  },
  saveButton: {
    backgroundColor: COLORS.success,
  },
  navigationButtons: {
    flexDirection: 'row',
    padding: SPACING.lg,
    gap: SPACING.md,
  },
  previousButton: {
    flex: 1,
  },
  nextButton: {
    flex: 1,
  },
});

export default WorksheetCreationScreen;
