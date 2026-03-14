import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Modal,
    TouchableOpacity,
    TouchableWithoutFeedback,
    Animated,
    Dimensions
} from 'react-native';
import { colors, spacing, typography, radius } from '../theme';

export interface ActionOption {
    label: string;
    onPress: () => void;
    isDestructive?: boolean;
}

interface ActionSheetModalProps {
    visible: boolean;
    onClose: () => void;
    title?: string;
    options: ActionOption[];
}

export const ActionSheetModal: React.FC<ActionSheetModalProps> = ({
    visible,
    onClose,
    title,
    options
}) => {
    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="slide"
            onRequestClose={onClose}
        >
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={styles.overlay}>
                    <TouchableWithoutFeedback>
                        <View style={styles.sheetLayout}>
                            {title && (
                                <View style={styles.header}>
                                    <Text style={styles.titleText}>{title}</Text>
                                </View>
                            )}

                            <View style={styles.optionsContainer}>
                                {options.map((option, index) => (
                                    <TouchableOpacity
                                        key={index}
                                        style={[
                                            styles.optionBtn,
                                            index === options.length - 1 && styles.lastOption
                                        ]}
                                        onPress={() => {
                                            onClose();
                                            setTimeout(option.onPress, 300); // Small delay to allow modal to close
                                        }}
                                    >
                                        <Text style={[
                                            styles.optionText,
                                            option.isDestructive && styles.destructiveText
                                        ]}>
                                            {option.label}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>

                            <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
                                <Text style={styles.cancelText}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    sheetLayout: {
        backgroundColor: '#F3F4F6', // Match app's light background
        borderTopLeftRadius: radius.xxl,
        borderTopRightRadius: radius.xxl,
        paddingBottom: spacing.xxl,
        paddingHorizontal: spacing.md,
    },
    header: {
        padding: spacing.lg,
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    titleText: {
        ...typography.presets.bodySmall,
        color: colors.text.tertiary,
        textAlign: 'center',
    },
    optionsContainer: {
        backgroundColor: colors.surface,
        borderRadius: radius.lg,
        marginTop: spacing.md,
        overflow: 'hidden',
    },
    optionBtn: {
        padding: spacing.lg,
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    lastOption: {
        borderBottomWidth: 0,
    },
    optionText: {
        ...typography.presets.bodyLarge,
        color: colors.primary,
    },
    destructiveText: {
        color: colors.error,
    },
    cancelBtn: {
        backgroundColor: colors.surface,
        borderRadius: radius.lg,
        marginTop: spacing.sm,
        padding: spacing.lg,
        alignItems: 'center',
    },
    cancelText: {
        ...typography.presets.bodyLarge,
        fontWeight: typography.weights.bold,
        color: colors.text.primary,
    },
});
