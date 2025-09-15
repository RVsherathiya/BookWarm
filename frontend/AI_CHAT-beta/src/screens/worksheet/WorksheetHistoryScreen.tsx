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
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useLanguage } from '../../contexts/LanguageContext';
import { COLORS, FONT_SIZES, SPACING } from '../../constants';
import { Button, Card, Loading } from '../../components';

interface Worksheet {
  id: string;
  title: string;
  subject: string;
  difficulty: string;
  academicLevel: string;
  worksheetType: string;
  numberOfQuestions: number;
  createdAt: string;
  coinsUsed: number;
  questions: any[];
}

const WorksheetHistoryScreen: React.FC = () => {
  const { t, language } = useLanguage();
  const [worksheets, setWorksheets] = useState<Worksheet[]>([]);
  const [filteredWorksheets, setFilteredWorksheets] = useState<Worksheet[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedWorksheet, setSelectedWorksheet] = useState<Worksheet | null>(
    null,
  );

  const isRTL = language === 'ar';

  useEffect(() => {
    loadWorksheets();
  }, []);

  useEffect(() => {
    filterWorksheets();
  }, [searchQuery, worksheets]);

  const loadWorksheets = async () => {
    setLoading(true);
    try {
      // Mock data - replace with actual data from storage
      const mockWorksheets: Worksheet[] = [
        {
          id: '1',
          title: 'Math Worksheet - Algebra Basics',
          subject: 'Mathematics',
          difficulty: 'Medium',
          academicLevel: 'Grade 9',
          worksheetType: 'mixed',
          numberOfQuestions: 15,
          createdAt: '2024-01-15',
          coinsUsed: 20,
          questions: [],
        },
        {
          id: '2',
          title: 'Science Worksheet - Photosynthesis',
          subject: 'Science',
          difficulty: 'Hard',
          academicLevel: 'Grade 10',
          worksheetType: 'multiple-choice',
          numberOfQuestions: 20,
          createdAt: '2024-01-14',
          coinsUsed: 25,
          questions: [],
        },
        {
          id: '3',
          title: 'English Worksheet - Grammar',
          subject: 'English',
          difficulty: 'Easy',
          academicLevel: 'Grade 8',
          worksheetType: 'fill-blank',
          numberOfQuestions: 10,
          createdAt: '2024-01-13',
          coinsUsed: 15,
          questions: [],
        },
      ];

      setWorksheets(mockWorksheets);
    } catch (error) {
      Alert.alert(t('common.error'), t('worksheet.loadFailed'));
    } finally {
      setLoading(false);
    }
  };

  const filterWorksheets = () => {
    if (!searchQuery.trim()) {
      setFilteredWorksheets(worksheets);
      return;
    }

    const filtered = worksheets.filter(
      worksheet =>
        worksheet.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        worksheet.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        worksheet.academicLevel
          .toLowerCase()
          .includes(searchQuery.toLowerCase()),
    );

    setFilteredWorksheets(filtered);
  };

  const handleViewDetails = (worksheet: Worksheet) => {
    setSelectedWorksheet(worksheet);
  };

  const handleEdit = (worksheet: Worksheet) => {
    // Navigate to edit worksheet screen
    Alert.alert(t('common.info'), t('worksheet.editFeature'));
  };

  const handleDelete = (worksheet: Worksheet) => {
    Alert.alert(t('common.confirm'), t('worksheet.deleteConfirm'), [
      { text: t('common.cancel'), style: 'cancel' },
      {
        text: t('common.delete'),
        style: 'destructive',
        onPress: () => {
          setWorksheets(prev => prev.filter(w => w.id !== worksheet.id));
          Alert.alert(t('common.success'), t('worksheet.deletedSuccessfully'));
        },
      },
    ]);
  };

  const handleExport = (worksheet: Worksheet) => {
    // Export worksheet to PDF
    Alert.alert(t('common.success'), t('worksheet.exportedSuccessfully'));
  };

  const renderWorksheetCard = (worksheet: Worksheet) => (
    <Card key={worksheet.id} style={styles.worksheetCard}>
      <View style={styles.worksheetHeader}>
        <Text style={styles.worksheetTitle}>{worksheet.title}</Text>
        <View style={styles.worksheetActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleViewDetails(worksheet)}
          >
            <Icon name="visibility" size={20} color={COLORS.primary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleEdit(worksheet)}
          >
            <Icon name="edit" size={20} color={COLORS.warning} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleDelete(worksheet)}
          >
            <Icon name="delete" size={20} color={COLORS.error} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.worksheetInfo}>
        <View style={styles.infoRow}>
          <Icon name="subject" size={16} color={COLORS.gray} />
          <Text style={styles.infoText}>{worksheet.subject}</Text>
        </View>
        <View style={styles.infoRow}>
          <Icon name="school" size={16} color={COLORS.gray} />
          <Text style={styles.infoText}>{worksheet.academicLevel}</Text>
        </View>
        <View style={styles.infoRow}>
          <Icon name="trending-up" size={16} color={COLORS.gray} />
          <Text style={styles.infoText}>{worksheet.difficulty}</Text>
        </View>
        <View style={styles.infoRow}>
          <Icon name="quiz" size={16} color={COLORS.gray} />
          <Text style={styles.infoText}>
            {worksheet.numberOfQuestions} {t('worksheet.questions')}
          </Text>
        </View>
      </View>

      <View style={styles.worksheetFooter}>
        <View style={styles.footerLeft}>
          <Text style={styles.dateText}>
            {t('worksheet.createdOn')}: {worksheet.createdAt}
          </Text>
          <Text style={styles.coinsText}>
            {t('worksheet.coinsUsed')}: {worksheet.coinsUsed}
          </Text>
        </View>
        <Button
          title={t('worksheet.export')}
          onPress={() => handleExport(worksheet)}
          style={styles.exportButton}
          variant="outline"
        />
      </View>
    </Card>
  );

  const renderWorksheetDetails = () => {
    if (!selectedWorksheet) return null;

    return (
      <View style={styles.detailsModal}>
        <View style={styles.detailsHeader}>
          <Text style={styles.detailsTitle}>{selectedWorksheet.title}</Text>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setSelectedWorksheet(null)}
          >
            <Icon name="close" size={24} color={COLORS.gray} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.detailsContent}>
          <View style={styles.detailSection}>
            <Text style={styles.sectionTitle}>{t('worksheet.basicInfo')}</Text>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>{t('worksheet.subject')}:</Text>
              <Text style={styles.detailValue}>
                {selectedWorksheet.subject}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>
                {t('worksheet.academicLevel')}:
              </Text>
              <Text style={styles.detailValue}>
                {selectedWorksheet.academicLevel}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>
                {t('worksheet.difficulty')}:
              </Text>
              <Text style={styles.detailValue}>
                {selectedWorksheet.difficulty}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>
                {t('worksheet.worksheetType')}:
              </Text>
              <Text style={styles.detailValue}>
                {selectedWorksheet.worksheetType}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>
                {t('worksheet.numberOfQuestions')}:
              </Text>
              <Text style={styles.detailValue}>
                {selectedWorksheet.numberOfQuestions}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>
                {t('worksheet.createdOn')}:
              </Text>
              <Text style={styles.detailValue}>
                {selectedWorksheet.createdAt}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>
                {t('worksheet.coinsUsed')}:
              </Text>
              <Text style={styles.detailValue}>
                {selectedWorksheet.coinsUsed}
              </Text>
            </View>
          </View>
        </ScrollView>

        <View style={styles.detailsActions}>
          <Button
            title={t('worksheet.export')}
            onPress={() => handleExport(selectedWorksheet)}
            style={styles.exportButton}
          />
          <Button
            title={t('common.close')}
            onPress={() => setSelectedWorksheet(null)}
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
          {t('worksheet.worksheetHistory')}
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
            placeholder={t('worksheet.searchWorksheets')}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={COLORS.gray}
          />
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {filteredWorksheets.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Icon name="assignment" size={64} color={COLORS.lightGray} />
            <Text style={styles.emptyTitle}>{t('worksheet.noWorksheets')}</Text>
            <Text style={styles.emptyDescription}>
              {searchQuery
                ? t('worksheet.noSearchResults')
                : t('worksheet.createFirstWorksheet')}
            </Text>
          </View>
        ) : (
          filteredWorksheets.map(renderWorksheetCard)
        )}
      </ScrollView>

      {selectedWorksheet && renderWorksheetDetails()}
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
  worksheetCard: {
    marginBottom: SPACING.md,
    padding: SPACING.md,
  },
  worksheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.md,
  },
  worksheetTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.text,
    flex: 1,
    marginRight: SPACING.sm,
  },
  worksheetActions: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  actionButton: {
    padding: SPACING.sm,
    borderRadius: 6,
    backgroundColor: COLORS.background,
  },
  worksheetInfo: {
    marginBottom: SPACING.md,
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
  worksheetFooter: {
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
  detailsActions: {
    flexDirection: 'row',
    padding: SPACING.lg,
    gap: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray,
  },
});

export default WorksheetHistoryScreen;
