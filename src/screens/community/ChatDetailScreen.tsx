import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    FlatList,
    TextInput,
    KeyboardAvoidingView,
    Platform,
    Image,
    StatusBar,
    Keyboard
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, spacing, typography, radius } from '../../theme';

interface Message {
    id: string;
    text: string;
    sender: 'me' | 'them';
    time: string;
}

const INITIAL_MESSAGES: Message[] = [
    { id: '1', text: 'Hey, I saw your post looking for an All-rounder!', sender: 'them', time: '10:00 AM' },
    { id: '2', text: 'Yes! Are you interested in joining for the match tomorrow?', sender: 'me', time: '10:05 AM' },
    { id: '3', text: 'Definitely. What is the ground location?', sender: 'them', time: '10:08 AM' },
    { id: '4', text: 'It is at the Open Ground near HSR Layout.', sender: 'me', time: '10:10 AM' },
];

const THEME_COLORS = {
    header: '#005CE6',
    headerLight: '#1A73E8',
    bubbleMe: '#D6E4FF', // Light theme blue
    bubbleThem: '#FFFFFF',
    bg: '#F1F5F9', // Light slate background
    textMain: '#1E293B',
    textSecondary: '#64748B',
    time: '#94A3B8',
    check: '#3B82F6',
};

const CRICKET_EMOJIS = ['🏏', '⚾', '🔥', '🏆', '🤝', '😊', '👏', '🙌', '💯', '👊', '💪', '🏃', '🧢', '👕', '👟'];

