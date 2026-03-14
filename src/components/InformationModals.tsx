import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView, Image, Dimensions, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography, radius } from '../theme';

const { width } = Dimensions.get('window');

interface ExtendedModalProps {
    visible: boolean;
    onClose: () => void;
    data?: any;
    title?: string;
}

// 1. Registration Modal
export const RegistrationModal: React.FC<ExtendedModalProps> = ({ visible, onClose, title, data }) => (
    <Modal animationType="slide" transparent visible={visible} onRequestClose={onClose}>
        <View style={styles.overlay}>
            <View style={[styles.modalContent, { height: '85%' }]}>
                <View style={styles.header}>
                    <View>
                        <Text style={styles.headerTitle}>Tournament Entry</Text>
                        <Text style={styles.headerSubtitle}>{title || data?.tournamentName}</Text>
                    </View>
                    <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                        <Ionicons name="close" size={24} color={colors.text.primary} />
                    </TouchableOpacity>
                </View>
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <View style={styles.infoBox}>
                        <View style={styles.infoRow}>
                            <Ionicons name="calendar-outline" size={20} color={colors.primary} />
                            <Text style={styles.infoText}>Starts: 15 Oct 2026</Text>
                        </View>
                        <View style={styles.infoRow}>
                            <Ionicons name="location-outline" size={20} color={colors.primary} />
                            <Text style={styles.infoText}>{data?.location || 'Central Stadium'}</Text>
                        </View>
                        <View style={styles.infoRow}>
                            <Ionicons name="cash-outline" size={20} color={colors.primary} />
                            <Text style={styles.infoText}>Entry Fee: ₹2,500 / Team</Text>
                        </View>
                    </View>

                    <Text style={styles.sectionTitle}>Select Your Team</Text>
                    <View style={styles.teamSelectCard}>
                        <View style={styles.selectedTeamItem}>
                            <View style={styles.teamAvatar}><Text style={styles.teamAvatarText}>GC</Text></View>
                            <View>
                                <Text style={styles.teamNameText}>Gladiators CC</Text>
                                <Text style={styles.teamRoleText}>Captain</Text>
                            </View>
                        </View>
                        <Ionicons name="chevron-down" size={20} color={colors.text.secondary} />
                    </View>

                    <Text style={styles.sectionTitle}>Contact Email</Text>
                    <TextInput
                        style={styles.inputField}
                        placeholder="captain@team.com"
                        placeholderTextColor={colors.text.tertiary}
                        defaultValue="aryan.s@cricpro.com"
                    />

                    <Text style={styles.sectionTitle}>Payment Summary</Text>
                    <View style={styles.receiptBox}>
                        <View style={styles.receiptRow}>
                            <Text style={styles.receiptLabel}>Registration Fee</Text>
                            <Text style={styles.receiptVal}>₹2,500</Text>
                        </View>
                        <View style={styles.receiptRow}>
                            <Text style={styles.receiptLabel}>Platform Tax</Text>
                            <Text style={styles.receiptVal}>₹125</Text>
                        </View>
                        <View style={[styles.receiptRow, styles.receiptTotalRow]}>
                            <Text style={styles.receiptTotalLabel}>Total Amount</Text>
                            <Text style={styles.receiptTotalVal}>₹2,625</Text>
                        </View>
                    </View>

                    <TouchableOpacity style={styles.primaryActionBtn} onPress={onClose}>
                        <Ionicons name="lock-closed" size={20} color="white" style={{ marginRight: 8 }} />
                        <Text style={styles.primaryActionText}>Proceed to Secure Payment</Text>
                    </TouchableOpacity>
                </ScrollView>
            </View>
        </View>
    </Modal>
);

