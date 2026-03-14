import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    TouchableOpacity,
    TextInput,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    Alert,
    StatusBar
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing } from '../../theme';
import { useAppStore } from '../../store/useAppStore';
import { MatchDetails } from '../../data/mockMatches';

export const ScheduleMatchScreen: React.FC = () => {
    const navigation = useNavigation();
    const addMatch = useAppStore((state) => state.addMatch);

    const statusBarHeight = Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0;

    // Form State
    const [teamOne, setTeamOne] = useState('');
    const [teamTwo, setTeamTwo] = useState('');
    const [ground, setGround] = useState('');
    const [overs, setOvers] = useState('20');
    const [ballType, setBallType] = useState('Leather'); // Leather or Tennis

    const handleScheduleMatch = () => {
        if (!teamOne.trim() || !teamTwo.trim()) {
            Alert.alert('Missing Info', 'Please enter both team names to schedule a match.');
            return;
        }

        const newMatch: MatchDetails = {
            id: `m_${Date.now()}`,
            status: 'upcoming',
            team_a: { name: teamOne },
            team_b: { name: teamTwo },
            time: 'Upcoming Match',
            location: ground || 'TBD',
            venue: ground || 'TBD',
            series: 'Local Match',
            toss: 'Toss not completed',
        };

        addMatch(newMatch);

        Alert.alert(
            'Match Scheduled!',
            `${teamOne} vs ${teamTwo} is officially booked.`,
            [{ text: 'Great', onPress: () => navigation.goBack() }]
        );
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={[styles.header, { paddingTop: statusBarHeight }]}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={colors.text.inverse} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Schedule Match</Text>
                <View style={{ width: 44 }} />
            </View>

            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                    {/* Teams Section */}
                    <View style={styles.formSection}>
                        <Text style={styles.sectionTitle}>Select Teams</Text>

                        <View style={styles.teamSelectorContainer}>
                            <View style={[styles.inputGroup, { flex: 1 }]}>
                                <Text style={styles.inputLabel}>Team 1 (Host) <Text style={styles.required}>*</Text></Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Your Team"
                                    placeholderTextColor={colors.text.tertiary}
                                    value={teamOne}
                                    onChangeText={setTeamOne}
                                />
                            </View>

                            <View style={styles.vsCircle}>
                                <Text style={styles.vsText}>VS</Text>
                            </View>

                            <View style={[styles.inputGroup, { flex: 1 }]}>
                                <Text style={styles.inputLabel}>Team 2 (Away) <Text style={styles.required}>*</Text></Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Opponent"
                                    placeholderTextColor={colors.text.tertiary}
                                    value={teamTwo}
                                    onChangeText={setTeamTwo}
                                />
                            </View>
                        </View>

                        <Text style={[styles.sectionTitle, { marginTop: spacing.lg }]}>Match Details</Text>

                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>Ground/Location</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Search grounds..."
                                placeholderTextColor={colors.text.tertiary}
                                value={ground}
                                onChangeText={setGround}
                            />
                        </View>

                        <View style={styles.rowInputs}>
                            <View style={[styles.inputGroup, { flex: 1, marginRight: spacing.md }]}>
                                <Text style={styles.inputLabel}>Overs</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="20"
                                    placeholderTextColor={colors.text.tertiary}
                                    keyboardType="numeric"
                                    value={overs}
                                    onChangeText={setOvers}
                                    maxLength={3}
                                />
                            </View>

                            <View style={[styles.inputGroup, { flex: 1 }]}>
                                <Text style={styles.inputLabel}>Ball Type</Text>
                                <View style={styles.toggleRow}>
                                    <TouchableOpacity
                                        style={[styles.toggleBtn, ballType === 'Leather' && styles.toggleBtnActive]}
                                        onPress={() => setBallType('Leather')}
                                        activeOpacity={0.8}
                                    >
                                        <Text style={[styles.toggleBtnText, ballType === 'Leather' && styles.toggleBtnTextActive]}>Leather</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={[styles.toggleBtn, ballType === 'Tennis' && styles.toggleBtnActive]}
                                        onPress={() => setBallType('Tennis')}
                                        activeOpacity={0.8}
                                    >
                                        <Text style={[styles.toggleBtnText, ballType === 'Tennis' && styles.toggleBtnTextActive]}>Tennis</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>

                        {/* Date & Time Picker Mock */}
                        <View style={styles.dateTimeContainer}>
                            <TouchableOpacity style={styles.datePickerBtn} activeOpacity={0.8}>
                                <Ionicons name="calendar-outline" size={20} color={colors.text.secondary} />
                                <Text style={styles.datePickerText}>Select Date</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.datePickerBtn} activeOpacity={0.8}>
                                <Ionicons name="time-outline" size={20} color={colors.text.secondary} />
                                <Text style={styles.datePickerText}>Select Time</Text>
                            </TouchableOpacity>
                        </View>

                    </View>

                </ScrollView>

                {/* Sticky Bottom CTA */}
                <View style={styles.footer}>
                    <TouchableOpacity
                        style={[styles.createButton, (!teamOne.trim() || !teamTwo.trim()) && styles.createButtonDisabled]}
                        onPress={handleScheduleMatch}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.createButtonText}>Schedule Match</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: colors.background,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: colors.primary,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.md,
    },
    backButton: {
        padding: spacing.xs,
    },
    headerTitle: {
        ...typography.presets.h3,
        color: colors.text.inverse,
        fontWeight: typography.weights.bold,
    },
    scrollContent: {
        padding: spacing.lg,
    },
    sectionTitle: {
        ...typography.presets.h3,
        color: colors.text.primary,
        fontWeight: typography.weights.bold,
        marginBottom: spacing.md,
    },
    formSection: {
        marginBottom: spacing.xl,
        marginTop: spacing.md,
    },
    teamSelectorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: spacing.sm,
    },
    vsCircle: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: colors.success,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: spacing.sm,
        marginTop: 18, // visually align between inputs
        shadowColor: colors.success,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 3,
    },
    vsText: {
        ...typography.presets.bodySmall,
        color: colors.text.inverse,
        fontWeight: typography.weights.bold,
    },
    rowInputs: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    inputGroup: {
        marginBottom: spacing.lg,
    },
    inputLabel: {
        ...typography.presets.body,
        fontWeight: typography.weights.medium,
        color: colors.text.secondary,
        marginBottom: spacing.xs,
    },
    required: {
        color: colors.error,
    },
    input: {
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 8,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.md,
        ...typography.presets.bodyLarge,
        color: colors.text.primary,
    },
    toggleRow: {
        flexDirection: 'row',
        backgroundColor: colors.surface,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: colors.border,
        overflow: 'hidden',
    },
    toggleBtn: {
        flex: 1,
        paddingVertical: spacing.md,
        alignItems: 'center',
        justifyContent: 'center',
    },
    toggleBtnActive: {
        backgroundColor: colors.success, // Success green for Matches
    },
    toggleBtnText: {
        ...typography.presets.body,
        color: colors.text.secondary,
        fontWeight: typography.weights.medium,
    },
    toggleBtnTextActive: {
        color: colors.text.inverse,
        fontWeight: typography.weights.bold,
    },
    dateTimeContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: spacing.sm,
    },
    datePickerBtn: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 8,
        paddingVertical: spacing.md,
        marginHorizontal: spacing.xs,
    },
    datePickerText: {
        ...typography.presets.body,
        color: colors.text.primary,
        marginLeft: spacing.sm,
    },
    footer: {
        padding: spacing.lg,
        backgroundColor: colors.background,
        borderTopWidth: 1,
        borderTopColor: colors.border,
    },
    createButton: {
        backgroundColor: colors.success, // Match green theme
        paddingVertical: spacing.md,
        borderRadius: 8,
        alignItems: 'center',
        shadowColor: colors.success,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    createButtonDisabled: {
        backgroundColor: colors.text.tertiary,
        shadowOpacity: 0,
        elevation: 0,
    },
    createButtonText: {
        ...typography.presets.h3,
        color: colors.text.inverse,
        fontWeight: typography.weights.bold,
    }
});
