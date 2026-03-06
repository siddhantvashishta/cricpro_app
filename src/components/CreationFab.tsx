import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing } from '../theme';
import { useNavigation } from '@react-navigation/native';

export const CreationFab: React.FC = () => {
    const [modalVisible, setModalVisible] = useState(false);
    const [scale] = useState(new Animated.Value(1));

    const navigation = useNavigation<any>();

    const toggleModal = () => {
        Animated.sequence([
            Animated.timing(scale, { toValue: 0.9, duration: 100, useNativeDriver: true }),
            Animated.timing(scale, { toValue: 1, duration: 100, useNativeDriver: true })
        ]).start(() => setModalVisible(!modalVisible));
    };

    const handleAction = (screenName: string) => {
        setModalVisible(false);
        navigation.navigate(screenName);
    };

    return (
        <>
            {modalVisible && (
                <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
                    <View style={styles.modalOverlay}>
                        <TouchableWithoutFeedback>
                            <View style={styles.modalContent}>
                                <TouchableOpacity style={styles.actionItem} onPress={() => handleAction('CreateTeam')}>
                                    <View style={[styles.iconBox, { backgroundColor: '#EBF2FA' }]}>
                                        <Ionicons name="shield" size={18} color={colors.primary} />
                                    </View>
                                    <Text style={styles.actionText}>Create Team</Text>
                                </TouchableOpacity>

                                <TouchableOpacity style={styles.actionItem} onPress={() => handleAction('StartTournament')}>
                                    <View style={[styles.iconBox, { backgroundColor: '#FFF0E6' }]}>
                                        <Ionicons name="trophy" size={18} color={colors.accent} />
                                    </View>
                                    <Text style={styles.actionText} numberOfLines={1}>Start Tournament</Text>
                                </TouchableOpacity>

                                <TouchableOpacity style={styles.actionItem} onPress={() => handleAction('ScheduleMatch')}>
                                    <View style={[styles.iconBox, { backgroundColor: '#ECFDF5' }]}>
                                        <Ionicons name="baseball" size={18} color={colors.success} />
                                    </View>
                                    <Text style={styles.actionText}>Schedule Match</Text>
                                </TouchableOpacity>

                                <TouchableOpacity style={styles.actionItem} onPress={() => handleAction('WritePost')}>
                                    <View style={[styles.iconBox, { backgroundColor: '#FEF3C7' }]}>
                                        <Ionicons name="create" size={18} color={colors.warning} />
                                    </View>
                                    <Text style={styles.actionText}>Write Post</Text>
                                </TouchableOpacity>

                                <TouchableOpacity style={styles.actionItem} onPress={() => handleAction('InstantScoring')}>
                                    <View style={[styles.iconBox, { backgroundColor: '#FEE2E2' }]}>
                                        <Ionicons name="speedometer" size={18} color={colors.error} />
                                    </View>
                                    <Text style={styles.actionText}>Instant Scoring</Text>
                                </TouchableOpacity>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>
            )}

            <View style={styles.fabWrapper}>
                <TouchableOpacity activeOpacity={0.8} onPress={toggleModal}>
                    <Animated.View style={[styles.fabButton, { transform: [{ scale }] }]}>
                        <Ionicons name={modalVisible ? "close" : "add"} size={28} color={colors.text.inverse} />
                    </Animated.View>
                </TouchableOpacity>
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    fabWrapper: {
        position: 'absolute',
        bottom: 96, // Positioned 16px above the 56px-tall Toss icon (24 bottom + 56 height + 16 gap = 96)
        right: 24,
        zIndex: 999, // FAB always on top
    },
    fabButton: {
        width: 44, // Same size as coin image
        height: 44,
        borderRadius: 22,
        backgroundColor: colors.primary, // Brand deep blue
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: colors.primary, // Colored shadow for premium look
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 8,
        elevation: 6,
    },
    modalOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'transparent',
        zIndex: 900,
    },
    modalContent: {
        position: 'absolute',
        bottom: 152, // Shifted up to match the FAB's new vertical position (96 bottom + 44 height + 12 gap = 152)
        right: 24,
        width: 250,
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        borderRadius: 16,
        padding: spacing.md,
        borderWidth: 1,
        borderColor: 'rgba(226, 232, 240, 0.5)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 8,
    },
    actionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: spacing.sm,
    },
    iconBox: {
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: spacing.md,
        backgroundColor: colors.surfaceHighlight, // Give icons a slight colored background again for contrast
    },
    actionText: {
        ...typography.presets.bodyLarge,
        fontWeight: typography.weights.medium,
        color: colors.text.primary,
        flex: 1, // Take up remaining space
    }
});
