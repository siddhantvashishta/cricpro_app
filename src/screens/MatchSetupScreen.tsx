import * as React from 'react';
import { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
  Platform,
  StatusBar,
  Alert,
  Dimensions,
  Modal,
} from 'react-native';
import { Colors } from '../constants/Colors';
import { useTeamStore, Team } from '../store/useTeamStore';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, MapPin, Clock, Calendar, StickyNote, ChevronRight, Search, X, ChevronLeft } from 'lucide-react-native';

const { width } = Dimensions.get('window');

const FORMATS = ['T10', 'T20', 'ODI', 'TEST', 'Custom'];
const DEFAULT_OVERS: Record<string, string> = { T10: '10', T20: '20', ODI: '50', TEST: 'Unlimited', Custom: '15' };

const PREDEFINED_VENUES = [
  { id: 'v1', name: 'Wankhede Stadium', city: 'Mumbai', type: 'Turf', verified: true },
  { id: 'v2', name: 'M. Chinnaswamy Stadium', city: 'Bengaluru', type: 'Turf', verified: true },
  { id: 'v3', name: 'Narendra Modi Stadium', city: 'Ahmedabad', type: 'Turf', verified: true },
  { id: 'v4', name: 'Local Cricket Ground', city: 'Noida', type: 'Matting', verified: false },
  { id: 'v5', name: 'Eden Gardens', city: 'Kolkata', type: 'Turf', verified: true },
];

// Calendar Helpers
const getDaysInMonth = (month: number, year: number) => {
  return new Date(year, month + 1, 0).getDate();
};

const getFirstDayOfMonth = (month: number, year: number) => {
  return new Date(year, month, 1).getDay();
};

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];
const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

