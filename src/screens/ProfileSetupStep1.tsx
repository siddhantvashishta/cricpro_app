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
import { ArrowLeft, Camera, Calendar, MapPin, CheckCircle2 } from 'lucide-react-native';
import { Colors } from '../constants/Colors';
import { useAuthStore } from '../store/useAuthStore';

const { width } = Dimensions.get('window');

const ProfileSetupStep1 = ({ navigation }: any) => {
  const { userProfile, updateProfile } = useAuthStore();
  const [fullName, setFullName] = useState(userProfile?.fullName || '');
  const [username, setUsername] = useState(userProfile?.username || '');
  const [dob, setDob] = useState(userProfile?.dob || '');
  const [city, setCity] = useState(userProfile?.city || '');

  const handleNext = () => {
    updateProfile({ fullName, username, dob, city });
    navigation.navigate('ProfileSetup2');
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
        <Text style={styles.headerTitle}>Profile Setup</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Progress Tracker */}
        <View style={styles.progressContainer}>
           <View style={styles.progressHeader}>
              <Text style={styles.stepText}>STEP 1 OF 2</Text>
              <Text style={styles.percentText}>50% Complete</Text>
           </View>
           <View style={styles.progressBarBg}>
              <View style={[styles.progressBarFill, { width: '50%' }]} />
           </View>
        </View>

        {/* Avatar Picker */}
        <View style={styles.avatarWrapper}>
           <View style={styles.avatarOuter}>
              <View style={styles.avatarPlaceholder}>
                 <Image 
                   source={{ uri: 'https://images.unsplash.com/photo-1540747913346-19e3adca174f?q=80&w=200&auto=format&fit=crop' }} 
                   style={styles.avatarImage} 
                 />
              </View>
              <TouchableOpacity style={styles.cameraBtn}>
                 <Camera color={Colors.white} size={16} fill={Colors.white} />
              </TouchableOpacity>
           </View>
           <Text style={styles.avatarHint}>Tap to change profile picture</Text>
        </View>

        {/* Form Fields */}
        <View style={styles.form}>
           <View style={styles.fieldGroup}>
              <Text style={styles.label}>Full Name *</Text>
              <TextInput 
                style={styles.input}
                value={fullName}
                onChangeText={setFullName}
                placeholder="Arjun Sharma"
                placeholderTextColor="#A0AEC0"
              />
           </View>

           <View style={styles.fieldGroup}>
              <Text style={styles.label}>Username</Text>
              <View style={styles.inputWithIcon}>
                 <Text style={styles.atIcon}>@</Text>
                 <TextInput 
                   style={[styles.input, { flex: 1, borderBottomWidth: 0, paddingBottom: 0 }]}
                   value={username}
                   onChangeText={setUsername}
                   placeholder="arjun_cricket"
                   placeholderTextColor="#A0AEC0"
                 />
                 <CheckCircle2 color="#38A169" size={20} fill="#C6F6D5" />
              </View>
              <View style={styles.inputUnderline} />
           </View>

           <View style={styles.fieldGroup}>
              <Text style={styles.label}>Date of Birth</Text>
              <View style={styles.inputWithIcon}>
                 <TextInput 
                   style={[styles.input, { flex: 1, borderBottomWidth: 0, paddingBottom: 0 }]}
                   value={dob}
                   onChangeText={setDob}
                   placeholder="15 / 08 / 1995"
                   placeholderTextColor="#A0AEC0"
                 />
                 <Calendar color="#718096" size={20} />
              </View>
              <View style={styles.inputUnderline} />
           </View>

           <View style={styles.fieldGroup}>
              <Text style={styles.label}>City</Text>
              <View style={styles.inputWithIcon}>
                 <TextInput 
                   style={[styles.input, { flex: 1, borderBottomWidth: 0, paddingBottom: 0 }]}
                   value={city}
                   onChangeText={setCity}
                   placeholder="Mumbai, Maharashtra"
                   placeholderTextColor="#A0AEC0"
                 />
                 <MapPin color="#718096" size={20} />
              </View>
              <View style={styles.inputUnderline} />
           </View>
        </View>

        <TouchableOpacity 
          style={[styles.primaryButton, (!fullName || !username) && styles.disabledButton]}
          onPress={handleNext}
          disabled={!fullName || !username}
        >
          <Text style={styles.primaryButtonText}>Next   →</Text>
        </TouchableOpacity>

        <Text style={styles.termsText}>
          By continuing, you agree to our <Text style={styles.linkText}>Terms of Service</Text>
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1A202C',
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 10,
    paddingBottom: 40,
  },
  progressContainer: {
    marginBottom: 40,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  stepText: {
    fontSize: 12,
    fontWeight: '900',
    color: Colors.maroon,
    letterSpacing: 1,
  },
  percentText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#718096',
  },
  progressBarBg: {
    height: 4,
    backgroundColor: '#EDF2F7',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: Colors.maroon,
  },
  avatarWrapper: {
    alignItems: 'center',
    marginBottom: 40,
  },
  avatarOuter: {
    width: 120,
    height: 120,
    position: 'relative',
    marginBottom: 12,
  },
  avatarPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#F7FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    opacity: 0.6,
  },
  cameraBtn: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.maroon,
    borderWidth: 3,
    borderColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarHint: {
    fontSize: 13,
    fontWeight: '600',
    color: '#718096',
  },
  form: {
    marginBottom: 40,
  },
  fieldGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: '#718096',
    marginBottom: 8,
  },
  input: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A202C',
    paddingVertical: 10,
    borderBottomWidth: 1.5,
    borderBottomColor: '#E2E8F0',
  },
  inputWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  atIcon: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.maroon,
    backgroundColor: '#FFF5F5',
    width: 28,
    height: 28,
    borderRadius: 14,
    textAlign: 'center',
    lineHeight: 28,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#FEE2E2',
    overflow: 'hidden'
  },
  inputUnderline: {
    height: 1.5,
    backgroundColor: '#E2E8F0',
    marginTop: -1,
  },
  primaryButton: {
    backgroundColor: Colors.maroon,
    width: '100%',
    paddingVertical: 18,
    borderRadius: 30,
    alignItems: 'center',
    marginBottom: 24,
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
  termsText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#718096',
    textAlign: 'center',
  },
  linkText: {
    color: '#1A237E',
    fontWeight: '800',
  },
});

export default ProfileSetupStep1;