// 2. Tournament Brackets Modal
export const BracketsModal: React.FC<ExtendedModalProps> = ({ visible, onClose, title }) => (
    <Modal animationType="fade" transparent visible={visible} onRequestClose={onClose}>
        <View style={styles.overlay}>
            <View style={[styles.modalContent, { height: '80%' }]}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Tournament Tree</Text>
                    <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                        <Ionicons name="close" size={24} color={colors.text.primary} />
                    </TouchableOpacity>
                </View>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.bracketScroll}>
                    <View style={styles.bracketColumn}>
                        <Text style={styles.roundTitle}>Quarter Finals</Text>
                        <View style={styles.matchupCard}>
                            <Text style={[styles.teamLabel, { color: colors.primary }]}>Gladiators (Win)</Text>
                            <View style={styles.vsDivider} />
                            <Text style={styles.teamLabel}>Trojans</Text>
                        </View>
                        <View style={[styles.matchupCard, { marginTop: spacing.xxl }]}>
                            <Text style={styles.teamLabel}>Meteors</Text>
                            <View style={styles.vsDivider} />
                            <Text style={[styles.teamLabel, { color: colors.primary }]}>Titans (Win)</Text>
                        </View>
                    </View>

                    <View style={styles.bracketConnector} />

                    <View style={styles.bracketColumn}>
                        <Text style={styles.roundTitle}>Semi Finals</Text>
                        <View style={[styles.matchupCard, { marginTop: 40 }]}>
                            <Text style={[styles.teamLabel, { color: colors.primary }]}>Gladiators</Text>
                            <View style={styles.vsDivider} />
                            <Text style={styles.teamLabel}>Titans</Text>
                        </View>
                    </View>

                    <View style={styles.bracketConnector} />

                    <View style={styles.bracketColumn}>
                        <Text style={styles.roundTitle}>Finals</Text>
                        <View style={[styles.matchupCard, { marginTop: 80, borderColor: '#FBBF24', borderWidth: 2 }]}>
                            <Text style={styles.teamLabel}>TBD</Text>
                            <View style={styles.vsDivider} />
                            <Text style={styles.teamLabel}>Eagles</Text>
                        </View>
                    </View>
                </ScrollView>
            </View>
        </View>
    </Modal>
);