const MatchSetupScreen = ({ navigation, route }: any) => {
  const insets = useSafeAreaInsets();
  const { teams } = useTeamStore();
  const existingMatch = route?.params?.match;
  const onMatchSaved = route?.params?.onMatchSaved;

  const [format, setFormat] = useState(existingMatch?.format || 'T10');
  const [overs, setOvers] = useState(existingMatch?.overs || DEFAULT_OVERS[existingMatch?.format || 'T10']);
  const [date, setDate] = useState(existingMatch?.date || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }));
  const [time, setTime] = useState(existingMatch?.time || '10:00 AM');
  const [venue, setVenue] = useState(existingMatch?.venue || '');
  const [notes, setNotes] = useState('');
  
  const [teamA, setTeamA] = useState<Team | null>(null);
  const [teamB, setTeamB] = useState<Team | null>(null);
  const [selectingSlot, setSelectingSlot] = useState<'A' | 'B' | null>(null);
  const [showTimeModal, setShowTimeModal] = useState(false);
  const [showVenueModal, setShowVenueModal] = useState(false);
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [venueSearch, setVenueSearch] = useState('');

  // Calendar Navigator States
  const [viewDate, setViewDate] = useState(new Date());

  const [tempHour, setTempHour] = useState('10');
  const [tempMin, setTempMin] = useState('00');
  const [tempPeriod, setTempPeriod] = useState('AM');

  // Initializing teams if editing
  React.useEffect(() => {
    if (existingMatch && teams.length > 0) {
      const t1 = teams.find(t => existingMatch.teams.includes(t.name));
      const t2 = teams.find(t => existingMatch.teams.includes(t.name) && t.id !== t1?.id);
      if (t1) setTeamA(t1);
      if (t2) setTeamB(t2);
    }
  }, [existingMatch, teams]);

  const handleFormatSelect = (f: string) => {
    setFormat(f);
    setOvers(DEFAULT_OVERS[f]);
  };

  const handleTeamSelect = (slot: 'A' | 'B') => {
    setSelectingSlot(slot);
    setSearchQuery('');
  };

  const onTeamPicked = (team: Team) => {
    if (selectingSlot === 'A') {
      if (teamB?.id === team.id) {
        Alert.alert('Selection Error', 'Team A and Team B must be different.');
        return;
      }
      setTeamA(team);
    } else {
      if (teamA?.id === team.id) {
        Alert.alert('Selection Error', 'Team A and Team B must be different.');
        return;
      }
      setTeamB(team);
    }
    setSelectingSlot(null);
  };

  const handleProceed = () => {
    if (!teamA || !teamB) {
      Alert.alert('Select both teams', 'Please select both Team A and Team B to proceed.');
      return;
    }

    const matchData = {
      id: existingMatch?.id || `m_${Date.now()}`,
      format,
      teams: `${teamA?.name || 'Team A'} vs ${teamB?.name || 'Team B'}`,
      teamAInfo: teamA,
      teamBInfo: teamB,
      date: date || 'TBD',
      time: time || 'TBD',
      venue: venue || 'Local Ground',
      status: existingMatch?.status || 'upcoming',
      overs,
    };

    if (onMatchSaved) {
      onMatchSaved(matchData);
    }

    if (existingMatch) {
       Alert.alert('Match Updated', 'Your match details have been saved.');
       navigation.goBack();
    } else {
       navigation.navigate('SelectPlayingXI', { 
         teamAInfo: teamA, 
         teamBInfo: teamB, 
         format, 
         overs,
         date,
         time,
         venue,
         notes
       });
    }
  };

  const onDateSelect = (d: number, m: number, y: number) => {
    const selectedDate = new Date(y, m, d);
    setDate(selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }));
    setShowCalendarModal(false);
  };

  const changeMonth = (offset: number) => {
    const nextDate = new Date(viewDate.getFullYear(), viewDate.getMonth() + offset, 1);
    setViewDate(nextDate);
  };


  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <StatusBar barStyle="dark-content" translucent={true} />

      {/* Header */}
      <View style={styles.header}>
        <Pressable
          style={({ pressed }) => [styles.backBtn, pressed ? { opacity: 0.6 } : null]}
          onPress={() => navigation.goBack?.()}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <ArrowLeft color={Colors.text} size={22} />
        </Pressable>
        <Text style={styles.headerTitle}>Match Setup</Text>
        <View style={styles.backBtn} />
      </View>

      <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false} keyboardDismissMode="on-drag">
        {/* Match Format */}
        <Text style={styles.sectionLabel}>MATCH FORMAT</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.formatRow}>
          {FORMATS.map(f => (
            <Pressable
              key={f}
              style={({ pressed }) => [
                styles.formatChip,
                format === f ? styles.formatChipActive : null,
                pressed ? { opacity: 0.8 } : null,
              ]}
              onPress={() => handleFormatSelect(f)}
              accessibilityRole="radio"
              accessibilityLabel={`Match format: ${f}`}
              accessibilityState={{ checked: format === f }}
            >
              <Text style={[styles.formatChipText, format === f ? styles.formatChipTextActive : null]}>{f}</Text>
            </Pressable>
          ))}
        </ScrollView>

        {/* Number of Overs */}
        <Text style={styles.sectionLabel}>NUMBER OF OVERS</Text>
        <View style={styles.inputBox}>
          <TextInput
            style={styles.input}
            value={overs}
            onChangeText={setOvers}
            keyboardType="default"
            placeholder="Enter overs"
            placeholderTextColor="#B0B0B0"
          />
        </View>

        {/* Select Teams */}
        <Text style={styles.sectionLabel}>SELECT TEAMS</Text>
        <View style={styles.teamsRow}>
          {(['A', 'B'] as const).map(slot => {
            const selectedTeam = slot === 'A' ? teamA : teamB;
            const isSelected = !!selectedTeam;
            return (
              <Pressable
                key={slot}
                style={({ pressed }) => [
                  styles.teamSlot,
                  !isSelected ? styles.teamSlotEmpty : null,
                  pressed ? { opacity: 0.8 } : null,
                ]}
                onPress={() => handleTeamSelect(slot)}
              >
                <View style={[styles.teamAvatar, !isSelected ? styles.teamAvatarEmpty : { backgroundColor: selectedTeam?.avatarColor || '#1B5E20' }]}>
                  <Text style={[styles.teamAvatarText, !isSelected ? { color: '#90A4AE' } : null]}>
                    {isSelected ? selectedTeam?.avatarLetter : '+'}
                  </Text>
                </View>
                <Text style={styles.teamSlotName} numberOfLines={1}>{selectedTeam?.name || `Team ${slot}`}</Text>
                <Text style={styles.teamSlotHint}>{isSelected ? selectedTeam?.city : 'Tap to select'}</Text>
              </Pressable>
            );
          })}
        </View>

        {/* Date Selection */}
        <Text style={styles.sectionLabel}>MATCH DATE</Text>
        
        {/* Primary Date Input */}
        <Pressable 
          style={styles.primaryDateInput} 
          onPress={() => setShowCalendarModal(true)}
        >
          <Calendar color={Colors.maroon} size={20} />
          <View style={styles.dateInputContent}>
            <Text style={styles.dateValueText}>{date}</Text>
            <Text style={styles.dateLabelText}>Selected Match Day</Text>
          </View>
          <ChevronRight color="#CBD5E1" size={18} />
        </Pressable>



        <View style={styles.row}>
          {/* Time Picker */}
          <View style={{ flex: 1 }}>
            <Text style={styles.sectionLabel}>START TIME</Text>
            <Pressable style={styles.selectionChip} onPress={() => setShowTimeModal(true)}>
              <Clock color={Colors.maroon} size={18} />
              <Text style={styles.selectionChipText}>{time}</Text>
            </Pressable>
          </View>
          <View style={{ width: 12 }} />
          {/* Venue Selector */}
          <View style={{ flex: 1 }}>
            <Text style={styles.sectionLabel}>VENUE</Text>
            <Pressable style={styles.selectionChip} onPress={() => setShowVenueModal(true)}>
              <MapPin color={Colors.maroon} size={18} />
              <Text style={styles.selectionChipText} numberOfLines={1}>{venue || 'Select Venue'}</Text>
            </Pressable>
          </View>
        </View>

        {/* Pre-fill Venue Placeholder if needed, otherwise handled by picker */}

        {/* Map Preview */}
        <Pressable
          style={({ pressed }) => [styles.mapPreview, pressed ? { opacity: 0.9 } : null]}
          onPress={() => Alert.alert('View Map', 'Map integration coming soon!')}
          accessibilityRole="button"
          accessibilityLabel="View venue on map"
        >
          <View style={styles.mapBg} />
          <View style={styles.viewMapBtn}>
            <Text style={styles.viewMapText}>VIEW MAP</Text>
          </View>
        </Pressable>

        {/* Match Notes */}
        <Text style={styles.sectionLabel}>MATCH NOTES</Text>
        <View style={[styles.inputBox, { alignItems: 'flex-start', minHeight: 90 }]}>
          <TextInput
            style={[styles.input, { minHeight: 80, textAlignVertical: 'top', paddingTop: 4 }]}
            value={notes}
            onChangeText={setNotes}
            placeholder="Additional rules, ball type, or ground conditions..."
            placeholderTextColor="#B0B0B0"
            multiline
          />
        </View>
      </ScrollView>

      {/* CTA */}
      <View style={[styles.ctaContainer, { paddingBottom: insets.bottom > 0 ? insets.bottom : 16 }]}>
        <Pressable
          style={({ pressed }) => [styles.ctaBtn, pressed ? { opacity: 0.85 } : null]}
          onPress={handleProceed}
        >
          <Text style={styles.ctaBtnText}>Proceed to Playing XI  →</Text>
        </Pressable>
      </View>

      {/* Team Selection Modal */}
      <Modal
        visible={selectingSlot !== null}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setSelectingSlot(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.dragHandle} />
            
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>Select Team {selectingSlot}</Text>
                <Text style={styles.modalSubtitle}>Choose a team for this match slot</Text>
              </View>
              <Pressable 
                style={styles.closeBtn}
                onPress={() => setSelectingSlot(null)}
                accessibilityRole="button"
                accessibilityLabel="Close modal"
              >
                <X color={Colors.textSecondary} size={20} strokeWidth={2.5} />
              </Pressable>
            </View>

            <View style={styles.searchBar}>
              <Search color={Colors.textSecondary} size={18} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search teams by name..."
                placeholderTextColor="#94A3B8"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              {searchQuery.length > 0 && (
                <Pressable onPress={() => setSearchQuery('')}>
                  <X color={Colors.textSecondary} size={16} />
                </Pressable>
              )}
            </View>

            <ScrollView 
              style={styles.teamsList} 
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 40 }}
            >
              {searchQuery === '' && (
                <>
                  <Text style={styles.listSectionLabel}>MY TEAMS</Text>
                  {teams.length > 0 ? (
                    teams.slice(0, 3).map(team => (
                      <Pressable
                        key={`recent-${team.id}`}
                        style={({ pressed }) => [styles.teamItem, pressed && styles.teamItemPressed]}
                        onPress={() => onTeamPicked(team)}
                      >
                        <View style={[styles.listAvatar, { backgroundColor: team.avatarColor }]}>
                          <Text style={styles.listAvatarText}>{team.avatarLetter}</Text>
                        </View>
                        <View style={styles.teamItemInfo}>
                          <Text style={styles.teamItemName}>{team.name}</Text>
                          <Text style={styles.teamItemCity}>{team.city}</Text>
                        </View>
                        <ChevronRight color="#CBD5E1" size={18} />
                      </Pressable>
                    ))
                  ) : (
                    <View style={styles.miniEmpty}>
                      <Text style={styles.miniEmptyText}>No teams yet</Text>
                    </View>
                  )}
                  <View style={styles.sectionDivider} />
                </>
              )}

              <Text style={styles.listSectionLabel}>
                {searchQuery ? 'SEARCH RESULTS' : 'ALL TEAMS'}
              </Text>
              
              {teams.filter(t => t.name.toLowerCase().includes(searchQuery.toLowerCase())).map(team => (
                <Pressable
                  key={team.id}
                  style={({ pressed }) => [styles.teamItem, pressed && styles.teamItemPressed]}
                  onPress={() => onTeamPicked(team)}
                >
                  <View style={[styles.listAvatar, { backgroundColor: team.avatarColor }]}>
                    <Text style={styles.listAvatarText}>{team.avatarLetter}</Text>
                  </View>
                  <View style={styles.teamItemInfo}>
                    <Text style={styles.teamItemName}>{team.name}</Text>
                    <Text style={styles.teamItemCity}>{team.city}</Text>
                  </View>
                  <ChevronRight color="#CBD5E1" size={18} />
                </Pressable>
              ))}

              {teams.filter(t => t.name.toLowerCase().includes(searchQuery.toLowerCase())).length === 0 && (
                <View style={styles.emptyState}>
                  <Search color="#CBD5E1" size={48} strokeWidth={1} style={{ marginBottom: 12 }} />
                  <Text style={styles.emptyText}>
                    {searchQuery ? `No teams matching "${searchQuery}"` : 'No teams found. Create one in My Teams!'}
                  </Text>
                </View>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Time Picker Modal */}
      <Modal visible={showTimeModal} transparent animationType="fade">
        <View style={styles.centeredModal}>
          <View style={styles.timeModalContent}>
            <Text style={styles.modalTitle}>Select Start Time</Text>
            <View style={styles.timePickerRow}>
              <View style={styles.timeCol}>
                {['09', '10', '11', '12', '01'].map(h => (
                  <Pressable key={h} onPress={() => setTempHour(h)} style={[styles.timeUnit, tempHour === h && styles.timeUnitActive]}>
                    <Text style={[styles.timeUnitText, tempHour === h && styles.timeUnitTextActive]}>{h}</Text>
                  </Pressable>
                ))}
              </View>
              <Text style={styles.timeSep}>:</Text>
              <View style={styles.timeCol}>
                {['00', '15', '30', '45'].map(m => (
                  <Pressable key={m} onPress={() => setTempMin(m)} style={[styles.timeUnit, tempMin === m && styles.timeUnitActive]}>
                    <Text style={[styles.timeUnitText, tempMin === m && styles.timeUnitTextActive]}>{m}</Text>
                  </Pressable>
                ))}
              </View>
              <View style={styles.periodCol}>
                {['AM', 'PM'].map(p => (
                  <Pressable key={p} onPress={() => setTempPeriod(p)} style={[styles.timeUnit, tempPeriod === p && styles.timeUnitActive]}>
                    <Text style={[styles.timeUnitText, tempPeriod === p && styles.timeUnitTextActive]}>{p}</Text>
                  </Pressable>
                ))}
              </View>
            </View>
            <Pressable style={styles.saveBtn} onPress={() => { setTime(`${tempHour}:${tempMin} ${tempPeriod}`); setShowTimeModal(false); }}>
              <Text style={styles.saveBtnText}>Confirm Time</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* Venue Picker Modal */}
      <Modal visible={showVenueModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Match Venue</Text>
              <Pressable onPress={() => setShowVenueModal(false)}>
                <X color={Colors.text} size={24} />
              </Pressable>
            </View>
            <View style={styles.searchBar}>
              <Search color={Colors.textSecondary} size={20} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search grounds or stadiums..."
                value={venueSearch}
                onChangeText={setVenueSearch}
              />
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
              {PREDEFINED_VENUES.filter(v => v.name.toLowerCase().includes(venueSearch.toLowerCase())).map(v => (
                <Pressable
                  key={v.id}
                  style={({ pressed }) => [styles.venueItem, pressed && { backgroundColor: '#F1F5F9' }]}
                  onPress={() => { setVenue(v.name); setShowVenueModal(false); }}
                >
                  <View style={styles.venueIcon}>
                    <MapPin color={Colors.maroon} size={20} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.venueName}>{v.name}</Text>
                    <Text style={styles.venueCity}>{v.city} • {v.type}</Text>
                  </View>
                  {v.verified && <View style={styles.verifiedBadge}><Text style={styles.verifiedText}>✓</Text></View>}
                </Pressable>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Full Calendar Modal */}
      <Modal visible={showCalendarModal} transparent animationType="fade">
        <View style={styles.centeredModal}>
          <View style={styles.calendarContent}>
            <View style={styles.calendarHeader}>
              <Pressable onPress={() => changeMonth(-1)} style={styles.monthNavBtn}>
                <ChevronLeft color={Colors.text} size={24} />
              </Pressable>
              <Text style={styles.calendarMonthText}>
                {MONTH_NAMES[viewDate.getMonth()]} {viewDate.getFullYear()}
              </Text>
              <Pressable onPress={() => changeMonth(1)} style={styles.monthNavBtn}>
                <ChevronRight color={Colors.text} size={24} />
              </Pressable>
            </View>

            <View style={styles.weekdayRow}>
              {WEEKDAYS.map((w, i) => (
                <Text key={i} style={styles.weekdayText}>{w}</Text>
              ))}
            </View>

            <View style={styles.dayGrid}>
              {Array(getFirstDayOfMonth(viewDate.getMonth(), viewDate.getFullYear())).fill(0).map((_, i) => (
                <View key={`empty-${i}`} style={styles.dayBox} />
              ))}
              {Array(getDaysInMonth(viewDate.getMonth(), viewDate.getFullYear())).fill(0).map((_, i) => {
                const d = i + 1;
                const isSelected = date === new Date(viewDate.getFullYear(), viewDate.getMonth(), d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                return (
                  <Pressable
                    key={d}
                    style={[styles.dayBox, isSelected && styles.dayBoxActive]}
                    onPress={() => onDateSelect(d, viewDate.getMonth(), viewDate.getFullYear())}
                  >
                    <Text style={[styles.dayText, isSelected && styles.dayTextActive]}>{d}</Text>
                  </Pressable>
                );
              })}
            </View>

            <Pressable style={styles.cancelBtn} onPress={() => setShowCalendarModal(false)}>
              <Text style={styles.cancelBtnText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 14, backgroundColor: Colors.white, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  backBtn: { width: 44, height: 44, justifyContent: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '800', color: Colors.text },
  body: { padding: 16, gap: 10 },

  sectionLabel: { fontSize: 11, fontWeight: '800', color: Colors.textSecondary, letterSpacing: 0.8, marginBottom: 8, marginTop: 6 },

  formatRow: { gap: 8, paddingBottom: 4 },
  formatChip: { paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20, backgroundColor: Colors.white, borderWidth: 1.5, borderColor: '#E0E0E0', minHeight: 44 },
  formatChipActive: { backgroundColor: Colors.maroon, borderColor: Colors.maroon },
  formatChipText: { fontSize: 14, fontWeight: '700', color: Colors.text },
  formatChipTextActive: { color: Colors.white },

  inputBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.white, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 4, borderWidth: 1, borderColor: '#EBEBEB', minHeight: 52 },
  input: { flex: 1, fontSize: 15, color: Colors.text, paddingVertical: 10 },

  teamsRow: { flexDirection: 'row', gap: 12 },
  teamSlot: { flex: 1, backgroundColor: Colors.white, borderRadius: 14, padding: 16, alignItems: 'center', borderWidth: 1.5, borderColor: '#E0E0E0' },
  teamSlotEmpty: { borderStyle: 'dashed', borderColor: '#90A4AE' },
  teamAvatar: { width: 52, height: 52, borderRadius: 26, backgroundColor: '#1B5E20', justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  teamAvatarEmpty: { backgroundColor: '#E8EEF2' },
  teamAvatarText: { fontSize: 22, fontWeight: '900', color: Colors.white },
  teamSlotName: { fontSize: 14, fontWeight: '800', color: Colors.text, marginBottom: 2 },
  teamSlotHint: { fontSize: 11, color: Colors.textSecondary },

  row: { flexDirection: 'row', alignItems: 'flex-end', marginTop: 4 },

  // Selection Chip
  selectionChip: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.white, borderRadius: 12, paddingHorizontal: 14, height: 52, borderWidth: 1, borderColor: '#EBEBEB', gap: 10 },
  selectionChipText: { fontSize: 15, fontWeight: '700', color: Colors.text },

  // Primary Date Input
  primaryDateInput: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.white, borderRadius: 16, paddingHorizontal: 16, paddingVertical: 12, borderWidth: 1, borderColor: '#EBEBEB', gap: 14, marginBottom: 12 },
  dateInputContent: { flex: 1 },
  dateValueText: { fontSize: 16, fontWeight: '800', color: Colors.text },
  dateLabelText: { fontSize: 11, color: Colors.textSecondary, marginTop: 1 },

  mapPreview: { height: 120, borderRadius: 14, overflow: 'hidden', justifyContent: 'center', alignItems: 'center', position: 'relative', marginTop: 10 },
  mapBg: { ...StyleSheet.absoluteFillObject, backgroundColor: '#C8D8E8' },
  viewMapBtn: { backgroundColor: Colors.maroon, paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8 },
  viewMapText: { fontSize: 12, fontWeight: '900', color: Colors.white, letterSpacing: 1 },

  ctaContainer: { backgroundColor: Colors.white, paddingHorizontal: 20, paddingTop: 14, borderTopWidth: 1, borderTopColor: '#F0F0F0' },
  ctaBtn: { backgroundColor: Colors.maroon, paddingVertical: 18, borderRadius: 14, alignItems: 'center', minHeight: 56 },
  ctaBtnText: { fontSize: 16, fontWeight: '900', color: Colors.white, letterSpacing: 0.5 },
  
  // Modal Styles
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
  centeredModal: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center', padding: 24 },
  modalContent: { 
    backgroundColor: Colors.white, 
    borderTopLeftRadius: 32, 
    borderTopRightRadius: 32, 
    height: '85%', 
    padding: 24,
    paddingTop: 8,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -10 },
        shadowOpacity: 0.1,
        shadowRadius: 15,
      },
      android: {
        elevation: 20,
      }
    })
  },
  dragHandle: {
    width: 40,
    height: 5,
    backgroundColor: '#E2E8F0',
    borderRadius: 3,
    alignSelf: 'center',
    marginBottom: 20,
  },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 },
  modalTitle: { fontSize: 22, fontWeight: '900', color: Colors.text, letterSpacing: -0.5 },
  modalSubtitle: { fontSize: 13, color: Colors.textSecondary, marginTop: 4, fontWeight: '500' },
  closeBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#F1F5F9', justifyContent: 'center', alignItems: 'center' },
  
  searchBar: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#F1F5F9', 
    borderRadius: 16, 
    paddingHorizontal: 16, 
    marginBottom: 20, 
    height: 52,
    borderWidth: 1,
    borderColor: '#E2E8F0'
  },
  searchInput: { flex: 1, marginLeft: 10, fontSize: 15, color: Colors.text, fontWeight: '500' },
  
  listSectionLabel: { fontSize: 11, fontWeight: '800', color: Colors.textSecondary, letterSpacing: 1, marginBottom: 12, marginTop: 8 },
  sectionDivider: { height: 1, backgroundColor: '#F1F5F9', marginVertical: 16 },
  
  teamsList: { flex: 1 },
  teamItem: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingVertical: 12, 
    paddingHorizontal: 12,
    borderRadius: 16,
    marginBottom: 4,
    backgroundColor: 'transparent'
  },
  teamItemPressed: { backgroundColor: '#F8FAFC' },
  listAvatar: { 
    width: 48, 
    height: 48, 
    borderRadius: 14, 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginRight: 14,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 4 },
      android: { elevation: 4 }
    })
  },
  listAvatarText: { color: Colors.white, fontWeight: '900', fontSize: 18 },
  teamItemInfo: { flex: 1 },
  teamItemName: { fontSize: 16, fontWeight: '800', color: Colors.text },
  teamItemCity: { fontSize: 13, color: Colors.textSecondary, marginTop: 2, fontWeight: '500' },
  
  timeModalContent: { 
    backgroundColor: Colors.white, 
    borderRadius: 32, 
    width: '100%', 
    padding: 24, 
    alignItems: 'center',
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.1, shadowRadius: 20 },
      android: { elevation: 20 }
    })
  },
  timePickerRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 30, gap: 15 },
  timeCol: { width: 64 },
  periodCol: { width: 74 },
  timeUnit: { paddingVertical: 10, alignItems: 'center', borderRadius: 12, backgroundColor: '#F8FAFC' },
  timeUnitActive: { backgroundColor: Colors.maroon },
  timeUnitText: { fontSize: 24, fontWeight: '700', color: '#64748B' },
  timeUnitTextActive: { color: Colors.white, fontWeight: '900' },
  timeSep: { fontSize: 32, fontWeight: '900', color: Colors.maroon, opacity: 0.3 },
  saveBtn: { backgroundColor: Colors.maroon, width: '100%', paddingVertical: 18, borderRadius: 16, alignItems: 'center', marginTop: 10 },
  saveBtnText: { color: Colors.white, fontWeight: '900', fontSize: 16, letterSpacing: 0.5 },

  venueItem: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingVertical: 12, 
    paddingHorizontal: 12,
    borderRadius: 16,
    marginBottom: 8,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#F1F5F9',
    gap: 14 
  },
  venueIcon: { 
    width: 48, 
    height: 48, 
    borderRadius: 12, 
    backgroundColor: '#E2E8F0', 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  venueName: { fontSize: 16, fontWeight: '800', color: Colors.text },
  venueCity: { fontSize: 12, color: Colors.textSecondary, marginTop: 2, fontWeight: '500' },
  verifiedBadge: { 
    backgroundColor: '#059669', 
    paddingHorizontal: 8, 
    paddingVertical: 3, 
    borderRadius: 10, 
    flexDirection: 'row', 
    alignItems: 'center',
    gap: 4
  },
  verifiedText: { color: Colors.white, fontSize: 10, fontWeight: '900', textTransform: 'uppercase' },

  // Calendar Modal Styles
  calendarContent: { 
    backgroundColor: Colors.white, 
    borderRadius: 32, 
    width: '100%', 
    padding: 24, 
    paddingBottom: 20,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.1, shadowRadius: 20 },
      android: { elevation: 20 }
    })
  },
  calendarHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  monthNavBtn: { width: 44, height: 44, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F1F5F9', borderRadius: 14 },
  calendarMonthText: { fontSize: 19, fontWeight: '900', color: Colors.text, letterSpacing: -0.5 },
  weekdayRow: { flexDirection: 'row', marginBottom: 12 },
  weekdayText: { flex: 1, textAlign: 'center', fontSize: 12, fontWeight: '800', color: Colors.textSecondary, opacity: 0.6 },
  dayGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 0 },
  dayBox: { width: '14.28%', height: 46, justifyContent: 'center', alignItems: 'center', borderRadius: 14 },
  dayBoxActive: { backgroundColor: Colors.maroon, ...Platform.select({ ios: { shadowColor: Colors.maroon, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 }, android: { elevation: 5 } }) },
  dayText: { fontSize: 15, fontWeight: '700', color: Colors.text },
  dayTextActive: { color: Colors.white, fontWeight: '900' },
  cancelBtn: { marginTop: 12, paddingVertical: 14, alignItems: 'center' },
  cancelBtnText: { fontSize: 15, fontWeight: '700', color: Colors.textSecondary, letterSpacing: 0.3 },

  miniEmpty: { padding: 12, alignItems: 'center', backgroundColor: '#F8FAFC', borderRadius: 12 },
  miniEmptyText: { fontSize: 12, color: Colors.textSecondary, fontStyle: 'italic' },

  emptyState: { padding: 60, alignItems: 'center', justifyContent: 'center' },
  emptyText: { color: Colors.textSecondary, textAlign: 'center', fontSize: 14, fontWeight: '500', lineHeight: 20 },
});

export default MatchSetupScreen;
