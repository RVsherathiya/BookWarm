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
import { COLORS, FONT_SIZES, SPACING, SUBJECTS, DIFFICULTY_LEVELS } from '../../constants';
import { Card, Button } from '../../components';
import { storage } from '../../utils';

const QuizHistoryScreen: React.FC = () => {
  const { t, language } = useLanguage();
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [filteredQuizzes, setFilteredQuizzes] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('all');

  const isRTL = language === 'ar';

  useEffect(() => {
    loadQuizzes();
  }, []);

  useEffect(() => {
    filterQuizzes();
  }, [quizzes, searchQuery, selectedFilter]);

  const loadQuizzes = async () => {
    try {
      const savedQuizzes = await storage.getQuizzes();
      setQuizzes(savedQuizzes);
    } catch (error) {
      console.error('Error loading quizzes:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadQuizzes();
    setRefreshing(false);
  };

  const filterQuizzes = () => {
    let filtered = quizzes;

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered?.filter(quiz =>
        quiz.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        SUBJECTS.find(s => s.id === quiz.subject)?.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by difficulty
    if (selectedFilter !== 'all') {
      filtered = filtered?.filter(quiz => quiz.difficulty === selectedFilter);
    }

    setFilteredQuizzes(filtered);
  };

  const getSubjectName = (subjectId: string) => {
    const subject = SUBJECTS.find(s => s.id === subjectId);
    return isRTL ? subject?.nameAr : subject?.name;
  };

  const getDifficultyName = (difficulty: string) => {
    const level = DIFFICULTY_LEVELS.find(d => d.value === difficulty);
    return isRTL ? level?.nameAr : level?.name;
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

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString(isRTL ? 'ar-SA' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const renderQuizCard = (quiz: any) => (
    <Card key={quiz.id} style={styles.quizCard}>
      <View style={styles.quizHeader}>
        <View style={styles.quizInfo}>
          <Text style={styles.quizTitle}>{quiz.title}</Text>
          <Text style={styles.quizSubject}>{getSubjectName(quiz.subject)}</Text>
        </View>
        <View style={styles.quizMeta}>
          <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(quiz.difficulty) }]}>
            <Text style={styles.difficultyText}>{getDifficultyName(quiz.difficulty)}</Text>
          </View>
        </View>
      </View>

      <View style={styles.quizDetails}>
        <View style={styles.detailItem}>
          <Icon name="quiz" size={16} color={COLORS.textSecondary} />
          <Text style={styles.detailText}>{quiz.questions?.length || 0} questions</Text>
        </View>
        <View style={styles.detailItem}>
          <Icon name="schedule" size={16} color={COLORS.textSecondary} />
          <Text style={styles.detailText}>~{quiz.questions?.length * 2} min</Text>
        </View>
        <View style={styles.detailItem}>
          <Icon name="monetization-on" size={16} color={COLORS.warning} />
          <Text style={styles.detailText}>{quiz.coinsUsed} coins</Text>
        </View>
      </View>

      <View style={styles.quizFooter}>
        <Text style={styles.quizDate}>{formatDate(quiz.createdAt)}</Text>
        <View style={styles.quizActions}>
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
      <Icon name="quiz" size={64} color={COLORS.textSecondary} />
      <Text style={styles.emptyTitle}>No Quizzes Found</Text>
      <Text style={styles.emptyMessage}>
        {searchQuery || selectedFilter !== 'all'
          ? 'No quizzes match your search criteria'
          : 'You haven\'t created any quizzes yet. Start by creating your first quiz!'
        }
      </Text>
      {!searchQuery && selectedFilter === 'all' && (
        <Button
          title="Create Quiz"
          onPress={() => {/* Navigate to quiz creation */}}
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
        <Text style={styles.title}>{t('quiz.quizHistory')}</Text>
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
            placeholder="Search quizzes..."
            placeholderTextColor={COLORS.textSecondary}
          />
          {searchQuery.length > 0 && (
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
        {filteredQuizzes?.length > 0 ? (
          filteredQuizzes?.map(renderQuizCard)
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
  quizCard: {
    marginBottom: SPACING.md,
  },
  quizHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.sm,
  },
  quizInfo: {
    flex: 1,
  },
  quizTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  quizSubject: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
  },
  quizMeta: {
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
  quizDetails: {
    flexDirection: 'row',
    marginBottom: SPACING.sm,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: SPACING.lg,
  },
  detailText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginLeft: 4,
  },
  quizFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  quizDate: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
  },
  quizActions: {
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

export default QuizHistoryScreen;
