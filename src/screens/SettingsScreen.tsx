import * as React from 'react';
import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Switch,
  StatusBar,
  Platform,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  User,
  Phone,
  Lock,
  Link as LinkIcon,
  ChevronRight,
  Zap,
  Bell,
  MessageSquare,
  Globe,
  Moon,
  Ruler,
  HelpCircle,
  Bug,
  Star,
  RefreshCcw,
  LogOut,
  Trash2,
  Eye,
  BarChart2,
  MapPin,
  Activity,
  Award,
  Layers,
  Thermometer,
} from 'lucide-react-native';
import { Colors } from '../constants/Colors';
import { useAuthStore } from '../store/useAuthStore';
import { useProStore } from '../store/useProStore';

const SettingsSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    <View style={styles.sectionContent}>{children}</View>
  </View>
);

const SettingsItem = ({
  icon: Icon,
  label,
  value,
  onPress,
  isSwitch,
  switchValue,
  onSwitchChange,
  showArrow = true,
  danger,
  iconBg = '#F5F5F5',
  iconColor = '#616161',
  isPro,
}: any) => (
  <Pressable
    style={({ pressed }) => [styles.item, pressed && !isSwitch ? { backgroundColor: '#F9F9F9' } : null]}
    onPress={isSwitch ? undefined : onPress}
  >
    <View style={styles.itemLeft}>
      <View style={[styles.iconContainer, { backgroundColor: iconBg }]}>
        <Icon size={18} color={danger ? '#D32F2F' : iconColor} />
      </View>
      <Text style={[styles.itemLabel, danger ? styles.dangerText : null]}>{label}</Text>
    </View>
    <View style={styles.itemRight}>
      {value && <Text style={styles.itemValue}>{value}</Text>}
      {isPro && (
        <View style={styles.proBadge}>
          <Text style={styles.proBadgeText}>PRO</Text>
        </View>
      )}
      {isSwitch ? (
        <Switch
          value={switchValue}
          onValueChange={onSwitchChange}
          trackColor={{ false: '#D1D1D1', true: Colors.maroon }}
          thumbColor={Platform.OS === 'ios' ? undefined : '#FFFFFF'}
        />
      ) : (
        showArrow && <ChevronRight size={18} color="#BDBDBD" />
      )}
    </View>
  </Pressable>
);

