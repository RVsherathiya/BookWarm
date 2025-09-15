import React, { useState, useEffect } from 'react';
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
import { Card } from '../../components';

const CoinHistoryScreen: React.FC = () => {
  const { t, language } = useLanguage();
  const [refreshing, setRefreshing] = useState(false);
  const [transactions, setTransactions] = useState<any[]>([]);

  const isRTL = language === 'ar';

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    // Mock transaction data - in real app, this would come from storage/API
    const mockTransactions = [
      {
        id: '1',
        type: 'purchase',
        amount: 100,
        description: 'Starter Pack Purchase',
        date: new Date('2024-01-15'),
        status: 'completed',
      },
      {
        id: '2',
        type: 'usage',
        amount: -10,
        description: 'Quiz Creation',
        date: new Date('2024-01-14'),
        status: 'completed',
      },
      {
        id: '3',
        type: 'usage',
        amount: -15,
        description: 'Challenge Creation',
        date: new Date('2024-01-13'),
        status: 'completed',
      },
      {
        id: '4',
        type: 'usage',
        amount: -20,
        description: 'Lesson Preparation',
        date: new Date('2024-01-12'),
        status: 'completed',
      },
      {
        id: '5',
        type: 'purchase',
        amount: 50,
        description: 'Teacher Pack Purchase',
        date: new Date('2024-01-10'),
        status: 'completed',
      },
    ];
    setTransactions(mockTransactions);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadTransactions();
    setRefreshing(false);
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'purchase':
        return 'add-circle';
      case 'usage':
        return 'remove-circle';
      case 'refund':
        return 'refresh';
      default:
        return 'help';
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'purchase':
        return COLORS.success;
      case 'usage':
        return COLORS.error;
      case 'refund':
        return COLORS.warning;
      default:
        return COLORS.textSecondary;
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString(isRTL ? 'ar-SA' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatAmount = (amount: number) => {
    return amount > 0 ? `+${amount}` : `${amount}`;
  };

  const renderTransaction = (transaction: any) => (
    <Card key={transaction.id} style={styles.transactionCard}>
      <View style={styles.transactionHeader}>
        <View style={styles.transactionIcon}>
          <Icon
            name={getTransactionIcon(transaction.type)}
            size={24}
            color={getTransactionColor(transaction.type)}
          />
        </View>
        <View style={styles.transactionInfo}>
          <Text style={styles.transactionDescription}>{transaction.description}</Text>
          <Text style={styles.transactionDate}>{formatDate(transaction.date)}</Text>
        </View>
        <View style={styles.transactionAmount}>
          <Text style={[
            styles.amountText,
            { color: transaction.amount > 0 ? COLORS.success : COLORS.error }
          ]}>
            {formatAmount(transaction.amount)}
          </Text>
          <Text style={styles.amountLabel}>coins</Text>
        </View>
      </View>
    </Card>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Icon name="history" size={64} color={COLORS.textSecondary} />
      <Text style={styles.emptyTitle}>No Transaction History</Text>
      <Text style={styles.emptyMessage}>
        Your coin transactions will appear here once you start using the app.
      </Text>
    </View>
  );

  const totalPurchased = transactions
    .filter(t => t.type === 'purchase')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalUsed = Math.abs(transactions
    .filter(t => t.type === 'usage')
    .reduce((sum, t) => sum + t.amount, 0));

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => {/* Navigate back */}}>
          <Icon name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Coin History</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Summary Cards */}
        <View style={styles.summaryContainer}>
          <Card style={styles.summaryCard}>
            <Icon name="trending-up" size={24} color={COLORS.success} />
            <Text style={styles.summaryTitle}>Total Purchased</Text>
            <Text style={styles.summaryAmount}>{totalPurchased}</Text>
            <Text style={styles.summaryLabel}>coins</Text>
          </Card>

          <Card style={styles.summaryCard}>
            <Icon name="trending-down" size={24} color={COLORS.error} />
            <Text style={styles.summaryTitle}>Total Used</Text>
            <Text style={styles.summaryAmount}>{totalUsed}</Text>
            <Text style={styles.summaryLabel}>coins</Text>
          </Card>
        </View>

        {/* Transaction List */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Transactions</Text>
          {transactions.length > 0 ? (
            transactions.map(renderTransaction)
          ) : (
            renderEmptyState()
          )}
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
  content: {
    flex: 1,
    padding: SPACING.lg,
  },
  summaryContainer: {
    flexDirection: 'row',
    marginBottom: SPACING.lg,
  },
  summaryCard: {
    flex: 1,
    alignItems: 'center',
    padding: SPACING.md,
    marginHorizontal: 4,
  },
  summaryTitle: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginTop: SPACING.sm,
    marginBottom: 4,
  },
  summaryAmount: {
    fontSize: FONT_SIZES.xl,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  summaryLabel: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textSecondary,
  },
  section: {
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  transactionCard: {
    marginBottom: SPACING.sm,
  },
  transactionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionDescription: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
    marginBottom: 2,
  },
  transactionDate: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
  },
  transactionAmount: {
    alignItems: 'flex-end',
  },
  amountText: {
    fontSize: FONT_SIZES.lg,
    fontWeight: 'bold',
  },
  amountLabel: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textSecondary,
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
});

export default CoinHistoryScreen;
