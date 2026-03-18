import * as React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Pressable,
  Image, 
  Dimensions, 
  StatusBar,
  FlatList,
  Platform,
  Alert,
  Modal
} from 'react-native';
import { useState, useRef, useEffect } from 'react';
import { Colors } from '../constants/Colors';
import { 
  Bell,
  Plus,
  Users,
  Trophy,
  UserPlus,
  Calendar,
  ThumbsUp,
  MessageCircle,
  ChevronRight,
  Zap,
  Newspaper,
  MapPin,
  Medal,
  BookOpen,
  BarChart3,
  Users2,
  PlayCircle
} from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useProStore } from '../store/useProStore';
import { useTeamStore, Match } from '../store/useTeamStore';
import { useAuthStore } from '../store/useAuthStore';

const { width } = Dimensions.get('window');

const liveMatches = [
  {
    id: '1',
    league: 'T20 LEAGUE',
    over: 'Over 15.2',
    team1: { name: 'IND', score: '142/3' },
    team2: { name: 'AUS', score: 'Yet to bat' },
    status: 'IND opt to bat first',
  },
  {
    id: '2',
    league: 'WORLD CUP',
    over: 'Over 44.5',
    team1: { name: 'ENG', score: '245/6' },
    team2: { name: 'NZ', score: 'Yet to bat' },
    status: 'NZ needs 246 to win',
  },
];

const quickActions = [
  { id: '1', label: 'Local Map', icon: MapPin, bgColor: Colors.maroon, iconColor: Colors.white },
  { id: '2', label: 'Ranking', icon: Trophy, bgColor: Colors.maroon, iconColor: Colors.white },
  { id: '3', label: 'Live', icon: Zap, bgColor: Colors.maroon, iconColor: Colors.white },
  { id: '4', label: 'News', icon: Newspaper, bgColor: Colors.maroon, iconColor: Colors.white },
  { id: '5', label: 'My Team', icon: Users, bgColor: Colors.maroon, iconColor: Colors.white },
  { id: '6', label: 'Recruit', icon: UserPlus, bgColor: Colors.maroon, iconColor: Colors.white },
  { id: '7', label: 'Community', icon: Users2, bgColor: Colors.maroon, iconColor: Colors.white },
  { id: '8', label: 'Instant Match', icon: PlayCircle, bgColor: Colors.maroon, iconColor: Colors.white },
];

// Static fallbacks removed - using store

const recentResults = [
  { id: '1', result: 'PAK def. RSA by 4 wickets', details: 'Babar Azam 78(52)', status: 'VICTORY' },
  { id: '2', result: 'WI def. SL by 12 runs', details: 'Pollard 40(18)', status: 'FINAL' },
  { id: '3', result: 'IND def. AUS by 6 wickets', details: 'Kohli 82*(53)', status: 'VICTORY' },
  { id: '4', result: 'NZ def. ENG by 5 runs', details: 'Mitchell 72(47)', status: 'FINAL' },
];

