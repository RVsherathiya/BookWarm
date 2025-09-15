import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  RefreshControl,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { COLORS, FONT_SIZES, SPACING, SERVICES } from '../../constants';
interface HomeScreenProps {
  navigation: any;
}
const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const [refreshing, setRefreshing] = React.useState(false);

  const handleButtonPress = (mode: string) => {
    navigation.navigate('ChatGPT', { mode });
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // Simulate refresh
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  const isRTL = language === 'ar';

  const renderServiceCard = (service: any) => (
    <TouchableOpacity key={service.id} style={styles.serviceCard}>
      <View style={styles.serviceIcon}>
        <Icon name={service.icon} size={32} color={COLORS.primary} />
      </View>
      <Text style={styles.serviceTitle}>{service.name}</Text>
      <Text style={styles.serviceDescription}>{service.description}</Text>
      <View style={styles.serviceFooter}>
        <Text style={styles.coinText}>{service.coinsRequired} coins</Text>
        <Icon name="arrow-forward-ios" size={16} color={COLORS.textSecondary} />
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View>
              <Text style={styles.greeting}>{t('home.welcome')}</Text>
              <Text style={styles.userName}>{user?.name || 'Teacher'}</Text>
            </View>
            <View style={styles.coinContainer}>
              <Icon name="monetization-on" size={24} color={COLORS.warning} />
              <Text style={styles.coinCount}>{user?.coins || 0}</Text>
            </View>
          </View>
        </View>

        {/* Quick Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Icon name="quiz" size={24} color={COLORS.primary} />
            <Text style={styles.statNumber}>12</Text>
            <Text style={styles.statLabel}>Quizzes</Text>
          </View>
          <View style={styles.statCard}>
            <Icon name="school" size={24} color={COLORS.secondary} />
            <Text style={styles.statNumber}>8</Text>
            <Text style={styles.statLabel}>Lessons</Text>
          </View>
          <View style={styles.statCard}>
            <Icon name="assignment" size={24} color={COLORS.success} />
            <Text style={styles.statNumber}>15</Text>
            <Text style={styles.statLabel}>Worksheets</Text>
          </View>
        </View>

        {/* Available Services */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('home.availableServices')}</Text>
          <View style={styles.servicesGrid}>
            {SERVICES.map(renderServiceCard)}
          </View>
        </View>

        {/* Subject Papers */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{t('home.subjectPapers')}</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.subjectCards}>
              <TouchableOpacity style={styles.subjectCard}>
                <Icon name="calculate" size={32} color={COLORS.primary} />
                <Text style={styles.subjectName}>Mathematics</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.subjectCard}>
                <Icon name="science" size={32} color={COLORS.secondary} />
                <Text style={styles.subjectName}>Science</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.subjectCard}>
                <Icon name="translate" size={32} color={COLORS.success} />
                <Text style={styles.subjectName}>English</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.subjectCard}>
                <Icon name="menu-book" size={32} color={COLORS.warning} />
                <Text style={styles.subjectName}>Arabic</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActions}>
            <TouchableOpacity onPress={() => handleButtonPress('quiz')} style={styles.quickActionCard}>
              <Icon name="add-circle" size={32} color={COLORS.primary} />
              <Text style={styles.quickActionText}>Create Quiz</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleButtonPress('challenge')} style={styles.quickActionCard}>
              <Icon name="games" size={32} color={COLORS.secondary} />
              <Text style={styles.quickActionText}>Create Challenge</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleButtonPress('lesson-preparation')} style={styles.quickActionCard}>
              <Icon name="school" size={32} color={COLORS.success} />
              <Text style={styles.quickActionText}>Lesson Plan</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleButtonPress('worksheet')} style={styles.quickActionCard}>
              <Icon name="assignment" size={32} color={COLORS.warning} />
              <Text style={styles.quickActionText}>Worksheet</Text>
            </TouchableOpacity>
          </View>
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
  scrollView: {
    flex: 1,
  },
  header: {
    backgroundColor: COLORS.primary,
    paddingTop: 60,
    paddingBottom: SPACING.xl,
    paddingHorizontal: SPACING.lg,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    fontSize: FONT_SIZES.lg,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 4,
  },
  userName: {
    fontSize: FONT_SIZES.xxxl,
    fontWeight: 'bold',
    color: 'white',
  },
  coinContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: 20,
  },
  coinCount: {
    fontSize: FONT_SIZES.lg,
    fontWeight: 'bold',
    color: 'white',
    marginLeft: SPACING.sm,
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
    fontSize: FONT_SIZES.xxl,
    fontWeight: 'bold',
    color: COLORS.text,
    marginTop: SPACING.sm,
  },
  statLabel: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  section: {
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.xl,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  seeAllText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.primary,
    fontWeight: '500',
  },
  servicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  serviceCard: {
    width: '48%',
    backgroundColor: COLORS.surface,
    padding: SPACING.md,
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
  serviceIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  serviceTitle: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  serviceDescription: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.sm,
  },
  serviceFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  coinText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.warning,
    fontWeight: '500',
  },
  subjectCards: {
    flexDirection: 'row',
  },
  subjectCard: {
    backgroundColor: COLORS.surface,
    padding: SPACING.md,
    marginRight: SPACING.md,
    borderRadius: 12,
    alignItems: 'center',
    minWidth: 100,
    shadowColor: COLORS.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  subjectName: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.text,
    marginTop: SPACING.sm,
    textAlign: 'center',
  },
  quickActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickActionCard: {
    width: '48%',
    backgroundColor: COLORS.surface,
    padding: SPACING.lg,
    borderRadius: 12,
    alignItems: 'center',
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
  quickActionText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.text,
    marginTop: SPACING.sm,
    textAlign: 'center',
    fontWeight: '500',
  },
});

export default HomeScreen;
