import * as React from 'react';
import { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Animated,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  Camera,
  Globe,
  Mail,
  Phone,
  Calendar,
  MapPin,
  AtSign,
  Instagram,
  Twitter,
  Facebook,
} from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { Colors } from '../constants/Colors';
import { useAuthStore } from '../store/useAuthStore';
import { Image } from 'react-native';

const MAX_BIO = 150;

const FieldInput = ({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType = 'default',
  multiline = false,
  maxLength,
  prefix,
  suffix,
  onSuffixPress,
  Icon,
}: any) => {
  const [focused, setFocused] = useState(false);
  return (
    <View style={fieldStyles.container}>
      <View style={fieldStyles.labelRow}>
        <Text style={fieldStyles.label}>{label}</Text>
        {maxLength && (
          <Text style={fieldStyles.charCount}>{(value || '').length} / {maxLength}</Text>
        )}
      </View>
      <View style={[fieldStyles.inputBox, focused ? fieldStyles.inputBoxFocused : null]}>
        {prefix && <Text style={fieldStyles.prefix}>{prefix}</Text>}
        <TextInput
          style={[fieldStyles.input, multiline ? { minHeight: 80, textAlignVertical: 'top' } : null]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#C0C0C0"
          keyboardType={keyboardType}
          multiline={multiline}
          maxLength={maxLength}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
        {suffix && (
          <Pressable
            onPress={onSuffixPress}
            style={({ pressed }) => [fieldStyles.suffixBtn, pressed ? { opacity: 0.6 } : null]}
            accessibilityRole="button"
            accessibilityLabel={suffix}
          >
            <Text style={fieldStyles.suffix}>{suffix}</Text>
          </Pressable>
        )}
        {Icon && !suffix && (
          <Icon color={Colors.maroon} size={18} style={fieldStyles.iconRight} />
        )}
      </View>
    </View>
  );
};

const fieldStyles = StyleSheet.create({
  container: { marginBottom: 16 },
  labelRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  label: { fontSize: 14, fontWeight: '700', color: Colors.text },
  charCount: { fontSize: 11, color: Colors.textSecondary },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.peach,
    borderRadius: 12,
    paddingHorizontal: 14,
    borderWidth: 1.5,
    borderColor: '#F0C0C0',
    minHeight: 50,
  },
  inputBoxFocused: { borderColor: Colors.maroon },
  prefix: { fontSize: 14, color: Colors.textSecondary, marginRight: 4 },
  input: { flex: 1, fontSize: 14, color: Colors.text, paddingVertical: 12 },
  suffixBtn: { paddingLeft: 8, minWidth: 60, alignItems: 'flex-end' },
  suffix: { fontSize: 14, fontWeight: '800', color: Colors.maroon },
  iconRight: { marginLeft: 8 },
});

// ─── Success Toast ─────────────────────────────────────────────────
const SuccessToast = ({ visible }: { visible: boolean }) => {
  const opacity = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (visible) {
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 300, useNativeDriver: true }),
        Animated.delay(2000),
        Animated.timing(opacity, { toValue: 0, duration: 300, useNativeDriver: true }),
      ]).start();
    }
  }, [visible]);

  return (
    <Animated.View style={[toastStyles.toast, { opacity }]} pointerEvents="none">
      <Text style={toastStyles.checkmark}>✓</Text>
      <Text style={toastStyles.text}>Profile updated successfully!</Text>
    </Animated.View>
  );
};

const toastStyles = StyleSheet.create({
  toast: {
    position: 'absolute', top: 8, left: 16, right: 16, zIndex: 100,
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: '#2E7D32', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14,
    ...Platform.select({ ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 8 }, android: { elevation: 8 } }),
  },
  checkmark: { fontSize: 16, color: Colors.white, fontWeight: '900' },
  text: { fontSize: 14, fontWeight: '700', color: Colors.white },
});

