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
    StatusBar,
    Image
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, radius } from '../../theme';
import { useImagePicker } from '../../hooks/useImagePicker';

export const CreateTeamScreen: React.FC = () => {
    const navigation = useNavigation();

    const statusBarHeight = Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0;

    // Form State
    const [teamName, setTeamName] = useState('');
    const [location, setLocation] = useState('');
    const [isPublic, setIsPublic] = useState(true);

    const { selectedImage: selectedLogo, pickImage, removeImage } = useImagePicker();

    const handleCreateTeam = () => {
        if (!teamName.trim()) {
            Alert.alert('Missing Info', 'Please enter a team name to continue.');
            return;
        }

        // Simulate API call for frontend mockup
        Alert.alert(
            'Team Created!',
            `Welcome to the league, ${teamName}!${selectedLogo ? ' (Logo attached)' : ' (No logo)'}`,
            [{ text: 'Great', onPress: () => navigation.goBack() }]
        );
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={[styles.header, { paddingTop: statusBarHeight }]}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={colors.text.inverse} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Create Team</Text>
                <View style={{ width: 44 }} />
            </View>

            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                    {/* Image Picker Section */}
                    <View style={styles.imagePickerContainer}>
                        <TouchableOpacity
                            style={[styles.imagePickerBox, selectedLogo && styles.imagePickerBoxSelected]}
                            onPress={pickImage}
                            activeOpacity={0.8}
                        >
                            {selectedLogo ? (
                                <>
                                    <Image source={{ uri: selectedLogo }} style={styles.selectedImage} />
                                    <TouchableOpacity style={styles.removeImageBadge} onPress={removeImage}>
                                        <Ionicons name="close-circle" size={24} color={colors.error} />
                                    </TouchableOpacity>
                                </>
                            ) : (
                                <>
                                    <View style={styles.placeholderIconContainer}>
                                        <Ionicons name="camera" size={32} color={colors.text.tertiary} />
                                    </View>
                                    <Text style={styles.imagePickerText}>Upload Logo</Text>
                                    <Text style={styles.optionalText}>(Optional)</Text>
                                </>
                            )}
                        </TouchableOpacity>
                    </View>

                    {/* Form Section */}
                    <View style={styles.formSection}>
                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>Team Name <Text style={styles.required}>*</Text></Text>
                            <TextInput
                                style={styles.input}
                                placeholder="e.g. Mumbai Strikers"
                                placeholderTextColor={colors.text.tertiary}
                                value={teamName}
                                onChangeText={setTeamName}
                                maxLength={30}
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>Home City / Location</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="e.g. Mumbai, Maharashtra"
                                placeholderTextColor={colors.text.tertiary}
                                value={location}
                                onChangeText={setLocation}
                            />
                        </View>

                        <Text style={styles.sectionTitle}>Privacy Settings</Text>

                        <View style={styles.privacyOptions}>
                            <TouchableOpacity
                                style={[styles.privacyCard, isPublic && styles.privacyCardActive]}
                                onPress={() => setIsPublic(true)}
                                activeOpacity={0.8}
                            >
                                <Ionicons name="earth" size={24} color={isPublic ? colors.primary : colors.text.secondary} />
                                <Text style={[styles.privacyTitle, isPublic && styles.privacyTitleActive]}>Public</Text>
                                <Text style={styles.privacyDesc}>Anyone can find and request to join your team.</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.privacyCard, !isPublic && styles.privacyCardActive]}
                                onPress={() => setIsPublic(false)}
                                activeOpacity={0.8}
                            >
                                <Ionicons name="lock-closed" size={24} color={!isPublic ? colors.primary : colors.text.secondary} />
                                <Text style={[styles.privacyTitle, !isPublic && styles.privacyTitleActive]}>Private</Text>
                                <Text style={styles.privacyDesc}>Only players you invite can see and join this team.</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                </ScrollView>

                {/* Sticky Bottom CTA */}
                <View style={styles.footer}>
                    <TouchableOpacity
                        style={[styles.createButton, !teamName.trim() && styles.createButtonDisabled]}
                        onPress={handleCreateTeam}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.createButtonText}>Create Team</Text>
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
        marginVertical: spacing.xl,
    },
    imagePickerBox: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: colors.surface,
        borderWidth: 1.5,
        borderColor: colors.border,
        borderStyle: 'dashed',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    imagePickerBoxSelected: {
        borderStyle: 'solid',
        borderColor: colors.primary,
    },
    placeholderIconContainer: {
        marginBottom: spacing.xs,
    },
    selectedImage: {
        width: '100%',
        height: '100%',
        borderRadius: 60,
    },
    removeImageBadge: {
        position: 'absolute',
        top: 0,
        right: 0,
        backgroundColor: colors.background,
        borderRadius: 12,
    },
    imagePickerText: {
        ...typography.presets.bodySmall,
        color: colors.text.secondary,
        fontWeight: typography.weights.medium,
    },
    optionalText: {
        ...typography.presets.caption,
        color: colors.text.tertiary,
    },
    formSection: {
        marginBottom: spacing.xl,
    },
    inputGroup: {
        marginBottom: spacing.lg,
    },
    inputLabel: {
        ...typography.presets.bodyLarge,
        fontWeight: typography.weights.medium,
        color: colors.text.primary,
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
    sectionTitle: {
        ...typography.presets.h3,
        color: colors.text.primary,
        fontWeight: typography.weights.bold,
        marginTop: spacing.md,
        marginBottom: spacing.md,
    },
    privacyOptions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: spacing.md,
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
        borderColor: colors.primary,
        backgroundColor: '#EBF2FA', // Light primary tint
    },
    privacyTitle: {
        ...typography.presets.bodyLarge,
        fontWeight: typography.weights.bold,
        color: colors.text.secondary,
        marginVertical: spacing.xs,
    },
    privacyTitleActive: {
        color: colors.primary,
    },
    privacyDesc: {
        ...typography.presets.bodySmall,
        color: colors.text.tertiary,
        textAlign: 'center',
    },
    footer: {
        padding: spacing.lg,
        backgroundColor: colors.background,
        borderTopWidth: 1,
        borderTopColor: colors.border,
    },
    createButton: {
        backgroundColor: colors.primary,
        paddingVertical: spacing.md,
        borderRadius: 8,
        alignItems: 'center',
        shadowColor: colors.primary,
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
