import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography, radius } from '../theme';
import { getTeamColor } from '../utils/teamColors';

interface TournamentTableModalProps {
    visible: boolean;
    onClose: () => void;
    tournamentName: string;
}

const DUMMY_TABLE_DATA = [
    { pos: 1, team: 'Gladiators', p: 8, w: 6, l: 2, pts: 12, nrr: '+1.450', color: '#10B981' },
    { pos: 2, team: 'Titans', p: 8, w: 5, l: 3, pts: 10, nrr: '+0.890', color: '#10B981' },
    { pos: 3, team: 'Men in Blue', p: 8, w: 5, l: 3, pts: 10, nrr: '+0.120', color: '#10B981' },
    { pos: 4, team: 'Meteors', p: 8, w: 4, l: 4, pts: 8, nrr: '-0.240', color: '#FBBF24' },
    { pos: 5, team: 'Eagles', p: 8, w: 3, l: 5, pts: 6, nrr: '-0.670', color: '#F3F4F6' },
    { pos: 6, team: 'Hawks', p: 8, w: 1, l: 7, pts: 2, nrr: '-1.560', color: '#F3F4F6' },
];

export const TournamentTableModal: React.FC<TournamentTableModalProps> = ({ visible, onClose, tournamentName }) => {
    const renderHeader = () => (
        <View style={styles.tableHeader}>
            <Text style={[styles.headerCell, styles.posCol]}>#</Text>
            <Text style={[styles.headerCell, styles.teamCol]}>TEAM</Text>
            <Text style={styles.headerCell}>P</Text>
            <Text style={styles.headerCell}>W</Text>
            <Text style={styles.headerCell}>L</Text>
            <Text style={[styles.headerCell, styles.ptsCol]}>PTS</Text>
            <Text style={[styles.headerCell, styles.nrrCol]}>NRR</Text>
        </View>
    );

    const renderItem = ({ item }: { item: typeof DUMMY_TABLE_DATA[0] }) => (
        <View style={[styles.tableRow, item.pos <= 3 && styles.qualifyRow]}>
            <View style={[styles.posIndicator, { backgroundColor: item.color }]} />
            <Text style={[styles.cellText, styles.posCol, { fontWeight: 'bold' }]}>{item.pos}</Text>
            <Text style={[styles.cellText, styles.teamCol, { fontWeight: 'bold', color: getTeamColor(item.team) }]} numberOfLines={1}>{item.team}</Text>
            <Text style={styles.cellText}>{item.p}</Text>
            <Text style={styles.cellText}>{item.w}</Text>
            <Text style={styles.cellText}>{item.l}</Text>
            <Text style={[styles.cellText, styles.ptsCol, { fontWeight: 'bold' }]}>{item.pts}</Text>
            <Text style={[styles.cellText, styles.nrrCol, { color: item.nrr.startsWith('+') ? '#059669' : '#DC2626' }]}>
                {item.nrr}
            </Text>
        </View>
    );

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={styles.modalContent}>
                    <View style={styles.header}>
                        <View>
                            <Text style={styles.headerTitle}>Points Table</Text>
                            <Text style={styles.headerSubtitle}>{tournamentName || 'Tournament Standings'}</Text>
                        </View>
                        <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                            <Ionicons name="close" size={24} color={colors.text.primary} />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.tableContainer}>
                        {renderHeader()}
                        <FlatList
                            data={DUMMY_TABLE_DATA}
                            keyExtractor={(item) => item.pos.toString()}
                            renderItem={renderItem}
                            contentContainerStyle={styles.listContent}
                        />
                    </View>

                    <View style={styles.footer}>
                        <View style={styles.legend}>
                            <View style={[styles.legendDot, { backgroundColor: '#10B981' }]} />
                            <Text style={styles.legendText}>Qualification Zone</Text>
                        </View>
                        <View style={[styles.legend, { marginLeft: spacing.md }]}>
                            <View style={[styles.legendDot, { backgroundColor: '#FBBF24' }]} />
                            <Text style={styles.legendText}>Playoffs</Text>
                        </View>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.7)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: spacing.lg,
    },
    modalContent: {
        backgroundColor: colors.surface,
        borderRadius: radius.xl,
        width: '100%',
        maxHeight: '80%',
        overflow: 'hidden',
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
        ...typography.presets.h2,
        color: colors.text.primary,
    },
    headerSubtitle: {
        ...typography.presets.caption,
        color: colors.text.secondary,
    },
    closeBtn: {
        padding: spacing.xs,
    },
    tableContainer: {
        padding: spacing.md,
    },
    tableHeader: {
        flexDirection: 'row',
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.sm,
        backgroundColor: colors.background,
        borderRadius: radius.sm,
        marginBottom: spacing.xs,
    },
    headerCell: {
        fontSize: 10,
        fontWeight: 'bold',
        color: colors.text.tertiary,
        textAlign: 'center',
        flex: 1,
    },
    tableRow: {
        flexDirection: 'row',
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.sm,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
        alignItems: 'center',
        position: 'relative',
    },
    qualifyRow: {
        backgroundColor: 'rgba(16, 185, 129, 0.03)',
    },
    posIndicator: {
        position: 'absolute',
        left: 0,
        width: 3,
        height: '60%',
        borderRadius: radius.full,
    },
    cellText: {
        fontSize: 12,
        color: colors.text.primary,
        textAlign: 'center',
        flex: 1,
    },
    posCol: {
        flex: 0.6,
    },
    teamCol: {
        flex: 2,
        textAlign: 'left',
        paddingLeft: spacing.sm,
    },
    ptsCol: {
        flex: 1,
    },
    nrrCol: {
        flex: 1.5,
    },
    listContent: {
        paddingBottom: spacing.md,
    },
    footer: {
        flexDirection: 'row',
        padding: spacing.lg,
        borderTopWidth: 1,
        borderTopColor: colors.border,
        backgroundColor: colors.background,
    },
    legend: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    legendDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginRight: 6,
    },
    legendText: {
        fontSize: 10,
        color: colors.text.secondary,
    },
});