// ─── Main Edit Profile Screen ───────────────────────────────────────
const EditProfileScreen = ({ navigation }: any) => {
  const insets = useSafeAreaInsets();
  const { userProfile, updateProfile } = useAuthStore();
  const [showToast, setShowToast] = useState(false);

  const [form, setForm] = useState({
    fullName: userProfile?.fullName || '',
    username: userProfile?.username || '',
    bio: (userProfile as any)?.bio || 'Right-handed batsman and part-time spinner.',
    phone: (userProfile as any)?.phone || '+1 (555) 000-1234',
    email: (userProfile as any)?.email || 'johndoe@email.com',
    dob: userProfile?.dob || 'May 14, 1995',
    city: userProfile?.city || 'San Francisco, CA',
    instagram: (userProfile as any)?.instagram || '',
    twitter: (userProfile as any)?.twitter || '',
    facebook: (userProfile as any)?.facebook || '',
    avatar: userProfile?.avatar || null,
  });

  const update = (key: string) => (val: string) => setForm(f => ({ ...f, [key]: val }));

  const handleSave = () => {
    updateProfile({
      fullName: form.fullName,
      username: form.username,
      dob: form.dob,
      city: form.city,
      avatar: form.avatar || undefined,
      ...({
        bio: form.bio,
        phone: form.phone,
        email: form.email,
        instagram: form.instagram,
        twitter: form.twitter,
        facebook: form.facebook,
      } as any)
    });
    setShowToast(true);
    setTimeout(() => navigation.goBack(), 2600);
  };

  const pickImage = async (useCamera: boolean) => {
    const permissionResult = useCamera 
      ? await ImagePicker.requestCameraPermissionsAsync()
      : await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.status !== 'granted') {
      Alert.alert('Permission Denied', `We need ${useCamera ? 'camera' : 'gallery'} permissions to make this work!`);
      return;
    }

    const result = useCamera
      ? await ImagePicker.launchCameraAsync({
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.8,
        })
      : await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ['images'],
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.8,
        });

    if (!result.canceled) {
      setForm(prev => ({ ...prev, avatar: result.assets[0].uri }));
    }
  };

  const handleChangePhoto = () => {
    Alert.alert('Change Photo', 'Choose from Gallery or take a new Photo', [
      { text: 'Gallery', onPress: () => pickImage(false) },
      { text: 'Camera', onPress: () => pickImage(true) },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar barStyle="dark-content" translucent={true} />
      <SuccessToast visible={showToast} />

      {/* Header */}
      <View style={styles.header}>
        <Pressable
          style={({ pressed }) => [styles.backBtn, pressed ? { opacity: 0.6 } : null]}
          onPress={() => navigation.goBack()}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <ArrowLeft color={Colors.maroon} size={22} />
        </Pressable>
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <Pressable
          style={({ pressed }) => [styles.saveHeaderBtn, pressed ? { opacity: 0.7 } : null]}
          onPress={handleSave}
          accessibilityRole="button"
          accessibilityLabel="Save profile"
        >
          <Text style={styles.saveHeaderText}>Save</Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        {/* Avatar change */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarOuter}>
            {form.avatar ? (
              <Image source={{ uri: form.avatar }} style={styles.fullAvatar} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarInitial}>{form.fullName.charAt(0)}</Text>
              </View>
            )}
            <Pressable
              style={({ pressed }) => [styles.cameraBtn, pressed ? { opacity: 0.8 } : null]}
              onPress={handleChangePhoto}
              accessibilityRole="button"
              accessibilityLabel="Change profile photo"
            >
              <Camera color={Colors.white} size={15} />
            </Pressable>
          </View>
          <Pressable onPress={handleChangePhoto} accessibilityRole="button" accessibilityLabel="Change photo">
            <Text style={styles.changePhotoText}>Change Photo</Text>
          </Pressable>
        </View>

        {/* Fields */}
        <FieldInput label="Full Name" value={form.fullName} onChangeText={update('fullName')} placeholder="Your full name" />
        <FieldInput label="Username" value={form.username} onChangeText={update('username')} placeholder="your_username" prefix="@" />
        <FieldInput label="Bio" value={form.bio} onChangeText={update('bio')} placeholder="Tell people about yourself..." multiline maxLength={MAX_BIO} />
        <FieldInput
          label="Phone Number"
          value={form.phone}
          onChangeText={update('phone')}
          placeholder="+1 (555) 000-0000"
          keyboardType="phone-pad"
          suffix="Change"
          onSuffixPress={() => Alert.alert('Change Phone', 'OTP-based phone change coming soon.')}
        />
        <FieldInput label="Email" value={form.email} onChangeText={update('email')} placeholder="you@email.com" keyboardType="email-address" />
        <FieldInput label="Date of Birth" value={form.dob} onChangeText={update('dob')} placeholder="Select date" Icon={Calendar} />
        <FieldInput label="City" value={form.city} onChangeText={update('city')} placeholder="Your city" Icon={MapPin} />

        {/* Social Links */}
        <Text style={styles.sectionTitle}>Social Links</Text>

        {[
          { label: 'Instagram', key: 'instagram', Icon: Instagram, prefix: '🌐 ' },
          { label: 'Twitter/X', key: 'twitter', Icon: Twitter, prefix: '@ ' },
          { label: 'Facebook', key: 'facebook', Icon: Facebook, prefix: '🌐 ' },
        ].map(link => (
          <FieldInput
            key={link.key}
            label={link.label}
            value={(form as any)[link.key]}
            onChangeText={update(link.key)}
            placeholder="@username"
            prefix={link.prefix}
          />
        ))}

        {/* Save Button */}
        <Pressable
          style={({ pressed }) => [styles.saveBtn, pressed ? { opacity: 0.85 } : null]}
          onPress={handleSave}
          accessibilityRole="button"
          accessibilityLabel="Save changes"
        >
          <Text style={styles.saveBtnText}>Save Changes</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  backBtn: { width: 44, height: 44, justifyContent: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '800', color: Colors.text },
  saveHeaderBtn: { minHeight: 44, justifyContent: 'center', paddingHorizontal: 4 },
  saveHeaderText: { fontSize: 15, fontWeight: '800', color: Colors.maroon },
  body: { padding: 20, paddingBottom: 40 },

  avatarSection: { alignItems: 'center', marginBottom: 28 },
  avatarOuter: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#FFCC9E', justifyContent: 'center', alignItems: 'center', marginBottom: 10, overflow: 'hidden', position: 'relative' },
  avatarPlaceholder: { width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.peach },
  avatarInitial: { fontSize: 32, fontWeight: '900', color: Colors.maroon },
  fullAvatar: { width: '100%', height: '100%', resizeMode: 'cover' },
  cameraBtn: { position: 'absolute', bottom: 4, right: 4, width: 32, height: 32, borderRadius: 16, backgroundColor: Colors.maroon, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: Colors.white, zIndex: 10 },
  changePhotoText: { fontSize: 14, fontWeight: '800', color: Colors.maroon },

  sectionTitle: { fontSize: 18, fontWeight: '900', color: Colors.text, marginTop: 10, marginBottom: 16 },
  saveBtn: { backgroundColor: Colors.maroon, paddingVertical: 18, borderRadius: 14, alignItems: 'center', minHeight: 56, marginTop: 16 },
  saveBtnText: { fontSize: 16, fontWeight: '900', color: Colors.white, letterSpacing: 0.5 },
});

export default EditProfileScreen;
