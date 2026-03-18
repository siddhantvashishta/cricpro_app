import * as React from 'react';
import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
  StatusBar,
  Platform,
  Alert,
  KeyboardAvoidingView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, Camera, Image as ImageIcon } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { Colors } from '../constants/Colors';
import { useTeamStore, Team } from '../store/useTeamStore';
import { Image } from 'react-native';

const ALL_FORMATS = ['T10', 'T20', 'ODI', 'Test', 'Custom'];
const THEME_COLORS = [Colors.maroon, '#1565C0', '#F9A825', '#2E7D32', '#E65100', '#263238', '#6A1B9A'];

const CreateTeamScreen = ({ navigation }: any) => {
  const insets = useSafeAreaInsets();
  const { addTeam } = useTeamStore();

  const [name, setName] = useState('');
  const [shortName, setShortName] = useState('');
  const [city, setCity] = useState('');
  const [yearFounded, setYearFounded] = useState('2024');
  const [homeGround, setHomeGround] = useState('');
  const [selectedFormats, setSelectedFormats] = useState<string[]>(['T20']);
  const [overs, setOvers] = useState('');
  const [themeColor, setThemeColor] = useState(Colors.maroon);
  const [image, setImage] = useState<string | null>(null);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Sorry, we need camera roll permissions to make this work!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const toggleFormat = (f: string) => {
    setSelectedFormats(prev =>
      prev.includes(f) ? prev.filter(x => x !== f) : [...prev, f]
    );
  };

  const handleCreate = () => {
    if (!name.trim()) {
      Alert.alert('Team Name Required', 'Please enter a team name.');
      return;
    }
    if (!shortName.trim()) {
      Alert.alert('Short Name Required', 'Please enter a short name (max 4 chars).');
      return;
    }

    const newTeam: Team = {
      id: `tm_${Date.now()}`,
      name: name.trim(),
      shortName: shortName.toUpperCase().slice(0, 4),
      city: city.trim(),
      yearFounded,
      homeGround: homeGround.trim(),
      formats: selectedFormats.length > 0 ? selectedFormats : ['T20'],
      overs: overs || '20',
      themeColor,
      players: 0,
      avatarColor: themeColor,
      avatarLetter: shortName.toUpperCase().slice(0, 2) || name.slice(0, 2).toUpperCase(),
      roster: [], // Initialize empty roster
      logo: image || undefined,
    };

    addTeam(newTeam);
    Alert.alert('✅ Team Created!', `"${name}" has been created successfully!`, [
      { text: 'Done', onPress: () => navigation.goBack() },
    ]);
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
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
        <Text style={styles.headerTitle}>Create Team</Text>
        <View style={styles.backBtn} />
      </View>

      <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false} keyboardDismissMode="on-drag">
        {/* Logo Upload */}
        <View style={styles.logoArea}>
          <Pressable
            style={[styles.logoCircle, { borderColor: themeColor, overflow: 'hidden' }]}
            onPress={pickImage}
            accessibilityRole="button" accessibilityLabel="Upload team logo"
          >
            {image ? (
              <Image source={{ uri: image }} style={styles.fullImage} />
            ) : (
              <>
                <Camera color={Colors.maroon} size={34} />
                <View style={[styles.logoCameraBadge, { backgroundColor: Colors.maroon }]}>
                  <Camera color={Colors.white} size={12} />
                </View>
              </>
            )}
          </Pressable>
          <Text style={styles.logoLabel}>{image ? 'Change Team Logo' : 'Upload Team Logo'}</Text>
          <Text style={styles.logoHint}>100dp circular recommended</Text>
        </View>

        {/* Team Name */}
        <Text style={styles.fieldLabel}>Team Name</Text>
        <View style={styles.inputBox}>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="e.g. Mumbai Warriors"
            placeholderTextColor="#C0C0C0"
          />
        </View>

        {/* Short Name */}
        <Text style={styles.fieldLabel}>Short Name (max 4 chars)</Text>
        <View style={styles.inputBox}>
          <TextInput
            style={styles.input}
            value={shortName}
            onChangeText={t => setShortName(t.toUpperCase().slice(0, 4))}
            placeholder="e.g. MIW"
            placeholderTextColor="#C0C0C0"
            autoCapitalize="characters"
            maxLength={4}
          />
        </View>

        {/* City */}
        <Text style={styles.fieldLabel}>City</Text>
        <View style={styles.inputBox}>
          <TextInput
            style={styles.input}
            value={city}
            onChangeText={setCity}
            placeholder="Enter team home city"
            placeholderTextColor="#C0C0C0"
          />
        </View>

        {/* Year + Home Ground row */}
        <View style={styles.fieldRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.fieldLabel}>Year Founded</Text>
            <View style={[styles.inputBox, { marginBottom: 0 }]}>
              <TextInput
                style={styles.input}
                value={yearFounded}
                onChangeText={setYearFounded}
                placeholder="2024"
                placeholderTextColor="#C0C0C0"
                keyboardType="numeric"
                maxLength={4}
              />
            </View>
          </View>
          <View style={{ width: 12 }} />
          <View style={{ flex: 1.5 }}>
            <Text style={styles.fieldLabel}>Home Ground</Text>
            <View style={[styles.inputBox, { marginBottom: 0 }]}>
              <TextInput
                style={styles.input}
                value={homeGround}
                onChangeText={setHomeGround}
                placeholder="Stadium name"
                placeholderTextColor="#C0C0C0"
              />
            </View>
          </View>
        </View>

        {/* Format Preference */}
        <Text style={[styles.fieldLabel, { marginTop: 16 }]}>Format Preference</Text>
        <View style={styles.formatsWrap}>
          {ALL_FORMATS.map(f => (
            <Pressable
              key={f}
              style={({ pressed }) => [
                styles.formatChip,
                selectedFormats.includes(f) ? styles.formatChipActive : null,
                pressed ? { opacity: 0.8 } : null,
              ]}
              onPress={() => toggleFormat(f)}
              accessibilityRole="checkbox"
              accessibilityLabel={f}
              accessibilityState={{ checked: selectedFormats.includes(f) }}
            >
              <Text style={[styles.formatChipText, selectedFormats.includes(f) ? styles.formatChipTextActive : null]}>{f}</Text>
            </Pressable>
          ))}
        </View>

        {/* Overs */}
        <Text style={styles.fieldLabel}>Overs per Innings</Text>
        <View style={styles.inputBox}>
          <TextInput
            style={styles.input}
            value={overs}
            onChangeText={setOvers}
            placeholder="e.g. 20"
            placeholderTextColor="#C0C0C0"
            keyboardType="numeric"
          />
        </View>

        {/* Theme Color */}
        <Text style={styles.fieldLabel}>Team Theme Color</Text>
        <View style={styles.colorRow}>
          {THEME_COLORS.map(c => (
            <Pressable
              key={c}
              style={[styles.colorSwatch, { backgroundColor: c }, themeColor === c ? styles.colorSwatchSelected : null]}
              onPress={() => setThemeColor(c)}
              accessibilityRole="radio"
              accessibilityLabel={`Theme color ${c}`}
              accessibilityState={{ checked: themeColor === c }}
            />
          ))}
        </View>
      </ScrollView>

      {/* Create CTA */}
      <View style={[styles.ctaContainer, { paddingBottom: insets.bottom > 0 ? insets.bottom : 16 }]}>
        <Pressable
          style={({ pressed }) => [styles.ctaBtn, { backgroundColor: themeColor === Colors.white ? Colors.maroon : themeColor }, pressed ? { opacity: 0.85 } : null]}
          onPress={handleCreate}
          accessibilityRole="button"
          accessibilityLabel="Create team"
        >
          <Text style={styles.ctaBtnText}>Create Team  +</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  backBtn: { width: 44, height: 44, justifyContent: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '800', color: Colors.text },
  body: { padding: 20, paddingBottom: 24 },

  logoArea: { alignItems: 'center', marginBottom: 28 },
  logoCircle: { width: 110, height: 110, borderRadius: 55, borderWidth: 2, borderColor: Colors.maroon, borderStyle: 'dashed', backgroundColor: Colors.peach, justifyContent: 'center', alignItems: 'center', position: 'relative' },
  logoCameraBadge: { position: 'absolute', bottom: 4, right: 4, width: 26, height: 26, borderRadius: 13, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: Colors.white },
  logoLabel: { fontSize: 15, fontWeight: '800', color: Colors.text, marginTop: 10 },
  logoHint: { fontSize: 12, color: Colors.textSecondary, marginTop: 2 },
  fullImage: { width: '100%', height: '100%', resizeMode: 'cover' },

  fieldLabel: { fontSize: 13, fontWeight: '700', color: Colors.text, marginBottom: 6 },
  inputBox: { backgroundColor: Colors.white, borderRadius: 10, paddingHorizontal: 14, borderWidth: 1.5, borderColor: '#E5E5E5', minHeight: 50, marginBottom: 16, justifyContent: 'center' },
  input: { fontSize: 14, color: Colors.text, paddingVertical: 12 },
  fieldRow: { flexDirection: 'row', marginBottom: 4 },

  formatsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 20 },
  formatChip: { paddingHorizontal: 18, paddingVertical: 10, borderRadius: 20, borderWidth: 1.5, borderColor: '#D0D0D0', minHeight: 40 },
  formatChipActive: { backgroundColor: Colors.peach, borderColor: Colors.maroon },
  formatChipText: { fontSize: 13, fontWeight: '700', color: Colors.text },
  formatChipTextActive: { color: Colors.maroon },

  colorRow: { flexDirection: 'row', gap: 12, flexWrap: 'wrap', marginBottom: 10 },
  colorSwatch: { width: 40, height: 40, borderRadius: 20 },
  colorSwatchSelected: { ...Platform.select({ ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.35, shadowRadius: 6 }, android: { elevation: 6 } }), transform: [{ scale: 1.15 }] },

  ctaContainer: { paddingHorizontal: 20, paddingTop: 12, backgroundColor: Colors.white, borderTopWidth: 1, borderTopColor: '#F0F0F0' },
  ctaBtn: { paddingVertical: 18, borderRadius: 14, alignItems: 'center', minHeight: 56 },
  ctaBtnText: { fontSize: 16, fontWeight: '900', color: Colors.white },
});

export default CreateTeamScreen;
