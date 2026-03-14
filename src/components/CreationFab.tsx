import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing } from '../theme';
import { useNavigation } from '@react-navigation/native';
import { useAppStore } from '../store/useAppStore';

export const CreationFab: React.FC = () => {
    const [modalVisible, setModalVisible] = useState(false);
    const [scale] = useState(new Animated.Value(1));

    const navigation = useNavigation<any>();
    const { activeTab } = useAppStore();

    const toggleModal = () => {
        if (activeTab === 'community') {
            navigation.navigate('WritePost');
            return;
        }

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
                    <Animated.View style={[styles.fabButton, { transform: [{ scale }] }, modalVisible && styles.fabButtonActive]}>
                        <Ionicons name={modalVisible ? "close" : "add"} size={32} color="white" />
                    </Animated.View>
                </TouchableOpacity>
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    fabWrapper: {
        position: 'absolute',
        bottom: 26, // Moved to primary bottom position for better accessibility
        right: 16,
        zIndex: 999,
    },
    fabButton: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#F97316',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#F97316', 
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.5,
        shadowRadius: 10,
        elevation: 8,
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    fabButtonActive: {
        backgroundColor: colors.error,
        shadowColor: colors.error,
    },
    modalOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        zIndex: 900,
    },
    modalContent: {
        position: 'absolute',
        bottom: 160, // Positioned above the whole stack (FAB + Toss icon)
        right: 16,
        width: 260,
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: spacing.md,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 15,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    actionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
    },
    iconBox: {
        width: 40,
        height: 40,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: spacing.md,
    },
    actionText: {
        ...typography.presets.bodyLarge,
        fontWeight: '700',
        color: '#1E293B',
        flex: 1,
    }
});
