import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView, Image, Dimensions, Platform, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography, radius } from '../theme';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

const { width } = Dimensions.get('window');

interface ModalProps {
    visible: boolean;
    onClose: () => void;
    title?: string;
    data?: any;
}

// 1. Detailed Analytics / Full Report Modal
export const ReportModal: React.FC<ModalProps> = ({ visible, onClose, title, data }) => (
    <Modal animationType="slide" transparent visible={visible} onRequestClose={onClose}>
        <View style={styles.overlay}>
            <View style={styles.modalContent}>
                <View style={styles.header}>
                    <View>
                        <Text style={styles.headerTitle}>{title || 'Analytics Breakdown'}</Text>
                        <Text style={styles.headerSubtitle}>{data?.tournamentName || 'Performance Report'}</Text>
                    </View>
                    <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                        <Ionicons name="close" size={24} color={colors.text.primary} />
                    </TouchableOpacity>
                </View>
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <View style={styles.chartPlaceholder}>
                        <Ionicons name="bar-chart-outline" size={48} color={colors.primary} />
                        <Text style={styles.chartText}>Advanced Metrics Visualized</Text>
                    </View>
                    <View style={styles.statsGrid}>
                        {[
                            { label: 'Consistency', value: '88%' },
                            { label: 'Impact Score', value: '9.2' },
                            { label: 'Form Guide', value: 'W-W-L-W-W' },
                            { label: 'Weakness', value: 'Off-spin' }
                        ].map((s, i) => (
                            <View key={i} style={styles.statBox}>
                                <Text style={styles.statValue}>{s.value}</Text>
                                <Text style={styles.statLabel}>{s.label}</Text>
                            </View>
                        ))}
                    </View>
                </ScrollView>
            </View>
        </View>
    </Modal>
);

