import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useLanguage } from '../../contexts/LanguageContext';
import { COLORS, FONT_SIZES, SPACING } from '../../constants';
import { LessonPreparationScreen, LessonHistoryScreen } from '../lesson';
import { WorksheetCreationScreen, WorksheetHistoryScreen } from '../worksheet';
import {
  PresentationCreationScreen,
  PresentationHistoryScreen,
} from '../presentation';
import { CVBuilderScreen, CVHistoryScreen } from '../cv';
import { PDFEditorScreen } from '../pdf';
import { Modal } from '../../components';

const CreateScreen: React.FC = () => {
  const { t, language } = useLanguage();
  const [showLessonModal, setShowLessonModal] = useState(false);
  const [showLessonHistory, setShowLessonHistory] = useState(false);
  const [showWorksheetModal, setShowWorksheetModal] = useState(false);
  const [showWorksheetHistory, setShowWorksheetHistory] = useState(false);
  const [showPresentationModal, setShowPresentationModal] = useState(false);
  const [showPresentationHistory, setShowPresentationHistory] = useState(false);
  const [showCVModal, setShowCVModal] = useState(false);
  const [showCVHistory, setShowCVHistory] = useState(false);
  const [showPDFModal, setShowPDFModal] = useState(false);

  const isRTL = language === 'ar';

  const handleLessonPreparation = () => {
    setShowLessonModal(true);
  };

  const handleLessonHistory = () => {
    setShowLessonHistory(true);
  };

  const handleWorksheetCreation = () => {
    setShowWorksheetModal(true);
  };

  const handleWorksheetHistory = () => {
    setShowWorksheetHistory(true);
  };

  const handlePresentationCreation = () => {
    setShowPresentationModal(true);
  };

  const handlePresentationHistory = () => {
    setShowPresentationHistory(true);
  };

  const handleCVBuilder = () => {
    setShowCVModal(true);
  };

  const handleCVHistory = () => {
    setShowCVHistory(true);
  };

  const handlePDFEditor = () => {
    setShowPDFModal(true);
  };

  const createOptions = [
    {
      id: '1',
      title: t('create.lessonPreparation'),
      titleAr: 'إعداد الدرس',
      description: 'AI-powered lesson planning and preparation',
      descriptionAr: 'تخطيط وإعداد الدروس بالذكاء الاصطناعي',
      icon: 'school',
      color: COLORS.primary,
      coins: 20,
      onPress: handleLessonPreparation,
    },
    {
      id: '2',
      title: t('create.createWorksheet'),
      titleAr: 'إنشاء ورقة عمل',
      description: 'Generate worksheets and practice materials',
      descriptionAr: 'إنشاء أوراق العمل ومواد التدريب',
      icon: 'assignment',
      color: COLORS.secondary,
      coins: 12,
      onPress: handleWorksheetCreation,
    },
    {
      id: '3',
      title: t('create.createPresentation'),
      titleAr: 'إنشاء عرض تقديمي',
      description: 'Create engaging presentations with templates',
      descriptionAr: 'إنشاء عروض تقديمية جذابة بالقوالب',
      icon: 'slideshow',
      color: COLORS.success,
      coins: 25,
      onPress: handlePresentationCreation,
    },
    {
      id: '4',
      title: t('create.createCV'),
      titleAr: 'إنشاء سيرة ذاتية',
      description: 'Build professional CVs with templates',
      descriptionAr: 'إنشاء سير ذاتية مهنية بالقوالب',
      icon: 'person',
      color: COLORS.warning,
      coins: 8,
      onPress: handleCVBuilder,
    },
    {
      id: '5',
      title: t('create.pdfEditor'),
      titleAr: 'محرر PDF',
      description: 'Edit and create PDF documents',
      descriptionAr: 'تعديل وإنشاء مستندات PDF',
      icon: 'picture-as-pdf',
      color: COLORS.error,
      coins: 5,
      onPress: handlePDFEditor,
    },
  ];

  const renderCreateOption = (option: any) => (
    <TouchableOpacity
      key={option.id}
      style={styles.optionCard}
      onPress={option.onPress}
    >
      <View
        style={[styles.optionIcon, { backgroundColor: `${option.color}20` }]}
      >
        <Icon name={option.icon} size={32} color={option.color} />
      </View>
      <View style={styles.optionContent}>
        <Text style={styles.optionTitle}>
          {isRTL ? option.titleAr : option.title}
        </Text>
        <Text style={styles.optionDescription}>
          {isRTL ? option.descriptionAr : option.description}
        </Text>
      </View>
      <View style={styles.optionFooter}>
        <View style={styles.coinContainer}>
          <Icon name="monetization-on" size={16} color={COLORS.warning} />
          <Text style={styles.coinText}>{option.coins}</Text>
        </View>
        <Icon name="arrow-forward-ios" size={16} color={COLORS.textSecondary} />
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>{t('create.title')}</Text>
          <Text style={styles.subtitle}>
            Create amazing educational content
          </Text>
        </View>

        <View style={styles.content}>
          {createOptions.map(renderCreateOption)}
        </View>

        {/* Quick Tips Section */}
        <View style={styles.tipsSection}>
          <Text style={styles.tipsTitle}>Quick Tips</Text>
          <View style={styles.tipCard}>
            <Icon name="lightbulb" size={24} color={COLORS.warning} />
            <Text style={styles.tipText}>
              Upload study materials to get better AI-generated content
            </Text>
          </View>
          <View style={styles.tipCard}>
            <Icon name="schedule" size={24} color={COLORS.primary} />
            <Text style={styles.tipText}>
              Save time by using AI assistance for content creation
            </Text>
          </View>
          <View style={styles.tipCard}>
            <Icon name="language" size={24} color={COLORS.secondary} />
            <Text style={styles.tipText}>
              Generate content in both English and Arabic
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Lesson Preparation Modal */}
      <Modal
        visible={showLessonModal}
        animationType="slide"
        presentationStyle="fullScreen"
        onClose={() => setShowLessonModal(false)}
      >
        <LessonPreparationScreen />
      </Modal>

      {/* Lesson History Modal */}
      <Modal
        visible={showLessonHistory}
        animationType="slide"
        presentationStyle="fullScreen"
        onClose={() => setShowLessonHistory(false)}
      >
        <LessonHistoryScreen />
      </Modal>

      {/* Worksheet Creation Modal */}
      <Modal
        visible={showWorksheetModal}
        animationType="slide"
        presentationStyle="fullScreen"
        onClose={() => setShowWorksheetModal(false)}
      >
        <WorksheetCreationScreen />
      </Modal>

      {/* Worksheet History Modal */}
      <Modal
        visible={showWorksheetHistory}
        animationType="slide"
        presentationStyle="fullScreen"
        onClose={() => setShowWorksheetHistory(false)}
      >
        <WorksheetHistoryScreen />
      </Modal>

      {/* Presentation Creation Modal */}
      <Modal
        visible={showPresentationModal}
        animationType="slide"
        presentationStyle="fullScreen"
        onClose={() => setShowPresentationModal(false)}
      >
        <PresentationCreationScreen />
      </Modal>

      {/* Presentation History Modal */}
      <Modal
        visible={showPresentationHistory}
        animationType="slide"
        presentationStyle="fullScreen"
        onClose={() => setShowPresentationHistory(false)}
      >
        <PresentationHistoryScreen />
      </Modal>

      {/* CV Builder Modal */}
      <Modal
        visible={showCVModal}
        animationType="slide"
        presentationStyle="fullScreen"
        onClose={() => setShowCVModal(false)}
      >
        <CVBuilderScreen />
      </Modal>

      {/* CV History Modal */}
      <Modal
        visible={showCVHistory}
        animationType="slide"
        presentationStyle="fullScreen"
        onClose={() => setShowCVHistory(false)}
      >
        <CVHistoryScreen />
      </Modal>

      {/* PDF Editor Modal */}
      <Modal
        visible={showPDFModal}
        animationType="slide"
        presentationStyle="fullScreen"
        onClose={() => setShowPDFModal(false)}
      >
        <PDFEditorScreen />
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
  optionCard: {
    backgroundColor: COLORS.surface,
    padding: SPACING.lg,
    borderRadius: 12,
    marginBottom: SPACING.md,
    shadowColor: COLORS.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  optionIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  optionContent: {
    marginBottom: SPACING.md,
  },
  optionTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  optionDescription: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  optionFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  coinContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  coinText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.warning,
    fontWeight: '500',
    marginLeft: 4,
  },
  tipsSection: {
    padding: SPACING.lg,
    backgroundColor: COLORS.surface,
    margin: SPACING.lg,
    borderRadius: 12,
  },
  tipsTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  tipCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
  },
  tipText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginLeft: SPACING.md,
    flex: 1,
  },
});

export default CreateScreen;
