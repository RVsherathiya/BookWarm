import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  RefreshControl,
  TextInput,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useLanguage } from '../../contexts/LanguageContext';
import { COLORS, FONT_SIZES, SPACING, SUBJECTS, DIFFICULTY_LEVELS, CHALLENGE_TYPES } from '../../constants';
import { Card, Button } from '../../components';
import { storage } from '../../utils';

const ChallengeHistoryScreen: React.FC = () => {
  const { t, language } = useLanguage();
  const [challenges, setChallenges] = useState<any[]>([]);
  const [filteredChallenges, setFilteredChallenges] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('all');

  const isRTL = language === 'ar';

  useEffect(() => {
    loadChallenges();
  }, []);

  useEffect(() => {
    filterChallenges();
  }, [challenges, searchQuery, selectedFilter]);

  const loadChallenges = async () => {
    try {
      const savedChallenges = await storage.getChallenges();
      setChallenges(savedChallenges);
    } catch (error) {
      console.error('Error loading challenges:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadChallenges();
    setRefreshing(false);
  };

  const filterChallenges = () => {
    let filtered = challenges;

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered?.filter(challenge =>
        challenge.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        SUBJECTS.find(s => s.id === challenge.subject)?.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by difficulty
    if (selectedFilter !== 'all') {
      filtered = filtered?.filter(challenge => challenge.difficulty === selectedFilter);
    }

    setFilteredChallenges(filtered);
  };

  const getSubjectName = (subjectId: string) => {
    const subject = SUBJECTS.find(s => s.id === subjectId);
    return isRTL ? subject?.nameAr : subject?.name;
  };

  const getDifficultyName = (difficulty: string) => {
    const level = DIFFICULTY_LEVELS.find(d => d.value === difficulty);
    return isRTL ? level?.nameAr : level?.name;
  };

  const getChallengeTypeName = (type: string) => {
    const challengeType = CHALLENGE_TYPES.find(t => t.id === type);
    return isRTL ? challengeType?.nameAr : challengeType?.name;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return COLORS.success;
      case 'medium':
        return COLORS.warning;
      case 'hard':
        return COLORS.error;
      default:
        return COLORS.textSecondary;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'ordering':
        return 'sort';
      case 'matching':
        return 'compare-arrows';
      case 'flashcards':
        return 'style';
      default:
        return 'games';
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString(isRTL ? 'ar-SA' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const renderChallengeCard = (challenge: any) => (
    <Card key={challenge.id} style={styles.challengeCard}>
      <View style={styles.challengeHeader}>
        <View style={styles.challengeInfo}>
          <Text style={styles.challengeTitle}>{challenge.title}</Text>
          <Text style={styles.challengeSubject}>{getSubjectName(challenge.subject)}</Text>
        </View>
        <View style={styles.challengeMeta}>
          <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(challenge.difficulty) }]}>
            <Text style={styles.difficultyText}>{getDifficultyName(challenge.difficulty)}</Text>
          </View>
        </View>
      </View>

      <View style={styles.challengeDetails}>
        <View style={styles.detailItem}>
          <Icon name={getTypeIcon(challenge.type)} size={16} color={COLORS.textSecondary} />
          <Text style={styles.detailText}>{getChallengeTypeName(challenge.type)}</Text>
        </View>
        <View style={styles.detailItem}>
          <Icon name="quiz" size={16} color={COLORS.textSecondary} />
          <Text style={styles.detailText}>{challenge.questions?.length || 0} items</Text>
        </View>
        <View style={styles.detailItem}>
          <Icon name="schedule" size={16} color={COLORS.textSecondary} />
          <Text style={styles.detailText}>{challenge.timePerQuestion}s per item</Text>
        </View>
        <View style={styles.detailItem}>
          <Icon name="monetization-on" size={16} color={COLORS.warning} />
          <Text style={styles.detailText}>{challenge.coinsUsed} coins</Text>
        </View>
      </View>

      <View style={styles.challengeFooter}>
        <Text style={styles.challengeDate}>{formatDate(challenge.createdAt)}</Text>
        <View style={styles.challengeActions}>
          <TouchableOpacity style={styles.actionButton}>
            <Icon name="visibility" size={16} color={COLORS.primary} />
            <Text style={styles.actionText}>View</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Icon name="edit" size={16} color={COLORS.secondary} />
            <Text style={styles.actionText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Icon name="share" size={16} color={COLORS.success} />
            <Text style={styles.actionText}>Share</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Card>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Icon name="games" size={64} color={COLORS.textSecondary} />
      <Text style={styles.emptyTitle}>No Challenges Found</Text>
      <Text style={styles.emptyMessage}>
        {searchQuery || selectedFilter !== 'all'
          ? 'No challenges match your search criteria'
          : 'You haven\'t created any challenges yet. Start by creating your first challenge!'
        }
      </Text>
      {!searchQuery && selectedFilter === 'all' && (
        <Button
          title="Create Challenge"
          onPress={() => {/* Navigate to challenge creation */}}
          style={styles.createButton}
        />
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => {/* Navigate back */}}>
          <Icon name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.title}>{t('challenge.challengeHistory')}</Text>
        <TouchableOpacity>
          <Icon name="add" size={24} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Icon name="search" size={20} color={COLORS.textSecondary} />
          <TextInput
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search challenges..."
            placeholderTextColor={COLORS.textSecondary}
          />
          {searchQuery?.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Icon name="close" size={20} color={COLORS.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={styles.filtersContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.filters}>
            <TouchableOpacity
              style={[
                styles.filterButton,
                selectedFilter === 'all' && styles.filterButtonSelected,
              ]}
              onPress={() => setSelectedFilter('all')}
            >
              <Text style={[
                styles.filterText,
                selectedFilter === 'all' && styles.filterTextSelected,
              ]}>
                All
              </Text>
            </TouchableOpacity>
            {DIFFICULTY_LEVELS.map((level) => (
              <TouchableOpacity
                key={level.id}
                style={[
                  styles.filterButton,
                  selectedFilter === level.value && styles.filterButtonSelected,
                ]}
                onPress={() => setSelectedFilter(level.value)}
              >
                <Text style={[
                  styles.filterText,
                  selectedFilter === level.value && styles.filterTextSelected,
                ]}>
                  {isRTL ? level.nameAr : level.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {filteredChallenges?.length > 0 ? (
          filteredChallenges?.map(renderChallengeCard)
        ) : (
          renderEmptyState()
        )}
      </ScrollView>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingTop: 60,
    paddingBottom: SPACING.md,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  title: {
    fontSize: FONT_SIZES.xl,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  searchContainer: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.surface,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderRadius: 8,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
    marginLeft: SPACING.sm,
  },
  filtersContainer: {
    paddingVertical: SPACING.sm,
    backgroundColor: COLORS.surface,
  },
  filters: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.lg,
  },
  filterButton: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    marginRight: SPACING.sm,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.background,
  },
  filterButtonSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  filterText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
  },
  filterTextSelected: {
    color: 'white',
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: SPACING.lg,
  },
  challengeCard: {
    marginBottom: SPACING.md,
  },
  challengeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.sm,
  },
  challengeInfo: {
    flex: 1,
  },
  challengeTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  challengeSubject: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
  },
  challengeMeta: {
    alignItems: 'flex-end',
  },
  difficultyBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: 10,
  },
  difficultyText: {
    fontSize: FONT_SIZES.xs,
    color: 'white',
    fontWeight: '600',
  },
  challengeDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: SPACING.sm,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: SPACING.lg,
    marginBottom: SPACING.xs,
  },
  detailText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginLeft: 4,
  },
  challengeFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  challengeDate: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
  },
  challengeActions: {
    flexDirection: 'row',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    marginLeft: SPACING.sm,
  },
  actionText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.primary,
    marginLeft: 4,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: SPACING.xxl,
  },
  emptyTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.text,
    marginTop: SPACING.md,
    marginBottom: SPACING.sm,
  },
  emptyMessage: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: SPACING.lg,
  },
  createButton: {
    paddingHorizontal: SPACING.xl,
  },
});

export default ChallengeHistoryScreen;
