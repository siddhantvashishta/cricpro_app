import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Modal,
    TouchableOpacity,
    TextInput,
    KeyboardAvoidingView,
    Platform,
    Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography, radius } from '../theme';

interface ApplyModalProps {
    visible: boolean;
    onClose: () => void;
    targetName: string;
}

export const ApplyModal: React.FC<ApplyModalProps> = ({ visible, onClose, targetName }) => {
    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <TouchableOpacity
                    style={styles.touchableOverlay}
                    activeOpacity={1}
                    onPress={onClose}
                />
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.modalContainer}
                >
                    <View style={styles.card}>
                        <View style={styles.header}>
                            <Text style={styles.headerTitle}>Apply / Match Request</Text>
                            <TouchableOpacity onPress={onClose}>
                                <Ionicons name="close" size={24} color={colors.text.primary} />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.body}>
                            <Text style={styles.description}>
                                Sending request to <Text style={styles.bold}>{targetName}</Text>
                            </Text>

                            <Text style={styles.label}>Your Message (Optional)</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Add a short pitch or note..."
                                placeholderTextColor={colors.text.tertiary}
                                multiline
                                numberOfLines={3}
                            />

                            <View style={styles.infoBox}>
                                <Ionicons name="information-circle-outline" size={16} color={colors.text.secondary} />
                                <Text style={styles.infoText}>
                                    Your professional cricket profile will be shared with the team.
                                </Text>
                            </View>

                            <TouchableOpacity
                                style={styles.confirmBtn}
                                onPress={() => {
                                    Alert.alert('Success', 'Your application has been sent to ' + targetName);
                                    onClose();
                                }}
                            >
                                <Ionicons name="send" size={16} color={colors.text.inverse} style={{ marginRight: 8 }} />
                                <Text style={styles.confirmText}>Send Application</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    touchableOverlay: {
        ...StyleSheet.absoluteFillObject,
    },
    modalContainer: {
        width: '90%',
    },
    card: {
        backgroundColor: colors.surface,
        borderRadius: radius.xl,
        overflow: 'hidden',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: spacing.lg,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    headerTitle: {
        ...typography.presets.h3,
        color: colors.text.primary,
    },
    body: {
        padding: spacing.lg,
    },
    description: {
        ...typography.presets.body,
        color: colors.text.secondary,
        marginBottom: spacing.lg,
    },
    bold: {
        fontWeight: typography.weights.bold,
        color: colors.text.primary,
    },
    label: {
        ...typography.presets.bodySmall,
        fontWeight: typography.weights.bold,
        color: colors.text.primary,
        marginBottom: spacing.sm,
    },
    input: {
        backgroundColor: '#F3F4F6',
        borderRadius: radius.md,
        padding: spacing.md,
        height: 80,
        textAlignVertical: 'top',
        ...typography.presets.body,
        color: colors.text.primary,
    },
    infoBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F8FAFC',
        padding: spacing.sm,
        borderRadius: radius.sm,
        marginTop: spacing.md,
    },
    infoText: {
        ...typography.presets.caption,
        color: colors.text.secondary,
        marginLeft: 8,
        flex: 1,
    },
    confirmBtn: {
        flexDirection: 'row',
        backgroundColor: '#F97316',
        padding: spacing.md,
        borderRadius: radius.md,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: spacing.xl,
    },
    confirmText: {
        ...typography.presets.bodyLarge,
        color: colors.text.inverse,
        fontWeight: typography.weights.bold,
    },
});