const SettingsScreen = ({ navigation }: any) => {
  const insets = useSafeAreaInsets();
  const { logout } = useAuthStore();
  const { isPro, planLabel } = useProStore();
  
  // States for toggles
  const [availability, setAvailability] = useState(true);
  const [showStats, setShowStats] = useState(true);
  const [showLocation, setShowLocation] = useState(false);
  const [pushEnabled, setPushEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const handleLogout = () => {
    Alert.alert('Log Out', 'Are you sure you want to log out of CricPro?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Log Out', style: 'destructive', onPress: () => {
          logout();
          navigation.replace('Login');
        } 
      },
    ]);
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'This will permanently delete your data. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => console.log('Deleted') },
      ]
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ArrowLeft color="#001F3F" size={24} />
        </Pressable>
        <Text style={styles.headerTitle}>Settings</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        <SettingsSection title="ACCOUNT">
          <SettingsItem 
            icon={User} 
            label="Edit Profile" 
            onPress={() => navigation.navigate('EditProfile')} 
            iconBg="#FFEBEE" iconColor="#D32F2F"
          />
          <SettingsItem 
            icon={Phone} 
            label="Change Phone Number" 
            onPress={() => {}} 
            iconBg="#FFF3E0" iconColor="#E65100"
          />
          <SettingsItem 
            icon={Lock} 
            label="Change Password" 
            onPress={() => {}} 
            iconBg="#F3E5F5" iconColor="#7B1FA2"
          />
          <SettingsItem 
            icon={LinkIcon} 
            label="Linked Accounts" 
            onPress={() => {}} 
            iconBg="#EFEBE9" iconColor="#5D4037"
          />
        </SettingsSection>

        <SettingsSection title="CRICKET PROFILE">
          <SettingsItem 
            icon={Activity} label="Playing Role" value="All-rounder" 
            iconBg="#E8F5E9" iconColor="#2E7D32" showArrow={false}
          />
          <SettingsItem 
            icon={Layers} label="Batting Style" value="Right Hand" 
            iconBg="#E1F5FE" iconColor="#0288D1" showArrow={false}
          />
          <SettingsItem 
            icon={Award} label="Bowling Style" value="Leg Spin" 
            iconBg="#FFFDE7" iconColor="#FBC02D" showArrow={false}
          />
          <SettingsItem 
            icon={BarChart2} label="Experience Level" value="Advanced" 
            iconBg="#F1F8E9" iconColor="#558B2F" showArrow={false}
          />
          <SettingsItem 
            icon={Bell} label="Availability Status" 
            isSwitch switchValue={availability} onSwitchChange={setAvailability}
            iconBg="#ECEFF1" iconColor="#455A64"
          />
        </SettingsSection>

        <SettingsSection title="PRIVACY">
          <SettingsItem 
            icon={Eye} label="Profile Visibility" value="Public" 
            iconBg="#E0F2F1" iconColor="#00796B"
          />
          <SettingsItem 
            icon={BarChart2} label="Show Stats Publicly" 
            isSwitch switchValue={showStats} onSwitchChange={setShowStats}
            iconBg="#FCE4EC" iconColor="#C2185B"
          />
          <SettingsItem 
            icon={MapPin} label="Show Location" 
            isSwitch switchValue={showLocation} onSwitchChange={setShowLocation}
            iconBg="#F5F5F5" iconColor="#616161"
          />
        </SettingsSection>

        <SettingsSection title="NOTIFICATIONS">
          <SettingsItem 
            icon={Bell} label="Push Notifications" 
            isSwitch switchValue={pushEnabled} onSwitchChange={setPushEnabled}
            iconBg="#FFF8E1" iconColor="#FFA000"
          />
          <SettingsItem 
            icon={Activity} label="Score Alerts" 
            iconBg="#E0F7FA" iconColor="#00ACC1"
          />
          <SettingsItem 
            icon={User} label="Recruitment Alerts" 
            iconBg="#F3E5F5" iconColor="#8E24AA"
          />
        </SettingsSection>

        <SettingsSection title="APP SETTINGS">
          <SettingsItem 
            icon={Globe} label="Language" value="English (US)" 
            iconBg="#E8EAF6" iconColor="#3F51B5"
          />
          <SettingsItem 
            icon={Moon} label="Dark Mode" 
            isSwitch switchValue={darkMode} onSwitchChange={setDarkMode}
            iconBg="#FAFAFA" iconColor="#212121"
          />
          <SettingsItem 
            icon={Ruler} label="Units" value="Kilometers" 
            iconBg="#FFF9C4" iconColor="#F9A825"
          />
        </SettingsSection>

        <SettingsSection title="SUBSCRIPTION">
          <SettingsItem 
            icon={MessageSquare} label="Current Plan" value={isPro ? planLabel : 'FREE'} 
            iconBg="#EFEBE9" iconColor="#795548" showArrow={false}
            isPro={isPro}
          />
          <SettingsItem 
            icon={Zap} label="Upgrade to Pro" 
            onPress={() => navigation.navigate('Subscription')}
            iconBg="#FFF8E1" iconColor="#D84315"
          />
        </SettingsSection>

        <SettingsSection title="SUPPORT">
          <SettingsItem icon={HelpCircle} label="Help Centre" iconBg="#E8F5E9" iconColor="#2E7D32" />
          <SettingsItem icon={Bug} label="Report a Bug" iconBg="#FFEBEE" iconColor="#C62828" />
          <SettingsItem icon={Star} label="Rate App" iconBg="#FFFDE7" iconColor="#FBC02D" />
        </SettingsSection>

        <SettingsSection title="DANGER ZONE">
          <SettingsItem 
            icon={RefreshCcw} label="Clear Cache" value="42.5 MB" 
            iconBg="#F5F5F5" iconColor="#616161" showArrow={false}
          />
          <SettingsItem 
            icon={LogOut} label="Log Out" danger 
            onPress={handleLogout} 
            iconBg="#FFEBEE" iconColor="#D32F2F" showArrow={false}
          />
          <SettingsItem 
            icon={Trash2} label="Delete Account" danger 
            onPress={handleDeleteAccount} 
            iconBg="#FFEBEE" iconColor="#D32F2F" showArrow={false}
          />
        </SettingsSection>
        
        <View style={styles.footer}>
          <Text style={styles.versionText}>CricPro v1.0.0</Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    height: 60,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  backBtn: {
    padding: 8,
    marginLeft: -8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#001F3F',
    marginLeft: 8,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  section: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '900',
    color: '#546E7A',
    marginLeft: 20,
    marginBottom: 8,
    letterSpacing: 1,
  },
  sectionContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginHorizontal: 16,
    overflow: 'hidden',
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8 },
      android: { elevation: 2 },
    }),
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: '#263238',
    marginLeft: 14,
  },
  itemRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemValue: {
    fontSize: 14,
    color: '#90A4AE',
    marginRight: 8,
    fontWeight: '600',
  },
  dangerText: {
    color: '#D32F2F',
  },
  proBadge: {
    backgroundColor: '#FFD700',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginRight: 8,
  },
  proBadgeText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#000',
  },
  footer: {
    marginTop: 40,
    alignItems: 'center',
  },
  versionText: {
    fontSize: 12,
    color: '#B0BEC5',
    fontWeight: '600',
  },
});

export default SettingsScreen;
