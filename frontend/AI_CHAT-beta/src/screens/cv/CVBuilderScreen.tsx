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
import { COLORS, FONT_SIZES, SPACING } from '../../constants';
import { Button, Input, Card, Loading } from '../../components';

const CVBuilderScreen: React.FC = () => {
  const { t, language } = useLanguage();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [cvData, setCvData] = useState({
    template: '',
    personalInfo: {
      fullName: '',
      email: '',
      phone: '',
      address: '',
      summary: '',
    },
    experience: [] as any[],
    education: [] as any[],
    skills: [] as string[],
    languages: [] as string[],
  });

  const isRTL = language === 'ar';

  const templates = [
    {
      id: 'modern',
      name: t('cv.modern'),
      nameAr: 'حديث',
      description: t('cv.modernDesc'),
      descriptionAr: 'تصميم حديث وأنيق',
      image: 'https://via.placeholder.com/200x150/2196F3/FFFFFF?text=Modern',
      color: COLORS.primary,
    },
    {
      id: 'professional',
      name: t('cv.professional'),
      nameAr: 'مهني',
      description: t('cv.professionalDesc'),
      descriptionAr: 'تصميم احترافي للوظائف',
      image:
        'https://via.placeholder.com/200x150/4CAF50/FFFFFF?text=Professional',
      color: COLORS.success,
    },
    {
      id: 'creative',
      name: t('cv.creative'),
      nameAr: 'إبداعي',
      description: t('cv.creativeDesc'),
      descriptionAr: 'تصميم إبداعي ومبتكر',
      image: 'https://via.placeholder.com/200x150/FF9800/FFFFFF?text=Creative',
      color: COLORS.warning,
    },
    {
      id: 'minimal',
      name: t('cv.minimal'),
      nameAr: 'بسيط',
      description: t('cv.minimalDesc'),
      descriptionAr: 'تصميم بسيط ونظيف',
      image: 'https://via.placeholder.com/200x150/9C27B0/FFFFFF?text=Minimal',
      color: COLORS.secondary,
    },
  ];

  const handleNext = () => {
    if (currentStep === 1) {
      if (!cvData.template) {
        Alert.alert(t('common.error'), t('cv.selectTemplate'));
        return;
      }
    }
    if (currentStep === 2) {
      if (!cvData.personalInfo.fullName || !cvData.personalInfo.email) {
        Alert.alert(t('common.error'), t('cv.fillRequiredFields'));
        return;
      }
    }
    setCurrentStep(currentStep + 1);
  };

  const handlePrevious = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleAddExperience = () => {
    const newExperience = {
      id: Date.now().toString(),
      company: '',
      position: '',
      startDate: '',
      endDate: '',
      description: '',
      current: false,
    };
    setCvData(prev => ({
      ...prev,
      experience: [...prev.experience, newExperience],
    }));
  };

  const handleAddEducation = () => {
    const newEducation = {
      id: Date.now().toString(),
      institution: '',
      degree: '',
      field: '',
      startDate: '',
      endDate: '',
      gpa: '',
      current: false,
    };
    setCvData(prev => ({
      ...prev,
      education: [...prev.education, newEducation],
    }));
  };

  const handleAddSkill = () => {
    Alert.prompt(t('cv.addSkill'), t('cv.enterSkill'), skill => {
      if (skill && skill.trim()) {
        setCvData(prev => ({
          ...prev,
          skills: [...prev.skills, skill.trim()],
        }));
      }
    });
  };

  const handleAddLanguage = () => {
    Alert.prompt(t('cv.addLanguage'), t('cv.enterLanguage'), language => {
      if (language && language.trim()) {
        setCvData(prev => ({
          ...prev,
          languages: [...prev.languages, language.trim()],
        }));
      }
    });
  };

  const handleRemoveItem = (
    type: 'experience' | 'education' | 'skills' | 'languages',
    id: string,
  ) => {
    setCvData(prev => ({
      ...prev,
      [type]: prev[type].filter((item: any) => item.id !== id),
    }));
  };

  const handleGenerateCV = async () => {
    setLoading(true);
    try {
      // Mock CV generation - replace with actual AI service
      await new Promise(resolve => setTimeout(resolve, 2000));

      Alert.alert(t('common.success'), t('cv.generatedSuccessfully'));
      setCurrentStep(4);
    } catch (error) {
      Alert.alert(t('common.error'), t('cv.generationFailed'));
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    // Save CV to local storage
    Alert.alert(t('common.success'), t('cv.savedSuccessfully'));
    // Navigate back or to history
  };

  const renderStep1 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>{t('cv.selectTemplate')}</Text>
      <Text style={styles.stepDescription}>{t('cv.templateDescription')}</Text>

      <View style={styles.templateContainer}>
        {templates.map(template => (
          <TouchableOpacity
            key={template.id}
            style={[
              styles.templateOption,
              cvData.template === template.id && styles.templateOptionSelected,
            ]}
            onPress={() =>
              setCvData(prev => ({ ...prev, template: template.id }))
            }
          >
            <Image
              source={{ uri: template.image }}
              style={styles.templateImage}
            />
            <Text
              style={[
                styles.templateName,
                cvData.template === template.id && styles.templateNameSelected,
              ]}
            >
              {isRTL ? template.nameAr : template.name}
            </Text>
            <Text
              style={[
                styles.templateDescription,
                cvData.template === template.id &&
                  styles.templateDescriptionSelected,
              ]}
            >
              {isRTL ? template.descriptionAr : template.description}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderStep2 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>{t('cv.personalInformation')}</Text>

      <Card style={styles.inputCard}>
        <Text style={styles.inputLabel}>{t('cv.fullName')} *</Text>
        <Input
          value={cvData.personalInfo.fullName}
          onChangeText={text =>
            setCvData(prev => ({
              ...prev,
              personalInfo: { ...prev.personalInfo, fullName: text },
            }))
          }
          placeholder={t('cv.enterFullName')}
        />
      </Card>

      <Card style={styles.inputCard}>
        <Text style={styles.inputLabel}>{t('cv.email')} *</Text>
        <Input
          value={cvData.personalInfo.email}
          onChangeText={text =>
            setCvData(prev => ({
              ...prev,
              personalInfo: { ...prev.personalInfo, email: text },
            }))
          }
          placeholder={t('cv.enterEmail')}
          keyboardType="email-address"
        />
      </Card>

      <Card style={styles.inputCard}>
        <Text style={styles.inputLabel}>{t('cv.phone')}</Text>
        <Input
          value={cvData.personalInfo.phone}
          onChangeText={text =>
            setCvData(prev => ({
              ...prev,
              personalInfo: { ...prev.personalInfo, phone: text },
            }))
          }
          placeholder={t('cv.enterPhone')}
          keyboardType="phone-pad"
        />
      </Card>

      <Card style={styles.inputCard}>
        <Text style={styles.inputLabel}>{t('cv.address')}</Text>
        <Input
          value={cvData.personalInfo.address}
          onChangeText={text =>
            setCvData(prev => ({
              ...prev,
              personalInfo: { ...prev.personalInfo, address: text },
            }))
          }
          placeholder={t('cv.enterAddress')}
        />
      </Card>

      <Card style={styles.inputCard}>
        <Text style={styles.inputLabel}>{t('cv.summary')}</Text>
        <TextInput
          style={styles.textArea}
          value={cvData.personalInfo.summary}
          onChangeText={text =>
            setCvData(prev => ({
              ...prev,
              personalInfo: { ...prev.personalInfo, summary: text },
            }))
          }
          placeholder={t('cv.enterSummary')}
          multiline
          numberOfLines={4}
        />
      </Card>
    </View>
  );

  const renderStep3 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>{t('cv.experienceEducation')}</Text>

      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{t('cv.experience')}</Text>
          <Button
            title={t('cv.addExperience')}
            onPress={handleAddExperience}
            style={styles.addButton}
            variant="outline"
          />
        </View>

        {cvData.experience.map((exp, index) => (
          <Card key={exp.id} style={styles.itemCard}>
            <View style={styles.itemHeader}>
              <Text style={styles.itemTitle}>
                {t('cv.experience')} {index + 1}
              </Text>
              <TouchableOpacity
                onPress={() => handleRemoveItem('experience', exp.id)}
                style={styles.removeButton}
              >
                <Icon name="close" size={20} color={COLORS.error} />
              </TouchableOpacity>
            </View>
            <Input
              value={exp.company}
              onChangeText={text =>
                setCvData(prev => ({
                  ...prev,
                  experience: prev.experience.map(e =>
                    e.id === exp.id ? { ...e, company: text } : e,
                  ),
                }))
              }
              placeholder={t('cv.company')}
            />
            <Input
              value={exp.position}
              onChangeText={text =>
                setCvData(prev => ({
                  ...prev,
                  experience: prev.experience.map(e =>
                    e.id === exp.id ? { ...e, position: text } : e,
                  ),
                }))
              }
              placeholder={t('cv.position')}
            />
            <View style={styles.dateRow}>
              <Input
                value={exp.startDate}
                onChangeText={text =>
                  setCvData(prev => ({
                    ...prev,
                    experience: prev.experience.map(e =>
                      e.id === exp.id ? { ...e, startDate: text } : e,
                    ),
                  }))
                }
                placeholder={t('cv.startDate')}
                style={styles.dateInput}
              />
              <Input
                value={exp.endDate}
                onChangeText={text =>
                  setCvData(prev => ({
                    ...prev,
                    experience: prev.experience.map(e =>
                      e.id === exp.id ? { ...e, endDate: text } : e,
                    ),
                  }))
                }
                placeholder={t('cv.endDate')}
                style={styles.dateInput}
              />
            </View>
          </Card>
        ))}
      </View>

      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{t('cv.education')}</Text>
          <Button
            title={t('cv.addEducation')}
            onPress={handleAddEducation}
            style={styles.addButton}
            variant="outline"
          />
        </View>

        {cvData.education.map((edu, index) => (
          <Card key={edu.id} style={styles.itemCard}>
            <View style={styles.itemHeader}>
              <Text style={styles.itemTitle}>
                {t('cv.education')} {index + 1}
              </Text>
              <TouchableOpacity
                onPress={() => handleRemoveItem('education', edu.id)}
                style={styles.removeButton}
              >
                <Icon name="close" size={20} color={COLORS.error} />
              </TouchableOpacity>
            </View>
            <Input
              value={edu.institution}
              onChangeText={text =>
                setCvData(prev => ({
                  ...prev,
                  education: prev.education.map(e =>
                    e.id === edu.id ? { ...e, institution: text } : e,
                  ),
                }))
              }
              placeholder={t('cv.institution')}
            />
            <Input
              value={edu.degree}
              onChangeText={text =>
                setCvData(prev => ({
                  ...prev,
                  education: prev.education.map(e =>
                    e.id === edu.id ? { ...e, degree: text } : e,
                  ),
                }))
              }
              placeholder={t('cv.degree')}
            />
            <View style={styles.dateRow}>
              <Input
                value={edu.startDate}
                onChangeText={text =>
                  setCvData(prev => ({
                    ...prev,
                    education: prev.education.map(e =>
                      e.id === edu.id ? { ...e, startDate: text } : e,
                    ),
                  }))
                }
                placeholder={t('cv.startDate')}
                style={styles.dateInput}
              />
              <Input
                value={edu.endDate}
                onChangeText={text =>
                  setCvData(prev => ({
                    ...prev,
                    education: prev.education.map(e =>
                      e.id === edu.id ? { ...e, endDate: text } : e,
                    ),
                  }))
                }
                placeholder={t('cv.endDate')}
                style={styles.dateInput}
              />
            </View>
          </Card>
        ))}
      </View>

      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{t('cv.skills')}</Text>
          <Button
            title={t('cv.addSkill')}
            onPress={handleAddSkill}
            style={styles.addButton}
            variant="outline"
          />
        </View>

        <View style={styles.skillsContainer}>
          {cvData.skills.map((skill, index) => (
            <View key={index} style={styles.skillTag}>
              <Text style={styles.skillText}>{skill}</Text>
              <TouchableOpacity
                onPress={() => handleRemoveItem('skills', index.toString())}
                style={styles.skillRemoveButton}
              >
                <Icon name="close" size={16} color={COLORS.error} />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{t('cv.languages')}</Text>
          <Button
            title={t('cv.addLanguage')}
            onPress={handleAddLanguage}
            style={styles.addButton}
            variant="outline"
          />
        </View>

        <View style={styles.skillsContainer}>
          {cvData.languages.map((language, index) => (
            <View key={index} style={styles.skillTag}>
              <Text style={styles.skillText}>{language}</Text>
              <TouchableOpacity
                onPress={() => handleRemoveItem('languages', index.toString())}
                style={styles.skillRemoveButton}
              >
                <Icon name="close" size={16} color={COLORS.error} />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </View>
    </View>
  );

  const renderStep4 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>{t('cv.generateCV')}</Text>

      <Card style={styles.generateCard}>
        <Icon name="auto-awesome" size={48} color={COLORS.primary} />
        <Text style={styles.generateTitle}>{t('cv.aiGeneration')}</Text>
        <Text style={styles.generateDescription}>
          {t('cv.aiGenerationDesc')}
        </Text>

        <View style={styles.generationInfo}>
          <View style={styles.infoItem}>
            <Icon name="template" size={20} color={COLORS.primary} />
            <Text style={styles.infoText}>
              {templates.find(t => t.id === cvData.template)?.name}
            </Text>
          </View>
          <View style={styles.infoItem}>
            <Icon name="person" size={20} color={COLORS.primary} />
            <Text style={styles.infoText}>{cvData.personalInfo.fullName}</Text>
          </View>
          <View style={styles.infoItem}>
            <Icon name="work" size={20} color={COLORS.primary} />
            <Text style={styles.infoText}>
              {cvData.experience.length} {t('cv.experienceItems')}
            </Text>
          </View>
        </View>

        <Button
          title={t('cv.generateWithAI')}
          onPress={handleGenerateCV}
          style={styles.generateButton}
          loading={loading}
        />
      </Card>

      <View style={styles.actionButtons}>
        <Button
          title={t('cv.saveCV')}
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
        <Text style={styles.headerTitle}>{t('cv.buildCV')}</Text>
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
    marginBottom: SPACING.sm,
    textAlign: 'center',
  },
  stepDescription: {
    fontSize: FONT_SIZES.md,
    color: COLORS.gray,
    textAlign: 'center',
    marginBottom: SPACING.lg,
    lineHeight: 24,
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
  inputCard: {
    marginBottom: SPACING.md,
  },
  inputLabel: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.sm,
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
  sectionContainer: {
    marginBottom: SPACING.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  addButton: {
    paddingHorizontal: SPACING.md,
  },
  itemCard: {
    marginBottom: SPACING.md,
    padding: SPACING.md,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  itemTitle: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.text,
  },
  removeButton: {
    padding: SPACING.xs,
  },
  dateRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  dateInput: {
    flex: 1,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  skillTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: 20,
  },
  skillText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.white,
    marginRight: SPACING.xs,
  },
  skillRemoveButton: {
    marginLeft: SPACING.xs,
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

export default CVBuilderScreen;
