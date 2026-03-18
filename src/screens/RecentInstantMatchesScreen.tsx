import * as React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  FlatList,
  Dimensions,
  StatusBar,
  Alert,
  Share,
  Platform,
  Modal,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { 
  ArrowLeft, 
  Trash2, 
  Share2, 
  Trophy, 
  Calendar,
  ChevronRight,
  Info,
  X
} from 'lucide-react-native';
import { Colors } from '../constants/Colors';
import { useTeamStore, InstantMatch } from '../store/useTeamStore';
import InstantMatchSummary from '../components/InstantMatchSummary';

const { width } = Dimensions.get('window');

const RecentInstantMatchesScreen = ({ navigation }: any) => {
  const insets = useSafeAreaInsets();
  const { instantMatches, deleteInstantMatch } = useTeamStore() as any;
  const [selectedMatch, setSelectedMatch] = React.useState<InstantMatch | null>(null);

  const formatBattingStats = (batsmen: Record<string, any>) => {
    return Object.keys(batsmen).map(name => {
      const p = batsmen[name];
      const sr = p.balls > 0 ? ((p.runs / p.balls) * 100).toFixed(1) : '0.0';
      return {
        name,
        desc: p.isNotOut === false ? (p.desc || 'out') : 'not out',
        isNotOut: p.isNotOut !== false,
        r: p.runs,
        b: p.balls,
        fours: p.fours || 0,
        sixes: p.sixes || 0,
        sr: parseFloat(sr)
      };
    });
  };

  const formatBowlingStats = (bowlers: Record<string, any>) => {
    return Object.keys(bowlers).map(name => {
      const p = bowlers[name];
      const oversNum = Math.floor(p.balls / 6) + (p.balls % 6) / 10;
      const econ = p.balls > 0 ? (p.runs / (p.balls / 6)).toFixed(1) : '0.0';
      return {
        name,
        o: oversNum,
        m: p.maidens || 0,
        runs: p.runs,
        w: p.wickets,
        econ: parseFloat(econ)
      };
    });
  };

  const getBestBatter = (stats: any[]) => {
    if (!stats?.length) return { name: '-', score: '0', balls: '0' };
    const best = stats.reduce((p, c) => (p.r > c.r) ? p : c);
    return { name: best.name, score: String(best.r), balls: String(best.b) };
  };

  const getBestBowler = (stats: any[]) => {
    if (!stats?.length) return { name: '-', wickets: '0', runs: '0', overs: '0' };
    const best = stats.reduce((p, c) => {
      if (p.w > c.w) return p;
      if (p.w === c.w && p.runs < c.runs) return p;
      return c;
    });
    return { name: best.name, wickets: String(best.w), runs: String(best.runs), overs: String(best.o) };
  };

  const handleShare = async (match: InstantMatch) => {
    const message = `🏏 CricPro Instant Match Result!\n\n${match.teamA} vs ${match.teamB}\nWinner: ${match.winner}\nDate: ${match.date}\n\nScored on CricPro App.`;
    try {
      await Share.share({ message });
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = (id: string) => {
    Alert.alert('Delete Match', 'Are you sure you want to remove this match from history?', [
      { text: 'Cancel', style: 'cancel' },
      { 
        text: 'Delete', 
        style: 'destructive', 
        onPress: () => {
          if (deleteInstantMatch) {
            deleteInstantMatch(id);
          }
        } 
      }
    ]);
  };

  const renderMatchItem = ({ item }: { item: InstantMatch }) => (
    <Pressable style={styles.matchCard} onPress={() => setSelectedMatch(item)}>
      <View style={styles.cardHeader}>
        <View style={styles.dateBadge}>
          <Calendar size={12} color="#64748B" />
          <Text style={styles.dateText}>{item.date}</Text>
        </View>
        <Pressable onPress={() => handleDelete(item.id)} style={styles.deleteBtn}>
          <Trash2 size={18} color="#EF4444" />
        </Pressable>
      </View>

      <View style={styles.teamsRow}>
        <View style={styles.teamInfo}>
          <Text style={styles.teamNameText}>{item.teamA}</Text>
          <Text style={styles.scoreBrief}>
            {item.innings[0].score}/{item.innings[0].wickets}
          </Text>
        </View>
        <Text style={styles.vsText}>VS</Text>
        <View style={[styles.teamInfo, { alignItems: 'flex-end' }]}>
          <Text style={styles.teamNameText}>{item.teamB}</Text>
          <Text style={styles.scoreBrief}>
            {item.innings[1]?.score || 0}/{item.innings[1]?.wickets || 0}
          </Text>
        </View>
      </View>

      <View style={styles.cardFooter}>
        <View style={styles.winnerLabel}>
          <Trophy size={14} color="#EAB308" />
          <Text style={styles.winnerText}>{item.winner} Won</Text>
        </View>
        <View style={styles.viewMoreBtn}>
          <Text style={styles.viewMoreText}>View Scorecard</Text>
          <ChevronRight size={16} color={Colors.maroon} />
        </View>
      </View>
    </Pressable>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <StatusBar barStyle="dark-content" />
      
      {/* HEADER */}
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ArrowLeft color="#1E293B" size={24} />
        </Pressable>
        <Text style={styles.headerTitle}>Match History</Text>
        <View style={{ width: 40 }} />
      </View>

      {instantMatches.length > 0 ? (
        <FlatList
          data={instantMatches}
          keyExtractor={(item) => item.id}
          renderItem={renderMatchItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconCircle}>
            <Info size={40} color="#94A3B8" />
          </View>
          <Text style={styles.emptyTitle}>No History Found</Text>
          <Text style={styles.emptySubtitle}>Your completed instant matches will appear here.</Text>
          <Pressable 
            style={styles.startBtn}
            onPress={() => navigation.navigate('InstantMatchSetup')}
          >
            <Text style={styles.startBtnText}>Start New Match</Text>
          </Pressable>
        </View>
      )}

      {/* Full Scorecard Modal */}
      <Modal visible={!!selectedMatch} animationType="slide" transparent={false}>
        {selectedMatch && (
          <InstantMatchSummary
            title={`${selectedMatch.teamA} vs ${selectedMatch.teamB}`}
            onClose={() => setSelectedMatch(null)}
            onNext={() => setSelectedMatch(null)}
            buttonText="CLOSE VIEW"
            allInningsData={selectedMatch.innings.map((inn: any) => {
              const bStats = formatBattingStats(inn.scorecard.batsmen);
              const bwStats = formatBowlingStats(inn.scorecard.bowlers);
              return {
                teamName: inn.batting,
                score: inn.score,
                wickets: inn.wickets,
                overs: (inn.balls / 6).toFixed(1),
                battingStats: bStats,
                bowlingStats: bwStats,
                bestBatter: getBestBatter(bStats),
                bestBowler: getBestBowler(bwStats),
                extrasStr: "0" // Extras might need better storage, but defaulting for now
              };
            })}
          />
        )}
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  backBtn: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1E293B',
  },
  listContent: {
    padding: 20,
    gap: 16,
  },
  matchCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10 },
      android: { elevation: 3 },
    }),
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  dateBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 6,
  },
  dateText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
  },
  deleteBtn: {
    padding: 6,
  },
  teamsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingHorizontal: 8,
  },
  teamInfo: {
    flex: 1,
    gap: 4,
  },
  teamNameText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1E293B',
  },
  scoreBrief: {
    fontSize: 20,
    fontWeight: '900',
    color: Colors.maroon,
  },
  vsText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#CBD5E1',
    marginHorizontal: 16,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  winnerLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF9C3',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    gap: 6,
  },
  winnerText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#854D0E',
  },
  shareIconBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: '#FFF1F2',
  },
  shareBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: Colors.maroon,
  },
  viewMoreBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  viewMoreText: {
    fontSize: 12,
    fontWeight: '800',
    color: Colors.maroon,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1E293B',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 20,
  },
  startBtn: {
    backgroundColor: Colors.maroon,
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 16,
  },
  startBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
});

export default RecentInstantMatchesScreen;
