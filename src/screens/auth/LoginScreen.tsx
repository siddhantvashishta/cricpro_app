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

export const LoginScreen = () => {
    const navigation = useNavigation<any>();
    const login = useAppStore((state) => state.login);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please enter both email and password.');
            return;
        }

        setLoading(true);
        const success = await login(email, password);
        setLoading(false);

        if (!success) {
            Alert.alert('Error', 'Invalid credentials. Please try again.');
        }
    };

    return (
        <View style={styles.container}>
                <SafeAreaView style={styles.safeArea}>
                    <KeyboardAvoidingView
                        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                        style={{ flex: 1 }}
                    >
                        <ScrollView
                            contentContainerStyle={styles.scrollContent}
                            showsVerticalScrollIndicator={false}
                        >
                            <View style={styles.header}>
                                <View style={styles.logoContainer}>
                                    <Image
                                        source={require('../../../assets/main_logo.png')}
                                        style={styles.logo}
                                        resizeMode="contain"
                                    />
                                </View>
                                <Text style={styles.title}>Welcome Back</Text>
                                <Text style={styles.subtitle}>Enter your details to continue your cricket journey</Text>
                            </View>

                            <View style={styles.form}>
                                <View style={styles.inputWrapper}>
                                    <Text style={styles.label}>Email Address</Text>
                                    <View style={styles.inputContainer}>
                                        <Ionicons name="mail-outline" size={20} color={colors.text.tertiary} style={styles.inputIcon} />
                                        <TextInput
                                            style={styles.input}
                                            placeholder="you@example.com"
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
                                            secureTextEntry={!showPassword}
                                        />
                                        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                                            <Ionicons
                                                name={showPassword ? "eye-off-outline" : "eye-outline"}
                                                size={20}
                                                color={colors.text.tertiary}
                                            />
                                        </TouchableOpacity>
                                    </View>
                                </View>

                                <TouchableOpacity style={styles.forgotPass}>
                                    <Text style={styles.forgotPassText}>Forgot Password?</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[styles.loginButton, loading && styles.disabledButton]}
                                    onPress={handleLogin}
                                    disabled={loading}
                                >
                                    <Text style={styles.loginButtonText}>
                                        {loading ? 'Signing In...' : 'Sign In'}
                                    </Text>
                                </TouchableOpacity>
                            </View>

                            <View style={styles.dividerContainer}>
                                <View style={styles.dividerLine} />
                                <Text style={styles.dividerText}>OR CONTINUE WITH</Text>
                                <View style={styles.dividerLine} />
                            </View>

                            <View style={styles.socialContainer}>
                                <TouchableOpacity style={styles.socialButton}>
                                    <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/512/2991/2991148.png' }} style={styles.socialIcon} />
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.socialButton}>
                                    <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/512/733/733547.png' }} style={styles.socialIcon} />
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.socialButton}>
                                    <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/512/0/747.png' }} style={styles.socialIcon} />
                                </TouchableOpacity>
                            </View>

                            <View style={styles.footer}>
                                <Text style={styles.footerText}>Don't have an account? </Text>
                                <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                                    <Text style={styles.signUpText}>Sign Up</Text>
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
        backgroundColor: 'rgba(2, 9, 18, 0.85)',
    },
    safeArea: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: spacing.xl,
        paddingBottom: spacing.xxl,
        paddingTop: spacing.xxl,
    },
    header: {
        alignItems: 'center',
        marginBottom: spacing.xxl,
    },
    logoContainer: {
        width: 80,
        height: 80,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: spacing.lg,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    logo: {
        width: 50,
        height: 50,
    },
    title: {
        ...typography.presets.h1,
        color: '#fff',
        fontSize: 28,
        marginBottom: spacing.xs,
    },
    subtitle: {
        ...typography.presets.bodySmall,
        color: colors.text.secondary,
        textAlign: 'center',
        paddingHorizontal: spacing.lg,
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
    forgotPass: {
        alignSelf: 'flex-end',
        marginBottom: spacing.xl,
    },
    forgotPassText: {
        ...typography.presets.caption,
        color: colors.primary,
        fontWeight: 'bold',
    },
    loginButton: {
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
    loginButtonText: {
        ...typography.presets.h3,
        color: '#fff',
    },
    dividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: spacing.xxl,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
    dividerText: {
        ...typography.presets.caption,
        color: colors.text.tertiary,
        marginHorizontal: spacing.md,
        fontSize: 10,
        letterSpacing: 1,
    },
    socialContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: spacing.lg,
        marginBottom: spacing.xxl,
    },
    socialButton: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    socialIcon: {
        width: 24,
        height: 24,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    footerText: {
        ...typography.presets.bodySmall,
        color: colors.text.secondary,
    },
    signUpText: {
        ...typography.presets.bodySmall,
        color: colors.primary,
        fontWeight: 'bold',
    },
});
