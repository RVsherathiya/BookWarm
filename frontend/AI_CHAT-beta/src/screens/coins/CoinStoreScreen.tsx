import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { COLORS, FONT_SIZES, SPACING, COIN_PACKAGES } from '../../constants';
import { Button, Card } from '../../components';

const CoinStoreScreen: React.FC = () => {
  const { t, language } = useLanguage();
  const { user, updateCoins } = useAuth();
  const [selectedPackage, setSelectedPackage] = useState<string>('');

  const isRTL = language === 'ar';

  const handlePurchase = async (packageId: string) => {
    const packageData = COIN_PACKAGES.find(pkg => pkg.id === packageId);
    if (!packageData) return;

    Alert.alert(
      'Confirm Purchase',
      `Are you sure you want to purchase ${packageData.name} for ${packageData.price} ${packageData.currency}?`,
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: 'Purchase',
          onPress: async () => {
            try {
              // Simulate purchase process
              await new Promise(resolve => setTimeout(resolve, 1000));
              
              // Update user's coins
              const newCoins = (user?.coins || 0) + packageData.coins;
              await updateCoins(newCoins);
              
              Alert.alert(t('common.success'), t('coins.purchaseSuccess'));
              setSelectedPackage('');
            } catch (error) {
              Alert.alert(t('common.error'), 'Purchase failed. Please try again.');
            }
          },
        },
      ]
    );
  };

  const renderPackageCard = (pkg: any) => (
    <Card
      key={pkg.id}
      style={[
        styles.packageCard,
        selectedPackage === pkg.id && styles.packageCardSelected,
      ]}
    >
      <TouchableOpacity
        onPress={() => setSelectedPackage(pkg.id)}
        style={styles.packageContent}
      >
        <View style={styles.packageHeader}>
          <View style={styles.packageIcon}>
            <Icon name="monetization-on" size={32} color={COLORS.warning} />
          </View>
          <View style={styles.packageInfo}>
            <Text style={styles.packageName}>{pkg.name}</Text>
            <Text style={styles.packageDescription}>{pkg.description}</Text>
          </View>
          {selectedPackage === pkg.id && (
            <Icon name="check-circle" size={24} color={COLORS.primary} />
          )}
        </View>

        <View style={styles.packageDetails}>
          <View style={styles.coinAmount}>
            <Icon name="monetization-on" size={20} color={COLORS.warning} />
            <Text style={styles.coinText}>{pkg.coins} coins</Text>
          </View>
          <View style={styles.priceContainer}>
            <Text style={styles.priceText}>{pkg.price} {pkg.currency}</Text>
          </View>
        </View>

        <View style={styles.packageFeatures}>
          <View style={styles.featureItem}>
            <Icon name="check" size={16} color={COLORS.success} />
            <Text style={styles.featureText}>Instant delivery</Text>
          </View>
          <View style={styles.featureItem}>
            <Icon name="check" size={16} color={COLORS.success} />
            <Text style={styles.featureText}>No expiration</Text>
          </View>
          <View style={styles.featureItem}>
            <Icon name="check" size={16} color={COLORS.success} />
            <Text style={styles.featureText}>Use for all services</Text>
          </View>
        </View>
      </TouchableOpacity>
    </Card>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => {/* Navigate back */}}>
          <Icon name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.title}>{t('coins.buyCoins')}</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Current Balance */}
        <Card style={styles.balanceCard}>
          <View style={styles.balanceHeader}>
            <Icon name="account-balance-wallet" size={24} color={COLORS.primary} />
            <Text style={styles.balanceTitle}>{t('coins.myCoins')}</Text>
          </View>
          <Text style={styles.balanceAmount}>{user?.coins || 0}</Text>
          <Text style={styles.balanceSubtext}>Available coins</Text>
        </Card>

        {/* Package Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('coins.coinPackages')}</Text>
          <Text style={styles.sectionDescription}>
            Choose a coin package that suits your needs. All packages include instant delivery and no expiration.
          </Text>
        </View>

        <View style={styles.packagesContainer}>
          {COIN_PACKAGES.map(renderPackageCard)}
        </View>

        {/* Payment Methods */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Methods</Text>
          <View style={styles.paymentMethods}>
            <View style={styles.paymentMethod}>
              <Icon name="credit-card" size={24} color={COLORS.primary} />
              <Text style={styles.paymentText}>Credit/Debit Card</Text>
            </View>
            <View style={styles.paymentMethod}>
              <Icon name="account-balance" size={24} color={COLORS.secondary} />
              <Text style={styles.paymentText}>Bank Transfer</Text>
            </View>
            <View style={styles.paymentMethod}>
              <Icon name="smartphone" size={24} color={COLORS.success} />
              <Text style={styles.paymentText}>Mobile Payment</Text>
            </View>
          </View>
        </View>

        {/* Terms and Conditions */}
        <View style={styles.section}>
          <Text style={styles.termsText}>
            By purchasing coins, you agree to our Terms of Service and Privacy Policy. 
            Coins are non-refundable and cannot be transferred to other accounts.
          </Text>
        </View>
      </ScrollView>

      {/* Purchase Button */}
      {selectedPackage && (
        <View style={styles.purchaseFooter}>
          <Button
            title={`Purchase ${COIN_PACKAGES.find(pkg => pkg.id === selectedPackage)?.name}`}
            onPress={() => handlePurchase(selectedPackage)}
            style={styles.purchaseButton}
          />
        </View>
      )}
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
  balanceCard: {
    marginBottom: SPACING.lg,
    backgroundColor: COLORS.primary,
  },
  balanceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  balanceTitle: {
    fontSize: FONT_SIZES.md,
    color: 'white',
    marginLeft: SPACING.sm,
  },
  balanceAmount: {
    fontSize: FONT_SIZES.xxxl,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  balanceSubtext: {
    fontSize: FONT_SIZES.sm,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  section: {
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  sectionDescription: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  packagesContainer: {
    marginBottom: SPACING.lg,
  },
  packageCard: {
    marginBottom: SPACING.md,
    borderWidth: 2,
    borderColor: COLORS.border,
  },
  packageCardSelected: {
    borderColor: COLORS.primary,
    backgroundColor: 'rgba(0, 122, 255, 0.05)',
  },
  packageContent: {
    padding: SPACING.md,
  },
  packageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  packageIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 193, 7, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  packageInfo: {
    flex: 1,
  },
  packageName: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  packageDescription: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
  },
  packageDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  coinAmount: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  coinText: {
    fontSize: FONT_SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.warning,
    marginLeft: SPACING.sm,
  },
  priceContainer: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: 20,
  },
  priceText: {
    fontSize: FONT_SIZES.md,
    fontWeight: 'bold',
    color: 'white',
  },
  packageFeatures: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: SPACING.lg,
    marginBottom: SPACING.xs,
  },
  featureText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginLeft: 4,
  },
  paymentMethods: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  paymentMethod: {
    flex: 1,
    alignItems: 'center',
    padding: SPACING.md,
    backgroundColor: COLORS.surface,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  paymentText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.text,
    marginTop: SPACING.sm,
    textAlign: 'center',
  },
  termsText: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textSecondary,
    lineHeight: 16,
    textAlign: 'center',
  },
  purchaseFooter: {
    padding: SPACING.lg,
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  purchaseButton: {
    backgroundColor: COLORS.primary,
  },
});

export default CoinStoreScreen;
