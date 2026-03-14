import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { colors, spacing, typography, shadows } from '../../theme';
import { AppHeader } from '../../components';

const ASSOCIATIONS = [
    {
        id: '1',
        name: 'ICC',
        fullName: 'International Cricket Council',
        description: 'The global governing body for cricket, responsible for the organization and governance of major international tournaments.',
        logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/8/8e/International_Cricket_Council_logo.svg/1200px-International_Cricket_Council_logo.svg.png',
        url: 'https://www.icc-cricket.com'
    },
    {
        id: '2',
        name: 'BCCI',
        fullName: 'Board of Control for Cricket in India',
        description: 'The national governing body for cricket in India, one of the most powerful and wealthiest cricket boards in the world.',
        logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/8/8d/BCCI_logo.svg/1200px-BCCI_logo.svg.png',
        url: 'https://www.bcci.tv'
    },
    {
        id: '3',
        name: 'ECB',
        fullName: 'England and Wales Cricket Board',
        description: 'The governing body for cricket in England and Wales, focusing on domestic and international excellence.',
        logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/9/9d/England_and_Wales_Cricket_Board_logo.svg/1200px-England_and_Wales_Cricket_Board_logo.svg.png',
        url: 'https://www.ecb.co.uk'
    },
    {
        id: '4',
        name: 'CA',
        fullName: 'Cricket Australia',
        description: 'The governing body for cricket in Australia, overseeing the development and promotion of the game at all levels.',
        logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/0/0d/Cricket_Australia_logo.svg/1200px-Cricket_Australia_logo.svg.png',
        url: 'https://www.cricket.com.au'
    },
    {
        id: '5',
        name: 'PCB',
        fullName: 'Pakistan Cricket Board',
        description: 'The controlling body for the game of cricket in Pakistan, responsible for the national team and domestic leagues.',
        logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/c/c5/Pakistan_Cricket_Board_logo.svg/1200px-Pakistan_Cricket_Board_logo.svg.png',
        url: 'https://www.pcb.com.pk'
    }
];

export const AssociationsScreen = () => {
    const navigation = useNavigation();

    const handleOpenLink = (url: string) => {
        Linking.openURL(url).catch(err => console.error("Couldn't load page", err));
    };

    return (
        <SafeAreaView style={styles.container}>
            <AppHeader title="Associations" showBack />

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Text style={styles.subHeader}>Governing Bodies</Text>
                <Text style={styles.description}>Explore the organizations that shape the international and domestic cricket landscape.</Text>

                {ASSOCIATIONS.map((assoc) => (
                    <TouchableOpacity
                        key={assoc.id}
                        style={styles.card}
                        onPress={() => handleOpenLink(assoc.url)}
                        activeOpacity={0.7}
                    >
                        <View style={styles.cardHeader}>
                            <View style={styles.logoContainer}>
                                <Image source={{ uri: assoc.logo }} style={styles.logo} resizeMode="contain" />
                            </View>
                            <View style={styles.titleContainer}>
                                <Text style={styles.assocName}>{assoc.name}</Text>
                                <Text style={styles.assocFullName}>{assoc.fullName}</Text>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color={colors.text.tertiary} />
                        </View>
                        <Text style={styles.assocDesc}>{assoc.description}</Text>
                        <View style={styles.divider} />
                        <View style={styles.footer}>
                            <Ionicons name="globe-outline" size={16} color={colors.primary} />
                            <Text style={styles.visitText}>Visit Official Website</Text>
                        </View>
                    </TouchableOpacity>
                ))}

                <View style={styles.infoBox}>
                    <Ionicons name="information-circle" size={24} color={colors.primary} />
                    <Text style={styles.infoText}>
                        More associations and state boards are joining our network soon. Stay tuned!
                    </Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: spacing.md,
        height: 60,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    backButton: {
        padding: spacing.xs,
    },
    headerTitle: {
        ...typography.presets.h3,
        color: colors.text.primary,
    },
    scrollContent: {
        padding: spacing.md,
        paddingBottom: spacing.xl,
    },
    subHeader: {
        ...typography.presets.h2,
        color: colors.text.primary,
        marginBottom: spacing.xs,
    },
    description: {
        ...typography.presets.bodySmall,
        color: colors.text.secondary,
        marginBottom: spacing.lg,
    },
    card: {
        backgroundColor: colors.surface,
        borderRadius: 16,
        padding: spacing.md,
        marginBottom: spacing.md,
        ...shadows.soft,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacing.sm,
    },
    logoContainer: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#fff', // Neutral background for logos
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: spacing.md,
        padding: 4,
    },
    logo: {
        width: '100%',
        height: '100%',
    },
    titleContainer: {
        flex: 1,
    },
    assocName: {
        ...typography.presets.h3,
        color: colors.text.primary,
    },
    assocFullName: {
        ...typography.presets.caption,
        color: colors.text.tertiary,
    },
    assocDesc: {
        ...typography.presets.bodySmall,
        color: colors.text.secondary,
        lineHeight: 20,
        marginBottom: spacing.md,
    },
    divider: {
        height: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.05)',
        marginBottom: spacing.sm,
    },
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    visitText: {
        ...typography.presets.caption,
        color: colors.primary,
        marginLeft: spacing.xs,
        fontWeight: 'bold',
    },
    infoBox: {
        backgroundColor: 'rgba(26, 75, 143, 0.1)',
        padding: spacing.md,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: spacing.sm,
    },
    infoText: {
        flex: 1,
        marginLeft: spacing.md,
        ...typography.presets.bodySmall,
        color: colors.text.secondary,
    },
});
