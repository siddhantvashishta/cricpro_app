import * as React from 'react';
import { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  ScrollView,
  Platform,
  StatusBar,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { X, Globe, Camera, Video, UserPlus, MapPin, ImagePlus } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { Colors } from '../constants/Colors';
import { Image } from 'react-native';
import { Users, Trophy } from 'lucide-react-native';

const POST_TYPES = [
  { id: 'general', label: 'General', Icon: Users },
  { id: 'match', label: 'Match Update', Icon: Trophy },
  { id: 'players', label: 'Looking for Players', Icon: UserPlus },
  { id: 'challenge', label: 'Challenge', Icon: Trophy },
];

const CreatePostScreen = ({ navigation }: any) => {
  const insets = useSafeAreaInsets();
  const [selectedType, setSelectedType] = useState('general');
  const [content, setContent] = useState('');
  const [media, setMedia] = useState<{ uri: string; type: 'image' | 'video' } | null>(null);
  const inputRef = useRef<TextInput>(null);

  const pickMedia = async (type: 'images' | 'videos') => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Sorry, we need camera roll permissions to make this work!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: type === 'images' ? ['images'] : ['videos'],
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      setMedia({
        uri: result.assets[0].uri,
        type: type === 'images' ? 'image' : 'video'
      });
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Sorry, we need camera permissions to make this work!');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.8,
    });
    if (!result.canceled) {
      setMedia({ uri: result.assets[0].uri, type: 'image' });
    }
  };

  const handlePublish = () => {
    if (!content.trim()) {
      Alert.alert('Empty post', 'Please write something before publishing.');
      return;
    }
    Alert.alert('Post Published!', 'Your post has been shared with the community.', [
      { text: 'OK', onPress: () => navigation.goBack() },
    ]);
  };

  const handleMediaAction = (id: string, label: string) => {
    if (id === 'camera') {
      takePhoto();
    } else if (id === 'video') {
      pickMedia('videos');
    } else if (id === 'tag' || id === 'location') {
      Alert.alert(label, `${label} feature coming soon!`);
    } else {
      pickMedia('images');
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <StatusBar barStyle="dark-content" translucent={true} />

      {/* Header */}
      <View style={styles.header}>
        <Pressable
          style={({ pressed }) => [styles.closeBtn, pressed ? { opacity: 0.6 } : null]}
          onPress={() => navigation.goBack()}
          accessibilityRole="button"
          accessibilityLabel="Close create post"
        >
          <X color={Colors.text} size={22} />
        </Pressable>
        <Text style={styles.headerTitle}>Create Post</Text>
        <Pressable
          style={({ pressed }) => [styles.publishBtn, pressed ? { opacity: 0.85 } : null]}
          onPress={handlePublish}
          accessibilityRole="button"
          accessibilityLabel="Publish post"
        >
          <Text style={styles.publishBtnText}>Publish</Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        {/* Author Info */}
        <View style={styles.authorRow}>
          <View style={styles.authorAvatar} />
          <View>
            <Text style={styles.authorName}>Alex Thompson</Text>
            <View style={styles.audienceTag}>
              <Globe color={Colors.maroon} size={11} />
              <Text style={styles.audienceText}>Public</Text>
            </View>
          </View>
        </View>

        {/* Post type chips */}
        <View style={styles.typeChips}>
          {POST_TYPES.map(type => {
            const isActive = selectedType === type.id;
            return (
              <Pressable
                key={type.id}
                style={({ pressed }) => [
                  styles.typeChip,
                  isActive ? styles.typeChipActive : null,
                  pressed ? { opacity: 0.75 } : null,
                ]}
                onPress={() => setSelectedType(type.id)}
                accessibilityRole="radio"
                accessibilityLabel={`Post type: ${type.label}`}
                accessibilityState={{ checked: isActive }}
              >
                <type.Icon color={isActive ? Colors.white : Colors.text} size={14} />
                <Text style={[styles.typeChipText, isActive ? styles.typeChipTextActive : null]}>
                  {type.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* Text Input */}
        <Pressable style={styles.textInputContainer} onPress={() => inputRef.current?.focus()}>
          <TextInput
            ref={inputRef}
            style={styles.textInput}
            placeholder="Share a cricket moment..."
            placeholderTextColor="#B0B0B0"
            multiline
            value={content}
            onChangeText={setContent}
            maxLength={500}
            textAlignVertical="top"
          />
        </Pressable>
        <Text style={styles.charCount}>{content.length}/500</Text>

        {/* Add to Post */}
        <View style={styles.addToPostSection}>
          <Text style={styles.addToPostLabel}>ADD TO POST</Text>
          <View style={styles.mediaActions}>
            {[
              { id: 'camera', label: 'Camera', Icon: Camera },
              { id: 'video', label: 'Video', Icon: Video },
              { id: 'tag', label: 'Tag\nPlayer', Icon: UserPlus },
              { id: 'location', label: 'Location', Icon: MapPin },
            ].map(action => (
              <Pressable
                key={action.id}
                style={({ pressed }) => [styles.mediaActionBtn, pressed ? { opacity: 0.7 } : null]}
                onPress={() => handleMediaAction(action.id, action.label)}
                accessibilityRole="button"
                accessibilityLabel={`Add ${action.label}`}
              >
                <action.Icon color={Colors.maroon} size={26} />
                <Text style={styles.mediaActionLabel}>{action.label}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Media Drop Zone */}
        <Pressable
          style={({ pressed }) => [styles.mediaDropZone, media ? { padding: 0, borderStyle: 'solid', overflow: 'hidden' } : null, pressed ? { opacity: 0.8 } : null]}
          onPress={() => handleMediaAction('gallery', 'Add media')}
          accessibilityRole="button"
          accessibilityLabel="Add media from gallery"
        >
          {media ? (
            <Image source={{ uri: media.uri }} style={styles.fullMedia} />
          ) : (
            <>
              <ImagePlus color="#B0B0B0" size={28} />
              <Text style={styles.mediaDropText}>Click to add media from gallery</Text>
            </>
          )}
        </Pressable>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F0EF' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  closeBtn: { width: 44, height: 44, justifyContent: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '800', color: Colors.text },
  publishBtn: {
    backgroundColor: Colors.maroon,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    minHeight: 44,
    justifyContent: 'center',
  },
  publishBtnText: { fontSize: 14, fontWeight: '800', color: Colors.white },
  body: { padding: 16, gap: 16 },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: Colors.white,
    padding: 14,
    borderRadius: 14,
  },
  authorAvatar: { width: 46, height: 46, borderRadius: 23, backgroundColor: '#FFCC80' },
  authorName: { fontSize: 15, fontWeight: '800', color: Colors.text, marginBottom: 4 },
  audienceTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.peach,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    alignSelf: 'flex-start',
  },
  audienceText: { fontSize: 11, fontWeight: '700', color: Colors.maroon },
  typeChips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  typeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    minHeight: 44,
  },
  typeChipActive: { backgroundColor: Colors.maroon, borderColor: Colors.maroon },
  typeChipText: { fontSize: 13, fontWeight: '700', color: Colors.text },
  typeChipTextActive: { color: Colors.white },
  textInputContainer: {
    backgroundColor: Colors.white,
    borderRadius: 14,
    padding: 16,
    minHeight: 140,
    borderWidth: 1,
    borderColor: '#EFEFEF',
  },
  textInput: { fontSize: 15, color: Colors.text, lineHeight: 22, minHeight: 110 },
  charCount: { fontSize: 11, color: Colors.textSecondary, textAlign: 'right', marginTop: -10 },
  addToPostSection: {
    backgroundColor: Colors.white,
    borderRadius: 14,
    padding: 16,
  },
  addToPostLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: Colors.textSecondary,
    letterSpacing: 1,
    marginBottom: 16,
  },
  mediaActions: { flexDirection: 'row', justifyContent: 'space-around' },
  mediaActionBtn: { alignItems: 'center', gap: 6, minWidth: 60, minHeight: 60, justifyContent: 'center' },
  mediaActionLabel: { fontSize: 11, fontWeight: '600', color: Colors.text, textAlign: 'center' },
  mediaDropZone: {
    backgroundColor: Colors.peach,
    borderRadius: 14,
    height: 110,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    borderWidth: 2,
    borderColor: '#F0C0C0',
    borderStyle: 'dashed',
  },
  mediaDropText: { fontSize: 13, fontWeight: '600', color: '#B0B0B0' },
  fullMedia: { width: '100%', height: '100%', resizeMode: 'cover' },
});

export default CreatePostScreen;
