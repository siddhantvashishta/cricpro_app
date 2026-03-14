import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, FlatList, SafeAreaView, Image, TouchableOpacity, Alert, ImageBackground } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { useAppStore } from '../../store/useAppStore';
import {
    AppHeader,
    TabSwitch,
    PromoBanner,
    PlayerCard,
    ProClubContent,
    FloatingCoinToss,
    CreationFab,
    AdCarousel,
    FantasyTipCard,
    PollCard,
    LookingCard
} from '../../components';
import { Ionicons } from '@expo/vector-icons';
import { colors as staticColors, spacing, typography, radius } from '../../theme';
import { useTheme } from '../../hooks/useTheme';
import { MOCK_PLAYERS } from '../../data/mockPlayers';
import { SCHEDULES_MOCK, RESULTS_MOCK, MatchDetails } from '../../data/mockMatches';

// --- Dummy Data mimicking the screenshot design ---
const TOP_PLAYERS = MOCK_PLAYERS;

const LOOKING_PREVIEW = [
    { id: 'lp1', type: 'Opponent' as any, teamName: "Mcca Warriors", description: 'Looking for T20 match.', date: 'Today, 4 PM', ground: 'HSR Ground', rightIconType: 'VS' as any },
    { id: 'lp2', type: 'Recruitment' as any, teamName: "Super Giants", description: 'Need an All-rounder.', date: 'Tomorrow', ground: 'Central Park', rightIconType: 'Person' as any },
    { id: 'lp3', type: 'Player' as any, teamName: "Aryan V.", description: 'Available to Join Team.', date: 'Flexible', ground: 'Anywhere', rightIconType: 'Person' as any },
    { id: 'lp4', type: 'Opponent' as any, teamName: "Blue Tigers", description: 'Open Challenge!', date: 'Sun, Mar 08', ground: 'Diamond Grove', rightIconType: 'VS' as any },
    { id: 'lp5', type: 'Recruitment' as any, teamName: "Apex Predators", description: 'Need a Spinner.', date: 'Sat, Mar 07', ground: 'Apex Arena', rightIconType: 'Person' as any },
    { id: 'lp6', type: 'Player' as any, teamName: "Sameer K.", description: 'Wicketkeeper for hire.', date: 'Weekends', ground: 'South BLR', rightIconType: 'Person' as any },
    { id: 'lp7', type: 'Opponent' as any, teamName: "Strikers XI", description: '15 Overs match.', date: 'Wed, Mar 11', ground: 'Youth Academy', rightIconType: 'VS' as any },
    { id: 'lp8', type: 'Recruitment' as any, teamName: "Titans", description: 'Need a Power hitter.', date: 'Mon, Mar 09', ground: 'HSR Layout', rightIconType: 'Person' as any },
    { id: 'lp9', type: 'Player' as any, teamName: "Karan B.", description: '130+ Fast Bowler.', date: 'Weekdays', ground: 'Anywhere', rightIconType: 'Person' as any },
    { id: 'lp10', type: 'Opponent' as any, teamName: "Kings XI", description: 'Floodlit challenge.', date: 'Fri, Mar 13', ground: 'Moonlight', rightIconType: 'VS' as any },
];

const MY_CRICKET_PREVIEW = [
    { id: 'mc1', title: 'Royal Challengers', subtitle: 'My Team', icon: 'people' },
    { id: 'mc2', title: 'Weekend T20 Cup', subtitle: 'Ongoing Tournament', icon: 'trophy' },
    { id: 'mc3', title: 'Match vs Titans', subtitle: 'Upcoming Match', icon: 'calendar' },
    { id: 'mc4', title: 'HSR Gladiators', subtitle: 'My Team', icon: 'people' },
    { id: 'mc5', title: 'Corporate League', subtitle: 'Registered', icon: 'medal' },
    { id: 'mc6', title: 'Practice Session', subtitle: 'Tomorrow, 7 AM', icon: 'sunny' },
    { id: 'mc7', title: 'Player Stats', subtitle: '1240 Runs, 45 Wkts', icon: 'analytics' },
    { id: 'mc8', title: 'Team Jersey', subtitle: 'Approved', icon: 'shirt' },
    { id: 'mc9', title: 'Sponsorship', subtitle: 'Active', icon: 'briefcase' },
    { id: 'mc10', title: 'Ground Booking', subtitle: 'Confirmed', icon: 'location' },
];