// 3. Info Modal
export const InfoModal: React.FC<ExtendedModalProps> = ({ visible, onClose, title, data }) => (
    <Modal animationType="slide" transparent visible={visible} onRequestClose={onClose}>
        <View style={styles.overlay}>
            <View style={styles.modalContent}>
                <View style={styles.header}>
                    <View>
                        <Text style={styles.headerTitle}>Tournament Info</Text>
                        <Text style={styles.headerSubtitle}>{title || data?.tournamentName}</Text>
                    </View>
                    <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                        <Ionicons name="close" size={24} color={colors.text.primary} />
                    </TouchableOpacity>
                </View>
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <Image source={{ uri: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=800' }} style={styles.mapPlaceholder} />

                    <Text style={styles.sectionTitle}>Overview</Text>
                    <Text style={styles.descText}>
                        The premier regional T20 tournament bringing together the best professional and corporate teams across the city. Sponsored by CricPro Network.
                    </Text>

                    <Text style={styles.sectionTitle}>Venue Highlights</Text>
                    {['Floodlit turf wickets', 'Live streaming facility', 'Professional Umpires', 'Pavilion Seating'].map((feat, i) => (
                        <View key={i} style={styles.bulletRow}>
                            <Ionicons name="checkmark-circle" size={16} color={colors.primary} />
                            <Text style={styles.bulletText}>{feat}</Text>
                        </View>
                    ))}

                    <Text style={styles.sectionTitle}>Prize Pool</Text>
                    <View style={styles.prizeBox}>
                        <Ionicons name="trophy" size={32} color="#FBBF24" />
                        <View style={{ marginLeft: spacing.md }}>
                            <Text style={styles.prizeTitle}>Winners: ₹50,000</Text>
                            <Text style={styles.prizeSub}>Runners up: ₹20,000</Text>
                        </View>
                    </View>
                </ScrollView>
            </View>
        </View>
    </Modal>
);

// 4. Rules Modal
export const RulesModal: React.FC<ExtendedModalProps> = ({ visible, onClose, title }) => (
    <Modal animationType="slide" transparent visible={visible} onRequestClose={onClose}>
        <View style={styles.overlay}>
            <View style={styles.modalContent}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>League Rules</Text>
                    <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                        <Ionicons name="close" size={24} color={colors.text.primary} />
                    </TouchableOpacity>
                </View>
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    {[
                        { title: 'Match Format', desc: 'Strict 20-Overs per side. Slow over-rate penalty applies (5 runs per over missing).' },
                        { title: 'Powerplay Limits', desc: 'First 6 overs mandatory powerplay. Maximum 2 fielders outside 30-yard circle.' },
                        { title: 'Ball Type', desc: 'Pink standard leather balls will be used for all day/night fixtures.' },
                        { title: 'Umpire Decisions', desc: 'On-field umpires decisions are final. No DRS available currently.' },
                        { title: 'Substitute Rules', desc: 'Impact Player rule is ACTIVE. Teams can nominate 4 subs at the toss.' }
                    ].map((rule, idx) => (
                        <View key={idx} style={styles.ruleCard}>
                            <View style={styles.ruleNumBadge}>
                                <Text style={styles.ruleNum}>{idx + 1}</Text>
                            </View>
                            <View style={styles.ruleContent}>
                                <Text style={styles.ruleTitle}>{rule.title}</Text>
                                <Text style={styles.ruleDesc}>{rule.desc}</Text>
                            </View>
                        </View>
                    ))}
                </ScrollView>
            </View>
        </View>
    </Modal>
);

// 5. Gallery Modal
export const GalleryModal: React.FC<ExtendedModalProps> = ({ visible, onClose, title }) => (
    <Modal animationType="slide" transparent visible={visible} onRequestClose={onClose}>
        <View style={styles.overlay}>
            <View style={[styles.modalContent, { height: '90%' }]}>
                <View style={styles.header}>
                    <View>
                        <Text style={styles.headerTitle}>Media Gallery</Text>
                        <Text style={styles.headerSubtitle}>{title || 'Match Highlights'} (12 New)</Text>
                    </View>
                    <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                        <Ionicons name="close" size={24} color={colors.text.primary} />
                    </TouchableOpacity>
                </View>
                <ScrollView contentContainerStyle={styles.galleryContent}>
                    {[
                        'https://images.unsplash.com/photo-1531415074968-036ba1b575da?q=80&w=400',
                        'https://images.unsplash.com/photo-1540747913346-19e3adca174f?q=80&w=400',
                        'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?q=80&w=400',
                        'https://images.unsplash.com/photo-1624526267942-ab0ff8a3e972?q=80&w=400',
                        'https://images.unsplash.com/photo-1589133036814-2ec514197c36?q=80&w=400',
                        'https://images.unsplash.com/photo-1562231758-d66bc2ed5499?q=80&w=400'
                    ].map((img, idx) => (
                        <TouchableOpacity key={idx} style={styles.gridImageWrap}>
                            <Image source={{ uri: img }} style={styles.gridImg} />
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>
        </View>
    </Modal>
);

const styles = StyleSheet.create({
    overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
    modalContent: { backgroundColor: colors.surface, borderTopLeftRadius: radius.xxl, borderTopRightRadius: radius.xxl, height: '75%', paddingBottom: spacing.xxl },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: spacing.xl, borderBottomWidth: 1, borderBottomColor: colors.border },
    headerTitle: { ...typography.presets.h2, color: colors.text.primary },
    headerSubtitle: { ...typography.presets.caption, color: colors.primary, marginTop: 2 },
    closeBtn: { padding: spacing.xs },
    scrollContent: { padding: spacing.xl, paddingBottom: 100 },
    sectionTitle: { fontSize: 16, fontWeight: 'bold', color: colors.text.primary, marginBottom: spacing.md, marginTop: spacing.lg },

    // Reg UI
    infoBox: { backgroundColor: colors.background, borderRadius: radius.lg, padding: spacing.lg, borderWidth: 1, borderColor: colors.border },
    infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm },
    infoText: { fontSize: 14, color: colors.text.secondary, marginLeft: spacing.sm, fontWeight: '500' },
    teamSelectCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: colors.background, padding: spacing.md, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border },
    selectedTeamItem: { flexDirection: 'row', alignItems: 'center' },
    teamAvatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.surfaceHighlight, alignItems: 'center', justifyContent: 'center', marginRight: spacing.md },
    teamAvatarText: { color: colors.text.secondary, fontWeight: 'bold', fontSize: 13 },
    teamNameText: { fontSize: 15, fontWeight: 'bold', color: colors.text.primary },
    teamRoleText: { fontSize: 12, color: colors.text.tertiary },
    inputField: { backgroundColor: colors.background, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, padding: spacing.md, color: colors.text.primary, fontSize: 15 },
    receiptBox: { backgroundColor: colors.background, borderRadius: radius.lg, padding: spacing.lg, borderWidth: 1, borderColor: colors.border },
    receiptRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.sm },
    receiptLabel: { fontSize: 13, color: colors.text.secondary },
    receiptVal: { fontSize: 13, color: colors.text.primary, fontWeight: '600' },
    receiptTotalRow: { borderTopWidth: 1, borderTopColor: colors.border, paddingTop: spacing.sm, marginTop: spacing.sm },
    receiptTotalLabel: { fontSize: 15, fontWeight: 'bold', color: colors.text.primary },
    receiptTotalVal: { fontSize: 16, fontWeight: 'bold', color: colors.primary },
    primaryActionBtn: { backgroundColor: colors.primary, flexDirection: 'row', padding: spacing.lg, borderRadius: radius.full, alignItems: 'center', justifyContent: 'center', marginTop: spacing.xxl },
    primaryActionText: { color: 'white', fontWeight: 'bold', fontSize: 16 },

    // Bracket UI
    bracketScroll: { padding: spacing.xl, paddingBottom: 100, flexDirection: 'row', alignItems: 'flex-start' },
    bracketColumn: { width: 140, marginRight: 20 },
    roundTitle: { fontSize: 13, fontWeight: 'bold', color: colors.text.tertiary, marginBottom: spacing.lg, textAlign: 'center' },
    matchupCard: { backgroundColor: colors.background, borderWidth: 1, borderColor: colors.border, borderRadius: radius.sm, overflow: 'hidden' },
    teamLabel: { paddingVertical: spacing.sm, paddingHorizontal: spacing.md, fontSize: 12, fontWeight: '600', color: colors.text.secondary },
    vsDivider: { height: 1, backgroundColor: colors.border },
    bracketConnector: { width: 30, borderTopWidth: 2, borderRightWidth: 2, borderBottomWidth: 2, borderColor: colors.border, height: 80, marginTop: 50, marginRight: 20 },

    // Info UI
    mapPlaceholder: { width: '100%', height: 180, borderRadius: radius.lg, marginBottom: spacing.lg },
    descText: { fontSize: 14, color: colors.text.secondary, lineHeight: 22 },
    bulletRow: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm },
    bulletText: { fontSize: 14, color: colors.text.secondary, marginLeft: spacing.sm },
    prizeBox: { flexDirection: 'row', backgroundColor: 'rgba(251, 191, 36, 0.1)', padding: spacing.lg, borderRadius: radius.lg, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(251, 191, 36, 0.3)' },
    prizeTitle: { fontSize: 16, fontWeight: 'bold', color: '#FBBF24' },
    prizeSub: { fontSize: 13, color: colors.text.secondary, marginTop: 4 },

    // Rule UI
    ruleCard: { flexDirection: 'row', backgroundColor: colors.background, padding: spacing.lg, borderRadius: radius.lg, marginBottom: spacing.md, borderWidth: 1, borderColor: colors.border },
    ruleNumBadge: { width: 28, height: 28, borderRadius: 14, backgroundColor: colors.surfaceHighlight, alignItems: 'center', justifyContent: 'center', marginRight: spacing.md },
    ruleNum: { color: colors.text.primary, fontWeight: 'bold', fontSize: 12 },
    ruleContent: { flex: 1 },
    ruleTitle: { fontSize: 15, fontWeight: 'bold', color: colors.text.primary, marginBottom: 4 },
    ruleDesc: { fontSize: 13, color: colors.text.secondary, lineHeight: 18 },

    // Gallery
    galleryContent: { padding: spacing.sm, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
    gridImageWrap: { width: '48%', aspectRatio: 1, marginBottom: spacing.md, borderRadius: radius.md, overflow: 'hidden' },
    gridImg: { width: '100%', height: '100%' }
});
