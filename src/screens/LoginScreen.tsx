import * as React from 'react';
import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  Image,
  Dimensions,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';
import { ChevronDown } from 'lucide-react-native';
import { Colors } from '../constants/Colors';
import { useAuthStore } from '../store/useAuthStore';

const { width } = Dimensions.get('window');

const LoginScreen = ({ navigation }: any) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const { login } = useAuthStore();

  const handleSendOtp = async () => {
    if (phoneNumber.length >= 10) {
      await login(phoneNumber);
      navigation.navigate('OTP', { phoneNumber: `+91 ${phoneNumber}` });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Logo */}
          <View style={styles.logoCenter}>
            <Image 
              source={require('../../assets/main_logo.png')} 
              style={styles.logoImage} 
              resizeMode="contain"
            />
          </View>

          {/* Title */}
          <Text style={styles.title}>Enter Your Number</Text>
          <Text style={styles.subtitle}>We'll send a verification code via SMS.</Text>

          {/* Input Area */}
          <View style={styles.inputContainer}>
            <View style={styles.fieldGroup}>
              <Text style={styles.inputLabel}>Country</Text>
              <TouchableOpacity style={styles.countryPicker}>
                <Text style={styles.flag}>🇮🇳</Text>
                <Text style={styles.countryCode}>+91</Text>
                <ChevronDown color={Colors.textSecondary} size={16} />
              </TouchableOpacity>
            </View>

            <View style={[styles.fieldGroup, { flex: 1, marginLeft: 16 }]}>
              <Text style={styles.inputLabel}>Phone Number</Text>
              <TextInput
                style={styles.phoneInput}
                placeholder="00000 00000"
                placeholderTextColor="#A0AEC0"
                keyboardType="phone-pad"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                maxLength={10}
              />
            </View>
          </View>

          {/* Send OTP Button */}
          <TouchableOpacity 
            style={[styles.primaryButton, phoneNumber.length < 10 && styles.disabledButton]}
            onPress={handleSendOtp}
            disabled={phoneNumber.length < 10}
          >
            <Text style={styles.primaryButtonText}>Send OTP</Text>
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.dividerContainer}>
            <View style={styles.divider} />
            <Text style={styles.dividerText}>OR CONTINUE WITH</Text>
            <View style={styles.divider} />
          </View>

          {/* Social Buttons */}
          <TouchableOpacity style={styles.socialButton}>
            <Image 
              source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg' }} 
              style={styles.socialIcon} 
            />
            <Text style={styles.socialButtonText}>Log in with Google</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.socialButton, styles.appleButton]}>
            <Text style={styles.appleIcon}></Text>
            <Text style={[styles.socialButtonText, styles.appleButtonText]}>Sign in with Apple</Text>
          </TouchableOpacity>

          <View style={{ height: 40 }} />

          {/* Footer */}
          <Text style={styles.footerText}>
            By continuing, you agree to our{' '}
            <Text style={styles.linkText}>Terms of Service</Text> and{' '}
            <Text style={styles.linkText}>Privacy Policy</Text>
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  scrollContent: {
    paddingHorizontal: 24,
    alignItems: 'center',
    paddingTop: 40,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 60,
  },
  logoOuter: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.maroon,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  logoInner: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoBrand: {
    color: Colors.white,
    fontSize: 6,
    fontWeight: '900',
  },
  logoCenter: {
    alignItems: 'center',
    marginBottom: 60,
    width: '100%',
  },
  logoImage: {
    width: 140,
    height: 40,
  },
  brandingText: {
    fontSize: 20,
    fontWeight: '900',
    color: '#1A202C',
    letterSpacing: 1,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#1A202C',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#4A5568',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 40,
  },
  inputContainer: {
    flexDirection: 'row',
    width: '100%',
    marginBottom: 32,
  },
  fieldGroup: {
    // Grouping label and input
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1A202C',
    marginBottom: 12,
  },
  countryPicker: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EDF2F7',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 25,
    minHeight: 56,
  },
  flag: {
    fontSize: 20,
    marginRight: 8,
  },
  countryCode: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A202C',
    marginRight: 4,
  },
  phoneInput: {
    backgroundColor: '#EDF2F7',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 25,
    fontSize: 18,
    fontWeight: '700',
    color: '#1A202C',
    minHeight: 56,
  },
  primaryButton: {
    backgroundColor: Colors.maroon,
    width: '100%',
    paddingVertical: 18,
    borderRadius: 30,
    alignItems: 'center',
    marginBottom: 40,
    ...Platform.select({
      ios: { shadowColor: Colors.maroon, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 },
      android: { elevation: 6 },
    }),
  },
  disabledButton: {
    opacity: 0.6,
  },
  primaryButtonText: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: '800',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    width: '100%',
    paddingHorizontal: 10,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#E2E8F0',
  },
  dividerText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#A0AEC0',
    paddingHorizontal: 12,
    letterSpacing: 1,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.white,
    width: '100%',
    paddingVertical: 16,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 16,
  },
  socialIcon: {
    width: 20,
    height: 20,
    marginRight: 12,
  },
  socialButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A202C',
  },
  appleButton: {
    backgroundColor: '#0F172A',
    borderColor: '#0F172A',
  },
  appleIcon: {
    fontSize: 20,
    color: Colors.white,
    marginRight: 8,
    marginTop: -4,
  },
  appleButtonText: {
    color: Colors.white,
  },
  footerText: {
    fontSize: 12,
    color: '#718096',
    textAlign: 'center',
    lineHeight: 18,
    marginTop: 'auto',
    marginBottom: 20,
  },
  linkText: {
    color: Colors.maroon,
    fontWeight: '700',
  },
});

export default LoginScreen;
