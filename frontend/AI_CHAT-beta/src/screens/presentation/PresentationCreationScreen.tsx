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
  Image,
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

const PresentationCreationScreen: React.FC = () => {
  const { t, language } = useLanguage();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [presentationData, setPresentationData] = useState({
    subject: '',
    difficulty: '',
    academicLevel: '',
    title: '',
    description: '',
    template: '',
    materials: '',
    slides: [] as any[],
  });

  const isRTL = language === 'ar';

  const templates = [
    {
      id: 'education',
      name: t('presentation.education'),
      nameAr: 'تعليمي',
      description: t('presentation.educationDesc'),
      descriptionAr: 'قالب مثالي للعروض التقديمية التعليمية',
      image: 'https://via.placeholder.com/200x150/4CAF50/FFFFFF?text=Education',
      color: COLORS.success,
    },
    {
      id: 'business',
      name: t('presentation.business'),
      nameAr: 'أعمال',
      description: t('presentation.businessDesc'),
      descriptionAr: 'قالب احترافي للعروض التقديمية التجارية',
      image: 'https://via.placeholder.com/200x150/2196F3/FFFFFF?text=Business',
      color: COLORS.primary,
    },
    {
      id: 'creative',
      name: t('presentation.creative'),
      nameAr: 'إبداعي',
      description: t('presentation.creativeDesc'),
      descriptionAr: 'قالب إبداعي للعروض التقديمية المبتكرة',
      image: 'https://via.placeholder.com/200x150/FF9800/FFFFFF?text=Creative',
      color: COLORS.warning,
    },
    {
      id: 'minimal',
      name: t('presentation.minimal'),
      nameAr: 'بسيط',
      description: t('presentation.minimalDesc'),
      descriptionAr: 'قالب بسيط وأنيق للعروض التقديمية',
      image: 'https://via.placeholder.com/200x150/9C27B0/FFFFFF?text=Minimal',
      color: COLORS.secondary,
    },
  ];

  const handleNext = () => {
    if (currentStep === 1) {
      if (
        !presentationData.subject ||
        !presentationData.difficulty ||
        !presentationData.academicLevel
      ) {
        Alert.alert(t('common.error'), t('presentation.fillRequiredFields'));
        return;
      }
    }
    if (currentStep === 2) {
      if (!presentationData.title || !presentationData.template) {
        Alert.alert(t('common.error'), t('presentation.fillRequiredFields'));
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
      // Mock AI generation - replace with actual Gamma AI service
      await new Promise(resolve => setTimeout(resolve, 3000));

      const mockSlides = generateMockSlides();
      setPresentationData(prev => ({ ...prev, slides: mockSlides }));
      setCurrentStep(4);
    } catch (error) {
      Alert.alert(t('common.error'), t('presentation.generationFailed'));
    } finally {
      setLoading(false);
    }
  };

  const generateMockSlides = () => {
    const slides = [];
    const slideCount = 8; // Mock slide count

    for (let i = 0; i < slideCount; i++) {
      slides.push({
        id: i + 1,
        title: `Slide ${i + 1}: ${presentationData.title}`,
        content: `This is the content for slide ${
          i + 1
        }. It contains relevant information about ${presentationData.subject}.`,
        type:
          i === 0 ? 'title' : i === slideCount - 1 ? 'conclusion' : 'content',
        image: `https://via.placeholder.com/400x300/4CAF50/FFFFFF?text=Slide+${
          i + 1
        }`,
      });
    }

    return slides;
  };

  const handleSave = () => {
    // Save presentation to local storage
    Alert.alert(t('common.success'), t('presentation.savedSuccessfully'));
    // Navigate back or to history
  };

  const renderStep1 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>{t('presentation.basicInfo')}</Text>

      <Card style={styles.inputCard}>
        <Text style={styles.inputLabel}>{t('presentation.subject')} *</Text>
        <View style={styles.pickerContainer}>
          <Text style={styles.pickerText}>
            {presentationData.subject || t('presentation.selectSubject')}
          </Text>
          <Icon name="arrow-drop-down" size={24} color={COLORS.gray} />
        </View>
      </Card>

      <Card style={styles.inputCard}>
        <Text style={styles.inputLabel}>{t('presentation.difficulty')} *</Text>
        <View style={styles.pickerContainer}>
          <Text style={styles.pickerText}>
            {presentationData.difficulty || t('presentation.selectDifficulty')}
          </Text>
          <Icon name="arrow-drop-down" size={24} color={COLORS.gray} />
        </View>
      </Card>

      <Card style={styles.inputCard}>
        <Text style={styles.inputLabel}>
          {t('presentation.academicLevel')} *
        </Text>
        <View style={styles.pickerContainer}>
          <Text style={styles.pickerText}>
            {presentationData.academicLevel ||
              t('presentation.selectAcademicLevel')}
          </Text>
          <Icon name="arrow-drop-down" size={24} color={COLORS.gray} />
        </View>
      </Card>
    </View>
  );

  const renderStep2 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>
        {t('presentation.presentationDetails')}
      </Text>

      <Card style={styles.inputCard}>
        <Text style={styles.inputLabel}>{t('presentation.title')} *</Text>
        <Input
          value={presentationData.title}
          onChangeText={text =>
            setPresentationData(prev => ({ ...prev, title: text }))
          }
          placeholder={t('presentation.enterTitle')}
        />
      </Card>

      <Card style={styles.inputCard}>
        <Text style={styles.inputLabel}>{t('presentation.description')}</Text>
        <TextInput
          style={styles.textArea}
          value={presentationData.description}
          onChangeText={text =>
            setPresentationData(prev => ({ ...prev, description: text }))
          }
          placeholder={t('presentation.enterDescription')}
          multiline
          numberOfLines={3}
        />
      </Card>

      <Card style={styles.inputCard}>
        <Text style={styles.inputLabel}>{t('presentation.template')} *</Text>
        <View style={styles.templateContainer}>
          {templates.map(template => (
            <TouchableOpacity
              key={template.id}
              style={[
                styles.templateOption,
                presentationData.template === template.id &&
                  styles.templateOptionSelected,
              ]}
              onPress={() =>
                setPresentationData(prev => ({
                  ...prev,
                  template: template.id,
                }))
              }
            >
              <Image
                source={{ uri: template.image }}
                style={styles.templateImage}
              />
              <Text
                style={[
                  styles.templateName,
                  presentationData.template === template.id &&
                    styles.templateNameSelected,
                ]}
              >
                {isRTL ? template.nameAr : template.name}
              </Text>
              <Text
                style={[
                  styles.templateDescription,
                  presentationData.template === template.id &&
                    styles.templateDescriptionSelected,
                ]}
              >
                {isRTL ? template.descriptionAr : template.description}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </Card>

      <Card style={styles.inputCard}>
        <Text style={styles.inputLabel}>{t('presentation.materials')}</Text>
        <TextInput
          style={styles.textArea}
          value={presentationData.materials}
          onChangeText={text =>
            setPresentationData(prev => ({ ...prev, materials: text }))
          }
          placeholder={t('presentation.uploadMaterials')}
          multiline
          numberOfLines={4}
        />
      </Card>
    </View>
  );

  const renderStep3 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>
        {t('presentation.generatePresentation')}
      </Text>

      <Card style={styles.generateCard}>
        <Icon name="auto-awesome" size={48} color={COLORS.primary} />
        <Text style={styles.generateTitle}>
          {t('presentation.aiGeneration')}
        </Text>
        <Text style={styles.generateDescription}>
          {t('presentation.aiGenerationDesc')}
        </Text>

        <View style={styles.generationInfo}>
          <View style={styles.infoItem}>
            <Icon name="template" size={20} color={COLORS.primary} />
            <Text style={styles.infoText}>
              {templates.find(t => t.id === presentationData.template)?.name}
            </Text>
          </View>
          <View style={styles.infoItem}>
            <Icon name="subject" size={20} color={COLORS.primary} />
            <Text style={styles.infoText}>{presentationData.subject}</Text>
          </View>
          <View style={styles.infoItem}>
            <Icon name="school" size={20} color={COLORS.primary} />
            <Text style={styles.infoText}>
              {presentationData.academicLevel}
            </Text>
          </View>
        </View>

        <Button
          title={t('presentation.generateWithAI')}
          onPress={handleGenerateAI}
          style={styles.generateButton}
          loading={loading}
        />
      </Card>
    </View>
  );

  const renderStep4 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>{t('presentation.reviewSlides')}</Text>

      {presentationData.slides.map((slide, index) => (
        <Card key={slide.id} style={styles.slideCard}>
          <View style={styles.slideHeader}>
            <Text style={styles.slideNumber}>Slide {index + 1}</Text>
            <Text style={styles.slideType}>{slide.type}</Text>
          </View>
          <Text style={styles.slideTitle}>{slide.title}</Text>
          <Text style={styles.slideContent}>{slide.content}</Text>
          <Image source={{ uri: slide.image }} style={styles.slideImage} />
        </Card>
      ))}

      <View style={styles.actionButtons}>
        <Button
          title={t('presentation.savePresentation')}
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
        <Text style={styles.headerTitle}>
          {t('presentation.createPresentation')}
        </Text>
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
  templateContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
  },
  templateOption: {
    width: '48%',
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    borderRadius: 12,
    backgroundColor: COLORS.white,
    alignItems: 'center',
  },
  templateOptionSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary + '10',
  },
  templateImage: {
    width: 80,
    height: 60,
    borderRadius: 8,
    marginBottom: SPACING.sm,
  },
  templateName: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 4,
  },
  templateNameSelected: {
    color: COLORS.primary,
  },
  templateDescription: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.gray,
    textAlign: 'center',
    lineHeight: 16,
  },
  templateDescriptionSelected: {
    color: COLORS.primary,
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
  generationInfo: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: SPACING.lg,
    gap: SPACING.md,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: 20,
  },
  infoText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.text,
    marginLeft: SPACING.xs,
  },
  generateButton: {
    paddingHorizontal: SPACING.xl,
  },
  slideCard: {
    marginBottom: SPACING.md,
    padding: SPACING.md,
  },
  slideHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  slideNumber: {
    fontSize: FONT_SIZES.sm,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  slideType: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.gray,
    textTransform: 'uppercase',
  },
  slideTitle: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  slideContent: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray,
    marginBottom: SPACING.sm,
    lineHeight: 20,
  },
  slideImage: {
    width: '100%',
    height: 150,
    borderRadius: 8,
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

export default PresentationCreationScreen;
