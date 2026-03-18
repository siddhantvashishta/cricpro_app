import * as React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Pressable, 
  Image, 
  Dimensions, 
  SafeAreaView,
  Share,
  Linking
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { 
  ChevronRight, 
  ShoppingBag, 
  Network, 
  Users, 
  Phone, 
  Share2, 
  Star, 
  Instagram, 
  Youtube, 
  Facebook, 
  Info, 
  BookOpen, 
  HelpCircle, 
  ShieldCheck, 
  FileText, 
  CreditCard,
  LogOut,
  LogIn,
  UserCircle
} from 'lucide-react-native';
import { Colors } from '../constants/Colors';
import { useAuthStore } from '../store/useAuthStore';
import { useProStore } from '../store/useProStore';

const { width } = Dimensions.get('window');

const MoreScreen = ({ navigation }: any) => {
  const insets = useSafeAreaInsets();
  const { userProfile, isAuthenticated, logout } = useAuthStore();
  const { isPro } = useProStore();

  const handleShare = async () => {
    try {
      await Share.share({
        message: 'Download CricPro - The Cricket Super App! Get live scores, stats, and connect with the cricket community. https://cricpro.app',
      });
    } catch (error) {
      console.log(error);
    }
  };

  const MenuItem = ({ icon: Icon, label, onPress, color = Colors.text }: any) => (
    <Pressable 
      style={({ pressed }) => [styles.menuItem, pressed && styles.menuItemPressed]} 
      onPress={onPress}
    >
      <View style={styles.menuItemLeft}>
        <View style={styles.iconContainer}>
          <Icon color={color} size={22} strokeWidth={1.5} />
        </View>
        <Text style={[styles.menuLabel, { color }]}>{label}</Text>
      </View>
      <ChevronRight color="#CBD5E1" size={20} />
    </Pressable>
  );

  const SectionHeader = ({ title }: { title: string }) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Profile Header */}
      <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
        <View style={styles.headerInfo}>
          <Image 
             source={require('../../assets/main_logo.png')} 
             style={styles.headerLogo} 
             resizeMode="contain"
          />
          <View style={styles.userMeta}>
            <Text style={styles.greetingText}>Welcome back,</Text>
            <Text style={styles.userName}>{isAuthenticated ? userProfile?.fullName : 'Guest User'}</Text>
            <Pressable onPress={() => navigation.navigate('PlayerProfile')}>
              <Text style={styles.viewProfile}>View Profile</Text>
            </Pressable>
          </View>
        </View>
        
        {isPro && (
          <View style={styles.proBadge}>
            <Text style={styles.proBadgeText}>PRO MEMBER</Text>
          </View>
        )}
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        <SectionHeader title="CRICPRO ECOSYSTEM" />
        <MenuItem icon={ShoppingBag} label="Cricpro Store" onPress={() => navigation.navigate('Store')} />
        <MenuItem icon={Network} label="Associations" onPress={() => navigation.navigate('Associations')} />
        <MenuItem icon={Users} label="Clubs" onPress={() => navigation.navigate('Clubs')} />
        <MenuItem icon={Phone} label="Contact & Support" onPress={() => navigation.navigate('ContactSupport')} />

        <SectionHeader title="COMMUNITY & GROWTH" />
        <MenuItem icon={Share2} label="Share the App" onPress={handleShare} />
        <MenuItem icon={Star} label="Rate Us" onPress={() => Linking.openURL('https://cricpro.app/rate')} />
        <MenuItem icon={Instagram} label="Instagram" onPress={() => Linking.openURL('https://instagram.com/cricpro')} />
        <MenuItem icon={Youtube} label="YouTube" onPress={() => Linking.openURL('https://youtube.com/cricpro')} />
        <MenuItem icon={Facebook} label="Facebook" onPress={() => Linking.openURL('https://facebook.com/cricpro')} />

        <SectionHeader title="SUPPORT & LEGAL" />
        <MenuItem icon={Info} label="What's New" onPress={() => {}} />
        <MenuItem icon={BookOpen} label="Blog" onPress={() => {}} />
        <MenuItem icon={HelpCircle} label="Help / FAQs" onPress={() => navigation.navigate('ContactSupport')} />
        <MenuItem icon={ShieldCheck} label="Privacy Policy" onPress={() => navigation.navigate('Legal', { title: 'Privacy Policy', type: 'privacy' })} />
        <MenuItem icon={FileText} label="Terms of Service" onPress={() => navigation.navigate('Legal', { title: 'Terms of Service', type: 'terms' })} />
        <MenuItem icon={CreditCard} label="Paid Service Terms" onPress={() => navigation.navigate('Legal', { title: 'Paid Service Terms', type: 'terms' })} />

        <View style={styles.authSection}>
          {isAuthenticated ? (
            <Pressable style={styles.logoutBtn} onPress={logout}>
              <LogOut color="#EF4444" size={20} />
              <Text style={styles.logoutText}>Logout</Text>
            </Pressable>
          ) : (
            <Pressable style={styles.loginBtn} onPress={() => navigation.navigate('Login')}>
              <LogIn color={Colors.white} size={20} />
              <Text style={styles.loginText}>Login</Text>
            </Pressable>
          )}
        </View>

        <Text style={styles.versionText}>Version 2.4.1 (Build 108)</Text>
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: { 
    backgroundColor: Colors.maroon, 
    paddingHorizontal: 12, 
    paddingBottom: 30,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 15,
    elevation: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  headerInfo: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  headerLogo: { width: 54, height: 54, tintColor: '#FFFFFF', marginLeft: -4 },
  userMeta: { gap: 0, justifyContent: 'center', height: 54 },
  greetingText: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: -2,
  },
  userName: { fontSize: 18, fontWeight: '900', color: Colors.white },
  viewProfile: { fontSize: 13, fontWeight: '700', color: 'rgba(255, 255, 255, 0.8)' },
  proBadge: { 
    backgroundColor: 'rgba(255, 215, 0, 0.2)', 
    paddingHorizontal: 12, 
    paddingVertical: 6, 
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FFD700'
  },
  proBadgeText: { fontSize: 10, fontWeight: '900', color: '#FFD700' },

  scrollContent: { paddingHorizontal: 16, paddingTop: 16 },
  sectionHeader: { marginTop: 24, marginBottom: 8, paddingHorizontal: 12 },
  sectionTitle: { fontSize: 12, fontWeight: '800', color: '#94A3B8', letterSpacing: 1.2 },
  
  menuItem: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    backgroundColor: Colors.white, 
    padding: 16, 
    borderRadius: 16, 
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#F1F5F9'
  },
  menuItemPressed: { backgroundColor: '#F8FAFC' },
  menuItemLeft: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  iconContainer: { width: 36, height: 36, borderRadius: 10, backgroundColor: '#F1F5F9', justifyContent: 'center', alignItems: 'center' },
  menuLabel: { fontSize: 15, fontWeight: '700', color: '#334155' },

  authSection: { marginTop: 32, paddingHorizontal: 8 },
  logoutBtn: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    gap: 10, 
    paddingVertical: 16, 
    backgroundColor: '#FEF2F2', 
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#FEE2E2'
  },
  logoutText: { fontSize: 16, fontWeight: '800', color: '#EF4444' },
  loginBtn: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    gap: 10, 
    paddingVertical: 16, 
    backgroundColor: Colors.maroon, 
    borderRadius: 16,
    shadowColor: Colors.maroon,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6
  },
  loginText: { fontSize: 16, fontWeight: '800', color: Colors.white },

  versionText: { textAlign: 'center', fontSize: 11, color: '#94A3B8', marginTop: 24, fontWeight: '600' },
});

export default MoreScreen;
