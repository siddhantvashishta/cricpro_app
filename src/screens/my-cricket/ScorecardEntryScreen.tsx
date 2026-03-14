import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, TextInput, Alert, Platform, StatusBar } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, spacing, typography, radius } from '../../theme';
import { useAppStore } from '../../store/useAppStore';

export const ScorecardEntryScreen: React.FC = () => {
    const navigation = useNavigation<any>();
    const route = useRoute();
    const { matchId } = (route.params as any) || {};
    const updateMatch = useAppStore((state) => state.updateMatch);
    const matches = useAppStore((state) => state.matches);
    const match = matches.find(m => m.id === matchId);

    const [t1Runs, setT1Runs] = useState('');
    const [t1Wickets, setT1Wickets] = useState('');
    const [t1Overs, setT1Overs] = useState('');

    const [t2Runs, setT2Runs] = useState('');
    const [t2Wickets, setT2Wickets] = useState('');
    const [t2Overs, setT2Overs] = useState('');

    const statusBarHeight = Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0;

    if (!match) return null;

    const handleSaveScorecard = () => {
        if (!t1Runs || !t2Runs) {
            Alert.alert('Incomplete Data', 'Please enter at least the runs for both teams.');
            return;
        }

        const r1 = parseInt(t1Runs);
        const r2 = parseInt(t2Runs);
        const w1 = t1Wickets || '0';
        const w2 = t2Wickets || '0';
        const o1 = t1Overs || '20.0';
        const o2 = t2Overs || '20.0';

        let result = '';
        if (r1 > r2) {
            result = `${match.team_a.name} won by ${r1 - r2} runs`;
        } else if (r2 > r1) {
            result = `${match.team_b.name} won by ${r2 - r1} runs`;
        } else {
            result = 'Match Tied';
        }

        updateMatch(match.id, {
            status: 'finished',
            team_a: { ...match.team_a, score: `${r1}/${w1}`, overs: o1 },
            team_b: { ...match.team_b, score: `${r2}/${w2}`, overs: o2 },
            result: result,
            highlight: true
        });

        Alert.alert('Success', 'Scorecard finalized and match updated!', [
            { text: 'OK', onPress: () => navigation.navigate('Results') }
        ]);
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={[styles.header, { paddingTop: statusBarHeight }]}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="close" size={24} color="white" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Enter Scorecard</Text>
                <TouchableOpacity onPress={handleSaveScorecard}>
                    <Text style={styles.saveBtn}>SAVE</Text>
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.matchBanner}>
                    <Text style={styles.matchTitle}>{match.team_a.name} vs {match.team_b.name}</Text>
                    <Text style={styles.venueText}>{match.venue}</Text>
                </View>

                {/* Team 1 Entry */}
                <View style={styles.entrySection}>
                    <Text style={styles.teamHeader}>{match.team_a.name}</Text>
                    <View style={styles.entryRow}>
                        <View style={styles.inputBox}>
                            <Text style={styles.label}>Runs</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="0"
                                keyboardType="numeric"
                                value={t1Runs}
                                onChangeText={setT1Runs}
                            />
                        </View>
                        <View style={styles.inputBox}>
                            <Text style={styles.label}>Wickets</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="0"
                                keyboardType="numeric"
                                value={t1Wickets}
                                onChangeText={setT1Wickets}
                            />
                        </View>
                        <View style={styles.inputBox}>
                            <Text style={styles.label}>Overs</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="20.0"
                                keyboardType="numeric"
                                value={t1Overs}
                                onChangeText={setT1Overs}
                            />
                        </View>
                    </View>
                </View>

                {/* Team 2 Entry */}
                <View style={[styles.entrySection, { marginTop: spacing.xl }]}>
                    <Text style={styles.teamHeader}>{match.team_b.name}</Text>
                    <View style={styles.entryRow}>
                        <View style={styles.inputBox}>
                            <Text style={styles.label}>Runs</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="0"
                                keyboardType="numeric"
                                value={t2Runs}
                                onChangeText={setT2Runs}
                            />
                        </View>
                        <View style={styles.inputBox}>
                            <Text style={styles.label}>Wickets</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="0"
                                keyboardType="numeric"
                                value={t2Wickets}
                                onChangeText={setT2Wickets}
                            />
                        </View>
                        <View style={styles.inputBox}>
                            <Text style={styles.label}>Overs</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="20.0"
                                keyboardType="numeric"
                                value={t2Overs}
                                onChangeText={setT2Overs}
                            />
                        </View>
                    </View>
                </View>

                <View style={styles.infoBox}>
                    <MaterialCommunityIcons name="information" size={20} color={colors.text.tertiary} />
                    <Text style={styles.infoText}>
                        Saving this scorecard will mark the match as "Finished" and update the standings in the results section.
                    </Text>
                </View>
            </ScrollView>

            <TouchableOpacity style={styles.footerAction} onPress={handleSaveScorecard}>
                <Text style={styles.footerActionText}>Finalize Result</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
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
        color: 'white',
        fontWeight: 'bold',
    },
    saveBtn: {
        ...typography.presets.body,
        fontWeight: 'bold',
        color: colors.success,
    },
    scrollContent: {
        padding: spacing.lg,
    },
    matchBanner: {
        alignItems: 'center',
        marginBottom: spacing.xxl,
    },
    matchTitle: {
        ...typography.presets.h2,
        color: colors.text.primary,
    },
    venueText: {
        ...typography.presets.caption,
        color: colors.text.tertiary,
        marginTop: 4,
    },
    entrySection: {
        backgroundColor: colors.surface,
        borderRadius: radius.lg,
        padding: spacing.lg,
        borderWidth: 1,
        borderColor: colors.border,
    },
    teamHeader: {
        ...typography.presets.bodyLarge,
        fontWeight: 'bold',
        color: colors.primary,
        marginBottom: spacing.md,
    },
    entryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    inputBox: {
        flex: 1,
        marginHorizontal: spacing.xs,
    },
    label: {
        ...typography.presets.caption,
        color: colors.text.secondary,
        marginBottom: 4,
        fontWeight: 'bold',
    },
    input: {
        backgroundColor: '#F3F4F6',
        borderRadius: radius.sm,
        padding: spacing.md,
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.text.primary,
        textAlign: 'center',
    },
    infoBox: {
        flexDirection: 'row',
        marginTop: spacing.xl,
        padding: spacing.md,
        backgroundColor: '#F1F5F9',
        borderRadius: radius.md,
        alignItems: 'center',
    },
    infoText: {
        flex: 1,
        fontSize: 12,
        color: colors.text.secondary,
        marginLeft: spacing.sm,
    },
    footerAction: {
        backgroundColor: colors.success,
        padding: spacing.lg,
        alignItems: 'center',
        justifyContent: 'center',
        margin: spacing.lg,
        borderRadius: radius.md,
    },
    footerActionText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 18,
    }
});