// 2. Certificate Modal
export const CertificateModal: React.FC<ModalProps> = ({ visible, onClose, data }) => {
    const handleDownload = async () => {
        try {
            const html = `
            <html>
                <head>
                    <style>
                        body { font-family: 'Helvetica', sans-serif; text-align: center; padding: 40px; background-color: #f8fafc; }
                        .border { border: 8px solid #FBBF24; padding: 40px; background-color: white; border-radius: 12px; }
                        h1 { color: #1e293b; font-size: 36px; margin-bottom: 20px; letter-spacing: 2px; }
                        h2 { color: #64748b; font-size: 18px; font-style: italic; margin-bottom: 30px; }
                        h3 { color: #F97316; font-size: 48px; margin: 20px 0; }
                        p { color: #475569; font-size: 16px; line-height: 1.6; margin: 30px 40px; }
                        .signatures { display: flex; justify-content: space-around; margin-top: 60px; }
                        .sign-block { width: 200px; text-align: center; }
                        .line { border-bottom: 2px solid #1e293b; margin-bottom: 10px; }
                        .sign-text { font-size: 14px; color: #64748b; font-weight: bold; }
                    </style>
                </head>
                <body>
                    <div class="border">
                        <h1>CERTIFICATE OF ACHIEVEMENT</h1>
                        <h2>This is proudly presented to</h2>
                        <h3>Aryan Sharma</h3>
                        <p>For outstanding performance and reaching ${data?.scheduledText || 'a massive milestone'} in ${data?.tournamentName || 'the league'}.</p>
                        <div class="signatures">
                            <div class="sign-block">
                                <div class="line"></div>
                                <div class="sign-text">League Director</div>
                            </div>
                            <div class="sign-block">
                                <div class="line"></div>
                                <div class="sign-text">Head Coach</div>
                            </div>
                        </div>
                    </div>
                </body>
            </html>
            `;

            const { uri } = await Print.printToFileAsync({ html, width: 842, height: 595 }); // A4 Landscape
            await Sharing.shareAsync(uri, { UTI: '.pdf', mimeType: 'application/pdf' });
        } catch (error) {
            console.error('Error generating PDF', error);
            Alert.alert('Error', 'Failed to generate or share the certificate PDF.');
        }
    };

    return (
        <Modal animationType="fade" transparent visible={visible} onRequestClose={onClose}>
            <View style={styles.overlay}>
                <View style={[styles.modalContent, { paddingBottom: spacing.lg }]}>
                    <TouchableOpacity onPress={onClose} style={[styles.closeBtn, { position: 'absolute', top: 10, right: 10, zIndex: 10 }]}>
                        <Ionicons name="close-circle" size={32} color={colors.text.secondary} />
                    </TouchableOpacity>
                    <View style={styles.certificateCard}>
                        <Ionicons name="ribbon" size={64} color="#FBBF24" style={styles.certIcon} />
                        <Text style={styles.certHeader}>CERTIFICATE OF ACHIEVEMENT</Text>
                        <Text style={styles.certSub}>This is proudly presented to</Text>
                        <Text style={styles.certName}>Aryan Sharma</Text>
                        <Text style={styles.certDesc}>For outstanding performance and reaching {data?.scheduledText || 'a massive milestone'} in {data?.tournamentName || 'the league'}.</Text>
                        <View style={styles.certSignatures}>
                            <View style={styles.signBlock}>
                                <View style={styles.signLine} />
                                <Text style={styles.signText}>League Director</Text>
                            </View>
                            <View style={styles.signBlock}>
                                <View style={styles.signLine} />
                                <Text style={styles.signText}>Head Coach</Text>
                            </View>
                        </View>

                        <TouchableOpacity style={[styles.actionBtn, { marginTop: spacing.xxl, paddingHorizontal: spacing.xxl }]} onPress={handleDownload}>
                            <Ionicons name="download-outline" size={20} color="white" style={{ marginRight: 8 }} />
                            <Text style={styles.actionBtnText}>Download PDF</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

// 3. Fitness/Training Plan Modal
export const PlanModal: React.FC<ModalProps> = ({ visible, onClose }) => (
    <Modal animationType="slide" transparent visible={visible} onRequestClose={onClose}>
        <View style={styles.overlay}>
            <View style={styles.modalContent}>
                <View style={styles.header}>
                    <View>
                        <Text style={styles.headerTitle}>Training Plan</Text>
                        <Text style={styles.headerSubtitle}>Personalized Fitness Routine</Text>
                    </View>
                    <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                        <Ionicons name="close" size={24} color={colors.text.primary} />
                    </TouchableOpacity>
                </View>
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    {[
                        { time: '06:00 AM', title: 'Cardio & Agility', desc: '5km run, ladder drills (30 mins)' },
                        { time: '08:30 AM', title: 'Net Session (Batting)', desc: 'Focus on spin bowling, throwdowns' },
                        { time: '04:00 PM', title: 'Strength Training', desc: 'Core & Lower body focus' },
                        { time: '07:00 PM', title: 'Recovery', desc: 'Stretching, Ice bath, Protein intake' }
                    ].map((step, i) => (
                        <View key={i} style={styles.timelineItem}>
                            <View style={styles.timeTracker}>
                                <Text style={styles.timeText}>{step.time}</Text>
                                <View style={styles.timeDot} />
                            </View>
                            <View style={styles.planCard}>
                                <Text style={styles.planTitle}>{step.title}</Text>
                                <Text style={styles.planDesc}>{step.desc}</Text>
                            </View>
                        </View>
                    ))}
                </ScrollView>
            </View>
        </View>
    </Modal>
);

// 4. Connect Network Modal
export const ConnectModal: React.FC<ModalProps> = ({ visible, onClose, data }) => (
    <Modal animationType="slide" transparent visible={visible} onRequestClose={onClose}>
        <View style={styles.overlay}>
            <View style={[styles.modalContent, { height: 'auto', paddingBottom: spacing.xl }]}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Network Match</Text>
                    <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                        <Ionicons name="close" size={24} color={colors.text.primary} />
                    </TouchableOpacity>
                </View>
                <View style={styles.profileBox}>
                    <Image source={{ uri: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200' }} style={styles.profileImg} />
                    <Text style={styles.profileName}>Rahul Verma</Text>
                    <Text style={styles.profileRole}>Top Order Batsman | Right Arm Off Spin</Text>
                    <Text style={styles.profileBio}>Looking for corporate matches on weekends in HSR Layout.</Text>

                    <View style={styles.statsGrid}>
                        <View style={styles.statBox}>
                            <Text style={styles.statValue}>142</Text>
                            <Text style={styles.statLabel}>Matches</Text>
                        </View>
                        <View style={styles.statBox}>
                            <Text style={styles.statValue}>38.5</Text>
                            <Text style={styles.statLabel}>Avg</Text>
                        </View>
                    </View>

                    <TouchableOpacity style={styles.actionBtn} onPress={onClose}>
                        <Ionicons name="person-add" size={20} color="white" style={{ marginRight: 8 }} />
                        <Text style={styles.actionBtnText}>Send Connection Request</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    </Modal>
);

// 5. Professional Resume Modal
export const ResumeModal: React.FC<ModalProps> = ({ visible, onClose, data }) => (
    <Modal animationType="slide" transparent visible={visible} onRequestClose={onClose}>
        <View style={styles.overlay}>
            <View style={styles.modalContent}>
                <View style={styles.header}>
                    <View>
                        <Text style={styles.headerTitle}>Player CV</Text>
                        <Text style={styles.headerSubtitle}>Verified Professional Record</Text>
                    </View>
                    <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                        <Ionicons name="close" size={24} color={colors.text.primary} />
                    </TouchableOpacity>
                </View>
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <View style={styles.resumeHeader}>
                        <View style={styles.resumeInitials}>
                            <Text style={styles.resumeInitialsText}>AS</Text>
                        </View>
                        <View style={styles.resumeBio}>
                            <Text style={styles.resumeName}>Aryan Sharma</Text>
                            <Text style={styles.resumeTitle}>Wicketkeeper-Batsman</Text>
                            <Text style={styles.resumeContact}>aryan.s@email.com • +91 98765 43210</Text>
                        </View>
                    </View>

                    <Text style={styles.sectionTitle}>Key Skills</Text>
                    <View style={styles.skillsRow}>
                        {['Aggressive Open', 'Pace Bowling Play', 'Stumpings', 'Leadership'].map((skill, i) => (
                            <View key={i} style={styles.skillBadge}>
                                <Text style={styles.skillText}>{skill}</Text>
                            </View>
                        ))}
                    </View>

                    <Text style={styles.sectionTitle}>Recent Experience</Text>
                    <View style={styles.expCard}>
                        <Text style={styles.expTitle}>Captain, Gladiators CC</Text>
                        <Text style={styles.expDate}>2024 - Present</Text>
                        <Text style={styles.expDesc}>• Led team to 3 consecutive league finals.{'\n'}• Highest run scorer in IT Cup 2025.</Text>
                    </View>
                    <View style={styles.expCard}>
                        <Text style={styles.expTitle}>State U19 Standby</Text>
                        <Text style={styles.expDate}>2022 - 2023</Text>
                        <Text style={styles.expDesc}>• Played 15 zonal matches with avg of 42.5.{'\n'}• 20+ dismissals in single season.</Text>
                    </View>

                    <TouchableOpacity style={styles.actionBtn} onPress={onClose}>
                        <Ionicons name="download-outline" size={20} color="white" style={{ marginRight: 8 }} />
                        <Text style={styles.actionBtnText}>Download PDF</Text>
                    </TouchableOpacity>
                </ScrollView>
            </View>
        </View>
    </Modal>
);

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: colors.background,
        borderTopLeftRadius: radius.xxl,
        borderTopRightRadius: radius.xxl,
        height: '85%',
        paddingTop: spacing.sm,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: spacing.xl,
        paddingVertical: spacing.lg,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
        backgroundColor: colors.surface,
        borderTopLeftRadius: radius.xxl,
        borderTopRightRadius: radius.xxl,
    },
    headerTitle: {
        ...typography.presets.h2,
        color: colors.text.primary,
    },
    headerSubtitle: {
        ...typography.presets.caption,
        color: colors.text.secondary,
        marginTop: 2,
    },
    closeBtn: {
        padding: spacing.xs,
    },
    scrollContent: {
        padding: spacing.xl,
    },
    actionBtn: {
        flexDirection: 'row',
        backgroundColor: colors.primary,
        padding: spacing.md,
        borderRadius: radius.md,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: spacing.xl,
    },
    actionBtnText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
    // Chart
    chartPlaceholder: {
        height: 150,
        backgroundColor: colors.surface,
        borderRadius: radius.lg,
        borderWidth: 1,
        borderColor: colors.border,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: spacing.xl,
    },
    chartText: {
        color: colors.text.tertiary,
        marginTop: spacing.sm,
        fontSize: 12,
        fontWeight: '500',
    },
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        gap: spacing.md,
    },
    statBox: {
        width: '48%',
        backgroundColor: colors.surface,
        padding: spacing.lg,
        borderRadius: radius.md,
        borderWidth: 1,
        borderColor: colors.border,
        alignItems: 'center',
    },
    statValue: {
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.primary,
    },
    statLabel: {
        fontSize: 11,
        color: colors.text.secondary,
        marginTop: 4,
    },
    // Certificate
    certificateCard: {
        backgroundColor: colors.surface,
        margin: spacing.xl,
        borderRadius: radius.lg,
        padding: spacing.xxl,
        alignItems: 'center',
        borderWidth: 8,
        borderColor: colors.surfaceHighlight,
    },
    certIcon: {
        marginBottom: spacing.sm,
    },
    certHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.text.primary,
        fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
        textAlign: 'center',
        marginBottom: spacing.md,
    },
    certSub: {
        fontSize: 12,
        color: colors.text.secondary,
        fontStyle: 'italic',
        marginBottom: spacing.sm,
    },
    certName: {
        fontSize: 28,
        fontWeight: 'bold',
        color: colors.primary,
        fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
        marginBottom: spacing.md,
    },
    certDesc: {
        fontSize: 12,
        color: colors.text.tertiary,
        textAlign: 'center',
        lineHeight: 18,
        marginBottom: spacing.xxl,
        paddingHorizontal: spacing.md,
    },
    certSignatures: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginTop: spacing.xl,
    },
    signBlock: {
        alignItems: 'center',
        width: '40%',
    },
    signLine: {
        width: '100%',
        height: 1,
        backgroundColor: colors.text.primary,
        marginBottom: 8,
    },
    signText: {
        fontSize: 10,
        color: colors.text.secondary,
    },
    // Plan Timeline
    timelineItem: {
        flexDirection: 'row',
        marginBottom: spacing.lg,
    },
    timeTracker: {
        width: 60,
        alignItems: 'flex-end',
        paddingRight: 16,
        borderRightWidth: 2,
        borderRightColor: colors.primary,
        position: 'relative',
    },
    timeText: {
        fontSize: 10,
        fontWeight: 'bold',
        color: colors.text.secondary,
        marginTop: 4,
    },
    timeDot: {
        position: 'absolute',
        right: -6,
        top: 6,
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: colors.primary,
        borderWidth: 2,
        borderColor: colors.background,
    },
    planCard: {
        flex: 1,
        paddingLeft: spacing.lg,
        paddingBottom: spacing.sm,
    },
    planTitle: {
        fontSize: 15,
        fontWeight: 'bold',
        color: colors.text.primary,
        marginBottom: 4,
    },
    planDesc: {
        fontSize: 13,
        color: colors.text.secondary,
        lineHeight: 18,
    },
    // Profile Box
    profileBox: {
        alignItems: 'center',
        padding: spacing.xl,
    },
    profileImg: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: spacing.md,
    },
    profileName: {
        fontSize: 22,
        fontWeight: 'bold',
        color: colors.text.primary,
    },
    profileRole: {
        fontSize: 13,
        color: colors.primary,
        fontWeight: '500',
        marginTop: 4,
    },
    profileBio: {
        fontSize: 14,
        color: colors.text.secondary,
        textAlign: 'center',
        marginVertical: spacing.md,
        lineHeight: 20,
        paddingHorizontal: spacing.lg,
    },
    // Resume
    resumeHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacing.xl,
    },
    resumeInitials: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: spacing.lg,
    },
    resumeInitialsText: {
        color: 'white',
        fontSize: 24,
        fontWeight: 'bold',
    },
    resumeBio: {
        flex: 1,
    },
    resumeName: {
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.text.primary,
    },
    resumeTitle: {
        fontSize: 14,
        color: colors.primary,
        fontWeight: '500',
        marginTop: 2,
    },
    resumeContact: {
        fontSize: 12,
        color: colors.text.tertiary,
        marginTop: 4,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.text.primary,
        marginBottom: spacing.md,
        marginTop: spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
        paddingBottom: 4,
    },
    skillsRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginBottom: spacing.lg,
    },
    skillBadge: {
        backgroundColor: colors.surface,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: colors.border,
    },
    skillText: {
        fontSize: 12,
        color: colors.text.secondary,
        fontWeight: '500',
    },
    expCard: {
        marginBottom: spacing.md,
    },
    expTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: colors.text.primary,
    },
    expDate: {
        fontSize: 11,
        color: colors.text.tertiary,
        marginTop: 2,
        marginBottom: 4,
    },
    expDesc: {
        fontSize: 13,
        color: colors.text.secondary,
        lineHeight: 18,
    },
});
