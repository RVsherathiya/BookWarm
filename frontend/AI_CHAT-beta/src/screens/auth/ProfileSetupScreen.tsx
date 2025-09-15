import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  StatusBar,
} from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { COLORS, FONT_SIZES, SPACING, ACADEMIC_LEVELS } from '../../constants';

const ProfileSetupScreen: React.FC = () => {
  const [selectedLevel, setSelectedLevel] = useState<string>('');
  const { updateProfile } = useAuth();
  const { t, language } = useLanguage();

  const handleContinue = async () => {
    if (!selectedLevel) {
      Alert.alert(t('common.error'), 'Please select your academic level');
      return;
    }

    try {
      await updateProfile({ 
        academicLevel: selectedLevel,
        isProfileComplete: true 
      });
    } catch (error) {
      Alert.alert(t('common.error'), 'Failed to update profile');
    }
  };

  const isRTL = language === 'ar';

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <View style={styles.logo}>
              <Text style={styles.logoText}>TL</Text>
            </View>
          </View>
          <Text style={styles.title}>{t('profile.setupProfile')}</Text>
          <Text style={styles.subtitle}>{t('profile.selectLevel')}</Text>
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.sectionTitle}>{t('profile.academicLevel')}</Text>
          
          <View style={styles.levelContainer}>
            {ACADEMIC_LEVELS.map((level) => (
              <TouchableOpacity
                key={level.id}
                style={[
                  styles.levelCard,
                  selectedLevel === level.id && styles.levelCardSelected,
                ]}
                onPress={() => setSelectedLevel(level.id)}
              >
                <Text
                  style={[
                    styles.levelText,
                    selectedLevel === level.id && styles.levelTextSelected,
                  ]}
                >
                  {isRTL ? level.nameAr : level.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity
            style={[
              styles.continueButton,
              !selectedLevel && styles.continueButtonDisabled,
            ]}
            onPress={handleContinue}
            disabled={!selectedLevel}
          >
            <Text style={styles.continueButtonText}>{t('common.next')}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  header: {
    backgroundColor: COLORS.primary,
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: SPACING.lg,
    alignItems: 'center',
  },
  logoContainer: {
    marginBottom: SPACING.lg,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.shadow,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  logoText: {
    fontSize: FONT_SIZES.xxxl,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  title: {
    fontSize: FONT_SIZES.xxxl,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  subtitle: {
    fontSize: FONT_SIZES.md,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
  formContainer: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xl,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.lg,
  },
  levelContainer: {
    marginBottom: SPACING.xl,
  },
  levelCard: {
    backgroundColor: COLORS.surface,
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.lg,
    borderRadius: 12,
    marginBottom: SPACING.md,
    borderWidth: 2,
    borderColor: COLORS.border,
    shadowColor: COLORS.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  levelCardSelected: {
    borderColor: COLORS.primary,
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
  },
  levelText: {
    fontSize: FONT_SIZES.md,
    fontWeight: '500',
    color: COLORS.text,
    textAlign: 'center',
  },
  levelTextSelected: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  continueButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.md,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  continueButtonDisabled: {
    backgroundColor: COLORS.textSecondary,
  },
  continueButtonText: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: 'white',
  },
});

export default ProfileSetupScreen;
