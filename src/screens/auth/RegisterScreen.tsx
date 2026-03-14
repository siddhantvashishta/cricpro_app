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
    Dimensions,
    ImageBackground
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { colors, spacing, typography, shadows, radius } from '../../theme';
import { useAppStore } from '../../store/useAppStore';

const { width } = Dimensions.get('window');

export const RegisterScreen = () => {
    const navigation = useNavigation<any>();
    const register = useAppStore((state) => state.register);

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [agree, setAgree] = useState(false);

    const handleRegister = async () => {
        if (!name || !email || !password || !confirmPassword) {
            Alert.alert('Error', 'Please fill in all fields.');
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert('Error', 'Passwords do not match.');
            return;
        }

        if (!agree) {
            Alert.alert('Error', 'You must agree to the Terms and Conditions.');
            return;
        }

        setLoading(true);
        const success = await register({ name, email, password });
        setLoading(false);

        if (success) {
            navigation.navigate('CreateProfile');
        } else {
            Alert.alert('Error', 'Registration failed. Please try again.');
        }
    };

    return (
        <View style={styles.container}>
                <SafeAreaView style={styles.safeArea}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => navigation.goBack()}
                    >
                        <Ionicons name="arrow-back" size={24} color="#fff" />
                    </TouchableOpacity>

                    <KeyboardAvoidingView
                        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                        style={{ flex: 1 }}
                    >
                        <ScrollView
                            contentContainerStyle={styles.scrollContent}
                            showsVerticalScrollIndicator={false}
                        >
                            <View style={styles.header}>
                                <Text style={styles.title}>Join the Club</Text>
                                <Text style={styles.subtitle}>Create an account to start your professional cricket career</Text>
                            </View>

                            <View style={styles.form}>
                                <View style={styles.inputWrapper}>
                                    <Text style={styles.label}>Full Name</Text>
                                    <View style={styles.inputContainer}>
                                        <Ionicons name="person-outline" size={20} color={colors.text.tertiary} style={styles.inputIcon} />
                                        <TextInput
                                            style={styles.input}
                                            placeholder="John Doe"
                                            placeholderTextColor={colors.text.tertiary}
                                            value={name}
                                            onChangeText={setName}
                                        />
                                    </View>
                                </View>

                                <View style={styles.inputWrapper}>
                                    <Text style={styles.label}>Email Address</Text>
                                    <View style={styles.inputContainer}>
                                        <Ionicons name="mail-outline" size={20} color={colors.text.tertiary} style={styles.inputIcon} />
                                        <TextInput
                                            style={styles.input}
                                            placeholder="you@email.com"
                                            placeholderTextColor={colors.text.tertiary}
                                            value={email}
                                            onChangeText={setEmail}
                                            keyboardType="email-address"
                                            autoCapitalize="none"
                                        />
                                    </View>
                                </View>

                                <View style={styles.inputWrapper}>
                                    <Text style={styles.label}>Password</Text>
                                    <View style={styles.inputContainer}>
                                        <Ionicons name="lock-closed-outline" size={20} color={colors.text.tertiary} style={styles.inputIcon} />
                                        <TextInput
                                            style={styles.input}
                                            placeholder="••••••••"
                                            placeholderTextColor={colors.text.tertiary}
                                            value={password}
                                            onChangeText={setPassword}
                                            secureTextEntry
                                        />
                                    </View>
                                </View>

                                <View style={styles.inputWrapper}>
                                    <Text style={styles.label}>Confirm Password</Text>
                                    <View style={styles.inputContainer}>
                                        <Ionicons name="shield-checkmark-outline" size={20} color={colors.text.tertiary} style={styles.inputIcon} />
                                        <TextInput
                                            style={styles.input}
                                            placeholder="••••••••"
                                            placeholderTextColor={colors.text.tertiary}
                                            value={confirmPassword}
                                            onChangeText={setConfirmPassword}
                                            secureTextEntry
                                        />
                                    </View>
                                </View>

                                <TouchableOpacity
                                    style={styles.checkboxContainer}
                                    onPress={() => setAgree(!agree)}
                                >
                                    <View style={[styles.checkbox, agree && styles.checkboxActive]}>
                                        {agree && <Ionicons name="checkmark" size={14} color="#fff" />}
                                    </View>
                                    <Text style={styles.checkboxLabel}>
                                        I agree to the <Text style={styles.linkText}>Terms of Service</Text> and <Text style={styles.linkText}>Privacy Policy</Text>
                                    </Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[styles.registerButton, loading && styles.disabledButton]}
                                    onPress={handleRegister}
                                    disabled={loading}
                                >
                                    <Text style={styles.registerButtonText}>
                                        {loading ? 'Creating Account' : 'Create Account'}
                                    </Text>
                                </TouchableOpacity>
                            </View>

                            <View style={styles.footer}>
                                <Text style={styles.footerText}>Already have an account? </Text>
                                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                                    <Text style={styles.signInText}>Sign In</Text>
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
                    </KeyboardAvoidingView>
                </SafeAreaView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#020912',
    },
    bgImage: {
        width: '100%',
        height: '100%',
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(2, 9, 18, 0.9)',
    },
    safeArea: {
        flex: 1,
    },
    backButton: {
        padding: spacing.md,
        marginTop: spacing.sm,
    },
    scrollContent: {
        paddingHorizontal: spacing.xl,
        paddingBottom: spacing.xxl,
    },
    header: {
        marginBottom: spacing.xxl,
    },
    title: {
        ...typography.presets.h1,
        color: '#fff',
        fontSize: 32,
        marginBottom: spacing.xs,
    },
    subtitle: {
        ...typography.presets.bodySmall,
        color: colors.text.secondary,
        lineHeight: 22,
    },
    form: {
        width: '100%',
    },
    inputWrapper: {
        marginBottom: spacing.lg,
    },
    label: {
        ...typography.presets.caption,
        color: colors.text.secondary,
        marginBottom: spacing.xs,
        marginLeft: 4,
        fontWeight: 'bold',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 12,
        paddingHorizontal: spacing.md,
        height: 56,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    inputIcon: {
        marginRight: spacing.sm,
    },
    input: {
        flex: 1,
        color: '#fff',
        ...typography.presets.body,
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacing.xl,
        marginTop: spacing.sm,
    },
    checkbox: {
        width: 20,
        height: 20,
        borderRadius: 4,
        borderWidth: 1.5,
        borderColor: colors.text.tertiary,
        marginRight: spacing.sm,
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkboxActive: {
        backgroundColor: colors.primary,
        borderColor: colors.primary,
    },
    checkboxLabel: {
        ...typography.presets.caption,
        color: colors.text.secondary,
        flex: 1,
    },
    linkText: {
        color: colors.primary,
        fontWeight: 'bold',
    },
    registerButton: {
        backgroundColor: colors.primary,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        ...shadows.primary,
    },
    disabledButton: {
        opacity: 0.6,
    },
    registerButtonText: {
        ...typography.presets.h3,
        color: '#fff',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: spacing.xxl,
    },
    footerText: {
        ...typography.presets.bodySmall,
        color: colors.text.secondary,
    },
    signInText: {
        ...typography.presets.bodySmall,
        color: colors.primary,
        fontWeight: 'bold',
    },
});
