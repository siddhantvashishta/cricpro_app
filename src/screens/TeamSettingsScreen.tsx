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
  Modal,
  ActivityIndicator,
  Share,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, Bell, ShieldAlert, Download, Share2, LogOut, ChevronRight, Unlock, AlertTriangle } from 'lucide-react-native';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import * as Clipboard from 'expo-clipboard';
import { Colors } from '../constants/Colors';
import { useTeamStore, PlayerRole, Player } from '../store/useTeamStore';
import TransferOwnershipModal from '../components/TransferOwnershipModal';

const SettingRow = ({ 
  icon, 
  title, 
  subtitle, 
  value, 
  onToggle, 
  onPress,
  danger 
}: { 
  icon: React.ReactNode, 
  title: string, 
  subtitle?: string, 
  value?: boolean, 
  onToggle?: (val: boolean) => void,
  onPress?: () => void,
  danger?: boolean 
}) => (
  <Pressable 
    style={({ pressed }) => [styles.settingRow, onPress && pressed && { opacity: 0.7 }]} 
    onPress={onPress}
    disabled={!onPress && !onToggle}
  >
    <View style={[styles.iconBox, danger && { backgroundColor: '#FFF0F0' }]}>
      {icon}
    </View>
    <View style={styles.settingInfo}>
      <Text style={[styles.settingTitle, danger && { color: '#E53935' }]}>{title}</Text>
      {subtitle && <Text style={styles.settingSub}>{subtitle}</Text>}
    </View>
    {onToggle !== undefined ? (
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{ false: '#E2E8F0', true: Colors.maroon }}
        thumbColor={Platform.OS === 'ios' ? '#FFFFFF' : value ? Colors.peach : '#F1F5F9'}
        ios_backgroundColor="#E2E8F0"
      />
    ) : onPress ? (
      <ChevronRight color={Colors.textSecondary} size={20} />
    ) : null}
  </Pressable>
);

