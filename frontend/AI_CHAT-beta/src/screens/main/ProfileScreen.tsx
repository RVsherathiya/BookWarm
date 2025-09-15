import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Alert,
  Modal,
  TextInput,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { COLORS, FONT_SIZES, SPACING, ACADEMIC_LEVELS } from '../../constants';
import { CoinStoreScreen, CoinHistoryScreen } from '../coins';

const ProfileScreen: React.FC = () => {
  const { user, logout, updateProfile } = useAuth();
  const { t, language, changeLanguage } = useLanguage();
  const [showEditModal, setShowEditModal] = useState(false);
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [showCoinStore, setShowCoinStore] = useState(false);
  const [showCoinHistory, setShowCoinHistory] = useState(false);
  const [editData, setEditData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    academicLevel: user?.academicLevel || '',
  });

  const isRTL = language === 'ar';

  const handleEditProfile = () => {
    setEditData({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      academicLevel: user?.academicLevel || '',
    });
    setShowEditModal(true);
  };

  const handleSaveProfile = async () => {
    try {
      await updateProfile(editData);
      setShowEditModal(false);
      Alert.alert(t('common.success'), t('profile.profileComplete'));
    } catch (error) {
      Alert.alert(t('common.error'), 'Failed to update profile');
    }
  };

  const handleLogout = () => {
    Alert.alert(
      t('profile.logout'),
      'Are you sure you want to logout?',
      [
        { text: t('common.cancel'), style: 'cancel' },
        { text: t('profile.logout'), onPress: logout },
      ]
    );
  };

  const handleLanguageChange = async (lang: 'en' | 'ar') => {
    await changeLanguage(lang);
    setShowLanguageModal(false);
  };

  const handleCoinStore = () => {
    setShowCoinStore(true);
  };

  const handleCoinHistory = () => {
    setShowCoinHistory(true);
  };

  const renderEditModal = () => (
    <Modal
      visible={showEditModal}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={() => setShowEditModal(false)}>
            <Text style={styles.cancelText}>{t('common.cancel')}</Text>
          </TouchableOpacity>
          <Text style={styles.modalTitle}>{t('profile.editProfile')}</Text>
          <TouchableOpacity onPress={handleSaveProfile}>
            <Text style={styles.saveText}>{t('common.save')}</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.modalContent}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Name</Text>
            <TextInput
              style={styles.textInput}
              value={editData.name}
              onChangeText={(text) => setEditData(prev => ({ ...prev, name: text }))}
              placeholder="Enter your name"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.textInput}
              value={editData.email}
              onChangeText={(text) => setEditData(prev => ({ ...prev, email: text }))}
              placeholder="Enter your email"
              keyboardType="email-address"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Phone</Text>
            <TextInput
              style={styles.textInput}
              value={editData.phone}
              onChangeText={(text) => setEditData(prev => ({ ...prev, phone: text }))}
              placeholder="Enter your phone"
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t('profile.academicLevel')}</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.optionsContainer}>
                {ACADEMIC_LEVELS.map((level) => (
                  <TouchableOpacity
                    key={level.id}
                    style={[
                      styles.optionButton,
                      editData.academicLevel === level.id && styles.optionButtonSelected,
                    ]}
                    onPress={() => setEditData(prev => ({ ...prev, academicLevel: level.id }))}
                  >
                    <Text style={[
                      styles.optionText,
                      editData.academicLevel === level.id && styles.optionTextSelected,
                    ]}>
                      {isRTL ? level.nameAr : level.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );

  const renderLanguageModal = () => (
    <Modal
      visible={showLanguageModal}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={() => setShowLanguageModal(false)}>
            <Text style={styles.cancelText}>{t('common.cancel')}</Text>
          </TouchableOpacity>
          <Text style={styles.modalTitle}>{t('profile.changeLanguage')}</Text>
          <View style={{ width: 60 }} />
        </View>

        <View style={styles.modalContent}>
          <TouchableOpacity
            style={[
              styles.languageOption,
              language === 'en' && styles.languageOptionSelected,
            ]}
            onPress={() => handleLanguageChange('en')}
          >
            <Text style={[
              styles.languageText,
              language === 'en' && styles.languageTextSelected,
            ]}>
              English
            </Text>
            {language === 'en' && <Icon name="check" size={24} color={COLORS.primary} />}
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.languageOption,
              language === 'ar' && styles.languageOptionSelected,
            ]}
            onPress={() => handleLanguageChange('ar')}
          >
            <Text style={[
              styles.languageText,
              language === 'ar' && styles.languageTextSelected,
            ]}>
              العربية
            </Text>
            {language === 'ar' && <Icon name="check" size={24} color={COLORS.primary} />}
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.profileInfo}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {user?.name?.charAt(0)?.toUpperCase() || 'T'}
              </Text>
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{user?.name || 'Teacher'}</Text>
              <Text style={styles.userEmail}>{user?.email || 'teacher@example.com'}</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.editButton} onPress={handleEditProfile}>
            <Icon name="edit" size={20} color={COLORS.primary} />
          </TouchableOpacity>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <TouchableOpacity style={styles.statCard} onPress={handleCoinStore}>
            <Icon name="monetization-on" size={24} color={COLORS.warning} />
            <Text style={styles.statNumber}>{user?.coins || 0}</Text>
            <Text style={styles.statLabel}>Coins</Text>
            <Text style={styles.statSubtext}>Tap to buy more</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.statCard} onPress={handleCoinHistory}>
            <Icon name="history" size={24} color={COLORS.primary} />
            <Text style={styles.statNumber}>5</Text>
            <Text style={styles.statLabel}>Transactions</Text>
            <Text style={styles.statSubtext}>View history</Text>
          </TouchableOpacity>
          <View style={styles.statCard}>
            <Icon name="quiz" size={24} color={COLORS.secondary} />
            <Text style={styles.statNumber}>12</Text>
            <Text style={styles.statLabel}>Quizzes</Text>
          </View>
        </View>

        {/* Profile Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Profile Details</Text>
          <View style={styles.detailItem}>
            <Icon name="person" size={20} color={COLORS.textSecondary} />
            <Text style={styles.detailLabel}>Name</Text>
            <Text style={styles.detailValue}>{user?.name || 'Not set'}</Text>
          </View>
          <View style={styles.detailItem}>
            <Icon name="email" size={20} color={COLORS.textSecondary} />
            <Text style={styles.detailLabel}>Email</Text>
            <Text style={styles.detailValue}>{user?.email || 'Not set'}</Text>
          </View>
          <View style={styles.detailItem}>
            <Icon name="phone" size={20} color={COLORS.textSecondary} />
            <Text style={styles.detailLabel}>Phone</Text>
            <Text style={styles.detailValue}>{user?.phone || 'Not set'}</Text>
          </View>
          <View style={styles.detailItem}>
            <Icon name="school" size={20} color={COLORS.textSecondary} />
            <Text style={styles.detailLabel}>Academic Level</Text>
            <Text style={styles.detailValue}>
              {ACADEMIC_LEVELS.find(level => level.id === user?.academicLevel)?.name || 'Not set'}
            </Text>
          </View>
        </View>

        {/* Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Settings</Text>
          <TouchableOpacity style={styles.settingItem} onPress={() => setShowLanguageModal(true)}>
            <Icon name="language" size={20} color={COLORS.textSecondary} />
            <Text style={styles.settingLabel}>{t('profile.changeLanguage')}</Text>
            <Text style={styles.settingValue}>{language === 'en' ? 'English' : 'العربية'}</Text>
            <Icon name="arrow-forward-ios" size={16} color={COLORS.textSecondary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingItem}>
            <Icon name="history" size={20} color={COLORS.textSecondary} />
            <Text style={styles.settingLabel}>{t('profile.viewHistory')}</Text>
            <Icon name="arrow-forward-ios" size={16} color={COLORS.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Account Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <TouchableOpacity style={[styles.settingItem, styles.logoutItem]} onPress={handleLogout}>
            <Icon name="logout" size={20} color={COLORS.error} />
            <Text style={[styles.settingLabel, styles.logoutText]}>{t('profile.logout')}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.settingItem, styles.deleteItem]}>
            <Icon name="delete" size={20} color={COLORS.error} />
            <Text style={[styles.settingLabel, styles.deleteText]}>{t('profile.deleteAccount')}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {renderEditModal()}
      {renderLanguageModal()}

      {/* Coin Store Modal */}
      <Modal
        visible={showCoinStore}
        animationType="slide"
        presentationStyle="fullScreen"
        onClose={() => setShowCoinStore(false)}
      >
        <CoinStoreScreen />
      </Modal>

      {/* Coin History Modal */}
      <Modal
        visible={showCoinHistory}
        animationType="slide"
        presentationStyle="fullScreen"
        onClose={() => setShowCoinHistory(false)}
      >
        <CoinHistoryScreen />
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
    backgroundColor: COLORS.primary,
    paddingTop: 60,
    paddingBottom: SPACING.xl,
    paddingHorizontal: SPACING.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  avatarText: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: FONT_SIZES.xl,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: FONT_SIZES.sm,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  editButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.lg,
    marginTop: -SPACING.lg,
    marginBottom: SPACING.lg,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.surface,
    padding: SPACING.md,
    marginHorizontal: 4,
    borderRadius: 12,
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
  statNumber: {
    fontSize: FONT_SIZES.xl,
    fontWeight: 'bold',
    color: COLORS.text,
    marginTop: SPACING.sm,
  },
  statLabel: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  statSubtext: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.primary,
    marginTop: 2,
    textAlign: 'center',
  },
  section: {
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.xl,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  detailLabel: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    marginLeft: SPACING.sm,
    flex: 1,
  },
  detailValue: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
    fontWeight: '500',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  settingLabel: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
    marginLeft: SPACING.sm,
    flex: 1,
  },
  settingValue: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginRight: SPACING.sm,
  },
  logoutItem: {
    borderBottomWidth: 0,
  },
  logoutText: {
    color: COLORS.error,
  },
  deleteItem: {
    borderBottomWidth: 0,
  },
  deleteText: {
    color: COLORS.error,
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
  cancelText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
  },
  saveText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.primary,
    fontWeight: '600',
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
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  optionButton: {
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
  },
  optionTextSelected: {
    color: 'white',
  },
  languageOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  languageOptionSelected: {
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
  },
  languageText: {
    fontSize: FONT_SIZES.lg,
    color: COLORS.text,
  },
  languageTextSelected: {
    color: COLORS.primary,
    fontWeight: '600',
  },
});

export default ProfileScreen;
