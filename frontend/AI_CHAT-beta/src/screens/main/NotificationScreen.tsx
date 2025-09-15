import React, { useState } from 'react';
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
import { useLanguage } from '../../contexts/LanguageContext';
import { COLORS, FONT_SIZES, SPACING } from '../../constants';

const NotificationScreen: React.FC = () => {
  const { t, language } = useLanguage();
  const [refreshing, setRefreshing] = useState(false);

  const isRTL = language === 'ar';

  const notifications = [
    {
      id: '1',
      title: 'Quiz Invitation',
      titleAr: 'دعوة للاختبار',
      message: 'You have been invited to participate in a Mathematics quiz',
      messageAr: 'تم دعوتك للمشاركة في اختبار الرياضيات',
      type: 'quiz_invite',
      isRead: false,
      time: '2 hours ago',
      timeAr: 'منذ ساعتين',
    },
    {
      id: '2',
      title: 'Challenge Invitation',
      titleAr: 'دعوة للتحدي',
      message: 'New Science challenge is available for you',
      messageAr: 'تحدي علوم جديد متاح لك',
      type: 'challenge_invite',
      isRead: false,
      time: '5 hours ago',
      timeAr: 'منذ 5 ساعات',
    },
    {
      id: '3',
      title: 'Coins Purchased',
      titleAr: 'تم شراء العملات',
      message: 'Your coin purchase was successful. 100 coins added to your account',
      messageAr: 'تم شراء العملات بنجاح. تم إضافة 100 عملة إلى حسابك',
      type: 'general',
      isRead: true,
      time: '1 day ago',
      timeAr: 'منذ يوم',
    },
    {
      id: '4',
      title: 'New Feature Available',
      titleAr: 'ميزة جديدة متاحة',
      message: 'PDF Editor is now available. Create and edit PDFs with ease',
      messageAr: 'محرر PDF متاح الآن. أنشئ وعدل ملفات PDF بسهولة',
      type: 'general',
      isRead: true,
      time: '2 days ago',
      timeAr: 'منذ يومين',
    },
    {
      id: '5',
      title: 'Quiz Completed',
      titleAr: 'تم إكمال الاختبار',
      message: 'You have successfully completed the English Grammar quiz',
      messageAr: 'لقد أكملت اختبار قواعد اللغة الإنجليزية بنجاح',
      type: 'general',
      isRead: true,
      time: '3 days ago',
      timeAr: 'منذ 3 أيام',
    },
  ];

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // Simulate refresh
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'quiz_invite':
        return 'quiz';
      case 'challenge_invite':
        return 'games';
      case 'general':
      default:
        return 'notifications';
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'quiz_invite':
        return COLORS.primary;
      case 'challenge_invite':
        return COLORS.secondary;
      case 'general':
      default:
        return COLORS.textSecondary;
    }
  };

  const renderNotification = (notification: any) => (
    <TouchableOpacity
      key={notification.id}
      style={[
        styles.notificationCard,
        !notification.isRead && styles.unreadNotification,
      ]}
    >
      <View style={styles.notificationIcon}>
        <Icon
          name={getNotificationIcon(notification.type)}
          size={24}
          color={getNotificationColor(notification.type)}
        />
      </View>
      <View style={styles.notificationContent}>
        <Text style={[
          styles.notificationTitle,
          !notification.isRead && styles.unreadText,
        ]}>
          {isRTL ? notification.titleAr : notification.title}
        </Text>
        <Text style={styles.notificationMessage}>
          {isRTL ? notification.messageAr : notification.message}
        </Text>
        <Text style={styles.notificationTime}>
          {isRTL ? notification.timeAr : notification.time}
        </Text>
      </View>
      {!notification.isRead && <View style={styles.unreadDot} />}
    </TouchableOpacity>
  );

  const unreadCount = notifications.filter(n => !n.isRead).length;

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
            <Text style={styles.title}>{t('notifications.title')}</Text>
            {unreadCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{unreadCount}</Text>
              </View>
            )}
          </View>
          <Text style={styles.subtitle}>
            {unreadCount > 0 
              ? `${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}`
              : 'All caught up!'
            }
          </Text>
        </View>

        {/* Notifications List */}
        <View style={styles.content}>
          {notifications.length > 0 ? (
            notifications.map(renderNotification)
          ) : (
            <View style={styles.emptyState}>
              <Icon name="notifications-none" size={64} color={COLORS.textSecondary} />
              <Text style={styles.emptyTitle}>{t('notifications.noNotifications')}</Text>
              <Text style={styles.emptyMessage}>
                You're all caught up! New notifications will appear here.
              </Text>
            </View>
          )}
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <Text style={styles.quickActionsTitle}>Quick Actions</Text>
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.actionButton}>
              <Icon name="quiz" size={24} color={COLORS.primary} />
              <Text style={styles.actionButtonText}>{t('notifications.inviteQuiz')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Icon name="games" size={24} color={COLORS.secondary} />
              <Text style={styles.actionButtonText}>{t('notifications.inviteChallenge')}</Text>
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
    alignItems: 'center',
    marginBottom: 4,
  },
  title: {
    fontSize: FONT_SIZES.xxxl,
    fontWeight: 'bold',
    color: 'white',
  },
  badge: {
    backgroundColor: COLORS.error,
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginLeft: SPACING.sm,
  },
  badgeText: {
    fontSize: FONT_SIZES.xs,
    color: 'white',
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: FONT_SIZES.md,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  content: {
    padding: SPACING.lg,
  },
  notificationCard: {
    backgroundColor: COLORS.surface,
    padding: SPACING.md,
    borderRadius: 12,
    marginBottom: SPACING.sm,
    flexDirection: 'row',
    alignItems: 'flex-start',
    shadowColor: COLORS.shadow,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  unreadNotification: {
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },
  notificationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  unreadText: {
    fontWeight: 'bold',
  },
  notificationMessage: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    lineHeight: 20,
    marginBottom: 4,
  },
  notificationTime: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textSecondary,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
    marginTop: 4,
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
  },
  quickActions: {
    padding: SPACING.lg,
    backgroundColor: COLORS.surface,
    margin: SPACING.lg,
    borderRadius: 12,
  },
  quickActionsTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.md,
    marginHorizontal: 4,
    backgroundColor: COLORS.background,
    borderRadius: 8,
  },
  actionButtonText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.text,
    marginLeft: SPACING.sm,
    fontWeight: '500',
  },
});

export default NotificationScreen;