const TeamSettingsScreen = ({ navigation }: any) => {
  const insets = useSafeAreaInsets();
  const { teams, players } = useTeamStore();
  const team = teams[0]; // Assuming user's primary team context for global settings

  // Dummy settings state
  const [allowJoinRequests, setAllowJoinRequests] = useState(true);
  const [publicProfile, setPublicProfile] = useState(true);
  const [matchAlerts, setMatchAlerts] = useState(true);

  // Feature states
  const [isExporting, setIsExporting] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);

  const handleShareLink = async () => {
    const inviteLink = `cricpro.app/t/${team?.id || 'demo'}`;
    await Clipboard.setStringAsync(inviteLink);
    try {
      await Share.share({
        message: `Join my cricket team "${team?.name}" on CricPro! Click here to request roster access: ${inviteLink}`,
      });
    } catch (error) {
      console.error(error);
      Alert.alert('Share Failed', 'Unable to share the join link.');
    }
  };

  const handleExport = async () => {
    if (!team) return;
    setIsExporting(true);

    try {
      const rosterPlayers = team.roster.map(id => players[id]).filter(Boolean);
      
      const roleGroups: Record<PlayerRole, typeof rosterPlayers> = {
        BAT: rosterPlayers.filter(p => p.role === 'BAT'),
        BWL: rosterPlayers.filter(p => p.role === 'BWL'),
        AR: rosterPlayers.filter(p => p.role === 'AR'),
        WK: rosterPlayers.filter(p => p.role === 'WK'),
      };

      const roleLabels: Record<PlayerRole, string> = {
        BAT: 'Batsmen', BWL: 'Bowlers', AR: 'All-Rounders', WK: 'Wicket-Keepers'
      };

      let htmlRows = '';
      (['BAT', 'BWL', 'AR', 'WK'] as PlayerRole[]).forEach(role => {
        if (roleGroups[role].length > 0) {
          htmlRows += `<tr><td colspan="2" class="role-header">${roleLabels[role]}</td></tr>`;
          roleGroups[role].forEach(p => {
            htmlRows += `
              <tr>
                <td><strong>${p.name}</strong></td>
                <td>${p.username || 'No linked account'}</td>
              </tr>
            `;
          });
        }
      });

      const htmlContent = `
        <html>
          <head>
            <style>
              body { font-family: 'Helvetica', sans-serif; padding: 40px; color: #333; position: relative; }
              .watermark {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%) rotate(-45deg);
                font-size: 100px;
                color: rgba(0, 0, 0, 0.03);
                white-space: nowrap;
                z-index: -1;
                pointer-events: none;
              }
              .header { text-align: center; border-bottom: 2px solid ${team.themeColor}; padding-bottom: 20px; margin-bottom: 30px; }
              .title { font-size: 32px; font-weight: bold; margin: 0; color: ${team.themeColor}; }
              .subtitle { font-size: 16px; color: #666; margin-top: 10px; }
              table { width: 100%; border-collapse: collapse; margin-top: 20px; }
              th, td { border: 1px solid #E2E8F0; padding: 12px; text-align: left; }
              th { background-color: #F8FAFC; color: #475569; font-weight: bold; }
              .role-header { background-color: ${Colors.peach}; color: ${Colors.maroon}; font-weight: bold; font-size: 14px; text-transform: uppercase; }
              .footer { margin-top: 40px; text-align: center; font-size: 12px; color: #94A3B8; }
            </style>
          </head>
          <body>
            <div class="watermark">${team.name.toUpperCase()}</div>
            <div class="header">
              <div class="title">${team.name}</div>
              <div class="subtitle">Official Team Roster (${rosterPlayers.length}/15 Players)</div>
            </div>
            <table>
              <thead>
                <tr>
                  <th>Player Name</th>
                  <th>CricPro Username</th>
                </tr>
              </thead>
              <tbody>
                ${htmlRows || '<tr><td colspan="2" style="text-align: center;">No players in roster</td></tr>'}
              </tbody>
            </table>
            <div class="footer">Generated via CricPro App on ${new Date().toLocaleDateString()}</div>
          </body>
        </html>
      `;

      const { uri } = await Print.printToFileAsync({ html: htmlContent });
      await Sharing.shareAsync(uri, { UTI: 'com.adobe.pdf', mimeType: 'application/pdf' });
      
    } catch (error) {
      Alert.alert('Export Failed', 'An error occurred while generating the PDF.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleConfirmTransfer = (newOwner: Player) => {
    setShowTransferModal(false);
    Alert.alert('Ownership Transferred', `You successfully handed over ${team?.name} admin rights to ${newOwner.name}.`);
    navigation.goBack();
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" translucent />

      {/* Header */}
      <View style={styles.header}>
        <Pressable
          style={({ pressed }) => [styles.iconBtn, pressed ? { opacity: 0.6 } : null]}
          onPress={() => navigation.goBack()}
        >
          <ArrowLeft color={Colors.text} size={22} />
        </Pressable>
        <Text style={styles.headerTitle}>Team Settings</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        
        {/* Section: Notifications */}
        <Text style={styles.sectionTitle}>NOTIFICATIONS</Text>
        <View style={styles.card}>
          <SettingRow 
            icon={<Bell color={Colors.maroon} size={20} />}
            title="Join Requests"
            subtitle="Get notified when someone asks to join your squad"
            value={allowJoinRequests}
            onToggle={setAllowJoinRequests}
          />
          <View style={styles.divider} />
          <SettingRow 
            icon={<ShieldAlert color={Colors.maroon} size={20} />}
            title="Match Alerts"
            subtitle="Important updates and scheduling reminders"
            value={matchAlerts}
            onToggle={setMatchAlerts}
          />
        </View>

        {/* Section: Privacy */}
        <Text style={styles.sectionTitle}>PRIVACY & DISCOVERABILITY</Text>
        <View style={styles.card}>
          <SettingRow 
            icon={<Unlock color={Colors.maroon} size={20} />}
            title="Public Team Profile"
            subtitle="Allow other captains to find your team for challenges"
            value={publicProfile}
            onToggle={setPublicProfile}
          />
          <View style={styles.divider} />
          <SettingRow 
            icon={<Share2 color={Colors.maroon} size={20} />}
            title="Share Default Link"
            subtitle="Generate a persistent invite link"
            onPress={handleShareLink}
          />
        </View>

        {/* Section: Data & Management */}
        <Text style={styles.sectionTitle}>DATA & MANAGEMENT</Text>
        <View style={styles.card}>
          <SettingRow 
            icon={isExporting ? <ActivityIndicator size="small" color={Colors.text} /> : <Download color={Colors.text} size={20} />}
            title="Export Roster Data"
            subtitle="Download PDF team sheet"
            onPress={isExporting ? undefined : handleExport}
          />
          <View style={styles.divider} />
          <SettingRow 
            icon={<LogOut color="#E53935" size={20} />}
            title="Transfer Ownership"
            subtitle="Hand over admin rights"
            onPress={() => setShowTransferModal(true)}
            danger={true}
          />
        </View>

        <Text style={styles.versionText}>CricPro v2.1.0 · Build 402</Text>

      </ScrollView>

      {/* Transfer Ownership Component */}
      <TransferOwnershipModal 
        isVisible={showTransferModal}
        onClose={() => setShowTransferModal(false)}
        teamId={team?.id || 'demo'}
        teamName={team?.name || 'Your Team'}
        onConfirmTransfer={handleConfirmTransfer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 10, backgroundColor: Colors.white, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  iconBtn: { width: 44, height: 44, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { flex: 1, fontSize: 18, fontWeight: '900', color: Colors.text, textAlign: 'center' },
  headerRight: { width: 44 }, // balance header
  body: { padding: 16, paddingBottom: 40 },
  
  sectionTitle: { fontSize: 11, fontWeight: '800', color: Colors.textSecondary, letterSpacing: 1, marginBottom: 8, marginLeft: 8, marginTop: 16 },
  card: { backgroundColor: Colors.white, borderRadius: 20, overflow: 'hidden', borderWidth: 1, borderColor: '#F1F5F9' },
  settingRow: { flexDirection: 'row', alignItems: 'center', padding: 16, gap: 14 },
  iconBox: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#FFF0F0', justifyContent: 'center', alignItems: 'center' },
  settingInfo: { flex: 1, gap: 2 },
  settingTitle: { fontSize: 15, fontWeight: '800', color: Colors.text },
  settingSub: { fontSize: 12, color: Colors.textSecondary, fontWeight: '500' },
  divider: { height: 1, backgroundColor: '#F1F5F9', marginLeft: 70 },
  
  versionText: { fontSize: 12, color: '#CBD5E0', textAlign: 'center', marginTop: 40, fontWeight: '600' },
});

export default TeamSettingsScreen;
