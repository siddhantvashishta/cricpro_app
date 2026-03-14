import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';
import { colors, spacing, typography, radius } from '../theme';
import { Ionicons } from '@expo/vector-icons';
import { getTeamColor } from '../utils/teamColors';

const { width } = Dimensions.get('window');

export interface MyCricketMatchCardProps {
    leagueName: string;
    tournamentName: string;
    status: string;
    dateStr: string;
    overs: string;
    location: string;
    team1: string;
    team2: string;
    team1Logo?: string;
    team2Logo?: string;
    team1Color?: string;
    team2Color?: string;
    mainLogo?: string;
    scheduledText: string;
    footerLinks: string[];
    thumbnailUrl?: string;
    onPress?: () => void;
    onLinkPress?: (link: string) => void;
}

export const MyCricketMatchCard: React.FC<MyCricketMatchCardProps> = ({
    leagueName,
    tournamentName,
    status,
    dateStr,
    overs,
    location,
    team1,
    team2,
    team1Logo,
    team2Logo,
    team1Color,
    team2Color,
    mainLogo,
    scheduledText,
    footerLinks,
    thumbnailUrl,
    onPress,
    onLinkPress
}) => {
    return (
        <View style={styles.cardContainer}>
            <TouchableOpacity
                activeOpacity={0.9}
                onPress={onPress}
                style={styles.touchable}
            >
                {/* Thumbnail for Video Highlights */}
                {thumbnailUrl && (
                    <View style={styles.thumbnailContainer}>
                        <Image source={{ uri: thumbnailUrl }} style={styles.thumbnail} />
                        <View style={styles.playIconOverlay}>
                            <Ionicons name="play-circle" size={48} color="rgba(255,255,255,0.8)" />
                        </View>
                    </View>
                )}

                {/* Top Section */}
                <View style={styles.topSection}>
                    {mainLogo && <Image source={{ uri: mainLogo }} style={styles.headerLogo} />}
                    <View style={styles.topLeft}>
                        <Text style={styles.leagueText} numberOfLines={1}>
                            <Text style={styles.leagueName}>{leagueName}</Text>, {tournamentName}
                        </Text>
                        <Text style={styles.dateLocationText} numberOfLines={1}>
                            {dateStr} | {overs} | {location}
                        </Text>
                    </View>
                    <View style={styles.statusBadge}>
                        <Text style={styles.statusText}>{status}</Text>
                    </View>
                </View>

                {/* Middle Section (Teams) */}
                <View style={styles.middleSection}>
                    <View style={styles.teamRow}>
                        {team1Logo ? (
                            <Image source={{ uri: team1Logo }} style={styles.teamLogo} />
                        ) : (
                            <View style={[styles.teamLogo, styles.placeholderLogo]}>
                                <Ionicons name="shield-outline" size={14} color={colors.text.secondary} />
                            </View>
                        )}
                        <Text style={[styles.teamName, { color: team1Color || getTeamColor(team1) }]}>{team1}</Text>
                    </View>
                    <View style={styles.teamRow}>
                        {team2Logo ? (
                            <Image source={{ uri: team2Logo }} style={styles.teamLogo} />
                        ) : (
                            <View style={[styles.teamLogo, styles.placeholderLogo]}>
                                <Ionicons name="shield-outline" size={14} color={colors.text.secondary} />
                            </View>
                        )}
                        <Text style={[styles.teamName, { color: team2Color || getTeamColor(team2) }]}>{team2}</Text>
                    </View>
                </View>

                {/* Bottom Section */}
                <View style={styles.bottomSection}>
                    <Text style={styles.scheduledText}>{scheduledText}</Text>
                    <View style={styles.linksRow}>
                        {footerLinks.map((link, index) => (
                            <TouchableOpacity key={index} onPress={() => onLinkPress?.(link)}>
                                <Text style={styles.linkText}>{link}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    cardContainer: {
        backgroundColor: colors.surface,
        borderRadius: radius.md,
        marginHorizontal: spacing.lg,
        marginBottom: spacing.md,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        overflow: 'hidden',
    },
    touchable: {
        padding: 0,
    },
    thumbnailContainer: {
        position: 'relative',
        height: 160,
        backgroundColor: colors.background,
    },
    thumbnail: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    playIconOverlay: {
        ...StyleSheet.absoluteFillObject,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.2)',
    },
    topSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: spacing.md,
        paddingTop: spacing.md,
        paddingBottom: spacing.sm,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    topLeft: {
        flex: 1,
        marginRight: spacing.sm,
    },
    headerLogo: {
        width: 32,
        height: 32,
        borderRadius: radius.full,
        marginRight: spacing.md,
        backgroundColor: colors.background,
    },
    leagueText: {
        ...typography.presets.bodySmall,
        color: colors.text.secondary,
        marginBottom: 2,
    },
    leagueName: {
        fontWeight: typography.weights.bold,
        color: colors.text.primary,
    },
    dateLocationText: {
        ...typography.presets.caption,
        color: colors.text.secondary,
    },
    statusBadge: {
        backgroundColor: '#FEF2F2',
        paddingHorizontal: spacing.sm,
        paddingVertical: 2,
        borderRadius: radius.md,
        alignSelf: 'flex-start',
    },
    statusText: {
        color: '#DC2626',
        fontSize: 10,
        fontWeight: 'bold',
    },
    middleSection: {
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    teamRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacing.xs,
    },
    teamLogo: {
        width: 24,
        height: 24,
        borderRadius: radius.full,
        marginRight: spacing.sm,
    },
    placeholderLogo: {
        backgroundColor: colors.background,
        alignItems: 'center',
        justifyContent: 'center',
    },
    teamName: {
        ...typography.presets.bodyLarge,
        fontWeight: typography.weights.bold,
    },
    bottomSection: {
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.md,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    scheduledText: {
        ...typography.presets.bodySmall,
        color: colors.text.secondary,
    },
    linksRow: {
        flexDirection: 'row',
        gap: spacing.md,
    },
    linkText: {
        ...typography.presets.bodySmall,
        color: '#F97316',
        fontWeight: typography.weights.bold,
    },
});