export const ChatDetailScreen: React.FC = () => {
    const navigation = useNavigation<any>();
    const route = useRoute();
    const insets = useSafeAreaInsets();
    const { name, avatar } = (route.params as any) || { name: 'Chat', avatar: null };

    const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
    const [inputText, setInputText] = useState('');
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);

    const handleSend = () => {
        if (inputText.trim() === '') return;

        const newMessage: Message = {
            id: Date.now().toString(),
            text: inputText.trim(),
            sender: 'me',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setMessages([...messages, newMessage]);
        setInputText('');
        setShowEmojiPicker(false);
    };

    const handleEmojiSelect = (emoji: string) => {
        setInputText(prev => prev + emoji);
    };

    const toggleEmojiPicker = () => {
        if (!showEmojiPicker) {
            Keyboard.dismiss();
        }
        setShowEmojiPicker(!showEmojiPicker);
    };

    const renderMessage = ({ item }: { item: Message }) => {
        const isMe = item.sender === 'me';
        return (
            <View style={[styles.messageWrapper, isMe ? styles.myMessageWrapper : styles.theirMessageWrapper]}>
                <View style={[styles.bubble, isMe ? styles.myBubble : styles.theirBubble]}>
                    <Text style={styles.messageText}>
                        {item.text}
                    </Text>
                    <View style={styles.timeRow}>
                        <Text style={styles.timeText}>
                            {item.time}
                        </Text>
                        {isMe && (
                            <Ionicons name="checkmark-done" size={14} color={THEME_COLORS.check} style={styles.checkIcon} />
                        )}
                    </View>
                </View>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={THEME_COLORS.header} translucent />

            {/* Professional Header with Safe Area Handling */}
            <View style={[styles.header, { paddingTop: insets.top }]}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={24} color="#FFF" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.headerInfo}>
                    <View style={styles.avatarContainer}>
                        {avatar ? (
                            <Image source={{ uri: avatar }} style={styles.avatar} />
                        ) : (
                            <View style={styles.avatarPlaceholder}>
                                <Ionicons name="person" size={22} color="#AAA" />
                            </View>
                        )}
                    </View>
                    <View style={styles.nameContainer}>
                        <Text style={styles.headerName} numberOfLines={1}>{name}</Text>
                        <Text style={styles.headerStatus}>online</Text>
                    </View>
                </TouchableOpacity>

                <View style={styles.headerActions}>
                    <TouchableOpacity style={styles.headerActionBtn}>
                        <Ionicons name="ellipsis-vertical" size={20} color="#FFF" />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Keyboard Avoiding View for Input Responsiveness */}
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? insets.top + 70 : 0}
                style={styles.keyboardView}
            >
                <View style={styles.chatArea}>
                    <FlatList
                        data={messages}
                        keyExtractor={(item) => item.id}
                        renderItem={renderMessage}
                        contentContainerStyle={styles.listContent}
                        showsVerticalScrollIndicator={false}
                        keyboardDismissMode="on-drag"
                        keyboardShouldPersistTaps="handled"
                        onScrollBeginDrag={() => setShowEmojiPicker(false)}
                    />
                </View>

                {/* Emoji Picker Bar */}
                {showEmojiPicker && (
                    <View style={styles.emojiPicker}>
                        <FlatList
                            data={CRICKET_EMOJIS}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={styles.emojiItem}
                                    onPress={() => handleEmojiSelect(item)}
                                >
                                    <Text style={styles.emojiText}>{item}</Text>
                                </TouchableOpacity>
                            )}
                            contentContainerStyle={styles.emojiListContent}
                        />
                    </View>
                )}

                {/* Themed Input Bar with Bottom Safe Area Handling */}
                <View style={[styles.inputBar, { paddingBottom: Math.max(insets.bottom, 8) }]}>
                    <View style={styles.inputContainer}>
                        <TouchableOpacity
                            style={styles.inputInnerBtn}
                            onPress={toggleEmojiPicker}
                        >
                            <Ionicons
                                name={showEmojiPicker ? "keypad-outline" : "happy-outline"}
                                size={24}
                                color={showEmojiPicker ? THEME_COLORS.header : "#64748B"}
                            />
                        </TouchableOpacity>

                        <TextInput
                            style={styles.input}
                            placeholder="Message"
                            value={inputText}
                            onChangeText={setInputText}
                            multiline
                            placeholderTextColor="#94A3B8"
                            onFocus={() => setShowEmojiPicker(false)}
                        />

                        <TouchableOpacity style={styles.inputInnerBtn}>
                            <Ionicons name="attach" size={24} color="#64748B" />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.inputInnerBtn}>
                            <Ionicons name="camera" size={24} color="#64748B" />
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                        style={styles.fabBtn}
                        onPress={handleSend}
                    >
                        <Ionicons
                            name="send"
                            size={20}
                            color="#FFF"
                        />
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: THEME_COLORS.bg,
    },
    keyboardView: {
        flex: 1,
    },
    header: {
        backgroundColor: THEME_COLORS.header,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 4,
        paddingBottom: 10,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 3,
    },
    backBtn: {
        padding: 8,
    },
    headerInfo: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatarContainer: {
        marginRight: 8,
    },
    avatar: {
        width: 38,
        height: 38,
        borderRadius: 19,
    },
    avatarPlaceholder: {
        width: 38,
        height: 38,
        borderRadius: 19,
        backgroundColor: '#E5E7EB',
        justifyContent: 'center',
        alignItems: 'center',
    },
    nameContainer: {
        flex: 1,
    },
    headerName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FFF',
    },
    headerStatus: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.8)',
    },
    headerActions: {
        flexDirection: 'row',
    },
    headerActionBtn: {
        padding: 10,
    },
    chatArea: {
        flex: 1,
    },
    listContent: {
        padding: 12,
        paddingBottom: 20,
    },
    messageWrapper: {
        marginBottom: 8,
        maxWidth: '85%',
    },
    myMessageWrapper: {
        alignSelf: 'flex-end',
    },
    theirMessageWrapper: {
        alignSelf: 'flex-start',
    },
    bubble: {
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    myBubble: {
        backgroundColor: THEME_COLORS.bubbleMe,
        borderBottomRightRadius: 4,
    },
    theirBubble: {
        backgroundColor: THEME_COLORS.bubbleThem,
        borderBottomLeftRadius: 4,
    },
    messageText: {
        ...typography.presets.bodySmall,
        color: THEME_COLORS.textMain,
    },
    timeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-end',
        marginTop: 2,
    },
    timeText: {
        fontSize: 10,
        color: THEME_COLORS.time,
        marginRight: 2,
    },
    checkIcon: {
        marginLeft: 2,
    },
    emojiPicker: {
        backgroundColor: '#FFF',
        borderTopWidth: 1,
        borderTopColor: '#E2E8F0',
        height: 50,
        justifyContent: 'center',
    },
    emojiListContent: {
        paddingHorizontal: 12,
        alignItems: 'center',
    },
    emojiItem: {
        paddingHorizontal: 10,
        paddingVertical: 5,
    },
    emojiText: {
        fontSize: 24,
    },
    inputBar: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        paddingHorizontal: 8,
        paddingBottom: 8,
        paddingTop: 4,
        backgroundColor: 'transparent',
    },
    inputContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        borderRadius: 24,
        paddingHorizontal: 12,
        minHeight: 48,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    input: {
        flex: 1,
        marginHorizontal: 8,
        maxHeight: 120,
        ...typography.presets.bodySmall,
        color: THEME_COLORS.textMain,
        paddingVertical: 8,
    },
    inputInnerBtn: {
        padding: 6,
    },
    fabBtn: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: THEME_COLORS.header,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 8,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
    },
});
