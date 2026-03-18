import * as React from 'react';
import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
  Platform,
  ScrollView,
} from 'react-native';
import { ArrowLeft, Target, Infinity, Hand, Trophy } from 'lucide-react-native';
import { Colors } from '../constants/Colors';
import { useAuthStore } from '../store/useAuthStore';

const { width } = Dimensions.get('window');

const ROLES = [
  { id: 'batter', label: 'Batter', icon: <Target color={Colors.maroon} size={28} /> },
  { id: 'bowler', label: 'Bowler', icon: <Hand color={Colors.maroon} size={28} /> },
  { id: 'allrounder', label: 'All-Rounder', icon: <Infinity color={Colors.maroon} size={28} /> },
  { id: 'wicketkeeper', label: 'Wicket-Keeper', icon: <Hand color={Colors.maroon} size={28} /> }, // Should ideally use a glove icon
];

const BATTING_STYLES = ['Right-hand Bat', 'Left-hand Bat'];
const BOWLING_STYLES = ['Right-arm Fast', 'Right-arm Medium', 'Off-spin', 'Leg-spin', 'Left-arm Orthodox'];
const EXP_LEVELS = ['Beginner', 'Club', 'District', 'State', 'National'];

const ProfileSetupStep2 = ({ navigation }: any) => {
  const { updateProfile, finishSetup } = useAuthStore();
  const [selectedRole, setSelectedRole] = useState('batter');
  const [selectedBatting, setSelectedBatting] = useState('Right-hand Bat');
  const [selectedBowling, setSelectedBowling] = useState('Off-spin');
  const [selectedExp, setSelectedExp] = useState('Beginner');

  const handleFinish = () => {
    updateProfile({
      playingRole: selectedRole,
      battingStyle: selectedBatting,
      bowlingStyle: selectedBowling,
      experienceLevel: selectedExp,
    });
    finishSetup();
    navigation.reset({
      index: 0,
      routes: [{ name: 'Main' }],
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <ArrowLeft color="#1A202C" size={24} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Progress Tracker */}
        <View style={styles.progressContainer}>
           <View style={styles.progressHeader}>
              <Text style={styles.stepText}>Step 2 of 2</Text>
              <Text style={styles.percentText}>100% complete</Text>
           </View>
           <View style={styles.progressBarBg}>
              <View style={[styles.progressBarFill, { width: '100%' }]} />
           </View>
        </View>

        <Text style={styles.title}>Your Cricket Profile</Text>
        <Text style={styles.subtitle}>Help teams discover you with the right role and skills.</Text>

        {/* Playing Role */}
        <View style={styles.section}>
           <View style={styles.sectionTitleRow}>
              <Target color={Colors.maroon} size={20} fill={Colors.maroon} />
              <Text style={styles.sectionTitle}>Playing Role</Text>
           </View>
           <View style={styles.roleGrid}>
              {ROLES.map((role) => (
                <TouchableOpacity
                  key={role.id}
                  style={[
                    styles.roleCard,
                    selectedRole === role.id && styles.roleCardActive
                  ]}
                  onPress={() => setSelectedRole(role.id)}
                >
                  {role.icon}
                  <Text style={[styles.roleLabel, selectedRole === role.id && styles.roleLabelActive]}>
                    {role.label}
                  </Text>
                </TouchableOpacity>
              ))}
           </View>
        </View>

        {/* Batting Style */}
        <View style={styles.section}>
           <View style={styles.sectionTitleRow}>
              <Hand color={Colors.maroon} size={20} fill={Colors.maroon} />
              <Text style={styles.sectionTitle}>Batting Style</Text>
           </View>
           <View style={styles.styleRow}>
              {BATTING_STYLES.map((style) => (
                <TouchableOpacity
                  key={style}
                  style={[
                    styles.styleBtn,
                    selectedBatting === style && styles.styleBtnActive
                  ]}
                  onPress={() => setSelectedBatting(style)}
                >
                  <Text style={[styles.styleBtnText, selectedBatting === style && styles.styleBtnTextActive]}>
                    {style}
                  </Text>
                </TouchableOpacity>
              ))}
           </View>
        </View>

        {/* Bowling Style */}
        <View style={styles.section}>
           <View style={styles.sectionTitleRow}>
              <Infinity color={Colors.maroon} size={20} />
              <Text style={styles.sectionTitle}>Bowling Style</Text>
              <Text style={styles.optionalText}>Optional</Text>
           </View>
           <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsRow}>
              {BOWLING_STYLES.map((style) => (
                <TouchableOpacity
                  key={style}
                  style={[
                    styles.chip,
                    selectedBowling === style && styles.chipActive
                  ]}
                  onPress={() => setSelectedBowling(style)}
                >
                  <Text style={[styles.chipText, selectedBowling === style && styles.chipTextActive]}>
                    {style}
                  </Text>
                </TouchableOpacity>
              ))}
           </ScrollView>
        </View>

        {/* Experience Level */}
        <View style={styles.section}>
           <View style={styles.sectionTitleRow}>
              <Trophy color={Colors.maroon} size={20} fill={Colors.maroon} />
              <Text style={styles.sectionTitle}>Experience Level</Text>
           </View>
           <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={[styles.chipsRow, styles.expRow]}>
              {EXP_LEVELS.map((level) => (
                <TouchableOpacity
                  key={level}
                  style={[
                    styles.chip,
                    selectedExp === level && styles.expChipActive
                  ]}
                  onPress={() => setSelectedExp(level)}
                >
                  <Text style={[styles.chipText, selectedExp === level && styles.expChipTextActive]}>
                    {level}
                  </Text>
                </TouchableOpacity>
              ))}
           </ScrollView>
        </View>

        <TouchableOpacity 
          style={styles.primaryButton}
          onPress={handleFinish}
        >
          <Text style={styles.primaryButtonText}>Finish Setup</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 0,
    paddingBottom: 40,
  },
  progressContainer: {
    marginBottom: 24,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  stepText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#E53E3E',
  },
  percentText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#718096',
  },
  progressBarBg: {
    height: 4,
    backgroundColor: '#EDF2F7',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: Colors.maroon,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#1A237E',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 15,
    color: '#64748B',
    lineHeight: 22,
    marginBottom: 40,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1A237E',
    marginLeft: 10,
    flex: 1,
  },
  optionalText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#94A3B8',
  },
  roleGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  roleCard: {
    width: (width - 48 - 16) / 2,
    height: 100,
    backgroundColor: '#F8FAFC',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  roleCardActive: {
    borderColor: Colors.maroon,
    backgroundColor: '#FFF5F5',
    borderWidth: 1.5,
  },
  roleLabel: {
    fontSize: 14,
    fontWeight: '800',
    color: '#94A3B8',
    marginTop: 8,
  },
  roleLabelActive: {
    color: Colors.maroon,
  },
  styleRow: {
    flexDirection: 'row',
    gap: 12,
  },
  styleBtn: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 24,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  styleBtnActive: {
    backgroundColor: Colors.maroon,
    borderColor: Colors.maroon,
  },
  styleBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#64748B',
  },
  styleBtnTextActive: {
    color: Colors.white,
  },
  chipsRow: {
    gap: 8,
    paddingRight: 40,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    minHeight: 40,
  },
  chipActive: {
    backgroundColor: '#FFF5F5',
    borderColor: Colors.maroon,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748B',
  },
  chipTextActive: {
    color: Colors.maroon,
  },
  expRow: {
    backgroundColor: '#F1F5F9',
    padding: 6,
    borderRadius: 25,
  },
  expChipActive: {
    backgroundColor: Colors.white,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  expChipTextActive: {
    color: Colors.maroon,
    fontWeight: '800'
  },
  primaryButton: {
    backgroundColor: Colors.maroon,
    width: '100%',
    paddingVertical: 18,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 20,
    ...Platform.select({
      ios: { shadowColor: Colors.maroon, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 },
      android: { elevation: 6 },
    }),
  },
  primaryButtonText: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: '800',
  },
});

export default ProfileSetupStep2;
