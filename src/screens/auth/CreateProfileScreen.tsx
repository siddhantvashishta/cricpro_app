import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Alert,
    Dimensions
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { colors, spacing, typography, shadows, radius } from '../../theme';
import { useAppStore } from '../../store/useAppStore';

const ROLES = [
    { id: 'batsman', label: 'Batsman', icon: 'cricket' },
    { id: 'bowler', label: 'Bowler', icon: 'baseball' },
    { id: 'all_rounder', label: 'All-Rounder', icon: 'star' },
    { id: 'wicket_keeper', label: 'Wicket Keeper', icon: 'hand-back-left' },
];

export const CreateProfileScreen = () => {
    const navigation = useNavigation<any>();
    const { user, updateUserProfile } = useAppStore();

    const [selectedRole, setSelectedRole] = useState('batsman');
    const [city, setCity] = useState('');
    const [bio, setBio] = useState('');
    const [loading, setLoading] = useState(false);

    const handleComplete = () => {
        if (!city) {
            Alert.alert('Error', 'Please enter your city.');
            return;
        }

        setLoading(true);
        // Simulate update
        setTimeout(() => {
            updateUserProfile({
                role: ROLES.find(r => r.id === selectedRole)?.label || 'Player',
            });
            setLoading(false);
            // Navigation will be handled by App.tsx observing isAuthenticated
            // but for now, we can just let it land on Home
        }, 1000);
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.header}>
                        <Text style={styles.title}>Complete Your Profile</Text>
                        <Text style={styles.subtitle}>Help us tailor your experience by providing a few more details</Text>
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Select Your Primary Role</Text>
                        <View style={styles.rolesGrid}>
                            {ROLES.map((role) => (
                                <TouchableOpacity
                                    key={role.id}
                                    style={[
                                        styles.roleCard,
                                        selectedRole === role.id && styles.roleCardActive
                                    ]}
                                    onPress={() => setSelectedRole(role.id)}
                                >
                                    <View style={[
                                        styles.roleIconCircle,
                                        selectedRole === role.id && styles.roleIconCircleActive
                                    ]}>
                                        <MaterialCommunityIcons
                                            name={role.icon as any}
                                            size={28}
                                            color={selectedRole === role.id ? colors.primary : colors.text.tertiary}
                                        />
                                    </View>
                                    <Text style={[
                                        styles.roleLabel,
                                        selectedRole === role.id && styles.roleLabelActive
                                    ]}>
                                        {role.label}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Your Location</Text>
                        <View style={styles.inputContainer}>
                            <Ionicons name="location-outline" size={20} color={colors.text.tertiary} style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Enter your city (e.g., Bangalore)"
                                placeholderTextColor={colors.text.tertiary}
                                value={city}
                                onChangeText={setCity}
                            />
                        </View>
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Short Bio (Optional)</Text>
                        <View style={styles.textAreaContainer}>
                            <TextInput
                                style={styles.textArea}
                                placeholder="Tell us about your cricket career..."
                                placeholderTextColor={colors.text.tertiary}
                                multiline
                                numberOfLines={4}
                                value={bio}
                                onChangeText={setBio}
                                textAlignVertical="top"
                            />
                        </View>
                    </View>

                    <TouchableOpacity
                        style={[styles.completeButton, loading && styles.disabledButton]}
                        onPress={handleComplete}
                        disabled={loading}
                    >
                        <Text style={styles.completeButtonText}>
                            {loading ? 'Finalizing...' : 'Complete Setup'}
                        </Text>
                        <Ionicons name="arrow-forward" size={20} color="#fff" style={{ marginLeft: 8 }} />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.skipButton}
                        onPress={() => handleComplete()}
                    >
                        <Text style={styles.skipButtonText}>I'll do this later</Text>
                    </TouchableOpacity>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    scrollContent: {
        padding: spacing.xl,
        paddingBottom: spacing.xxl,
    },
    header: {
        marginBottom: spacing.xxl,
        marginTop: spacing.md,
    },
    title: {
        ...typography.presets.h1,
        color: colors.text.primary,
        fontSize: 28,
        marginBottom: spacing.xs,
    },
    subtitle: {
        ...typography.presets.bodySmall,
        color: colors.text.secondary,
        lineHeight: 22,
    },
    section: {
        marginBottom: spacing.xxl,
    },
    sectionTitle: {
        ...typography.presets.h3,
        color: colors.text.primary,
        marginBottom: spacing.md,
    },
    rolesGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing.md,
    },
    roleCard: {
        width: '47%',
        backgroundColor: colors.surface,
        borderRadius: 20,
        padding: spacing.md,
        alignItems: 'center',
        borderWidth: 1.5,
        borderColor: 'transparent',
        ...shadows.soft,
    },
    roleCardActive: {
        borderColor: colors.primary,
        backgroundColor: 'rgba(74, 144, 226, 0.05)',
    },
    roleIconCircle: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: 'rgba(255, 255, 255, 0.03)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: spacing.sm,
    },
    roleIconCircleActive: {
        backgroundColor: 'rgba(74, 144, 226, 0.1)',
    },
    roleLabel: {
        ...typography.presets.caption,
        color: colors.text.secondary,
        fontWeight: 'bold',
    },
    roleLabelActive: {
        color: colors.primary,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.surface,
        borderRadius: 16,
        paddingHorizontal: spacing.md,
        height: 56,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.05)',
        ...shadows.soft,
    },
    inputIcon: {
        marginRight: spacing.sm,
    },
    input: {
        flex: 1,
        color: colors.text.primary,
        ...typography.presets.body,
    },
    textAreaContainer: {
        backgroundColor: colors.surface,
        borderRadius: 16,
        padding: spacing.sm,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.05)',
        ...shadows.soft,
    },
    textArea: {
        height: 100,
        color: colors.text.primary,
        ...typography.presets.body,
        padding: spacing.sm,
    },
    completeButton: {
        backgroundColor: colors.primary,
        height: 60,
        borderRadius: 30,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: spacing.md,
        ...shadows.primary,
    },
    disabledButton: {
        opacity: 0.6,
    },
    completeButtonText: {
        ...typography.presets.h3,
        color: '#fff',
    },
    skipButton: {
        alignItems: 'center',
        marginTop: spacing.lg,
        padding: spacing.md,
    },
    skipButtonText: {
        ...typography.presets.bodySmall,
        color: colors.text.tertiary,
        fontWeight: '500',
    },
});
