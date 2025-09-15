import React, { useState, useEffect } from 'react';
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
import { Button, Card, Loading } from '../../components';

interface CV {
  id: string;
  title: string;
  template: string;
  fullName: string;
  email: string;
  phone: string;
  experienceCount: number;
  educationCount: number;
  skillsCount: number;
  createdAt: string;
  coinsUsed: number;
}

const CVHistoryScreen: React.FC = () => {
  const { t, language } = useLanguage();
  const [cvs, setCvs] = useState<CV[]>([]);
  const [filteredCvs, setFilteredCvs] = useState<CV[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedCV, setSelectedCV] = useState<CV | null>(null);

  const isRTL = language === 'ar';

  useEffect(() => {
    loadCVs();
  }, []);

  useEffect(() => {
    filterCVs();
  }, [searchQuery, cvs]);

  const loadCVs = async () => {
    setLoading(true);
    try {
      // Mock data - replace with actual data from storage
      const mockCVs: CV[] = [
        {
          id: '1',
          title: 'John Doe - Software Engineer',
          template: 'modern',
          fullName: 'John Doe',
          email: 'john.doe@email.com',
          phone: '+1 234 567 8900',
          experienceCount: 3,
          educationCount: 2,
          skillsCount: 8,
          createdAt: '2024-01-15',
          coinsUsed: 25,
        },
        {
          id: '2',
          title: 'Jane Smith - Marketing Manager',
          template: 'professional',
          fullName: 'Jane Smith',
          email: 'jane.smith@email.com',
          phone: '+1 234 567 8901',
          experienceCount: 5,
          educationCount: 1,
          skillsCount: 12,
          createdAt: '2024-01-14',
          coinsUsed: 30,
        },
        {
          id: '3',
          title: 'Ahmed Al-Rashid - Teacher',
          template: 'creative',
          fullName: 'Ahmed Al-Rashid',
          email: 'ahmed.rashid@email.com',
          phone: '+965 1234 5678',
          experienceCount: 4,
          educationCount: 3,
          skillsCount: 10,
          createdAt: '2024-01-13',
          coinsUsed: 28,
        },
      ];

      setCvs(mockCVs);
    } catch (error) {
      Alert.alert(t('common.error'), t('cv.loadFailed'));
    } finally {
      setLoading(false);
    }
  };

  const filterCVs = () => {
    if (!searchQuery.trim()) {
      setFilteredCvs(cvs);
      return;
    }

    const filtered = cvs.filter(
      cv =>
        cv.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cv.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cv.email.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    setFilteredCvs(filtered);
  };

  const handleViewDetails = (cv: CV) => {
    setSelectedCV(cv);
  };

  const handleEdit = (cv: CV) => {
    // Navigate to edit CV screen
    Alert.alert(t('common.info'), t('cv.editFeature'));
  };

  const handleDelete = (cv: CV) => {
    Alert.alert(t('common.confirm'), t('cv.deleteConfirm'), [
      { text: t('common.cancel'), style: 'cancel' },
      {
        text: t('common.delete'),
        style: 'destructive',
        onPress: () => {
          setCvs(prev => prev.filter(c => c.id !== cv.id));
          Alert.alert(t('common.success'), t('cv.deletedSuccessfully'));
        },
      },
    ]);
  };

  const handleExport = (cv: CV) => {
    // Export CV to PDF
    Alert.alert(t('common.success'), t('cv.exportedSuccessfully'));
  };

  const getTemplateColor = (template: string) => {
    const colors = {
      modern: COLORS.primary,
      professional: COLORS.success,
      creative: COLORS.warning,
      minimal: COLORS.secondary,
    };
    return colors[template as keyof typeof colors] || COLORS.gray;
  };

  const renderCVCard = (cv: CV) => (
    <Card key={cv.id} style={styles.cvCard}>
      <View style={styles.cvHeader}>
        <View style={styles.cvInfo}>
          <Text style={styles.cvTitle}>{cv.title}</Text>
          <View style={styles.templateBadge}>
            <View
              style={[
                styles.templateDot,
                { backgroundColor: getTemplateColor(cv.template) },
              ]}
            />
            <Text style={styles.templateText}>{cv.template}</Text>
          </View>
        </View>
        <View style={styles.cvActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleViewDetails(cv)}
          >
            <Icon name="visibility" size={20} color={COLORS.primary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleEdit(cv)}
          >
            <Icon name="edit" size={20} color={COLORS.warning} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleDelete(cv)}
          >
            <Icon name="delete" size={20} color={COLORS.error} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.cvDetails}>
        <View style={styles.detailRow}>
          <Icon name="person" size={16} color={COLORS.gray} />
          <Text style={styles.detailText}>{cv.fullName}</Text>
        </View>
        <View style={styles.detailRow}>
          <Icon name="email" size={16} color={COLORS.gray} />
          <Text style={styles.detailText}>{cv.email}</Text>
        </View>
        <View style={styles.detailRow}>
          <Icon name="phone" size={16} color={COLORS.gray} />
          <Text style={styles.detailText}>{cv.phone}</Text>
        </View>
      </View>

      <View style={styles.cvStats}>
        <View style={styles.statItem}>
          <Icon name="work" size={16} color={COLORS.primary} />
          <Text style={styles.statText}>
            {cv.experienceCount} {t('cv.experience')}
          </Text>
        </View>
        <View style={styles.statItem}>
          <Icon name="school" size={16} color={COLORS.success} />
          <Text style={styles.statText}>
            {cv.educationCount} {t('cv.education')}
          </Text>
        </View>
        <View style={styles.statItem}>
          <Icon name="star" size={16} color={COLORS.warning} />
          <Text style={styles.statText}>
            {cv.skillsCount} {t('cv.skills')}
          </Text>
        </View>
      </View>

      <View style={styles.cvFooter}>
        <View style={styles.footerLeft}>
          <Text style={styles.dateText}>
            {t('cv.createdOn')}: {cv.createdAt}
          </Text>
          <Text style={styles.coinsText}>
            {t('cv.coinsUsed')}: {cv.coinsUsed}
          </Text>
        </View>
        <Button
          title={t('cv.export')}
          onPress={() => handleExport(cv)}
          style={styles.exportButton}
          variant="outline"
        />
      </View>
    </Card>
  );

  const renderCVDetails = () => {
    if (!selectedCV) return null;

    return (
      <View style={styles.detailsModal}>
        <View style={styles.detailsHeader}>
          <Text style={styles.detailsTitle}>{selectedCV.title}</Text>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setSelectedCV(null)}
          >
            <Icon name="close" size={24} color={COLORS.gray} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.detailsContent}>
          <View style={styles.detailSection}>
            <Text style={styles.sectionTitle}>{t('cv.basicInfo')}</Text>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>{t('cv.fullName')}:</Text>
              <Text style={styles.detailValue}>{selectedCV.fullName}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>{t('cv.email')}:</Text>
              <Text style={styles.detailValue}>{selectedCV.email}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>{t('cv.phone')}:</Text>
              <Text style={styles.detailValue}>{selectedCV.phone}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>{t('cv.template')}:</Text>
              <Text style={styles.detailValue}>{selectedCV.template}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>{t('cv.createdOn')}:</Text>
              <Text style={styles.detailValue}>{selectedCV.createdAt}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>{t('cv.coinsUsed')}:</Text>
              <Text style={styles.detailValue}>{selectedCV.coinsUsed}</Text>
            </View>
          </View>

          <View style={styles.detailSection}>
            <Text style={styles.sectionTitle}>{t('cv.statistics')}</Text>
            <View style={styles.statsGrid}>
              <View style={styles.statCard}>
                <Icon name="work" size={24} color={COLORS.primary} />
                <Text style={styles.statNumber}>
                  {selectedCV.experienceCount}
                </Text>
                <Text style={styles.statLabel}>{t('cv.experience')}</Text>
              </View>
              <View style={styles.statCard}>
                <Icon name="school" size={24} color={COLORS.success} />
                <Text style={styles.statNumber}>
                  {selectedCV.educationCount}
                </Text>
                <Text style={styles.statLabel}>{t('cv.education')}</Text>
              </View>
              <View style={styles.statCard}>
                <Icon name="star" size={24} color={COLORS.warning} />
                <Text style={styles.statNumber}>{selectedCV.skillsCount}</Text>
                <Text style={styles.statLabel}>{t('cv.skills')}</Text>
              </View>
            </View>
          </View>
        </ScrollView>

        <View style={styles.detailsActions}>
          <Button
            title={t('cv.export')}
            onPress={() => handleExport(selectedCV)}
            style={styles.exportButton}
          />
          <Button
            title={t('common.close')}
            onPress={() => setSelectedCV(null)}
            style={styles.closeButton}
            variant="outline"
          />
        </View>
      </View>
    );
  };

  if (loading) {
    return <Loading />;
  }

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
        <Text style={styles.headerTitle}>{t('cv.cvHistory')}</Text>
        <View style={styles.headerRight} />
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Icon
            name="search"
            size={20}
            color={COLORS.gray}
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder={t('cv.searchCVs')}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={COLORS.gray}
          />
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {filteredCvs.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Icon name="description" size={64} color={COLORS.lightGray} />
            <Text style={styles.emptyTitle}>{t('cv.noCVs')}</Text>
            <Text style={styles.emptyDescription}>
              {searchQuery ? t('cv.noSearchResults') : t('cv.createFirstCV')}
            </Text>
          </View>
        ) : (
          filteredCvs.map(renderCVCard)
        )}
      </ScrollView>

      {selectedCV && renderCVDetails()}
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
  searchContainer: {
    padding: SPACING.lg,
    backgroundColor: COLORS.white,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderRadius: 8,
    paddingHorizontal: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
  },
  searchIcon: {
    marginRight: SPACING.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
    paddingVertical: SPACING.sm,
  },
  content: {
    flex: 1,
    padding: SPACING.lg,
  },
  cvCard: {
    marginBottom: SPACING.md,
    padding: SPACING.md,
  },
  cvHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.sm,
  },
  cvInfo: {
    flex: 1,
    marginRight: SPACING.sm,
  },
  cvTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  templateBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  templateDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: SPACING.xs,
  },
  templateText: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.gray,
    textTransform: 'capitalize',
  },
  cvActions: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  actionButton: {
    padding: SPACING.sm,
    borderRadius: 6,
    backgroundColor: COLORS.background,
  },
  cvDetails: {
    marginBottom: SPACING.md,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  detailText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.text,
    marginLeft: SPACING.sm,
  },
  cvStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: SPACING.md,
    paddingVertical: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.text,
    marginLeft: SPACING.xs,
  },
  cvFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray,
  },
  footerLeft: {
    flex: 1,
  },
  dateText: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.gray,
    marginBottom: 2,
  },
  coinsText: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.primary,
    fontWeight: '600',
  },
  exportButton: {
    paddingHorizontal: SPACING.md,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: SPACING.xxl,
  },
  emptyTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.text,
    marginTop: SPACING.md,
    marginBottom: SPACING.sm,
  },
  emptyDescription: {
    fontSize: FONT_SIZES.md,
    color: COLORS.gray,
    textAlign: 'center',
    lineHeight: 24,
  },
  detailsModal: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: COLORS.white,
    zIndex: 1000,
  },
  detailsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  detailsTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.text,
    flex: 1,
    marginRight: SPACING.md,
  },
  closeButton: {
    padding: SPACING.sm,
  },
  detailsContent: {
    flex: 1,
    padding: SPACING.lg,
  },
  detailSection: {
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.md,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  detailLabel: {
    fontSize: FONT_SIZES.md,
    color: COLORS.gray,
    fontWeight: '500',
  },
  detailValue: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
    fontWeight: '600',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statCard: {
    alignItems: 'center',
    padding: SPACING.md,
    backgroundColor: COLORS.background,
    borderRadius: 12,
    minWidth: 80,
  },
  statNumber: {
    fontSize: FONT_SIZES.xl,
    fontWeight: 'bold',
    color: COLORS.text,
    marginTop: SPACING.xs,
  },
  statLabel: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray,
    marginTop: SPACING.xs,
  },
  detailsActions: {
    flexDirection: 'row',
    padding: SPACING.lg,
    gap: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray,
  },
});

export default CVHistoryScreen;