const STORE_PREVIEW = [
    { id: 'st1', name: 'SS Gladiator Bat', price: '₹12,499', image: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?q=80&w=200&h=200&fit=crop' },
    { id: 'st2', name: 'DSC Condor', price: '₹8,999', image: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=200&h=200&fit=crop' },
    { id: 'st3', name: 'Adidas Spike', price: '₹5,490', image: 'https://images.unsplash.com/photo-1512719994953-eabf50895df7?q=80&w=200&h=200&fit=crop' },
    { id: 'st4', name: 'Pro Helmet', price: '₹2,350', image: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=200&h=200&fit=crop' },
    { id: 'st5', name: 'Leather Ball', price: '₹450', image: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?q=80&w=200&h=200&fit=crop' },
    { id: 'st6', name: 'Kashmir Willow', price: '₹3,200', image: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=200&h=200&fit=crop' },
    { id: 'st7', name: 'Batting Pads', price: '₹1,850', image: 'https://images.unsplash.com/photo-1512719994953-eabf50895df7?q=80&w=200&h=200&fit=crop' },
    { id: 'st8', name: 'Cricket Kitbag', price: '₹2,999', image: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=200&h=200&fit=crop' },
    { id: 'st9', name: 'White Jersey', price: '₹799', image: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?q=80&w=200&h=200&fit=crop' },
    { id: 'st10', name: 'Grip & Tape', price: '₹150', image: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=200&h=200&fit=crop' },
];

const SOCIAL_POSTS = [
    { id: 'p1', author: 'CricPro Official', time: '2h ago', content: 'What a devastating spell of fast bowling today! 🌪️🔥', likes: 1240, comments: 85, image: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60' },
    { id: 'p2', author: 'Roman Saini', time: '5h ago', content: 'Great practice session with the boys. Ready for the finals! 🏏💪', likes: 3500, comments: 210, image: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60' },
    { id: 'p3', author: 'Virat K', time: '10h ago', content: 'Nothing beats the feeling of a match-winning century! 💯🙏', likes: 8500, comments: 420, image: 'https://images.unsplash.com/photo-1512719994953-eabf50895df7?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60' },
    { id: 'p4', author: 'Cricket Daily', time: '1d ago', content: 'Who do you think will win the championship this year? Vote now! 🗳️🏏', likes: 2100, comments: 560, image: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60' },
    { id: 'p5', author: 'Hardik P', time: '1d ago', content: 'Training hard for the big match tomorrow! 🏋️‍♂️🏏', likes: 4500, comments: 120, image: 'https://images.unsplash.com/photo-1512719994953-eabf50895df7?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60' },
    { id: 'p6', author: 'KL Rahul', time: '1d ago', content: 'Love the new gear from CricPro Store! 🧤✨', likes: 3200, comments: 95, image: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60' },
    { id: 'p7', author: 'Jasprit B', time: '2d ago', content: ' Yorkers all day! 🎯🎳', likes: 7800, comments: 156, image: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60' },
    { id: 'p8', author: 'Rishabh P', time: '2d ago', content: 'Keep moving, keep growing. 🌱🏏', likes: 5600, comments: 88, image: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60' },
    { id: 'p9', author: 'Shikhar D', time: '2d ago', content: 'Gabbar is back! 🦁🔥', likes: 4200, comments: 230, image: 'https://images.unsplash.com/photo-1512719994953-eabf50895df7?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60' },
    { id: 'p10', author: 'Yuzi Chahal', time: '3d ago', content: 'Spinning the web everywhere! 🕸️🌀', likes: 3100, comments: 45, image: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60' },
];

import { FANTASY_TIPS_MOCK } from '../../data/mockTips';

const MOCK_POLLS = [
    {
        id: 'poll_1',
        question: 'Who will win the toss today?',
        options: [
            { id: '1a', label: 'Team India', percentage: 65 },
            { id: '1b', label: 'Australia', percentage: 35 },
        ],
        totalVotes: 12450
    },
    {
        id: 'poll_2',
        question: 'Who will be the top run-getter in T20 series?',
        options: [
            { id: '2a', label: 'Virat K', percentage: 45 },
            { id: '2b', label: 'Roman Saini', percentage: 35 },
            { id: '2c', label: 'Others', percentage: 20 },
        ],
        totalVotes: 8900
    },
    {
        id: 'poll_3',
        question: 'Pitch Prediction: Spin or Pace?',
        options: [
            { id: '3a', label: 'Spin Mastery', percentage: 30 },
            { id: '3b', label: 'Pace Attack', percentage: 50 },
            { id: '3c', label: 'Flat Track', percentage: 20 },
        ],
        totalVotes: 15600
    }
];


import { MyCricketFilterModal } from '../../components/MyCricketFilterModal';

const NEWS_DATA = [
    { id: 'n1', title: 'World Cup 2026: The Race for Glory Begins!', summary: '16 teams, one dream. The ultimate battle for cricketing supremacy kicks off this weekend.', image: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?q=80&w=600', time: '1h ago', category: 'International' },
    { id: 'n2', title: 'IPL Draft: Stunning Moves & Record Bids', summary: 'Franchises break the bank for upcoming talent. Here are the top 5 surprises of the draft.', image: 'https://images.unsplash.com/photo-1540747913346-19e3adca174f?q=80&w=600', time: '3h ago', category: 'League' },
    { id: 'n3', title: 'Local Hero Strikes Gold in State Finals', summary: 'A record-breaking 150* secures the title for Bengaluru Eagles in a thriller.', image: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?q=80&w=600', time: '5h ago', category: 'Local' },
    { id: 'n4', title: 'Fitness First: New Training Regimen for Pros', summary: 'CricPro exclusive: How top cricketers are maintaining peak physical condition.', image: 'https://images.unsplash.com/photo-1624526267942-ab0ff8a3e972?q=80&w=600', time: '8h ago', category: 'Training' },
    { id: 'n5', title: 'Technology in Cricket: The AI Revolution', summary: 'From ball-tracking to performance analysis, see how data is changing the game.', image: 'https://images.unsplash.com/photo-1589133036814-2ec514197c36?q=80&w=600', time: '12h ago', category: 'Tech' },
    { id: 'n6', title: 'Women’s Premier League: Season Preview', summary: 'Everything you need to know about the upcoming WPL season starts here.', image: 'https://images.unsplash.com/photo-1562231758-d66bc2ed5499?q=80&w=600', time: '1d ago', category: 'League' },
    { id: 'n7', title: 'Pitch Report: Decoding the Spin Trap', summary: 'Experts weigh in on how to tackle the turning tracks this season.', image: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?q=80&w=600', time: '1d ago', category: 'Analysis' },
    { id: 'n8', title: 'Grassroots Growth: Building the Next Generation', summary: 'How local academies are scouting talent in rural corridors.', image: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=600', time: '2d ago', category: 'Community' },
    { id: 'n9', title: 'Gear Guide: Choosing the Perfect Bat', summary: 'Kashmir vs English Willow? Our experts help you pick the right timber.', image: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?q=80&w=600', time: '2d ago', category: 'Store' },
    { id: 'n10', title: 'Legends Return: The Reunion Match', summary: 'Relive the magic as the 2011 champions take the field once more.', image: 'https://images.unsplash.com/photo-1624526267942-ab0ff8a3e972?q=80&w=600', time: '3d ago', category: 'Legends' },
];

export const HomeScreen: React.FC = () => {
    const navigation = useNavigation<NavigationProp<any>>();
    const [isFilterVisible, setIsFilterVisible] = useState(false);
    const { activeHomeTab, setActiveHomeTab, pollVotes, setPollVote, matches, setHeaderConfig } = useAppStore();
    const [isNotificationVisible, setIsNotificationVisible] = useState(false);

    const { colors, isDark } = useTheme();

    const upcomingMatches = matches.filter(m => m.status === 'upcoming');
    const finishedMatches = matches.filter(m => m.status === 'finished');

    const renderPlayer = ({ item }: { item: typeof TOP_PLAYERS[0] }) => (
        <View style={styles.playerCardWrapper}>
            <PlayerCard
                name={item.name}
                isPro={item.isPro}
                runs={item.runs}
                wickets={item.wickets}
                imageUrl={item.imageUrl}
                onPress={() => navigation.navigate('PlayerProfile', { playerId: item.id })}
            />
        </View>
    );

    const renderSchedule = ({ item }: { item: MatchDetails }) => (
        <View style={styles.scheduleCard}>
            <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => navigation.navigate('MatchDetails', { matchId: item.id })}
                style={{ flex: 1 }}
            >
                <View style={styles.scheduleHeader}>
                    <View style={styles.matchTypeBadge}>
                        <Text style={styles.matchTypeText}>T20</Text>
                    </View>
                    <Text style={styles.scheduleDate}>{item.time.split(',')[0]}</Text>
                    <Text style={styles.scheduleTime}>{item.time.includes(',') ? item.time.split(',')[1].trim() : item.time}</Text>
                </View>

                <View style={styles.scheduleTeams}>
                    <View style={styles.teamContainer}>
                        <View style={[styles.teamBadge, { backgroundColor: '#1E40AF' }]}>
                            <Text style={styles.teamBadgeText}>{item.team_a.name.substring(0, 2).toUpperCase()}</Text>
                        </View>
                        <Text style={styles.teamNameText} numberOfLines={1}>{item.team_a.name}</Text>
                    </View>

                    <View style={styles.vsContainer}>
                        <Text style={styles.vsLabel}>VS</Text>
                    </View>

                    <View style={styles.teamContainer}>
                        <View style={[styles.teamBadge, { backgroundColor: '#B91C1C' }]}>
                            <Text style={styles.teamBadgeText}>{item.team_b.name.substring(0, 2).toUpperCase()}</Text>
                        </View>
                        <Text style={styles.teamNameText} numberOfLines={1}>{item.team_b.name}</Text>
                    </View>
                </View>

                <View style={styles.scheduleFooter}>
                    <View style={styles.locationContainer}>
                        <Ionicons name="location-outline" size={14} color={staticColors.text.tertiary} />
                        <Text style={styles.scheduleLocation} numberOfLines={1}>{item.location}</Text>
                    </View>
                    <View style={styles.detailsBtn}>
                        <Text style={styles.detailsBtnText}>Details</Text>
                        <Ionicons name="chevron-forward" size={12} color={colors.primary} />
                    </View>
                </View>
            </TouchableOpacity>
        </View>
    );

    const renderResult = ({ item }: { item: MatchDetails }) => {
        // Robust winner detection handling partial matches
        const resultString = item.result?.toLowerCase() || '';
        const teamAName = item.team_a.name.toLowerCase();
        const teamBName = item.team_b.name.toLowerCase();
        
        const teamAWins = resultString.includes(teamAName) || 
                         (teamAName.split(' ').some(word => word.length > 3 && resultString.includes(word)));
        const teamBWins = resultString.includes(teamBName) || 
                         (teamBName.split(' ').some(word => word.length > 3 && resultString.includes(word)));

        return (
            <View style={styles.resultCard}>
                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => navigation.navigate('MatchDetails', { matchId: item.id })}
                    style={{ flex: 1 }}
                >
                    <View style={styles.resultHeader}>
                        <Text style={styles.resultMatchInfo}>{item.series || 'Tournament Final'} • {item.time}</Text>
                        {item.highlight && (
                            <View style={styles.liveBadge}>
                                <View style={styles.liveDot} />
                                <Text style={styles.liveText}>HIGHLIGHT</Text>
                            </View>
                        )}
                    </View>

                    <View style={styles.resultMain}>
                        <View style={styles.resultTeamRow}>
                            <View style={styles.resultTeamInfo}>
                                <View style={[styles.teamBadgeSmall, { backgroundColor: '#1E40AF' }]}>
                                    <Text style={styles.teamBadgeSmallText}>{item.team_a.name.substring(0, 1)}</Text>
                                </View>
                                <Text style={[styles.resultTeamName, teamAWins && styles.winningTeamName]}>{item.team_a.name}</Text>
                            </View>
                            <Text style={[styles.resultScore, teamAWins && styles.winningScore]}>{item.team_a.score}</Text>
                        </View>

                        <View style={styles.resultTeamRow}>
                            <View style={styles.resultTeamInfo}>
                                <View style={[styles.teamBadgeSmall, { backgroundColor: '#B91C1C' }]}>
                                    <Text style={styles.teamBadgeSmallText}>{item.team_b.name.substring(0, 1)}</Text>
                                </View>
                                <Text style={[styles.resultTeamName, teamBWins && styles.winningTeamName]}>{item.team_b.name}</Text>
                            </View>
                            <Text style={[styles.resultScore, teamBWins && styles.winningScore]}>{item.team_b.score}</Text>
                        </View>
                    </View>

                    <View style={styles.resultFooter}>
                        <Text style={styles.resultOutcomeText} numberOfLines={1}>{item.result}</Text>
                        <TouchableOpacity style={styles.scorecardActionBtn}>
                            <Text style={styles.scorecardActionText}>Scorecard</Text>
                            <Ionicons name="stats-chart" size={10} color={staticColors.primary} style={{marginLeft: 2}} />
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </View>
        );
    };

    const renderFantasyTip = ({ item }: { item: typeof FANTASY_TIPS_MOCK[0] }) => (
        <FantasyTipCard
            title={item.title}
            expert={item.expert}
            imageUrl={item.imageUrl}
            onPress={() => navigation.navigate('FantasyTipDetails', { tipId: item.id })}
        />
    );

    const renderPost = ({ item }: { item: typeof SOCIAL_POSTS[0] }) => (
        <View style={styles.postCard}>
            <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => navigation.navigate('MainTabs', { screen: 'Community' })}
                style={{ flex: 1 }}
            >
                <View style={styles.postHeader}>
                    <View style={styles.postAuthorAvatar} />
                    <View>
                        <Text style={styles.postAuthorName}>{item.author}</Text>
                        <Text style={styles.postTime}>{item.time}</Text>
                    </View>
                </View>
                <Text style={styles.postContent}>{item.content}</Text>
                <Image source={{ uri: item.image }} style={styles.postImage} />
                <View style={styles.postFooter}>
                    <Text style={styles.postFooterText}>👍 {item.likes} Likes</Text>
                    <Text style={styles.postFooterText}>💬 {item.comments} Comments</Text>
                </View>
            </TouchableOpacity>
        </View>
    );

    const renderNewsItem = ({ item }: { item: typeof NEWS_DATA[0] }) => (
        <TouchableOpacity
            style={styles.newsCard}
            activeOpacity={0.9}
            onPress={() => navigation.navigate('NewsDetail', { item })}
        >
            <Image source={{ uri: item.image }} style={styles.newsImage} />
            <View style={styles.newsOverlay}>
                <View style={styles.newsBadge}>
                    <Text style={styles.newsBadgeText}>{item.category}</Text>
                </View>
                <Text style={styles.newsTitle} numberOfLines={2}>{item.title}</Text>
                <View style={styles.newsFooter}>
                    <Text style={styles.newsTime}>{item.time}</Text>
                    <Ionicons name="arrow-forward-circle" size={24} color="#FFF" />
                </View>
            </View>
        </TouchableOpacity>
    );

    React.useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            setHeaderConfig({
                title: undefined,
                rightIcons: [
                    { name: 'search', onPress: () => navigation.navigate('Search') },
                    { name: 'chatbox-ellipses-outline', onPress: () => navigation.navigate('DirectMessages') },
                    { name: 'funnel-outline', onPress: () => setIsFilterVisible(true) }
                ],
                showBack: false
            });
        });
        return unsubscribe;
    }, [navigation]);

    return (
        <View style={styles.container}>
                {/* Modal for global filtering on Home */}
                <MyCricketFilterModal
                    visible={isFilterVisible}
                    onClose={() => setIsFilterVisible(false)}
                    onApply={(filters) => {
                        Alert.alert('Home Filters', `Applying global filters for ${filters.type}...`);
                    }}
                />
                {/* Exact Tab Replication */}
                <TabSwitch activeTab={activeHomeTab} onTabChange={setActiveHomeTab} />

                {/* Main Content Area */}
                {activeHomeTab === 'For you' ? (
                    <ScrollView
                        style={styles.scrollView}
                        contentContainerStyle={styles.scrollContent}
                        showsVerticalScrollIndicator={false}
                    >
                        {/* Schedules Section (Moved Up) */}
                        <View style={styles.sectionContainer}>
                            <View style={styles.sectionHeader}>
                                <Text style={styles.sectionTitle}>Schedules</Text>
                                <TouchableOpacity onPress={() => navigation.navigate('Schedules')}>
                                    <Text style={styles.seeAllText}>View All</Text>
                                </TouchableOpacity>
                            </View>
                            <FlatList
                                data={upcomingMatches}
                                keyExtractor={(item) => item.id}
                                renderItem={renderSchedule}
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={styles.horizontalListContent}
                                snapToInterval={280 + spacing.md}
                                decelerationRate="fast"
                            />
                        </View>

                        {/* Ad Carousel Inserted Here */}
                        <AdCarousel />

                        {/* Results Section (Moved Up) */}
                        <View style={styles.sectionContainer}>
                            <View style={styles.sectionHeader}>
                                <Text style={styles.sectionTitle}>Recent Results</Text>
                                <TouchableOpacity onPress={() => navigation.navigate('Results')}>
                                    <Text style={styles.seeAllText}>View All</Text>
                                </TouchableOpacity>
                            </View>
                            <FlatList
                                data={finishedMatches}
                                keyExtractor={(item) => item.id}
                                renderItem={renderResult}
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={styles.horizontalListContent}
                                snapToInterval={280 + spacing.md}
                                decelerationRate="fast"
                            />
                        </View>

                        {/* Popular Cricketers Section */}
                        <View style={styles.sectionContainer}>
                            <View style={styles.sectionHeader}>
                                <Text style={styles.sectionTitle}>Popular cricketers</Text>
                                <TouchableOpacity onPress={() => navigation.navigate('MainTabs', { screen: 'Looking' })}>
                                    <Text style={styles.seeAllText}>Find Cricketers</Text>
                                </TouchableOpacity>
                            </View>

                            <FlatList
                                data={TOP_PLAYERS}
                                keyExtractor={(item) => item.id}
                                renderItem={renderPlayer}
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={styles.horizontalListContent}
                                snapToInterval={160 + spacing.md}
                                decelerationRate="fast"
                            />
                        </View>

                        {/* NEW: News Section (Instagram Style) */}
                        <View style={styles.sectionContainer}>
                            <View style={styles.sectionHeader}>
                                <Text style={styles.sectionTitle}>Latest News</Text>
                                <TouchableOpacity onPress={() => Alert.alert('News', 'Full news feed coming soon!')}>
                                    <Text style={styles.seeAllText}>View All</Text>
                                </TouchableOpacity>
                            </View>
                            <FlatList
                                data={NEWS_DATA}
                                keyExtractor={(item) => item.id}
                                renderItem={renderNewsItem}
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={styles.horizontalListContent}
                                snapToInterval={220 + spacing.md}
                                decelerationRate="fast"
                            />
                        </View>

                        {/* NEW: Looking Section Preview */}
                        <View style={styles.sectionContainer}>
                            <View style={styles.sectionHeader}>
                                <Text style={styles.sectionTitle}>Looking</Text>
                                <TouchableOpacity onPress={() => navigation.navigate('MainTabs', { screen: 'Looking' })}>
                                    <Text style={styles.seeAllText}>View All</Text>
                                </TouchableOpacity>
                            </View>
                            <FlatList
                                data={LOOKING_PREVIEW}
                                keyExtractor={(item) => item.id}
                                renderItem={({ item }) => (
                                    <View style={{ width: 280, marginRight: spacing.md }}>
                                        <LookingCard
                                            type={item.type}
                                            teamName={item.teamName}
                                            description={item.description}
                                            date={item.date}
                                            ground={item.ground}
                                            timeAgo="Just now"
                                            distance="-- KM"
                                            rightIconType={item.rightIconType}
                                            onActionPress={() => navigation.navigate('MainTabs', { screen: 'Looking' })}
                                            onProfilePress={() => navigation.navigate('PlayerProfile', { playerId: item.id })}
                                        />
                                    </View>
                                )}
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={styles.horizontalListContent}
                                snapToInterval={280 + spacing.md}
                                decelerationRate="fast"
                            />
                        </View>

                        {/* NEW: My Cricket Section Preview */}
                        <View style={styles.sectionContainer}>
                            <View style={styles.sectionHeader}>
                                <Text style={styles.sectionTitle}>My Cricket</Text>
                                <TouchableOpacity onPress={() => navigation.navigate('MainTabs', { screen: 'My Cricket' })}>
                                    <Text style={styles.seeAllText}>Manage</Text>
                                </TouchableOpacity>
                            </View>
                            <FlatList
                                data={MY_CRICKET_PREVIEW}
                                keyExtractor={(item) => item.id}
                                renderItem={({ item }) => (
                                    <TouchableOpacity
                                        style={styles.myCricketCard}
                                        onPress={() => navigation.navigate('MainTabs', { screen: 'My Cricket' })}
                                    >
                                        <View style={styles.myCricketIconBg}>
                                            <Ionicons name={item.icon as any} size={24} color={colors.primary} />
                                        </View>
                                        <Text style={styles.myCricketTitle} numberOfLines={1}>{item.title}</Text>
                                        <Text style={styles.myCricketSubtitle}>{item.subtitle}</Text>
                                    </TouchableOpacity>
                                )}
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={styles.horizontalListContent}
                            />
                        </View>

                        {/* Community Section (Expanded Preview) */}
                        <View style={styles.sectionContainer}>
                            <View style={styles.sectionHeader}>
                                <Text style={styles.sectionTitle}>Community Posts</Text>
                                <TouchableOpacity onPress={() => navigation.navigate('MainTabs', { screen: 'Community' })}>
                                    <Text style={styles.seeAllText}>View All</Text>
                                </TouchableOpacity>
                            </View>
                            <FlatList
                                data={SOCIAL_POSTS}
                                keyExtractor={(item) => item.id}
                                renderItem={renderPost}
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={styles.horizontalListContent}
                                snapToInterval={300 + spacing.md}
                                decelerationRate="fast"
                            />
                        </View>

                        {/* NEW: Store Section Preview */}
                        <View style={styles.sectionContainer}>
                            <View style={styles.sectionHeader}>
                                <Text style={styles.sectionTitle}>CricPro Store</Text>
                                <TouchableOpacity onPress={() => navigation.navigate('MainTabs', { screen: 'Store' })}>
                                    <Text style={styles.seeAllText}>Shop Now</Text>
                                </TouchableOpacity>
                            </View>
                            <FlatList
                                data={STORE_PREVIEW}
                                keyExtractor={(item) => item.id}
                                renderItem={({ item }) => (
                                    <View style={styles.storeCard}>
                                        <TouchableOpacity
                                            activeOpacity={0.9}
                                            onPress={() => navigation.navigate('MainTabs', { screen: 'Store' })}
                                            style={{ flex: 1 }}
                                        >
                                            <Image source={{ uri: item.image }} style={styles.storeImage} />
                                            <Text style={styles.storeName} numberOfLines={1}>{item.name}</Text>
                                            <Text style={styles.storePrice}>{item.price}</Text>
                                        </TouchableOpacity>
                                    </View>
                                )}
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={styles.horizontalListContent}
                            />
                        </View>

                        {/* Fantasy Tips Section */}
                        <View style={styles.sectionContainer}>
                            <View style={styles.sectionHeader}>
                                <Text style={styles.sectionTitle}>Fantasy Expert Tips</Text>
                                <TouchableOpacity onPress={() => navigation.navigate('FantasyTips')}>
                                    <Text style={styles.seeAllText}>View All</Text>
                                </TouchableOpacity>
                            </View>
                            <FlatList
                                data={FANTASY_TIPS_MOCK}
                                keyExtractor={(item) => item.id}
                                renderItem={renderFantasyTip}
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={styles.horizontalListContent}
                                snapToInterval={200 + spacing.md}
                                decelerationRate="fast"
                            />
                        </View>

                        {/* Interactive Poll Section */}
                        <View style={styles.sectionContainer}>
                            <View style={styles.sectionHeader}>
                                <Text style={styles.sectionTitle}>Daily Cricket Poll</Text>
                            </View>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalListContent}>
                                {MOCK_POLLS.map((poll) => (
                                    <PollCard
                                        key={poll.id}
                                        id={poll.id}
                                        question={poll.question}
                                        options={poll.options}
                                        totalVotes={poll.totalVotes}
                                        votedOptionId={pollVotes[poll.id]}
                                        onVote={setPollVote}
                                    />
                                ))}
                                {/* Invitation for more content */}
                                <View style={[styles.pollPlaceholder, { marginLeft: -spacing.sm }]}>
                                    <View style={styles.placeholderIcon}>
                                        <Ionicons name="add-circle" size={32} color={colors.primary} />
                                    </View>
                                    <Text style={styles.placeholderText}>New polls daily!</Text>
                                </View>
                            </ScrollView>
                        </View>

                        {/* App Version Footer */}
                        <View style={styles.footer}>
                            <Image
                                source={require('../../../assets/footerlogo.png')}
                                style={[styles.footerLogo, { tintColor: isDark ? '#475569' : '#CBD5E1' }]}
                                resizeMode="contain"
                            />
                            <Text style={styles.madeWithText}>Made with ♥ for Cricket</Text>
                        </View>

                    </ScrollView>
                ) : (
                    <ProClubContent />
                )}

                {/* Functional Floating Coin Toss */}
                <FloatingCoinToss />

                {/* Universal Creation FAB */}
                <CreationFab />
            </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: spacing.xl,
    },
    sectionContainer: {
        paddingTop: spacing.lg,
        marginTop: spacing.md,
        paddingBottom: spacing.lg,
        marginHorizontal: spacing.sm,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingLeft: spacing.screenPadding,
        marginBottom: spacing.md,
    },
    sectionTitle: {
        ...typography.presets.bodyLarge,
        fontWeight: typography.weights.medium,
        color: staticColors.text.primary,
    },
    seeAllText: {
        ...typography.presets.bodySmall,
        color: '#F97316', // orange
        backgroundColor: '#FFF0E6', // light orange bg
        paddingHorizontal: spacing.sm,
        paddingVertical: spacing.xs,
        marginRight: spacing.screenPadding,
    },
    horizontalListContent: {
        paddingHorizontal: spacing.screenPadding,
        paddingVertical: spacing.md, // Add vertical padding to prevent shadow clipping
    },
    playerCardWrapper: {
        marginRight: spacing.sm,
    },
    pollPlaceholder: {
        width: 150,
        height: 180,
        borderRadius: radius.lg,
        backgroundColor: staticColors.surfaceHighlight,
        borderStyle: 'dashed',
        borderWidth: 1,
        borderColor: staticColors.border,
        justifyContent: 'center',
        alignItems: 'center',
    },
    placeholderText: {
        ...typography.presets.caption,
        color: staticColors.text.tertiary,
        textAlign: 'center',
    },
    placeholderIcon: {
        marginBottom: spacing.sm,
    },
    // New Styles for Schedules, Results, Posts
    scheduleCard: {
        width: 300,
        backgroundColor: staticColors.surface,
        borderRadius: radius.xl,
        padding: spacing.md,
        marginRight: spacing.md,
        marginBottom: 8, // Add margin to prevent clipping
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
        borderWidth: 1,
        borderColor: staticColors.border,
    },
    scheduleHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: spacing.md,
        paddingBottom: spacing.sm,
        borderBottomWidth: 1,
        borderBottomColor: staticColors.surfaceHighlight,
    },
    matchTypeBadge: {
        backgroundColor: staticColors.surfaceHighlight,
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
    },
    matchTypeText: {
        ...typography.presets.caption,
        fontWeight: typography.weights.bold,
        color: staticColors.text.secondary,
    },
    scheduleDate: {
        ...typography.presets.caption,
        color: staticColors.text.secondary,
        fontWeight: typography.weights.medium,
    },
    scheduleTime: {
        ...typography.presets.caption,
        color: '#D97706', // Gold/Dark Yellow
        fontWeight: typography.weights.bold,
    },
    scheduleTeams: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: spacing.lg,
        paddingHorizontal: spacing.xs,
    },
    teamContainer: {
        alignItems: 'center',
        flex: 1,
    },
    teamBadge: {
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    teamBadgeText: {
        color: 'white',
        fontWeight: typography.weights.bold,
        fontSize: 14,
    },
    teamNameText: {
        ...typography.presets.bodySmall,
        fontWeight: typography.weights.semibold,
        color: staticColors.text.primary,
        textAlign: 'center',
    },
    vsContainer: {
        width: 30,
        alignItems: 'center',
    },
    vsLabel: {
        ...typography.presets.caption,
        fontWeight: typography.weights.heavy,
        color: staticColors.text.tertiary,
    },
    scheduleFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: spacing.xs,
    },
    locationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    scheduleLocation: {
        ...typography.presets.caption,
        color: staticColors.text.tertiary,
        marginLeft: 4,
    },
    detailsBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: staticColors.surfaceHighlight,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    detailsBtnText: {
        ...typography.presets.caption,
        fontWeight: typography.weights.bold,
        color: staticColors.primary,
        marginRight: 2,
    },
    resultCard: {
        width: 300,
        backgroundColor: staticColors.surface,
        borderRadius: radius.xl,
        padding: spacing.md,
        marginRight: spacing.md,
        marginBottom: 8, // Add margin to prevent clipping
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 4,
        borderWidth: 1,
        borderColor: staticColors.border,
    },

    resultHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.md,
    },
    resultMatchInfo: {
        ...typography.presets.caption,
        color: staticColors.text.tertiary,
        fontWeight: typography.weights.medium,
    },
    liveBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
    liveDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#10B981',
        marginRight: 4,
    },
    liveText: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#10B981',
    },
    resultMain: {
        marginBottom: spacing.md,
    },
    resultTeamRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    resultTeamInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    teamBadgeSmall: {
        width: 24,
        height: 24,
        borderRadius: 12,
        marginRight: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    teamBadgeSmallText: {
        color: 'white',
        fontSize: 10,
        fontWeight: typography.weights.bold,
    },
    resultTeamName: {
        ...typography.presets.body,
        color: staticColors.text.primary,
        fontWeight: typography.weights.medium,
        opacity: 0.7,
    },
    winningTeamName: {
        color: staticColors.text.primary,
        fontWeight: typography.weights.heavy,
        opacity: 1,
    },
    resultScore: {
        ...typography.presets.body,
        color: staticColors.text.primary,
        fontWeight: typography.weights.medium,
        opacity: 0.7,
    },
    winningScore: {
        color: staticColors.text.primary,
        fontWeight: typography.weights.heavy,
        opacity: 1,
    },
    resultFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: spacing.sm,
        borderTopWidth: 1,
        borderTopColor: staticColors.surfaceHighlight,
    },
    resultOutcomeText: {
        ...typography.presets.caption,
        color: staticColors.text.primary,
        fontWeight: typography.weights.semibold,
        flex: 1,
    },
    scorecardActionBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: staticColors.surfaceHighlight,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        marginLeft: 8,
    },
    scorecardActionText: {
        ...typography.presets.caption,
        color: staticColors.primary,
        fontWeight: typography.weights.bold,
    },
    postCard: {
        width: 300,
        backgroundColor: staticColors.surface,
        borderRadius: radius.lg,
        padding: spacing.md,
        marginRight: spacing.md,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    postHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacing.sm,
    },
    postAuthorAvatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#E4E4E7',
        marginRight: spacing.sm,
    },
    postAuthorName: {
        ...typography.presets.body,
        fontWeight: typography.weights.bold,
        color: staticColors.text.primary,
    },
    postTime: {
        ...typography.presets.caption,
        color: staticColors.text.secondary,
    },
    postContent: {
        ...typography.presets.bodySmall,
        color: staticColors.text.primary,
        marginBottom: spacing.sm,
    },
    postImage: {
        width: '100%',
        height: 150,
        borderRadius: 8,
        marginBottom: spacing.sm,
    },
    postFooter: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
    },
    postFooterText: {
        ...typography.presets.caption,
        color: staticColors.text.secondary,
        marginRight: spacing.md,
    },
    // My Cricket Preview Card
    myCricketCard: {
        width: 140,
        height: 120,
        borderRadius: 16,
        padding: spacing.md,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: spacing.md,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    myCricketIconBg: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: staticColors.surfaceHighlight,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: spacing.sm,
    },
    myCricketTitle: {
        ...typography.presets.bodySmall,
        fontWeight: typography.weights.bold,
        color: staticColors.text.primary,
        textAlign: 'center',
    },
    myCricketSubtitle: {
        ...typography.presets.caption,
        color: staticColors.text.secondary,
        textAlign: 'center',
        marginTop: 2,
    },
    // Store Preview Card
    storeCard: {
        width: 160,
        backgroundColor: staticColors.surface,
        borderRadius: radius.lg,
        padding: spacing.sm,
        marginRight: spacing.md,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    storeImage: {
        width: '100%',
        height: 100,
        borderRadius: 8,
        marginBottom: spacing.sm,
        backgroundColor: '#F3F4F6',
    },
    storeName: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 2,
    },
    storePrice: {
        fontSize: 14,
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
    // News Section Styles (Instagram Style)
    newsCard: {
        width: 220,
        height: 280,
        marginRight: spacing.md,
        borderRadius: radius.lg,
        overflow: 'hidden',
        backgroundColor: staticColors.surface,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    newsImage: {
        width: '100%',
        height: '100%',
        position: 'absolute',
    },
    newsOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'flex-end',
        padding: spacing.md,
    },
    newsBadge: {
        alignSelf: 'flex-start',
        color: staticColors.primary,
        paddingHorizontal: spacing.sm,
        paddingVertical: 2,
        borderRadius: radius.sm,
        marginBottom: spacing.xs,
    },
    newsBadgeText: {
        ...typography.presets.caption,
        color: '#FFF',
        fontWeight: typography.weights.bold,
        textTransform: 'uppercase',
    },
    newsTitle: {
        ...typography.presets.body,
        fontWeight: typography.weights.bold,
        color: '#FFF',
        marginBottom: spacing.xs,
    },
    newsFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    newsTime: {
        ...typography.presets.caption,
        color: 'rgba(255,255,255,0.8)',
    },
    footer: {
        padding: spacing.xl,
        alignItems: 'center',
        opacity: 0.8,
        marginTop: spacing.xl,
    },
    footerLogo: {
        width: 120,
        height: 40,
        marginBottom: spacing.xs,
    },
    madeWithText: {
        ...typography.presets.caption,
        fontSize: 10,
        color: staticColors.text.tertiary,
    },
});
