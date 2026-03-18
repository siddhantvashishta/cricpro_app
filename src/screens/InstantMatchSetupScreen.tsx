import * as React from 'react';
import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, Play, Shield, Hash, History, ChevronRight } from 'lucide-react-native';
import { Colors } from '../constants/Colors';

const InstantMatchSetupScreen = ({ navigation }: any) => {
  const insets = useSafeAreaInsets();
  const [teamA, setTeamA] = useState('');
  const [teamB, setTeamB] = useState('');
  const [overs, setOvers] = useState('5');

  const handleStartMatch = () => {
    if (!teamA || !teamB || !overs) {
      return;
    }
    navigation.navigate('InstantScoring', {
      teamA,
      teamB,
      overs: parseInt(overs),
    });
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <Pressable
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
        >
          <ArrowLeft color={Colors.maroon} size={24} />
        </Pressable>
        <Text style={styles.headerTitle}>Instant Match</Text>
        <View style={{ width: 40 }} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.introCard}>
            <Text style={styles.introTitle}>Quick Match Setup</Text>
            <Text style={styles.introSubtitle}>Enter basic details to start scoring immediately. No registration required.</Text>
          </View>

          <Pressable 
            style={styles.historyBtn}
            onPress={() => navigation.navigate('RecentInstantMatches')}
          >
            <View style={styles.historyIconCircle}>
              <History size={16} color={Colors.maroon} />
            </View>
            <Text style={styles.historyBtnText}>View Matches History</Text>
            <ChevronRight size={16} color="#94A3B8" />
          </Pressable>

          <View style={styles.formSection}>
            <View style={styles.inputGroup}>
              <View style={styles.labelRow}>
                <Shield size={16} color={Colors.maroon} />
                <Text style={styles.label}>Team A Name</Text>
              </View>
              <TextInput
                style={styles.input}
                placeholder="e.g. Mumbai Warriors"
                value={teamA}
                onChangeText={setTeamA}
                placeholderTextColor="#94A3B8"
              />
            </View>

            <View style={styles.vsContainer}>
              <View style={styles.vsLine} />
              <View style={styles.vsCircle}>
                <Text style={styles.vsText}>VS</Text>
              </View>
              <View style={styles.vsLine} />
            </View>

            <View style={styles.inputGroup}>
              <View style={styles.labelRow}>
                <Shield size={16} color="#607D8B" />
                <Text style={styles.label}>Team B Name</Text>
              </View>
              <TextInput
                style={styles.input}
                placeholder="e.g. Bangalore Strikers"
                value={teamB}
                onChangeText={setTeamB}
                placeholderTextColor="#94A3B8"
              />
            </View>

            <View style={styles.inputGroup}>
              <View style={styles.labelRow}>
                <Hash size={16} color={Colors.maroon} />
                <Text style={styles.label}>Match Overs</Text>
              </View>
              <View style={styles.oversRow}>
                {['5', '10', '15', '20'].map((val) => (
                  <Pressable
                    key={val}
                    style={[styles.overChip, overs === val && styles.overChipActive]}
                    onPress={() => setOvers(val)}
                  >
                    <Text style={[styles.overChipText, overs === val && styles.overChipTextActive]}>{val}</Text>
                  </Pressable>
                ))}
                <TextInput
                  style={[styles.customOverInput, (overs !== '5' && overs !== '10' && overs !== '15' && overs !== '20') && styles.overChipActive]}
                  placeholder="Custom"
                  keyboardType="numeric"
                  value={(!['5', '10', '15', '20'].includes(overs)) ? overs : ''}
                  onChangeText={setOvers}
                  placeholderTextColor="#94A3B8"
                />
              </View>
            </View>
          </View>

          <Pressable
            style={[styles.startBtn, (!teamA || !teamB || !overs) && { opacity: 0.6 }]}
            onPress={handleStartMatch}
            disabled={!teamA || !teamB || !overs}
          >
            <Play color="#FFFFFF" size={20} fill="#FFFFFF" />
            <Text style={styles.startBtnText}>START SCORING</Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: 56,
  },
  backBtn: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1A202C',
  },
  scrollContent: {
    padding: 24,
  },
  introCard: {
    backgroundColor: Colors.peach,
    padding: 20,
    borderRadius: 20,
    marginBottom: 32,
  },
  introTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: Colors.maroon,
    marginBottom: 4,
  },
  introSubtitle: {
    fontSize: 14,
    color: '#64748B',
    lineHeight: 20,
    fontWeight: '500',
  },
  formSection: {
    gap: 24,
  },
  inputGroup: {
    gap: 10,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: '#64748B',
  },
  input: {
    height: 56,
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    paddingHorizontal: 16,
    fontSize: 16,
    fontWeight: '600',
    color: '#1A202C',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  vsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    gap: 12,
  },
  vsLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E2E8F0',
  },
  vsCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  vsText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#94A3B8',
  },
  oversRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  overChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  overChipActive: {
    backgroundColor: Colors.maroon,
    borderColor: Colors.maroon,
  },
  overChipText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#64748B',
  },
  overChipTextActive: {
    color: '#FFFFFF',
  },
  customOverInput: {
    width: 80,
    height: 40,
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    paddingHorizontal: 12,
    fontSize: 14,
    fontWeight: '700',
    color: '#1A202C',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    textAlign: 'center',
  },
  startBtn: {
    backgroundColor: Colors.maroon,
    height: 60,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    marginTop: 40,
    ...Platform.select({
      ios: { shadowColor: Colors.maroon, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 12 },
      android: { elevation: 8 },
    }),
  },
  startBtnText: {
    fontSize: 16,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  historyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    padding: 12,
    borderRadius: 16,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  historyIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFF1F2',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  historyBtnText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '800',
    color: '#1E293B',
  },
});

export default InstantMatchSetupScreen;
