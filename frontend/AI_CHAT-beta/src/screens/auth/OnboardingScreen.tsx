import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  StatusBar,
} from 'react-native';
import { useLanguage } from '../../contexts/LanguageContext';
import { COLORS, FONT_SIZES, SPACING } from '../../constants';

const { width } = Dimensions.get('window');

const OnboardingScreen: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { t, language } = useLanguage();

  const slides = [
    {
      id: 1,
      title: 'Welcome to Teacher LMS',
      titleAr: 'مرحباً بك في نظام إدارة التعلم للمعلمين',
      description: 'AI-powered tools to enhance your teaching experience',
      descriptionAr: 'أدوات مدعومة بالذكاء الاصطناعي لتحسين تجربة التدريس',
      icon: '🎓',
    },
    {
      id: 2,
      title: 'Create Engaging Content',
      titleAr: 'إنشاء محتوى جذاب',
      description: 'Generate quizzes, worksheets, and presentations with AI',
      descriptionAr: 'إنشاء اختبارات وأوراق عمل وعروض تقديمية بالذكاء الاصطناعي',
      icon: '✨',
    },
    {
      id: 3,
      title: 'Save Time & Effort',
      titleAr: 'وفر الوقت والجهد',
      description: 'Automate lesson planning and content creation',
      descriptionAr: 'أتمتة تخطيط الدروس وإنشاء المحتوى',
      icon: '⏰',
    },
  ];

  const isRTL = language === 'ar';

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const skipOnboarding = () => {
    // This would typically navigate to the main app
    // For now, we'll just show an alert
    console.log('Skip onboarding');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      
      <View style={styles.content}>
        <View style={styles.slideContainer}>
          <View style={styles.iconContainer}>
            <Text style={styles.icon}>{slides[currentSlide].icon}</Text>
          </View>
          
          <Text style={styles.title}>
            {isRTL ? slides[currentSlide].titleAr : slides[currentSlide].title}
          </Text>
          
          <Text style={styles.description}>
            {isRTL ? slides[currentSlide].descriptionAr : slides[currentSlide].description}
          </Text>
        </View>

        <View style={styles.pagination}>
          {slides.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                index === currentSlide && styles.activeDot,
              ]}
            />
          ))}
        </View>

        <View style={styles.buttonContainer}>
          {currentSlide > 0 && (
            <TouchableOpacity style={styles.backButton} onPress={prevSlide}>
              <Text style={styles.backButtonText}>{t('common.back')}</Text>
            </TouchableOpacity>
          )}
          
          <View style={styles.rightButtons}>
            <TouchableOpacity style={styles.skipButton} onPress={skipOnboarding}>
              <Text style={styles.skipButtonText}>Skip</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.nextButton} onPress={nextSlide}>
              <Text style={styles.nextButtonText}>
                {currentSlide === slides.length - 1 ? t('common.done') : t('common.next')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },
  content: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
    paddingTop: 60,
    paddingBottom: 40,
  },
  slideContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  icon: {
    fontSize: 60,
  },
  title: {
    fontSize: FONT_SIZES.xxxl,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: SPACING.lg,
  },
  description: {
    fontSize: FONT_SIZES.lg,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: SPACING.md,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: 'white',
    width: 24,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backButton: {
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
  },
  backButtonText: {
    fontSize: FONT_SIZES.md,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '500',
  },
  rightButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  skipButton: {
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    marginRight: SPACING.md,
  },
  skipButtonText: {
    fontSize: FONT_SIZES.md,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '500',
  },
  nextButton: {
    backgroundColor: 'white',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
    borderRadius: 25,
    shadowColor: COLORS.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  nextButtonText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.primary,
    fontWeight: '600',
  },
});

export default OnboardingScreen;
