import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Modal,
    TouchableOpacity,
    TextInput,
    ScrollView,
    KeyboardAvoidingView,
    Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radius, typography } from '../../theme';

interface AddressEditModalProps {
    visible: boolean;
    onClose: () => void;
    currentAddress: {
        name: string;
        street: string;
        city: string;
        state: string;
        zip: string;
        phone: string;
    } | null;
    onSave: (address: any) => void;
}

export const AddressEditModal: React.FC<AddressEditModalProps> = ({
    visible,
    onClose,
    currentAddress,
    onSave
}) => {
    const [form, setForm] = useState({
        name: '',
        street: '',
        city: '',
        state: '',
        zip: '',
        phone: ''
    });

    useEffect(() => {
        if (currentAddress) {
            setForm(currentAddress);
        }
    }, [currentAddress, visible]);

    const handleSave = () => {
        // Basic validation
        if (!form.name || !form.street || !form.city || !form.phone) {
            return;
        }
        onSave(form);
        onClose();
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.modalContainer}
                >
                    <View style={styles.header}>
                        <Text style={styles.headerTitle}>Delivery Address</Text>
                        <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                            <Ionicons name="close" size={24} color={colors.text.primary} />
                        </TouchableOpacity>
                    </View>

                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.formContent}>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Full Name</Text>
                            <TextInput
                                style={styles.input}
                                value={form.name}
                                onChangeText={(val) => setForm({ ...form, name: val })}
                                placeholder="Enter your full name"
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Phone Number</Text>
                            <TextInput
                                style={styles.input}
                                value={form.phone}
                                onChangeText={(val) => setForm({ ...form, phone: val })}
                                placeholder="Mobile number"
                                keyboardType="phone-pad"
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Flat, House no., Building, Apartment</Text>
                            <TextInput
                                style={styles.input}
                                value={form.street}
                                onChangeText={(val) => setForm({ ...form, street: val })}
                                placeholder="Address details"
                            />
                        </View>

                        <View style={styles.row}>
                            <View style={[styles.inputGroup, { flex: 1, marginRight: spacing.md }]}>
                                <Text style={styles.label}>City</Text>
                                <TextInput
                                    style={styles.input}
                                    value={form.city}
                                    onChangeText={(val) => setForm({ ...form, city: val })}
                                    placeholder="City"
                                />
                            </View>
                            <View style={[styles.inputGroup, { flex: 1 }]}>
                                <Text style={styles.label}>State</Text>
                                <TextInput
                                    style={styles.input}
                                    value={form.state}
                                    onChangeText={(val) => setForm({ ...form, state: val })}
                                    placeholder="State"
                                />
                            </View>
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Pincode</Text>
                            <TextInput
                                style={styles.input}
                                value={form.zip}
                                onChangeText={(val) => setForm({ ...form, zip: val })}
                                placeholder="6-digit pincode"
                                keyboardType="number-pad"
                            />
                        </View>
                    </ScrollView>

                    <View style={styles.footer}>
                        <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
                            <Text style={styles.saveBtnText}>Save Address</Text>
                        </TouchableOpacity>
                    </View>
                </KeyboardAvoidingView>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContainer: {
        backgroundColor: '#FFF',
        borderTopLeftRadius: radius.xl,
        borderTopRightRadius: radius.xl,
        maxHeight: '90%',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: spacing.lg,
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: colors.text.primary,
    },
    closeBtn: {
        padding: 4,
    },
    formContent: {
        padding: spacing.lg,
    },
    inputGroup: {
        marginBottom: spacing.lg,
    },
    label: {
        fontSize: 12,
        fontWeight: '700',
        color: colors.text.secondary,
        marginBottom: 8,
    },
    input: {
        backgroundColor: '#F8FAFC',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        borderRadius: radius.md,
        paddingHorizontal: spacing.md,
        height: 48,
        fontSize: 14,
        color: colors.text.primary,
    },
    row: {
        flexDirection: 'row',
    },
    footer: {
        padding: spacing.lg,
        borderTopWidth: 1,
        borderTopColor: '#F1F5F9',
        paddingBottom: Platform.OS === 'ios' ? 40 : spacing.lg,
    },
    saveBtn: {
        backgroundColor: '#000',
        height: 54,
        borderRadius: radius.md,
        justifyContent: 'center',
        alignItems: 'center',
    },
    saveBtnText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '800',
    }
});
