import * as React from 'react';
import { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
  Switch,
  StatusBar,
  Platform,
  Alert,
  Animated,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, Image as ImageIcon, ChevronDown, Calendar, Users, Zap } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { Colors } from '../constants/Colors';
import { Image } from 'react-native';
import { useTeamStore, Tournament } from '../store/useTeamStore';

const FORMATS = ['Knockout', 'Round Robin', 'League + Knockout', 'Double Elimination'];
const MATCH_TYPES = ['Limited Overs (T20/ODI)', 'Test Cricket', 'T10', 'Custom'];

const StepDot = ({ num, active, done }: { num: number; active: boolean; done: boolean }) => (
  <View style={stepStyles.wrapper}>
    <View style={[stepStyles.dot, active ? stepStyles.dotActive : null, done ? stepStyles.dotDone : null]}>
      <Text style={[stepStyles.dotText, active || done ? stepStyles.dotTextLight : null]}>{num}</Text>
    </View>
    <Text style={[stepStyles.label, active ? stepStyles.labelActive : null]}>
      {num === 1 ? 'Basics' : num === 2 ? 'Schedule' : 'Rules'}
    </Text>
  </View>
);

const stepStyles = StyleSheet.create({
  wrapper: { alignItems: 'center', gap: 4 },
  dot: { width: 28, height: 28, borderRadius: 14, backgroundColor: '#E5E5E5', justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#E5E5E5' },
  dotActive: { backgroundColor: Colors.maroon, borderColor: Colors.maroon },
  dotDone: { backgroundColor: Colors.peach, borderColor: Colors.maroon },
  dotText: { fontSize: 12, fontWeight: '800', color: Colors.textSecondary },
  dotTextLight: { color: Colors.maroon },
  label: { fontSize: 10, fontWeight: '700', color: Colors.textSecondary },
  labelActive: { color: Colors.maroon },
});

const DropdownField = ({ label, value, options, onSelect }: any) => {
  const [open, setOpen] = useState(false);
  return (
    <View style={dStyles.container}>
      <Text style={dStyles.label}>{label}</Text>
      <Pressable
        style={[dStyles.box, open ? dStyles.boxOpen : null]}
        onPress={() => setOpen(o => !o)}
        accessibilityRole="button"
        accessibilityLabel={`Select ${label}`}
      >
        <Text style={dStyles.value}>{value}</Text>
        <ChevronDown color={Colors.textSecondary} size={18} />
      </Pressable>
      {open && (
        <View style={dStyles.dropdown}>
          {options.map((opt: string) => (
            <Pressable
              key={opt}
              style={({ pressed }) => [dStyles.option, pressed ? { backgroundColor: Colors.peach } : null, value === opt ? dStyles.optionSelected : null]}
              onPress={() => { onSelect(opt); setOpen(false); }}
              accessibilityRole="menuitem"
            >
              <Text style={[dStyles.optionText, value === opt ? dStyles.optionTextSelected : null]}>{opt}</Text>
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
};
const dStyles = StyleSheet.create({
  container: { zIndex: 10, marginBottom: 16 },
  label: { fontSize: 13, fontWeight: '700', color: Colors.text, marginBottom: 6 },
  box: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: Colors.white, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 14, borderWidth: 1.5, borderColor: '#E5E5E5', minHeight: 50 },
  boxOpen: { borderColor: Colors.maroon },
  value: { fontSize: 14, color: Colors.text, flex: 1 },
  dropdown: { position: 'absolute', top: 80, left: 0, right: 0, backgroundColor: Colors.white, borderRadius: 10, borderWidth: 1, borderColor: '#E5E5E5', zIndex: 100, overflow: 'hidden', ...Platform.select({ ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8 }, android: { elevation: 6 } }) },
  option: { padding: 14, borderBottomWidth: 1, borderBottomColor: '#F5F5F5' },
  optionSelected: { backgroundColor: Colors.peach },
  optionText: { fontSize: 14, color: Colors.text },
  optionTextSelected: { fontWeight: '800', color: Colors.maroon },
});

// ─── Main Create Screen ────────────────────────────────────────────────────
const CreateTournamentScreen = ({ navigation }: any) => {
  const insets = useSafeAreaInsets();

  // Step 1 - Basics
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [format, setFormat] = useState('Knockout');
  const [matchType, setMatchType] = useState('Limited Overs (T20/ODI)');

  // Step 2 - Schedule
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [maxTeams, setMaxTeams] = useState('16');
  const [entryFee, setEntryFee] = useState(false);

  // Step 3 - Rules
  const [overs, setOvers] = useState('20');
  const [powerPlay, setPowerPlay] = useState('6');
  const [dls, setDls] = useState(false);
  const [rules, setRules] = useState('');
  const [prizePool, setPrizePool] = useState('');
  const [banner, setBanner] = useState<string | null>(null);

  const pickBanner = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Sorry, we need camera roll permissions to make this work!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8,
    });

    if (!result.canceled) {
      setBanner(result.assets[0].uri);
    }
  };

  const { addTournament, generateTournamentFixtures } = useTeamStore();

  const handleGenerate = () => {
    if (!name.trim()) {
      Alert.alert('Missing Name', 'Please enter a tournament name.');
      return;
    }

    const newTournament: Tournament = {
      id: `t_${Date.now()}`,
      name,
      format,
      matchType,
      venue: 'National Sports Complex',
      city: city || 'Mumbai',
      startDate: startDate || new Date().toLocaleDateString(),
      endDate: endDate || new Date().toLocaleDateString(),
      maxTeams: parseInt(maxTeams) || 16,
      overs: parseInt(overs) || 20,
      powerPlay: parseInt(powerPlay) || 6,
      dls,
      status: 'upcoming',
      teams: [
        'Mumbai Indians', 'Chennai Super Kings', 'Royal Challengers Bangalore', 
        'Kolkata Knight Riders', 'Delhi Capitals', 'Sunrisers Hyderabad', 
        'Rajasthan Royals', 'Gujarat Titans'
      ],
      fixtures: [],
      standings: [],
      banner: banner || undefined,
      rules: rules || undefined,
      prizePool: prizePool || undefined,
    };

    addTournament(newTournament);
    generateTournamentFixtures(newTournament.id);

    Alert.alert(
      '🏆 Tournament Created!',
      `"${name}" has been created successfully!\n\nFormat: ${format}\nMatch Type: ${matchType}\nMax Teams: ${maxTeams}`,
      [{ text: 'View Tournament', onPress: () => navigation.navigate('TournamentList') }]
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <StatusBar barStyle="dark-content" translucent />

      {/* Header */}
      <View style={styles.header}>
        <Pressable
          style={({ pressed }) => [styles.backBtn, pressed ? { opacity: 0.6 } : null]}
          onPress={() => navigation.goBack()}
          accessibilityRole="button" accessibilityLabel="Go back"
        >
          <ArrowLeft color={Colors.text} size={22} />
        </Pressable>
        <Text style={styles.headerTitle}>Create Tournament</Text>
        <View style={styles.backBtn} />
      </View>

      {/* Step indicators */}
      <View style={styles.stepRow}>
        <StepDot num={1} active done={false} />
        <View style={styles.stepLine} />
        <StepDot num={2} active done={false} />
        <View style={styles.stepLine} />
        <StepDot num={3} active done={false} />
      </View>

      <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false} keyboardDismissMode="on-drag">
        {/* ---- Step 1: Basics ---- */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionEmoji}>ℹ️</Text>
          <Text style={styles.sectionTitle}>Step 1: Basics</Text>
        </View>

        <Text style={styles.fieldLabel}>Tournament Name</Text>
        <View style={styles.inputBox}>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="e.g. Summer Pro League 2024"
            placeholderTextColor="#C0C0C0"
          />
        </View>

        <Text style={styles.fieldLabel}>City</Text>
        <View style={styles.inputBox}>
          <TextInput
            style={styles.input}
            value={city}
            onChangeText={setCity}
            placeholder="e.g. Mumbai"
            placeholderTextColor="#C0C0C0"
          />
        </View>

        {/* Banner Upload */}
        <Text style={styles.fieldLabel}>Tournament Banner</Text>
        <Pressable
          style={({ pressed }) => [styles.bannerBox, banner ? { paddingVertical: 0, overflow: 'hidden', borderStyle: 'solid' } : null, pressed ? { opacity: 0.85 } : null]}
          onPress={pickBanner}
          accessibilityRole="button" accessibilityLabel="Upload tournament banner"
        >
          {banner ? (
            <Image source={{ uri: banner }} style={styles.fullBanner} />
          ) : (
            <>
              <ImageIcon color={Colors.maroon} size={32} />
              <Text style={styles.bannerText}>Click to upload banner</Text>
              <Text style={styles.bannerHint}>Recommended: 1200x675px</Text>
            </>
          )}
        </Pressable>

        <DropdownField label="Tournament Format" value={format} options={FORMATS} onSelect={setFormat} />
        <DropdownField label="Match Type" value={matchType} options={MATCH_TYPES} onSelect={setMatchType} />

        {/* ---- Step 2: Schedule ---- */}
        <View style={[styles.sectionHeader, { marginTop: 10 }]}>
          <Text style={styles.sectionEmoji}>📅</Text>
          <Text style={styles.sectionTitle}>Step 2: Schedule & Teams</Text>
        </View>

        <View style={styles.fieldRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.fieldLabel}>Start Date</Text>
            <View style={styles.inputBox}>
              <TextInput
                style={styles.input}
                value={startDate}
                onChangeText={setStartDate}
                placeholder="mm/dd/yyyy"
                placeholderTextColor="#C0C0C0"
                keyboardType="numeric"
              />
              <Calendar color={Colors.textSecondary} size={16} />
            </View>
          </View>
          <View style={{ width: 12 }} />
          <View style={{ flex: 1 }}>
            <Text style={styles.fieldLabel}>End Date</Text>
            <View style={styles.inputBox}>
              <TextInput
                style={styles.input}
                value={endDate}
                onChangeText={setEndDate}
                placeholder="mm/dd/yyyy"
                placeholderTextColor="#C0C0C0"
                keyboardType="numeric"
              />
              <Calendar color={Colors.textSecondary} size={16} />
            </View>
          </View>
        </View>

        <View style={styles.fieldRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.fieldLabel}>Max Teams</Text>
            <View style={styles.inputBox}>
              <TextInput
                style={styles.input}
                value={maxTeams}
                onChangeText={setMaxTeams}
                keyboardType="numeric"
              />
            </View>
          </View>
        </View>

        <View style={styles.toggleRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.toggleLabel}>Registration Entry Fee</Text>
            <Text style={styles.toggleHint}>Collect fees via CricPro Payments</Text>
          </View>
          <Switch
            value={entryFee}
            onValueChange={setEntryFee}
            trackColor={{ false: '#E5E5E5', true: Colors.maroon }}
            thumbColor={Colors.white}
          />
        </View>

        {/* ---- Step 3: Rules ---- */}
        <View style={[styles.sectionHeader, { marginTop: 10 }]}>
          <Text style={styles.sectionEmoji}>⚡</Text>
          <Text style={styles.sectionTitle}>Step 3: Rules & Regulations</Text>
        </View>

        <View style={styles.fieldRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.fieldLabel}>Overs Per Inning</Text>
            <View style={styles.inputBox}>
              <TextInput
                style={styles.input}
                value={overs}
                onChangeText={setOvers}
                keyboardType="numeric"
                placeholder="20"
                placeholderTextColor="#C0C0C0"
              />
            </View>
          </View>
          <View style={{ width: 12 }} />
          <View style={{ flex: 1 }}>
            <Text style={styles.fieldLabel}>Power Play Overs</Text>
            <View style={styles.inputBox}>
              <TextInput
                style={styles.input}
                value={powerPlay}
                onChangeText={setPowerPlay}
                keyboardType="numeric"
                placeholder="6"
                placeholderTextColor="#C0C0C0"
              />
            </View>
          </View>
        </View>

        <Text style={styles.fieldLabel}>Prize Pool (Optional)</Text>
        <View style={styles.inputBox}>
          <TextInput
            style={styles.input}
            value={prizePool}
            onChangeText={setPrizePool}
            placeholder="e.g. ₹50,000"
            placeholderTextColor="#C0C0C0"
          />
        </View>

        <Text style={styles.fieldLabel}>Rules & Regulations</Text>
        <View style={[styles.inputBox, { height: 100, alignItems: 'flex-start' }]}>
          <TextInput
            style={[styles.input, { textAlignVertical: 'top', height: '100%' }]}
            value={rules}
            onChangeText={setRules}
            placeholder="Enter tournament rules..."
            placeholderTextColor="#C0C0C0"
            multiline
          />
        </View>

        <View style={styles.toggleRow}>
          <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <Text style={styles.dlsEmoji}>🌧️</Text>
            <View>
              <Text style={styles.toggleLabel}>DLS Method (Duckworth-Lewis)</Text>
            </View>
          </View>
          <Switch
            value={dls}
            onValueChange={setDls}
            trackColor={{ false: '#E5E5E5', true: Colors.maroon }}
            thumbColor={Colors.white}
          />
        </View>
      </ScrollView>

      {/* Generate Fixtures CTA */}
      <View style={[styles.ctaContainer, { paddingBottom: insets.bottom > 0 ? insets.bottom : 16 }]}>
        <Pressable
          style={({ pressed }) => [styles.ctaBtn, pressed ? { opacity: 0.85 } : null]}
          onPress={handleGenerate}
          accessibilityRole="button"
          accessibilityLabel="Generate fixtures"
        >
          <Text style={styles.ctaBtnText}>Generate Fixtures 🚀</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  backBtn: { width: 44, height: 44, justifyContent: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '800', color: Colors.text },
  stepRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 40, paddingVertical: 14, backgroundColor: Colors.white, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  stepLine: { flex: 1, height: 1.5, backgroundColor: '#E5E5E5', marginHorizontal: 4 },
  body: { padding: 20, paddingBottom: 30 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 },
  sectionEmoji: { fontSize: 18 },
  sectionTitle: { fontSize: 18, fontWeight: '900', color: Colors.text },
  fieldLabel: { fontSize: 13, fontWeight: '700', color: Colors.text, marginBottom: 6 },
  inputBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.white, borderRadius: 10, paddingHorizontal: 14, borderWidth: 1.5, borderColor: '#E5E5E5', minHeight: 50, marginBottom: 16 },
  input: { flex: 1, fontSize: 14, color: Colors.text, paddingVertical: 12 },
  bannerBox: { borderWidth: 1.5, borderColor: Colors.maroon, borderStyle: 'dashed', borderRadius: 12, backgroundColor: Colors.peach, paddingVertical: 28, alignItems: 'center', gap: 8, marginBottom: 20, minHeight: 150, justifyContent: 'center' },
  bannerText: { fontSize: 14, fontWeight: '700', color: Colors.text },
  bannerHint: { fontSize: 12, color: Colors.maroon },
  fullBanner: { width: '100%', height: 180, resizeMode: 'cover' },
  fieldRow: { flexDirection: 'row', alignItems: 'flex-end', marginBottom: 4 },
  toggleRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8F8F8', borderRadius: 12, padding: 14, marginBottom: 16, gap: 10, borderWidth: 1, borderColor: '#EBEBEB' },
  toggleLabel: { fontSize: 13, fontWeight: '700', color: Colors.text },
  toggleHint: { fontSize: 11, color: Colors.textSecondary, marginTop: 2 },
  dlsEmoji: { fontSize: 20 },
  ctaContainer: { paddingHorizontal: 20, paddingTop: 12, backgroundColor: Colors.white, borderTopWidth: 1, borderTopColor: '#F0F0F0' },
  ctaBtn: { backgroundColor: Colors.maroon, paddingVertical: 18, borderRadius: 14, alignItems: 'center', minHeight: 56 },
  ctaBtnText: { fontSize: 16, fontWeight: '900', color: Colors.white },
});

export default CreateTournamentScreen;
