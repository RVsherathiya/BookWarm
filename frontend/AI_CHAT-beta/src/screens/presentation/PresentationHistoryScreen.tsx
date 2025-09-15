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

interface Presentation {
  id: string;
  title: string;
  subject: string;
  difficulty: string;
  academicLevel: string;
  template: string;
  description: string;
  slideCount: number;
  createdAt: string;
  coinsUsed: number;
  slides: any[];
}

const PresentationHistoryScreen: React.FC = () => {
  const { t, language } = useLanguage();
  const [presentations, setPresentations] = useState<Presentation[]>([]);
  const [filteredPresentations, setFilteredPresentations] = useState<
    Presentation[]
  >([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedPresentation, setSelectedPresentation] =
    useState<Presentation | null>(null);

  const isRTL = language === 'ar';

  useEffect(() => {
    loadPresentations();
  }, []);

  useEffect(() => {
    filterPresentations();
  }, [searchQuery, presentations]);

  const loadPresentations = async () => {
    setLoading(true);
    try {
      // Mock data - replace with actual data from storage
      const mockPresentations: Presentation[] = [
        {
          id: '1',
          title: 'Introduction to Algebra',
          subject: 'Mathematics',
          difficulty: 'Medium',
          academicLevel: 'Grade 9',
          template: 'education',
          description: 'A comprehensive introduction to algebraic concepts',
          slideCount: 12,
          createdAt: '2024-01-15',
          coinsUsed: 30,
          slides: [],
        },
        {
          id: '2',
          title: 'Photosynthesis Process',
          subject: 'Science',
          difficulty: 'Hard',
          academicLevel: 'Grade 10',
          template: 'creative',
          description: 'Detailed explanation of the photosynthesis process',
          slideCount: 15,
          createdAt: '2024-01-14',
          coinsUsed: 35,
          slides: [],
        },
        {
          id: '3',
          title: 'World War II Overview',
          subject: 'History',
          difficulty: 'Medium',
          academicLevel: 'Grade 11',
          template: 'business',
          description: 'Comprehensive overview of World War II events',
          slideCount: 20,
          createdAt: '2024-01-13',
          coinsUsed: 40,
          slides: [],
        },
      ];

      setPresentations(mockPresentations);
    } catch (error) {
      Alert.alert(t('common.error'), t('presentation.loadFailed'));
    } finally {
      setLoading(false);
    }
  };

  const filterPresentations = () => {
    if (!searchQuery.trim()) {
      setFilteredPresentations(presentations);
      return;
    }

    const filtered = presentations.filter(
      presentation =>
        presentation.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        presentation.subject
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        presentation.academicLevel
          .toLowerCase()
          .includes(searchQuery.toLowerCase()),
    );

    setFilteredPresentations(filtered);
  };

  const handleViewDetails = (presentation: Presentation) => {
    setSelectedPresentation(presentation);
  };

  const handleEdit = (presentation: Presentation) => {
    // Navigate to edit presentation screen
    Alert.alert(t('common.info'), t('presentation.editFeature'));
  };

  const handleDelete = (presentation: Presentation) => {
    Alert.alert(t('common.confirm'), t('presentation.deleteConfirm'), [
      { text: t('common.cancel'), style: 'cancel' },
      {
        text: t('common.delete'),
        style: 'destructive',
        onPress: () => {
          setPresentations(prev => prev.filter(p => p.id !== presentation.id));
          Alert.alert(
            t('common.success'),
            t('presentation.deletedSuccessfully'),
          );
        },
      },
    ]);
  };

  const handleExport = (presentation: Presentation) => {
    // Export presentation to PDF or PPT
    Alert.alert(t('common.success'), t('presentation.exportedSuccessfully'));
  };

  const getTemplateColor = (template: string) => {
    const colors = {
      education: COLORS.success,
      business: COLORS.primary,
      creative: COLORS.warning,
      minimal: COLORS.secondary,
    };
    return colors[template as keyof typeof colors] || COLORS.gray;
  };

  const renderPresentationCard = (presentation: Presentation) => (
    <Card key={presentation.id} style={styles.presentationCard}>
      <View style={styles.presentationHeader}>
        <View style={styles.presentationInfo}>
          <Text style={styles.presentationTitle}>{presentation.title}</Text>
          <View style={styles.templateBadge}>
            <View
              style={[
                styles.templateDot,
                { backgroundColor: getTemplateColor(presentation.template) },
              ]}
            />
            <Text style={styles.templateText}>{presentation.template}</Text>
          </View>
        </View>
        <View style={styles.presentationActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleViewDetails(presentation)}
          >
            <Icon name="visibility" size={20} color={COLORS.primary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleEdit(presentation)}
          >
            <Icon name="edit" size={20} color={COLORS.warning} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleDelete(presentation)}
          >
            <Icon name="delete" size={20} color={COLORS.error} />
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.presentationDescription}>
        {presentation.description}
      </Text>

      <View style={styles.presentationInfo}>
        <View style={styles.infoRow}>
          <Icon name="subject" size={16} color={COLORS.gray} />
          <Text style={styles.infoText}>{presentation.subject}</Text>
        </View>
        <View style={styles.infoRow}>
          <Icon name="school" size={16} color={COLORS.gray} />
          <Text style={styles.infoText}>{presentation.academicLevel}</Text>
        </View>
        <View style={styles.infoRow}>
          <Icon name="trending-up" size={16} color={COLORS.gray} />
          <Text style={styles.infoText}>{presentation.difficulty}</Text>
        </View>
        <View style={styles.infoRow}>
          <Icon name="slideshow" size={16} color={COLORS.gray} />
          <Text style={styles.infoText}>
            {presentation.slideCount} {t('presentation.slides')}
          </Text>
        </View>
      </View>

      <View style={styles.presentationFooter}>
        <View style={styles.footerLeft}>
          <Text style={styles.dateText}>
            {t('presentation.createdOn')}: {presentation.createdAt}
          </Text>
          <Text style={styles.coinsText}>
            {t('presentation.coinsUsed')}: {presentation.coinsUsed}
          </Text>
        </View>
        <Button
          title={t('presentation.export')}
          onPress={() => handleExport(presentation)}
          style={styles.exportButton}
          variant="outline"
        />
      </View>
    </Card>
  );

  const renderPresentationDetails = () => {
    if (!selectedPresentation) return null;

    return (
      <View style={styles.detailsModal}>
        <View style={styles.detailsHeader}>
          <Text style={styles.detailsTitle}>{selectedPresentation.title}</Text>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setSelectedPresentation(null)}
          >
            <Icon name="close" size={24} color={COLORS.gray} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.detailsContent}>
          <View style={styles.detailSection}>
            <Text style={styles.sectionTitle}>
              {t('presentation.basicInfo')}
            </Text>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>
                {t('presentation.subject')}:
              </Text>
              <Text style={styles.detailValue}>
                {selectedPresentation.subject}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>
                {t('presentation.academicLevel')}:
              </Text>
              <Text style={styles.detailValue}>
                {selectedPresentation.academicLevel}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>
                {t('presentation.difficulty')}:
              </Text>
              <Text style={styles.detailValue}>
                {selectedPresentation.difficulty}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>
                {t('presentation.template')}:
              </Text>
              <Text style={styles.detailValue}>
                {selectedPresentation.template}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>
                {t('presentation.slideCount')}:
              </Text>
              <Text style={styles.detailValue}>
                {selectedPresentation.slideCount}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>
                {t('presentation.createdOn')}:
              </Text>
              <Text style={styles.detailValue}>
                {selectedPresentation.createdAt}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>
                {t('presentation.coinsUsed')}:
              </Text>
              <Text style={styles.detailValue}>
                {selectedPresentation.coinsUsed}
              </Text>
            </View>
          </View>

          <View style={styles.detailSection}>
            <Text style={styles.sectionTitle}>
              {t('presentation.description')}
            </Text>
            <Text style={styles.descriptionText}>
              {selectedPresentation.description}
            </Text>
          </View>
        </ScrollView>

        <View style={styles.detailsActions}>
          <Button
            title={t('presentation.export')}
            onPress={() => handleExport(selectedPresentation)}
            style={styles.exportButton}
          />
          <Button
            title={t('common.close')}
            onPress={() => setSelectedPresentation(null)}
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
        <Text style={styles.headerTitle}>
          {t('presentation.presentationHistory')}
        </Text>
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
            placeholder={t('presentation.searchPresentations')}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={COLORS.gray}
          />
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {filteredPresentations.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Icon name="slideshow" size={64} color={COLORS.lightGray} />
            <Text style={styles.emptyTitle}>
              {t('presentation.noPresentations')}
            </Text>
            <Text style={styles.emptyDescription}>
              {searchQuery
                ? t('presentation.noSearchResults')
                : t('presentation.createFirstPresentation')}
            </Text>
          </View>
        ) : (
          filteredPresentations.map(renderPresentationCard)
        )}
      </ScrollView>

      {selectedPresentation && renderPresentationDetails()}
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
  presentationCard: {
    marginBottom: SPACING.md,
    padding: SPACING.md,
  },
  presentationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.sm,
  },
  presentationInfo: {
    flex: 1,
    marginRight: SPACING.sm,
  },
  presentationTitle: {
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
  presentationActions: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  actionButton: {
    padding: SPACING.sm,
    borderRadius: 6,
    backgroundColor: COLORS.background,
  },
  presentationDescription: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray,
    marginBottom: SPACING.md,
    lineHeight: 20,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  infoText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.text,
    marginLeft: SPACING.sm,
  },
  presentationFooter: {
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
  descriptionText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
    lineHeight: 24,
  },
  detailsActions: {
    flexDirection: 'row',
    padding: SPACING.lg,
    gap: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray,
  },
});

export default PresentationHistoryScreen;
