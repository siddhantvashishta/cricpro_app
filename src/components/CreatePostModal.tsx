import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Modal,
    TouchableOpacity,
    TextInput,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    Alert,
    Image
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { colors, spacing, typography, radius } from '../theme';
import { useAppStore } from '../store/useAppStore';
import { useImagePicker } from '../hooks/useImagePicker';

interface CreatePostModalProps {
    visible: boolean;
    onClose: () => void;
    initialType?: string;
}

export const CreatePostModal: React.FC<CreatePostModalProps> = ({ visible, onClose, initialType = 'Opponent' }) => {
    const { addPost, addCommunityPost, user } = useAppStore();
    const { selectedImage, pickImage, removeImage } = useImagePicker();
    const [selectedType, setSelectedType] = useState(initialType);
    const [dateValue, setDateValue] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [ground, setGround] = useState('');
    const [description, setDescription] = useState('');
    const [communityText, setCommunityText] = useState('');

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: '2-digit',
            year: 'numeric'
        });
    };

    const onDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
        setShowDatePicker(false);
        if (selectedDate) {
            setDateValue(selectedDate);
        }
    };

    const handlePost = () => {
        if (selectedType === 'Community') {
            if (!communityText.trim() && !selectedImage) {
                Alert.alert('Error', 'Please enter some content or add a photo for your post');
                return;
            }

            const newCommunityPost = {
                id: 'cp_' + Date.now().toString(),
                author: user?.name || 'Anonymous',
                time: 'Just now',
                content: communityText,
                image: selectedImage,
                likes: 0,
                comments: 0,
            };

            addCommunityPost(newCommunityPost);
            Alert.alert('Success', 'Your community post has been shared!');
            onClose();
            setCommunityText('');
            removeImage();
            return;
        }

        if (!ground || !description) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        const dateString = formatDate(dateValue);

        const newPost = {
            id: Date.now().toString(),
            type: selectedType === 'Team' ? 'Recruitment' : selectedType,
            teamName: (user?.name || 'My') + "'s team",
            description: selectedType === 'Opponent'
                ? `is looking for an opponent to play a Match.`
                : description,
            date: dateString,
            ground: ground,
            requirementText: selectedType !== 'Opponent' ? description : undefined,
            timeAgo: 'Just now',
            distance: 'Your location',
            rightIconType: selectedType === 'Opponent' ? 'VS' : 'Person',
        };

        addPost(newPost);
        Alert.alert('Success', 'Your post has been created!');
        onClose();

        // Reset fields
        setDateValue(new Date());
        setGround('');
        setDescription('');
    };

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.modalContent}
                >
                    <View style={styles.header}>
                        <Text style={styles.headerTitle}>Create Recruitment Post</Text>
                        <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                            <Ionicons name="close" size={24} color={colors.text.primary} />
                        </TouchableOpacity>
                    </View>

                    <ScrollView style={styles.form} showsVerticalScrollIndicator={false}>
                        <Text style={styles.label}>What are you looking for?</Text>
                        <View style={styles.typeSelector}>
                            {['Opponent', 'Player', 'Team', 'Community'].map((type) => (
                                <TouchableOpacity
                                    key={type}
                                    style={[styles.typeChip, type === selectedType && styles.activeTypeChip]}
                                    onPress={() => setSelectedType(type)}
                                >
                                    <Text style={[styles.typeText, type === selectedType && styles.activeTypeText]}>{type}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        {selectedType === 'Community' ? (
                            <>
                                <Text style={styles.label}>Post Image (Optional)</Text>
                                <View style={styles.imageSelectorContainer}>
                                    {selectedImage ? (
                                        <View style={styles.previewWrapper}>
                                            <Image source={{ uri: selectedImage }} style={styles.imagePreview} />
                                            <TouchableOpacity style={styles.removeBadge} onPress={removeImage}>
                                                <Ionicons name="close" size={16} color={colors.text.inverse} />
                                            </TouchableOpacity>
                                        </View>
                                    ) : (
                                        <TouchableOpacity style={styles.imagePlaceholder} onPress={pickImage} activeOpacity={0.7}>
                                            <Ionicons name="camera-outline" size={32} color={colors.text.tertiary} />
                                            <Text style={styles.placeholderText}>Add Photo</Text>
                                        </TouchableOpacity>
                                    )}
                                </View>

                                <Text style={styles.label}>Post Content</Text>
                                <TextInput
                                    style={[styles.input, styles.textArea]}
                                    placeholder="What's happening in your cricket world?"
                                    placeholderTextColor={colors.text.tertiary}
                                    multiline
                                    numberOfLines={6}
                                    value={communityText}
                                    onChangeText={setCommunityText}
                                />
                            </>
                        ) : (
                            <>
                                <Text style={styles.label}>Match/Requirement Date</Text>
                                <TouchableOpacity
                                    style={styles.dateSelector}
                                    onPress={() => setShowDatePicker(true)}
                                    activeOpacity={0.7}
                                >
                                    <Ionicons name="calendar-outline" size={20} color={colors.primary} style={styles.inputIcon} />
                                    <Text style={styles.dateText}>{formatDate(dateValue)}</Text>
                                </TouchableOpacity>

                                {showDatePicker && (
                                    <DateTimePicker
                                        value={dateValue}
                                        mode="date"
                                        display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                                        onChange={onDateChange}
                                        minimumDate={new Date()}
                                    />
                                )}

                                <Text style={styles.label}>Ground/Location</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Search ground or enter location"
                                    placeholderTextColor={colors.text.tertiary}
                                    value={ground}
                                    onChangeText={setGround}
                                />

                                <Text style={styles.label}>Description</Text>
                                <TextInput
                                    style={[styles.input, styles.textArea]}
                                    placeholder="Describe your requirement (e.g. We need a fast bowler for a weekend match)"
                                    placeholderTextColor={colors.text.tertiary}
                                    multiline
                                    numberOfLines={4}
                                    value={description}
                                    onChangeText={setDescription}
                                />
                            </>
                        )}

                        <TouchableOpacity style={styles.submitBtn} onPress={handlePost}>
                            <Text style={styles.submitBtnText}>
                                {selectedType === 'Community' ? 'Share to Community' : 'Post Requirement'}
                            </Text>
                        </TouchableOpacity>
                    </ScrollView>
                </KeyboardAvoidingView>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: colors.surface,
        borderTopLeftRadius: radius.xxl,
        borderTopRightRadius: radius.xxl,
        height: '80%',
        paddingBottom: spacing.xxl,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: spacing.lg,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    headerTitle: {
        ...typography.presets.h3,
        color: colors.text.primary,
    },
    closeBtn: {
        padding: spacing.xs,
    },
    form: {
        padding: spacing.lg,
    },
    label: {
        ...typography.presets.body,
        fontWeight: typography.weights.bold,
        color: colors.text.primary,
        marginTop: spacing.md,
        marginBottom: spacing.sm,
    },
    input: {
        backgroundColor: '#F3F4F6',
        borderRadius: radius.md,
        padding: spacing.md,
        color: colors.text.primary,
        ...typography.presets.body,
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top',
    },
    dateSelector: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F3F4F6',
        borderRadius: radius.md,
        padding: spacing.md,
        borderWidth: 1,
        borderColor: colors.border,
    },
    inputIcon: {
        marginRight: spacing.sm,
    },
    dateText: {
        ...typography.presets.body,
        color: colors.text.primary,
    },
    typeSelector: {
        flexDirection: 'row',
        gap: spacing.sm,
    },
    typeChip: {
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        borderRadius: radius.full,
        borderWidth: 1,
        borderColor: colors.border,
    },
    activeTypeChip: {
        backgroundColor: '#F97316',
        borderColor: '#F97316',
    },
    typeText: {
        ...typography.presets.bodySmall,
        color: colors.text.secondary,
    },
    activeTypeText: {
        color: colors.text.inverse,
        fontWeight: typography.weights.bold,
    },
    submitBtn: {
        backgroundColor: '#F97316',
        borderRadius: radius.md,
        padding: spacing.md,
        alignItems: 'center',
        marginTop: spacing.xl,
        marginBottom: spacing.xxl,
    },
    submitBtnText: {
        ...typography.presets.bodyLarge,
        color: colors.text.inverse,
        fontWeight: typography.weights.bold,
    },
    imageSelectorContainer: {
        marginBottom: spacing.md,
    },
    imagePlaceholder: {
        height: 180,
        backgroundColor: '#F3F4F6',
        borderRadius: radius.md,
        borderWidth: 2,
        borderColor: colors.border,
        borderStyle: 'dashed',
        alignItems: 'center',
        justifyContent: 'center',
    },
    placeholderText: {
        ...typography.presets.bodySmall,
        color: colors.text.tertiary,
        marginTop: spacing.xs,
    },
    previewWrapper: {
        position: 'relative',
        height: 180,
        borderRadius: radius.md,
        overflow: 'hidden',
    },
    imagePreview: {
        width: '100%',
        height: '100%',
    },
    removeBadge: {
        position: 'absolute',
        top: spacing.sm,
        right: spacing.sm,
        backgroundColor: 'rgba(0,0,0,0.6)',
        width: 28,
        height: 28,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
