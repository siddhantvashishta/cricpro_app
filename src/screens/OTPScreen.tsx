import * as React from 'react';
import { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  Dimensions,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';
import { ArrowLeft, ShieldCheck } from 'lucide-react-native';
import { Colors } from '../constants/Colors';
import { useAuthStore } from '../store/useAuthStore';

const { width } = Dimensions.get('window');

const OTPScreen = ({ navigation, route }: any) => {
  const { phoneNumber } = route.params || { phoneNumber: '+91 00000 00000' };
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(45);
  const { verifyOtp } = useAuthStore();
  
  const inputRefs = useRef<Array<TextInput | null>>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleOtpChange = (value: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value !== '' && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && otp[index] === '' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const otpValue = otp.join('');
    if (otpValue.length === 6) {
      try {
        await verifyOtp(otpValue);
        // Onboarding flow: Go to profile setup
        navigation.navigate('ProfileSetup1');
      } catch (error) {
        console.error('OTP Verification failed', error);
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <ArrowLeft color="#1A202C" size={24} />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.title}>Verify Your Number</Text>
          <Text style={styles.subtitle}>Code sent to {phoneNumber}</Text>

          <View style={styles.otpContainer}>
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                ref={(ref) => { inputRefs.current[index] = ref; }}
                style={[
                  styles.otpInput,
                  otp[index] !== '' && styles.otpInputFilled,
                  index === 0 && styles.otpInputFirst
                ]}
                keyboardType="number-pad"
                maxLength={1}
                value={digit}
                onChangeText={(value) => handleOtpChange(value, index)}
                onKeyPress={(e) => handleKeyPress(e, index)}
              />
            ))}
          </View>

          <View style={styles.resendContainer}>
            <Text style={styles.resendText}>Didn't receive the code?</Text>
            <TouchableOpacity disabled={timer > 0}>
              <Text style={[styles.resendAction, timer > 0 && styles.disabledResend]}>
                Resend OTP
              </Text>
            </TouchableOpacity>
            {timer > 0 && (
              <Text style={styles.timerText}>Resend in 0:{timer.toString().padStart(2, '0')}</Text>
            )}
          </View>

          <TouchableOpacity 
            style={[styles.primaryButton, otp.join('').length < 6 && styles.disabledButton]}
            onPress={handleVerify}
            disabled={otp.join('').length < 6}
          >
            <Text style={styles.primaryButtonText}>Verify & Proceed</Text>
          </TouchableOpacity>

          <View style={styles.secureFooter}>
             <ShieldCheck color="#CBD5E0" size={48} strokeWidth={1.5} />
             <Text style={styles.secureText}>SECURE VERIFICATION</Text>
          </View>
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
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingHorizontal: 24,
    alignItems: 'center',
    paddingTop: 20,
    flexGrow: 1,
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
    marginBottom: 48,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 48,
  },
  otpInput: {
    width: (width - 48 - 60) / 6,
    height: 60,
    backgroundColor: Colors.white,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    fontSize: 24,
    fontWeight: '800',
    color: '#1A202C',
    textAlign: 'center',
  },
  otpInputFilled: {
    borderColor: Colors.maroon,
    backgroundColor: '#FFF5F5',
  },
  otpInputFirst: {
     // Special styling for active/first if needed
  },
  resendContainer: {
    alignItems: 'center',
    marginBottom: 60,
  },
  resendText: {
    fontSize: 14,
    color: '#718096',
    marginBottom: 8,
  },
  resendAction: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.maroon,
    marginBottom: 4,
  },
  disabledResend: {
    opacity: 0.5,
  },
  timerText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.maroon,
  },
  primaryButton: {
    backgroundColor: Colors.maroon,
    width: '100%',
    paddingVertical: 18,
    borderRadius: 30,
    alignItems: 'center',
    marginBottom: 'auto',
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
  secureFooter: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 40,
  },
  secureText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#A0AEC0',
    letterSpacing: 1.5,
    marginTop: 8,
  },
});

export default OTPScreen;
