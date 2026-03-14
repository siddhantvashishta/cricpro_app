import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Dimensions, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography, radius } from '../theme';
import { MyCricketMatchCard } from './MyCricketMatchCard';

const { width, height } = Dimensions.get('window');

interface MatchesListModalProps {
    visible: boolean;
    onClose: () => void;
    title?: string;
}

// Dummy subset for the modal view
const SCHEDULED_MATCHES = [
    { id: 'sm1', leagueName: 'Group Stage', tournamentName: 'Match 1', status: 'Upcoming', dateStr: 'Today, 04:00 PM', overs: '20 Ov.', location: 'Main Ground', team1: 'Gladiators', team2: 'Titans', team1Color: '#F97316', team2Color: '#3B82F6', mainLogo: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=100', scheduledText: 'Match starts soon', footerLinks: ['Insights'], subTab: 'Your' },
    { id: 'sm2', leagueName: 'Group Stage', tournamentName: 'Match 2', status: 'Upcoming', dateStr: 'Tomorrow, 09:00 AM', overs: '20 Ov.', location: 'Oval Field', team1: 'Gladiators', team2: 'Spartans', team1Color: '#F97316', team2Color: '#10B981', mainLogo: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?q=80&w=100', scheduledText: 'Group B Fixture', footerLinks: ['Table'], subTab: 'Your' },
    { id: 'sm3', leagueName: 'Quarter Final', tournamentName: 'Match 3', status: 'Upcoming', dateStr: 'Sunday, 10:00 AM', overs: '20 Ov.', location: 'City Arena', team1: 'Gladiators', team2: 'Eagles', team1Color: '#F97316', team2Color: '#EF4444', mainLogo: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?q=80&w=100', scheduledText: 'Knockout Stage', footerLinks: ['Insights'], subTab: 'Your' },
];

export const MatchesListModal: React.FC<MatchesListModalProps> = ({ visible, onClose, title }) => {
    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={styles.modalContent}>
                    {/* Header */}
                    <View style={styles.header}>
                        <View style={styles.headerTitleContainer}>
                            <Text style={styles.title}>Scheduled Matches</Text>
                            <Text style={styles.subtitle}>{title || 'Tournament Fixtures'}</Text>
                        </View>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <Ionicons name="close" size={24} color={colors.text.primary} />
                        </TouchableOpacity>
                    </View>

                    {/* Content */}
                    <ScrollView
                        contentContainerStyle={styles.scrollContent}
                        showsVerticalScrollIndicator={false}
                    >
                        {SCHEDULED_MATCHES.map((item) => (
                            <MyCricketMatchCard
                                key={item.id}
                                leagueName={item.leagueName}
                                tournamentName={item.tournamentName}
                                status={item.status}
                                dateStr={item.dateStr}
                                overs={item.overs}
                                location={item.location}
                                team1={item.team1}
                                team2={item.team2}
                                team1Color={item.team1Color}
                                team2Color={item.team2Color}
                                team1Logo={item.mainLogo}
                                team2Logo={item.mainLogo}
                                mainLogo={item.mainLogo}
                                scheduledText={item.scheduledText}
                                footerLinks={[]} // Minimal view inside modal
                                onPress={() => { }}
                                onLinkPress={() => { }}
                            />
                        ))}
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: colors.background,
        borderTopLeftRadius: radius.xl,
        borderTopRightRadius: radius.xl,
        maxHeight: height * 0.9,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: spacing.xl,
        paddingTop: spacing.xl,
        paddingBottom: spacing.lg,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
        backgroundColor: colors.surface,
        borderTopLeftRadius: radius.xl,
        borderTopRightRadius: radius.xl,
    },
    headerTitleContainer: {
        flex: 1,
    },
    title: {
        ...typography.presets.h2,
        color: colors.text.primary,
    },
    subtitle: {
        ...typography.presets.caption,
        color: colors.text.secondary,
        marginTop: 2,
    },
    closeButton: {
        padding: spacing.xs,
        backgroundColor: '#F3F4F6',
        borderRadius: 20,
    },
    scrollContent: {
        paddingBottom: spacing.xxl,
    },
});
