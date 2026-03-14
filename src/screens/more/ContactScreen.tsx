import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { colors, spacing, typography, shadows } from '../../theme';
import { AppHeader } from '../../components';

export const ContactScreen = () => {
    const navigation = useNavigation();
    const [message, setMessage] = useState('');
    const [sending, setSending] = useState(false);

    const handleSendMessage = () => {
        if (!message.trim()) {
            Alert.alert('Error', 'Please enter a message.');
            return;
        }
        setSending(true);
        // Simulate API call
        setTimeout(() => {
            setSending(false);
            setMessage('');
            Alert.alert('Success', 'Your message has been sent. We will get back to you soon!');
        }, 1500);
    };

    return (
        <SafeAreaView style={styles.container}>
            <AppHeader title="Contact Us" showBack />
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Get in Touch</Text>
                        <Text style={styles.sectionDesc}>Have questions or feedback? We'd love to hear from you.</Text>

                        <View style={styles.contactCard}>
                            <View style={styles.contactItem}>
                                <View style={styles.iconCircle}>
                                    <Ionicons name="mail" size={20} color={colors.primary} />
                                </View>
                                <View>
                                    <Text style={styles.contactLabel}>Email Support</Text>
                                    <Text style={styles.contactValue}>siddhant.kumar@codeapto.com</Text>
                                </View>
                            </View>

                            <View style={styles.contactItem}>
                                <View style={styles.iconCircle}>
                                    <Ionicons name="call" size={20} color={colors.primary} />
                                </View>
                                <View>
                                    <Text style={styles.contactLabel}>Phone</Text>
                                    <Text style={styles.contactValue}>+91 7492973921</Text>
                                </View>
                            </View>

                            <View style={[styles.contactItem, { borderBottomWidth: 0 }]}>
                                <View style={styles.iconCircle}>
                                    <Ionicons name="location" size={20} color={colors.primary} />
                                </View>
                                <View>
                                    <Text style={styles.contactLabel}>Office</Text>
                                    <Text style={styles.contactValue}>Marthahalli, Bangalore</Text>
                                </View>
                            </View>
                        </View>
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Social Media</Text>
                        <View style={styles.socialRow}>
                            <TouchableOpacity style={styles.socialIcon}>
                                <Ionicons name="logo-instagram" size={24} color="#E4405F" />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.socialIcon}>
                                <Ionicons name="logo-twitter" size={24} color="#1DA1F2" />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.socialIcon}>
                                <Ionicons name="logo-facebook" size={24} color="#1877F2" />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.socialIcon}>
                                <Ionicons name="logo-youtube" size={24} color="#FF0000" />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Send Feedback</Text>
                        <View style={styles.inputContainer}>
                            <TextInput
                                style={styles.textArea}
                                placeholder="Type your message here..."
                                placeholderTextColor={colors.text.tertiary}
                                multiline
                                numberOfLines={5}
                                value={message}
                                onChangeText={setMessage}
                                textAlignVertical="top"
                            />
                        </View>
                        <TouchableOpacity
                            style={[styles.sendButton, sending && styles.disabledButton]}
                            onPress={handleSendMessage}
                            disabled={sending}
                        >
                            <Text style={styles.sendButtonText}>
                                {sending ? 'Sending...' : 'Send Message'}
                            </Text>
                        </TouchableOpacity>
                    </View>
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
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: spacing.md,
        height: 60,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    backButton: {
        padding: spacing.xs,
    },
    headerTitle: {
        ...typography.presets.h3,
        color: colors.text.primary,
    },
    scrollContent: {
        padding: spacing.md,
        paddingBottom: spacing.xl,
    },
    section: {
        marginBottom: spacing.xl,
    },
    sectionTitle: {
        ...typography.presets.h3,
        color: colors.text.primary,
        marginBottom: spacing.xs,
    },
    sectionDesc: {
        ...typography.presets.bodySmall,
        color: colors.text.secondary,
        marginBottom: spacing.md,
    },
    contactCard: {
        backgroundColor: colors.surface,
        borderRadius: 20,
        padding: spacing.md,
        ...shadows.soft,
    },
    contactItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255, 255, 255, 0.05)',
    },
    iconCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(74, 144, 226, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: spacing.md,
    },
    contactLabel: {
        ...typography.presets.caption,
        color: colors.text.tertiary,
    },
    contactValue: {
        ...typography.presets.body,
        color: colors.text.primary,
        fontWeight: 'bold',
    },
    socialRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: spacing.sm,
    },
    socialIcon: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: colors.surface,
        justifyContent: 'center',
        alignItems: 'center',
        ...shadows.soft,
    },
    inputContainer: {
        backgroundColor: colors.surface,
        borderRadius: 16,
        padding: spacing.sm,
        marginTop: spacing.sm,
        ...shadows.soft,
    },
    textArea: {
        height: 120,
        color: colors.text.primary,
        ...typography.presets.bodySmall,
        padding: spacing.sm,
    },
    sendButton: {
        backgroundColor: colors.primary,
        height: 54,
        borderRadius: 27,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: spacing.lg,
        ...shadows.primary,
    },
    disabledButton: {
        opacity: 0.6,
    },
    sendButtonText: {
        ...typography.presets.body,
        color: '#fff',
        fontWeight: 'bold',
    },
});