const HomeScreen = ({ navigation }: any) => {
  const insets = useSafeAreaInsets();
  const { matches, updateMatchStatus, globalLiveMatch } = useTeamStore();
  const { userProfile } = useAuthStore();
  const { isPro } = useProStore();

  const [showProModal, setShowProModal] = useState(false);
  const [selectedMatchAnalytics, setSelectedMatchAnalytics] = useState<any>(null);

  const handleProPress = (item: any) => {
    if (isPro) {
      setSelectedMatchAnalytics(item);
      setShowProModal(true);
    } else {
      navigation.navigate('Subscription');
    }
  };

  const storeLiveMatches = matches.filter(m => m.status === 'live');
  const storeUpcomingMatches = matches.filter(m => m.status === 'upcoming');

  // Convert globalLiveMatch to display format if it exists
  const activeGlobalMatch = globalLiveMatch ? {
    id: 'global-live',
    league: 'INSTANT MATCH',
    over: `Over ${(globalLiveMatch.balls/6).toFixed(1)}`,
    team1: { name: globalLiveMatch.battingTeam, score: `${globalLiveMatch.score}/${globalLiveMatch.wickets}` },
    team2: { name: globalLiveMatch.bowlingTeam, score: 'Yet to bat' }, // Simplified
    status: `${globalLiveMatch.strikerName} is batting`,
    isGlobalSync: true
  } : null;

  const displayLiveMatches = activeGlobalMatch 
    ? [activeGlobalMatch, ...storeLiveMatches] 
    : (storeLiveMatches.length > 0 ? storeLiveMatches : liveMatches);
  const displayUpcomingMatches = storeUpcomingMatches.length > 0 ? storeUpcomingMatches : [
    { id: 'u1', teams: 'Titans vs Warriors', time: 'Tomorrow, 02:30 PM', venue: 'MCC Ground' },
    { id: 'u2', teams: 'Strikers vs Kings', time: '22 Oct, 10:00 AM', venue: 'Starlight Complex' },
  ];

  const renderLiveMatch = ({ item }: { item: any }) => {
    // Check if it's a real store match or static mock
    const isRealMatch = 'teamAInfo' in item;
    const team1Name = isRealMatch ? item.teamAInfo.shortName : item.team1.name;
    const team2Name = isRealMatch ? item.teamBInfo.shortName : item.team2.name;
    
    // Detailed scoring logic for real matches
    const team1Score = isRealMatch ? (item.scoreA || '0/0') : item.team1.score;
    const team2Score = isRealMatch ? (item.scoreB || 'Yet to bat') : item.team2.score;
    
    const league = isRealMatch ? item.format : item.league;
    const status = isRealMatch ? (item.currentStatus || 'Match in progress') : item.status;
    const overDisplay = isRealMatch ? (item.oversPlayed ? `${item.oversPlayed} Ov` : `${item.overs} Ov`) : item.over;

    return (
      <Pressable 
        style={styles.matchCard}
        onPress={() => navigation.navigate('Live', { screen: 'LivePlayer', params: { matchId: item.id } })}
      >
        <View style={styles.matchCardHeader}>
          <View style={styles.leagueTag}>
            <Text style={styles.leagueText}>{league}</Text>
          </View>
          <TouchableOpacity 
            style={[styles.proAnalyticsBadge, !isPro && { backgroundColor: '#F8F9FA' }]} 
            onPress={() => handleProPress(item)}
          >
             <Zap color={isPro ? "#FFD700" : "#ADB5BD"} size={10} fill={isPro ? "#FFD700" : "none"} />
             <Text style={[styles.proAnalyticsText, !isPro && { color: '#6C757D' }]}>
               {isPro ? 'PRO ANALYTICS' : 'UNLOCK PRO'}
             </Text>
          </TouchableOpacity>
          <Text style={styles.overText}>{overDisplay}</Text>
        </View>
        <View style={styles.teamRow}>
          <View style={styles.teamInfo}>
            <View style={[styles.teamDot, { backgroundColor: isRealMatch ? item.teamAInfo.avatarColor : '#DEE2E6' }]} />
            <Text style={styles.teamName}>{team1Name}</Text>
          </View>
          <Text style={styles.teamScore}>{team1Score}</Text>
        </View>
        <View style={styles.teamRow}>
          <View style={styles.teamInfo}>
            <View style={[styles.teamDot, { backgroundColor: isRealMatch ? item.teamBInfo.avatarColor : '#E0E0E0' }]} />
            <Text style={styles.teamName}>{team2Name}</Text>
          </View>
          <Text style={[styles.teamScore, { color: Colors.textSecondary, fontWeight: '400' }]}>{team2Score}</Text>
        </View>
        <View style={styles.matchCardFooter}>
          <Text style={styles.matchStatus} numberOfLines={1}>{status}</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Live', { screen: 'LiveMain' })}>
            <Text style={styles.detailsBtn}>Details</Text>
          </TouchableOpacity>
        </View>
      </Pressable>
    );
  };

  const resultsRef = useRef<FlatList>(null);
  const [resultIndex, setResultIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      if (resultsRef.current) {
        const nextIndex = (resultIndex + 1) % recentResults.length;
        setResultIndex(nextIndex);
        resultsRef.current.scrollToIndex({ index: nextIndex, animated: true });
      }
    }, 5000); // 5 seconds interval
    return () => clearInterval(interval);
  }, [resultIndex]);

  return (
    <View style={[styles.container, { backgroundColor: Colors.white }]}>
      <StatusBar barStyle="light-content" translucent={true} />

      {/* Pro Analytics Modal */}
      <Modal
        visible={showProModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowProModal(false)}
      >
        <Pressable 
          style={styles.modalOverlay} 
          onPress={() => setShowProModal(false)}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <View style={styles.modalHeaderBar} />
              <View style={styles.modalTitleRow}>
                <Zap color="#FFD700" size={20} fill="#FFD700" />
                <Text style={styles.modalTitle}>ADVANCED INSIGHTS</Text>
              </View>
              <Text style={styles.modalSubtitle}>
                {selectedMatchAnalytics?.teams || 'Real-time Match Analysis'}
              </Text>
            </View>

            <View style={styles.analyticsGrid}>
              <View style={styles.analyticCard}>
                <Text style={styles.analyticLabel}>Projected Score</Text>
                <Text style={styles.analyticValue}>184</Text>
                <Text style={styles.analyticSub}>Based on RR 9.2</Text>
              </View>
              <View style={styles.analyticCard}>
                <Text style={styles.analyticLabel}>Win Probability</Text>
                <Text style={styles.analyticValue}>68%</Text>
                <Text style={styles.analyticSub}>Mumbai Mavericks</Text>
              </View>
              <View style={styles.analyticCard}>
                <Text style={styles.analyticLabel}>Required RR</Text>
                <Text style={styles.analyticValue}>N/A</Text>
                <Text style={styles.analyticSub}>1st Innings</Text>
              </View>
              <View style={styles.analyticCard}>
                <Text style={styles.analyticLabel}>Pitch Type</Text>
                <Text style={styles.analyticValue}>Batting+</Text>
                <Text style={styles.analyticSub}>Hard & Dry</Text>
              </View>
            </View>

            <View style={[styles.premiumAd, { marginTop: 20 }]}>
              <Text style={styles.premiumText}>Want more deep-dive heatmaps?</Text>
              <TouchableOpacity style={styles.premiumBtn} onPress={() => {
                setShowProModal(false);
                navigation.navigate('Subscription');
              }}>
                <Text style={styles.premiumBtnText}>VIEW FULL ANALYTICS</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Pressable>
      </Modal>
      
      {/* Fixed Header */}
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <View style={styles.headerRow}>
          <View style={styles.userInfo}>
            <Image 
              source={require('../../assets/main_logo.png')} 
              style={styles.headerLogo} 
              resizeMode="contain"
            />
            <View style={styles.greetingContainer}>
              <Text style={styles.greetingText}>Welcome back,</Text>
              <Text style={styles.userNameText}>{userProfile?.fullName || 'Alex'}</Text>
            </View>
          </View>
          <View style={styles.headerActions}>
            {/* UPGRADE / PRO badge */}
            {isPro ? (
              <View style={styles.proBadge}>
                <Zap color="#FFD700" size={13} fill="#FFD700" />
                <Text style={styles.proBadgeText}>PRO</Text>
              </View>
            ) : (
              <Pressable
                style={({ pressed }) => [styles.upgradeBtn, pressed ? { opacity: 0.85 } : null]}
                onPress={() => navigation.navigate('Subscription')}
                accessibilityRole="button"
                accessibilityLabel="Upgrade to Pro"
              >
                <Zap color={Colors.maroon} size={13} />
                <Text style={styles.upgradeBtnText}>UPGRADE</Text>
              </Pressable>
            )}
            <TouchableOpacity 
              style={styles.notificationBtn}
              onPress={() => navigation.navigate('Messages')}
            >
              <MessageCircle color={Colors.white} size={20} fill={Colors.white} />
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.notificationBtn, { marginLeft: 8 }]}
              onPress={() => navigation.navigate('Notifications')}
            >
              <Bell color={Colors.white} size={20} fill={Colors.white} />
              <View style={styles.notificationDot} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Live Matches Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Live Matches</Text>
          <View style={styles.liveBadge}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>Live</Text>
          </View>
        </View>
        <FlatList
          data={displayLiveMatches}
          renderItem={renderLiveMatch}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.horizontalList}
        />

        {/* Quick Actions */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            {quickActions.map(action => (
              <View key={action.id} style={styles.actionItem}>
                <Pressable
                  style={({ pressed }) => [
                    styles.actionIconCell,
                    { backgroundColor: action.bgColor },
                    pressed ? { opacity: 0.75, transform: [{ scale: 0.95 }] } : null,
                  ]}
                  onPress={() => {
                    if (action.label === 'Recruit') {
                      navigation.navigate('Community', { screen: 'Explore' });
                    } else if (action.label === 'Ranking') {
                      navigation.navigate('Rankings');
                    } else if (action.label === 'New Match') {
                      navigation.navigate('Matches');
                    } else if (action.label === 'My Team') {
                      navigation.navigate('MyTeams');
                    } else if (action.label === 'Local Map') {
                      navigation.navigate('LocalCricketMap');
                    } else if (action.label === 'Live') {
                      if (!isPro) {
                        navigation.navigate('Subscription');
                      } else {
                        navigation.navigate('Live', { screen: 'LiveMain' });
                      }
                    } else if (action.label === 'News') {
                      navigation.navigate('CricketNews');
                    } else if (action.label === 'Community') {
                      navigation.navigate('Community');
                    } else if (action.label === 'Instant Match') {
                      navigation.navigate('InstantMatchSetup');
                    } else {
                      Alert.alert(action.label, `The ${action.label} feature is coming soon to CricPro!`);
                    }
                  }}
                  accessibilityRole="button"
                  accessibilityLabel={action.label}
                >
                  <action.icon color={action.iconColor} size={24} />
                </Pressable>
                <Text style={styles.actionLabel}>{action.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Recent Results Carousel */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Recent Results</Text>
          <FlatList
            ref={resultsRef}
            data={recentResults}
            renderItem={({ item }) => (
              <Pressable 
                style={styles.resultCard}
                onPress={() => Alert.alert('Match Result', `${item.result}\n\nKey Performance: ${item.details}`)}
              >
                <View style={styles.resultCardIndicator} />
                <View style={styles.resultCardContent}>
                  <View style={styles.resultHeader}>
                    <Text style={styles.resultText}>{item.result}</Text>
                    <View style={[styles.statusBadge, { backgroundColor: item.status === 'VICTORY' ? '#E8F5E9' : '#F8FAFC' }]}>
                      <Text style={[styles.statusBadgeText, { color: item.status === 'VICTORY' ? '#2E7D32' : '#64748B' }]}>
                        {item.status}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.resultSubtext}>{item.details}</Text>
                </View>
                <ChevronRight size={16} color={Colors.maroon} />
              </Pressable>
            )}
            horizontal
            showsHorizontalScrollIndicator={false}
            pagingEnabled
            snapToAlignment="center"
            decelerationRate="fast"
            keyExtractor={item => item.id}
            contentContainerStyle={styles.resultsHorizontalList}
          />
        </View>

        {/* Upcoming Matches */}
        <View style={styles.sectionContainer}>
          <View style={styles.spaceBetweenHeader}>
            <Text style={styles.sectionTitle}>Upcoming Matches</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Matches')}>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          {displayUpcomingMatches.map(match => (
            <Pressable 
              key={match.id} 
              style={styles.matchListCard}
              onPress={() => {
                if ('playersA' in match) {
                  // Real match from store
                  Alert.alert(
                    match.teams,
                    `Venue: ${match.venue}\nTime: ${match.time}\n\nWhat would you like to do?`,
                    [
                      { 
                        text: 'Start Scoring Now', 
                        onPress: () => {
                          updateMatchStatus(match.id, 'live');
                          navigation.navigate('BattingOrder', { 
                            playersA: match.playersA, 
                            playersB: match.playersB, 
                            teamAName: match.teamAInfo?.name, 
                            teamBName: match.teamBInfo?.name, 
                            cvcMap: match.cvcMap 
                          });
                        } 
                      },
                      { text: 'View Details', onPress: () => {} },
                      { text: 'Cancel', style: 'cancel' }
                    ]
                  );
                } else {
                  // Fallback static match
                  navigation.navigate('Matches', { screen: 'MatchSetup' });
                }
              }}
            >
               <View style={styles.teamAvatars}>
                 <View style={[styles.avatarSmall, { backgroundColor: Colors.maroon }]} />
                 <View style={[styles.avatarSmall, { marginLeft: -15, zIndex: -1, backgroundColor: Colors.peach }]} />
               </View>
               <View style={styles.matchListInfo}>
                  <Text style={styles.matchListTeams}>{match.teams}</Text>
                  <Text style={styles.matchListTime}>{match.time}</Text>
               </View>
               <TouchableOpacity style={styles.calendarBtn} onPress={() => Alert.alert('Reminder Set', `You will be notified before ${match.teams} starts.`)}>
                 <Calendar color={Colors.maroon} size={18} />
               </TouchableOpacity>
            </Pressable>
          ))}
        </View>

        {/* Community Buzz */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Community Buzz</Text>
          <Pressable 
            style={styles.buzzCard}
            onPress={() => navigation.navigate('Community', { screen: 'Home' })}
          >
             <View style={styles.buzzHeader}>
                <View style={[styles.avatarSmall, { backgroundColor: '#78909C' }]} />
                <View style={styles.buzzUserInfo}>
                   <Text style={styles.buzzUserName}>Rahul K. <Text style={styles.buzzTimeText}>2h ago</Text></Text>
                   <Text style={styles.buzzContent}>"Incredible performance by the Strikers today! That last over was pur..."</Text>
                </View>
             </View>
             <View style={styles.buzzFooter}>
                <View style={styles.buzzActions}>
                   <TouchableOpacity style={styles.buzzAction}>
                     <ThumbsUp color={Colors.textSecondary} size={16} />
                     <Text style={styles.buzzActionText}>42</Text>
                   </TouchableOpacity>
                   <TouchableOpacity style={styles.buzzAction}>
                     <MessageCircle color={Colors.textSecondary} size={16} />
                     <Text style={styles.buzzActionText}>12</Text>
                   </TouchableOpacity>
                </View>
             </View>
          </Pressable>
        </View>
      </ScrollView>

      {/* ── Floating Coin Toss button ── */}
      <Pressable
        style={({ pressed }) => [styles.tossFab, pressed ? { opacity: 0.82, transform: [{ scale: 0.95 }] } : null]}
        onPress={() => navigation.navigate('CoinToss')}
        accessibilityRole="button"
        accessibilityLabel="Coin Toss"
      >
        <Text style={styles.tossFabEmoji}>🪙</Text>
        <Text style={styles.tossFabLabel}>TOSS</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  header: {
    backgroundColor: Colors.maroon,
    paddingHorizontal: 12,
    paddingBottom: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.peach,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerLogo: {
    width: 54,
    height: 54,
    marginLeft: -4, // Pushed left for perfect edge alignment
  },
  greetingContainer: {
    marginLeft: 10, 
    justifyContent: 'center',
    height: 54, // Match logo height
  },
  greetingText: {
    fontSize: 11,
    color: Colors.white,
    opacity: 0.8,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  userNameText: {
    fontSize: 16,
    color: Colors.white,
    fontWeight: '900',
    marginTop: -2,
  },
  notificationBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationDot: {
    position: 'absolute',
    top: 10,
    right: 12,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FF3B30',
    borderWidth: 1,
    borderColor: Colors.maroon,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 25,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1A237E', // Deep Navy
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF3B30',
  },
  liveText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FF3B30',
  },
  horizontalList: {
    paddingHorizontal: 15,
  },
  matchCard: {
    width: width * 0.72,
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    ...Platform.select({
      ios: { 
        shadowColor: '#000', 
        shadowOffset: { width: 0, height: 4 }, 
        shadowOpacity: 0.05, 
        shadowRadius: 10 
      },
      android: { elevation: 3 },
    }),
  },
  matchCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  leagueTag: {
    backgroundColor: Colors.peach,
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  leagueText: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.maroon,
  },
  overText: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  teamRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  teamInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  teamDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#DEE2E6',
  },
  teamName: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.text,
  },
  teamScore: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.text,
  },
  matchCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F8F9FA',
  },
  matchStatus: {
    fontSize: 11,
    fontStyle: 'italic',
    color: Colors.textSecondary,
  },
  detailsBtn: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.maroon,
  },
  sectionContainer: {
    paddingHorizontal: 20,
    marginTop: 30,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    marginTop: 15,
    gap: 16,
  },
  actionItem: {
    alignItems: 'center',
    width: (width - 40 - 48) / 4,
    marginBottom: 16,
  },
  actionIconCell: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.text,
    textAlign: 'center',
  },
  resultsHorizontalList: {
    paddingHorizontal: 20,
    marginTop: 15,
  },
  resultCard: {
    backgroundColor: Colors.white,
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 16,
    marginRight: 12,
    width: width - 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#F1F5F9',
    ...Platform.select({
      ios: { 
        shadowColor: '#000', 
        shadowOffset: { width: 0, height: 4 }, 
        shadowOpacity: 0.05, 
        shadowRadius: 10 
      },
      android: { elevation: 3 },
    }),
  },
  resultCardContent: {
    flex: 1,
    paddingLeft: 12,
  },
  resultCardIndicator: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 6,
    backgroundColor: '#2E7D32', // Deeper Professional Green
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
    paddingRight: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  statusBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  resultText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A', // Navy/Slate
    letterSpacing: -0.2,
  },
  resultSubtext: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 4,
    fontWeight: '600',
  },
  spaceBetweenHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.maroon,
  },
  matchListCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    padding: 16,
    borderRadius: 16,
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    ...Platform.select({
      ios: { 
        shadowColor: '#000', 
        shadowOffset: { width: 0, height: 2 }, 
        shadowOpacity: 0.05, 
        shadowRadius: 8 
      },
      android: { elevation: 2 },
    }),
  },
  teamAvatars: {
    flexDirection: 'row',
    width: 60,
  },
  avatarSmall: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E6F4FE',
    borderWidth: 2,
    borderColor: Colors.white,
  },
  matchListInfo: {
    flex: 1,
    marginLeft: 10,
  },
  matchListTeams: {
    fontSize: 15,
    fontWeight: 'bold',
    color: Colors.text,
  },
  matchListTime: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  calendarBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.peach,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buzzCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    marginTop: 15,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    ...Platform.select({
      ios: { 
        shadowColor: '#000', 
        shadowOffset: { width: 0, height: 2 }, 
        shadowOpacity: 0.05, 
        shadowRadius: 8 
      },
      android: { elevation: 2 },
    }),
  },
  buzzHeader: {
    flexDirection: 'row',
    gap: 12,
  },
  buzzUserInfo: {
    flex: 1,
  },
  buzzUserName: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.text,
  },
  buzzTimeText: {
    fontSize: 11,
    fontWeight: '400',
    color: Colors.textSecondary,
  },
  buzzContent: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 4,
    lineHeight: 18,
  },
  buzzFooter: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(128, 0, 0, 0.05)',
  },
  buzzActions: {
    flexDirection: 'row',
    gap: 20,
  },
  buzzAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  buzzActionText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  upgradeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.white,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    minHeight: 32,
    borderWidth: 1.5,
    borderColor: Colors.maroon,
  },
  upgradeBtnText: {
    fontSize: 11,
    fontWeight: '900',
    color: Colors.maroon,
    letterSpacing: 0.5,
  },
  proBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#1A1A1A',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    minHeight: 32,
    borderWidth: 1.5,
    borderColor: '#FFD700',
  },
  proBadgeText: {
    fontSize: 11,
    fontWeight: '900',
    color: '#FFD700',
    letterSpacing: 0.5,
  },
  proAnalyticsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFF8E1',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: '#FFD700',
  },
  proAnalyticsText: {
    fontSize: 8,
    fontWeight: '900',
    color: '#D84315',
  },
  avatarInner: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.peach,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  avatarProBadge: {
    position: 'absolute',
    bottom: -4,
    backgroundColor: '#FFD700',
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: Colors.maroon,
  },
  avatarProText: {
    fontSize: 7,
    fontWeight: '900',
    color: Colors.maroon,
  },
  tossFab: {
    position: 'absolute',
    bottom: 76,
    right: 20,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#0D1B3E',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 0,
    borderWidth: 2,
    borderColor: Colors.maroon,
    ...Platform.select({
      ios: { shadowColor: '#0D1B3E', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.5, shadowRadius: 10 },
      android: { elevation: 8 },
    }),
  },
  tossFabEmoji: {
    fontSize: 24,
    lineHeight: 28,
  },
  tossFabLabel: {
    fontSize: 8,
    fontWeight: '900',
    color: Colors.white,
    letterSpacing: 1,
    marginTop: -2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
  },
  modalHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  modalHeaderBar: {
    width: 40,
    height: 4,
    backgroundColor: '#E0E0E0',
    borderRadius: 2,
    marginBottom: 16,
  },
  modalTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#1A1A1A',
    letterSpacing: 1,
  },
  modalSubtitle: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  analyticsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  analyticCard: {
    width: (width - 60) / 2,
    backgroundColor: '#F8F9FA',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  analyticLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  analyticValue: {
    fontSize: 24,
    fontWeight: '900',
    color: Colors.maroon,
    marginBottom: 2,
  },
  analyticSub: {
    fontSize: 10,
    color: 'rgba(0,0,0,0.4)',
    fontWeight: '600',
  },
  premiumAd: {
    backgroundColor: '#FFF8E1',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FFD700',
  },
  premiumText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#795548',
    marginBottom: 12,
  },
  premiumBtn: {
    backgroundColor: '#FFD700',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  premiumBtnText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#5D4037',
  },
});


export default HomeScreen;
