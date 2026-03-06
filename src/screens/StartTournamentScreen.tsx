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
    Switch,
    StatusBar
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing } from '../theme';

export const StartTournamentScreen: React.FC = () => {
    const navigation = useNavigation();

    const statusBarHeight = Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0;

    // Form State
    const [tournamentName, setTournamentName] = useState('');
    const [location, setLocation] = useState('');
    const [entryFee, setEntryFee] = useState('');
    const [isPublic, setIsPublic] = useState(true);
    const [requireApproval, setRequireApproval] = useState(false);

    const handleCreateTournament = () => {
        if (!tournamentName.trim()) {
            Alert.alert('Missing Info', 'Please enter a tournament name to continue.');
            return;
        }

        // Simulate API call for frontend mockup
        Alert.alert(
            'Tournament Created!',
            `Registration is now open for ${tournamentName}.`,
            [{ text: 'Great', onPress: () => navigation.goBack() }]
        );
    };

    const handleLogoPick = () => {
        Alert.alert('Upload Logo', 'Opens image picker for tournament crest.');
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={[styles.header, { paddingTop: statusBarHeight }]}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={colors.text.inverse} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Start Tournament</Text>
                <View style={{ width: 44 }} />
            </View>

            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                    {/* Image Picker */}
                    <View style={styles.imagePickerContainer}>
                        <TouchableOpacity style={styles.imagePickerBox} onPress={handleLogoPick} activeOpacity={0.8}>
                            <Ionicons name="image" size={32} color={colors.text.tertiary} />
                            <Text style={styles.imagePickerText}>Add Banner</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Form Details */}
                    <View style={styles.formSection}>
                        <Text style={styles.sectionTitle}>Tournament Details</Text>

                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>Tournament Name <Text style={styles.required}>*</Text></Text>
                            <TextInput
                                style={styles.input}
                                placeholder="e.g. Summer Premier League"
                                placeholderTextColor={colors.text.tertiary}
                                value={tournamentName}
                                onChangeText={setTournamentName}
                                maxLength={40}
                            />
                        </View>

                        <View style={styles.rowInputs}>
                            <View style={[styles.inputGroup, { flex: 2, marginRight: spacing.md }]}>
                                <Text style={styles.inputLabel}>Ground/Location</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="City or Stadium"
                                    placeholderTextColor={colors.text.tertiary}
                                    value={location}
                                    onChangeText={setLocation}
                                />
                            </View>

                            <View style={[styles.inputGroup, { flex: 1 }]}>
                                <Text style={styles.inputLabel}>Entry Fee</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Free"
                                    placeholderTextColor={colors.text.tertiary}
                                    keyboardType="numeric"
                                    value={entryFee}
                                    onChangeText={setEntryFee}
                                />
                            </View>
                        </View>

                        <Text style={[styles.sectionTitle, { marginTop: spacing.lg }]}>Visibility & Registration</Text>

                        <View style={styles.privacyOptions}>
                            <TouchableOpacity
                                style={[styles.privacyCard, isPublic && styles.privacyCardActive]}
                                onPress={() => setIsPublic(true)}
                                activeOpacity={0.8}
                            >
                                <Ionicons name="earth" size={24} color={isPublic ? colors.accent : colors.text.secondary} />
                                <Text style={[styles.privacyTitle, isPublic && { color: colors.accent }]}>Open</Text>
                                <Text style={styles.privacyDesc}>Anyone can find and register their team.</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.privacyCard, !isPublic && styles.privacyCardActive]}
                                onPress={() => setIsPublic(false)}
                                activeOpacity={0.8}
                            >
                                <Ionicons name="lock-closed" size={24} color={!isPublic ? colors.accent : colors.text.secondary} />
                                <Text style={[styles.privacyTitle, !isPublic && { color: colors.accent }]}>Invite Only</Text>
                                <Text style={styles.privacyDesc}>Hidden from public. You manually invite teams.</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.switchRow}>
                            <View style={styles.switchTextContainer}>
                                <Text style={styles.switchTitle}>Require Approval</Text>
                                <Text style={styles.switchDesc}>Manually approve teams who request to join.</Text>
                            </View>
                            <Switch
                                trackColor={{ false: colors.border, true: colors.accent }}
                                thumbColor={colors.text.inverse}
                                onValueChange={setRequireApproval}
                                value={requireApproval}
                            />
                        </View>
                    </View>

                </ScrollView>

                {/* Sticky Bottom CTA */}
                <View style={styles.footer}>
                    <TouchableOpacity
                        style={[styles.createButton, !tournamentName.trim() && styles.createButtonDisabled]}
                        onPress={handleCreateTournament}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.createButtonText}>Start Tournament</Text>
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
    imagePickerContainer: {
        alignItems: 'center',
        marginTop: spacing.md,
        marginBottom: spacing.xl,
    },
    imagePickerBox: {
        width: '100%',
        height: 140,
        borderRadius: 12,
        backgroundColor: colors.surface,
        borderWidth: 2,
        borderColor: colors.border,
        borderStyle: 'dashed',
        justifyContent: 'center',
        alignItems: 'center',
    },
    imagePickerText: {
        ...typography.presets.body,
        color: colors.text.tertiary,
        marginTop: spacing.sm,
    },
    sectionTitle: {
        ...typography.presets.h3,
        color: colors.text.primary,
        fontWeight: typography.weights.bold,
        marginBottom: spacing.md,
    },
    formSection: {
        marginBottom: spacing.xl,
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
    privacyOptions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: spacing.md,
        marginBottom: spacing.xl,
    },
    privacyCard: {
        flex: 1,
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 12,
        padding: spacing.md,
        alignItems: 'center',
    },
    privacyCardActive: {
        borderColor: colors.accent,
        backgroundColor: '#FFF0E6', // Light accent tint
    },
    privacyTitle: {
        ...typography.presets.bodyLarge,
        fontWeight: typography.weights.bold,
        color: colors.text.secondary,
        marginVertical: spacing.xs,
    },
    privacyDesc: {
        ...typography.presets.bodySmall,
        color: colors.text.tertiary,
        textAlign: 'center',
    },
    switchRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: colors.surface,
        padding: spacing.md,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: colors.border,
    },
    switchTextContainer: {
        flex: 1,
        marginRight: spacing.md,
    },
    switchTitle: {
        ...typography.presets.bodyLarge,
        fontWeight: typography.weights.bold,
        color: colors.text.primary,
        marginBottom: 2,
    },
    switchDesc: {
        ...typography.presets.bodySmall,
        color: colors.text.secondary,
    },
    footer: {
        padding: spacing.lg,
        backgroundColor: colors.background,
        borderTopWidth: 1,
        borderTopColor: colors.border,
    },
    createButton: {
        backgroundColor: colors.accent, // Using accent color for Tournaments
        paddingVertical: spacing.md,
        borderRadius: 8,
        alignItems: 'center',
        shadowColor: colors.accent,
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
