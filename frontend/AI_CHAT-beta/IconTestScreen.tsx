import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Platform,
  StatusBar,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface IconTestScreenProps {
  navigation: any;
}

const IconTestScreen: React.FC<IconTestScreenProps> = ({ navigation }) => {
  const testIcons = [
    { name: 'home', color: '#10a37f' },
    { name: 'favorite', color: '#ff6b35' },
    { name: 'star', color: '#ffd700' },
    { name: 'settings', color: '#6366f1' },
    { name: 'notifications', color: '#8b5cf6' },
    { name: 'search', color: '#10a37f' },
    { name: 'menu', color: '#666' },
    { name: 'close', color: '#ff4444' },
    { name: 'check', color: '#00aa00' },
    { name: 'add', color: '#10a37f' },
    { name: 'remove', color: '#ff4444' },
    { name: 'edit', color: '#ffa500' },
  ];

  return (
    <LinearGradient colors={['#f7f7f8', '#ffffff']} style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      <SafeAreaView style={styles.safeArea}>
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
              activeOpacity={0.7}
            >
              <Icon name="arrow-back" size={24} color="#10a37f" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Icon Test</Text>
            <View style={styles.placeholder} />
          </View>

          {/* Test Icons */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Vector Icons Test</Text>
            <Text style={styles.description}>
              If you can see the icons below, vector icons are working correctly!
            </Text>
            
            <View style={styles.iconGrid}>
              {testIcons.map((icon, index) => (
                <View key={index} style={styles.iconItem}>
                  <Icon name={icon.name} size={32} color={icon.color} />
                  <Text style={styles.iconLabel}>{icon.name}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Different Icon Families */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Different Icon Families</Text>
            
            <View style={styles.familyContainer}>
              <Text style={styles.familyTitle}>Material Icons</Text>
              <View style={styles.familyIcons}>
                <Icon name="home" size={24} color="#10a37f" />
                <Icon name="favorite" size={24} color="#ff6b35" />
                <Icon name="star" size={24} color="#ffd700" />
                <Icon name="settings" size={24} color="#6366f1" />
              </View>
            </View>
          </View>

          {/* Troubleshooting Info */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Troubleshooting</Text>
            <View style={styles.troubleshootingContainer}>
              <Text style={styles.troubleshootingText}>
                If icons are not showing:
              </Text>
              <Text style={styles.troubleshootingItem}>
                • Make sure fonts are copied to android/app/src/main/assets/fonts/
              </Text>
              <Text style={styles.troubleshootingItem}>
                • Run: npx react-native run-android --reset-cache
              </Text>
              <Text style={styles.troubleshootingItem}>
                • For iOS: cd ios && pod install
              </Text>
              <Text style={styles.troubleshootingItem}>
                • Clean and rebuild the project
              </Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 20,
    paddingTop: Platform.OS === 'android' ? 20 : 40,
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#202123',
  },
  placeholder: {
    width: 40,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#202123',
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
    lineHeight: 20,
  },
  iconGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  iconItem: {
    alignItems: 'center',
    width: '22%',
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  iconLabel: {
    fontSize: 10,
    color: '#666',
    marginTop: 4,
    textAlign: 'center',
  },
  familyContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  familyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  familyIcons: {
    flexDirection: 'row',
    gap: 16,
  },
  troubleshootingContainer: {
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 12,
  },
  troubleshootingText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  troubleshootingItem: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
    lineHeight: 18,
  },
});

export default IconTestScreen;
