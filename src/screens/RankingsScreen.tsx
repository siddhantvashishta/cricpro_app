import * as React from 'react';
import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Image,
  Dimensions,
  StatusBar,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, Search, ChevronUp, ChevronDown, Minus, TrendingUp } from 'lucide-react-native';
import { Colors } from '../constants/Colors';
import { useTeamStore } from '../store/useTeamStore';
import { useAuthStore } from '../store/useAuthStore';

const { width } = Dimensions.get('window');


const RankingsScreen = ({ navigation }: any) => {
  const insets = useSafeAreaInsets();
  const { players } = useTeamStore();
  const { userProfile } = useAuthStore();
  const [activeTab, setActiveTab] = useState('Batting');
  const [activeFormat, setActiveFormat] = useState('T20');

  const userRegion = userProfile?.city || 'Mumbai';
  
  const regionalPlayers = Object.values(players)
    .filter(p => !p.city || p.city === userRegion) // Show players from user's city or generic
    .sort((a, b) => {
        if (activeTab === 'Batting') return (b.stats?.RUNS || 0) - (a.stats?.RUNS || 0);
        if (activeTab === 'Bowling') return (b.stats?.WKTS || 0) - (a.stats?.WKTS || 0);
        return (b.stats?.AVG || 0) - (a.stats?.AVG || 0);
    })
    .slice(0, 10);

  const renderRankItem = (item: typeof RANKINGS[0], index: number) => {
    if (index < 3) return null; // Podium handles first 3

    return (
      <View key={item.id} style={styles.rankItem}>
        <Text style={styles.rankNumber}>{index + 1 < 10 ? `0${index + 1}` : index + 1}</Text>
        <Image source={{ uri: item.avatar }} style={styles.listAvatar} />
        <View style={styles.playerMainInfo}>
          <Text style={styles.listPlayerName}>{item.name}</Text>
          <Text style={styles.listPlayerTeam}>{item.team}</Text>
        </View>
        <Text style={styles.listValue}>{item.runs}</Text>
        <Text style={styles.listValue}>{item.avg}</Text>
        <View style={styles.changeCol}>
          {item.change === 'up' && <ChevronUp color="#4CAF50" size={16} />}
          {item.change === 'down' && <ChevronDown color="#F44336" size={16} />}
          {item.change === 'none' && <Minus color="#90A4AE" size={16} />}
        </View>
      </View>
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ArrowLeft color="#1A237E" size={24} />
        </Pressable>
        <View style={styles.headerTitleRow}>
          <Text style={styles.headerTitle}>Rankings</Text>
          <View style={styles.proPill}>
            <Text style={styles.proPillText}>PRO</Text>
          </View>
        </View>
        <Pressable style={styles.searchBtn}><Search color="#1A237E" size={24} /></Pressable>
      </View>

      {/* Categories */}
      <View style={styles.categories}>
        {['Batting', 'Bowling', 'Teams', 'All-Rounders'].map(cat => (
          <Pressable 
            key={cat} 
            style={[styles.categoryBtn, activeTab === cat && styles.categoryBtnActive]}
            onPress={() => setActiveTab(cat)}
          >
            <Text style={[styles.categoryText, activeTab === cat && styles.categoryTextActive]}>{cat}</Text>
          </Pressable>
        ))}
      </View>

      {/* Format Filters */}
      <View style={styles.formats}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.formatsScroll}>
          {['T20', 'ODI', 'Test', 'Under-19'].map(fmt => (
            <Pressable 
              key={fmt} 
              style={[styles.formatBtn, activeFormat === fmt && styles.formatBtnActive]}
              onPress={() => setActiveFormat(fmt)}
            >
              <Text style={[styles.formatText, activeFormat === fmt && styles.formatTextActive]}>{fmt}</Text>
              <ChevronDown color={activeFormat === fmt ? '#FFFFFF' : '#607D8B'} size={14} />
            </Pressable>
          ))}
          <Pressable style={styles.formatBtn}>
            <Text style={styles.formatText}>This Season</Text>
            <ChevronDown color="#607D8B" size={14} />
          </Pressable>
        </ScrollView>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollBody}>
        
        {/* Podium Section */}
        {regionalPlayers.length >= 3 ? (
          <View style={styles.podiumContainer}>
            {/* Rank 2 */}
            <View style={styles.podiumSide}>
              <View style={styles.podiumAvatarContainer}>
                 <View style={[styles.podiumAvatar, { backgroundColor: '#F5F7FA', justifyContent: 'center', alignItems: 'center' }]}>
                    <Text style={{ fontSize: 24, fontWeight: '900' }}>{regionalPlayers[1].name.charAt(0)}</Text>
                 </View>
                 <View style={styles.podiumRankBadgeSide}><Text style={styles.podiumRankText}>2</Text></View>
              </View>
              <Text style={styles.podiumName}>{regionalPlayers[1].name}</Text>
              <Text style={styles.podiumRuns}>{activeTab === 'Bowling' ? regionalPlayers[1].stats?.WKTS : regionalPlayers[1].stats?.RUNS} {activeTab === 'Bowling' ? 'Wkts' : 'Runs'}</Text>
              <View style={styles.podiumBaseSide}>
                  <View style={[styles.starIcon, {backgroundColor: '#CFD8DC'}]} />
              </View>
            </View>

            {/* Rank 1 (Center) */}
            <View style={styles.podiumCenter}>
               <View style={styles.podiumProPill}><Text style={styles.podiumProText}>PRO</Text></View>
               <View style={styles.podiumAvatarContainerMain}>
                  <View style={[styles.podiumAvatarMain, { backgroundColor: '#F5F7FA', justifyContent: 'center', alignItems: 'center' }]}>
                    <Text style={{ fontSize: 32, fontWeight: '900' }}>{regionalPlayers[0].name.charAt(0)}</Text>
                  </View>
                  <View style={styles.podiumRankBadgeMain}>
                    <Text style={styles.podiumRankTextMain}>1</Text>
                  </View>
               </View>
               <Text style={styles.podiumNameMain}>{regionalPlayers[0].name}</Text>
               <Text style={styles.podiumRunsMain}>{activeTab === 'Bowling' ? regionalPlayers[0].stats?.WKTS : regionalPlayers[0].stats?.RUNS} {activeTab === 'Bowling' ? 'Wkts' : 'Runs'}</Text>
               <View style={styles.podiumBaseMain}>
                  <Text style={styles.trophyEmoji}>🏆</Text>
               </View>
            </View>

            {/* Rank 3 */}
            <View style={styles.podiumSide}>
              <View style={styles.podiumAvatarContainer}>
                 <View style={styles.proSmallPill}><Text style={styles.proSmallText}>PRO</Text></View>
                 <View style={[styles.podiumAvatar, { backgroundColor: '#F5F7FA', justifyContent: 'center', alignItems: 'center' }]}>
                    <Text style={{ fontSize: 24, fontWeight: '900' }}>{regionalPlayers[2].name.charAt(0)}</Text>
                 </View>
                 <View style={styles.podiumRankBadgeSide}><Text style={styles.podiumRankText}>3</Text></View>
              </View>
              <Text style={styles.podiumName}>{regionalPlayers[2].name}</Text>
              <Text style={styles.podiumRuns}>{activeTab === 'Bowling' ? regionalPlayers[2].stats?.WKTS : regionalPlayers[2].stats?.RUNS} {activeTab === 'Bowling' ? 'Wkts' : 'Runs'}</Text>
              <View style={styles.podiumBaseSide}>
                  <View style={[styles.starIcon, {backgroundColor: '#FFCCBC'}]} />
              </View>
            </View>
          </View>
        ) : (
          <View style={{ height: 260, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ color: '#607D8B', fontWeight: '700' }}>Not enough regional data available</Text>
          </View>
        )}

        {/* List Header */}
        <View style={styles.listHeader}>
          <Text style={[styles.headerLabel, { width: 40 }]}>RANK</Text>
          <Text style={[styles.headerLabel, { flex: 1, marginLeft: 16 }]}>PLAYER</Text>
          <Text style={[styles.headerLabel, { width: 60, textAlign: 'center' }]}>RUNS</Text>
          <Text style={[styles.headerLabel, { width: 60, textAlign: 'center' }]}>AVG</Text>
          <Text style={[styles.headerLabel, { width: 40, textAlign: 'center' }]}>CHG</Text>
        </View>

        {/* List Content */}
        <View style={styles.rankList}>
          {regionalPlayers.map((item, index) => {
            if (index < 3) return null;
            return (
              <View key={item.id} style={styles.rankItem}>
                <Text style={styles.rankNumber}>{index + 1 < 10 ? `0${index + 1}` : index + 1}</Text>
                <View style={[styles.listAvatar, { backgroundColor: '#F5F7FA' }]}>
                  <Text style={{ fontWeight: '800' }}>{item.name.charAt(0)}</Text>
                </View>
                <View style={styles.playerMainInfo}>
                  <Text style={styles.listPlayerName}>{item.name}</Text>
                  <Text style={styles.listPlayerTeam}>{item.role}</Text>
                </View>
                <Text style={styles.listValue}>{activeTab === 'Bowling' ? item.stats?.WKTS : item.stats?.RUNS}</Text>
                <Text style={styles.listValue}>{item.stats?.AVG}</Text>
                <View style={styles.changeCol}>
                   <ChevronUp color="#4CAF50" size={16} />
                </View>
              </View>
            );
          })}
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Floating Personal Rank Card */}
      <View style={[styles.personalCard, { bottom: insets.bottom + 10 }]}>
         <Image source={{ uri: 'https://images.unsplash.com/photo-1540747913346-19e3adca174f?q=80&w=100&auto=format&fit=crop' }} style={styles.personalAvatar} />
         <View style={styles.personalInfo}>
            <Text style={styles.personalPosText}>#47</Text>
            <View>
              <Text style={styles.personalName}>My Position (You)</Text>
              <View style={styles.personalLocationRow}>
                 <Text style={styles.personalLocation}>Local Ranking</Text>
                 <View style={styles.proSmallPillGold}><Text style={styles.proSmallTextGold}>PRO</Text></View>
              </View>
            </View>
         </View>
         <Text style={styles.personalRuns}>452</Text>
         <Text style={styles.personalAvg}>32.1</Text>
         <TrendingUp color="#D84315" size={18} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: 60,
  },
  backBtn: { width: 44, height: 44, justifyContent: 'center' },
  headerTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  headerTitle: { fontSize: 20, fontWeight: '900', color: '#1A237E' },
  proPill: { backgroundColor: '#FFD700', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6, borderWidth: 1, borderColor: '#FFFFFF' },
  proPillText: { fontSize: 10, fontWeight: '900', color: Colors.maroon },
  searchBtn: { width: 44, height: 44, justifyContent: 'center', alignItems: 'flex-end' },
  
  categories: { flexDirection: 'row', paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  categoryBtn: { flex: 1, alignItems: 'center', paddingVertical: 14 },
  categoryBtnActive: { borderBottomWidth: 2, borderBottomColor: Colors.maroon },
  categoryText: { fontSize: 14, fontWeight: '700', color: '#607D8B' },
  categoryTextActive: { color: Colors.maroon },

  formats: { marginTop: 12 },
  formatsScroll: { paddingHorizontal: 16, gap: 10, paddingBottom: 10 },
  formatBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F5F7FA', paddingHorizontal: 14, paddingVertical: 10, borderRadius: 20, gap: 6 },
  formatBtnActive: { backgroundColor: Colors.maroon },
  formatText: { fontSize: 14, fontWeight: '700', color: '#607D8B' },
  formatTextActive: { color: '#FFFFFF' },

  scrollBody: { paddingTop: 20 },
  
  // Podium
  podiumContainer: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'center', paddingHorizontal: 20, height: 260 },
  podiumSide: { alignItems: 'center', width: (width - 40) / 3.5 },
  podiumCenter: { alignItems: 'center', width: (width - 40) / 3, marginHorizontal: 10, zIndex: 10 },
  podiumAvatarContainer: { width: 80, height: 80, borderRadius: 40, borderWidth: 3, borderColor: '#F5F7FA', position: 'relative' },
  podiumAvatar: { width: 74, height: 74, borderRadius: 37 },
  podiumAvatarContainerMain: { width: 100, height: 100, borderRadius: 50, borderWidth: 4, borderColor: '#FFD700', position: 'relative' },
  podiumAvatarMain: { width: 92, height: 92, borderRadius: 46 },
  podiumRankBadgeSide: { position: 'absolute', bottom: -5, alignSelf: 'center', backgroundColor: '#F0EDED', width: 24, height: 24, borderRadius: 12, borderWidth: 1.5, borderColor: '#90A4AE', justifyContent: 'center', alignItems: 'center' },
  podiumRankBadgeMain: { position: 'absolute', bottom: -5, alignSelf: 'center', backgroundColor: '#FFD700', width: 28, height: 28, borderRadius: 14, borderWidth: 2, borderColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center' },
  podiumRankText: { fontSize: 12, fontWeight: '900', color: '#546E7A' },
  podiumRankTextMain: { fontSize: 14, fontWeight: '900', color: Colors.maroon },
  podiumProPill: { position: 'absolute', top: -15, backgroundColor: '#FFD700', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10, zIndex: 10, borderWidth: 1.5, borderColor: '#FFFFFF' },
  podiumProText: { fontSize: 10, fontWeight: '900', color: Colors.maroon },
  proSmallPill: { position: 'absolute', top: -5, left: -5, backgroundColor: '#FFD700', paddingHorizontal: 5, paddingVertical: 1, borderRadius: 6, zIndex: 10, borderWidth: 1, borderColor: '#FFFFFF' },
  proSmallText: { fontSize: 7, fontWeight: '900', color: Colors.maroon },
  podiumName: { fontSize: 12, fontWeight: '800', color: '#1A237E', marginTop: 12 },
  podiumNameMain: { fontSize: 14, fontWeight: '900', color: '#1A237E', marginTop: 14 },
  podiumRuns: { fontSize: 11, fontWeight: '700', color: Colors.maroon },
  podiumRunsMain: { fontSize: 13, fontWeight: '900', color: Colors.maroon },
  podiumBaseSide: { width: '100%', height: 60, backgroundColor: '#FCE4EC', marginTop: 10, borderTopLeftRadius: 10, borderTopRightRadius: 10, justifyContent: 'center', alignItems: 'center', opacity: 0.6 },
  podiumBaseMain: { width: '100%', height: 90, backgroundColor: '#FFF9C4', marginTop: 10, borderTopLeftRadius: 15, borderTopRightRadius: 15, justifyContent: 'center', alignItems: 'center' },
  trophyEmoji: { fontSize: 24 },
  starIcon: { width: 20, height: 20, borderRadius: 10 },

  // List
  listHeader: { flexDirection: 'row', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F0F0F0', backgroundColor: '#F5F7FA' },
  headerLabel: { fontSize: 10, fontWeight: '800', color: '#90A4AE', letterSpacing: 0.5 },
  rankList: { paddingHorizontal: 16 },
  rankItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#F5F5F5' },
  rankNumber: { fontSize: 14, fontWeight: '800', color: '#90A4AE', width: 40 },
  listAvatar: { width: 36, height: 36, borderRadius: 18, marginLeft: 0 },
  playerMainInfo: { flex: 1, marginLeft: 16 },
  listPlayerName: { fontSize: 14, fontWeight: '800', color: '#263238' },
  listPlayerTeam: { fontSize: 11, color: '#78909C', fontWeight: '600' },
  listValue: { fontSize: 14, fontWeight: '800', color: '#263238', width: 60, textAlign: 'center' },
  changeCol: { width: 40, alignItems: 'center' },

  // Personal Card
  personalCard: { position: 'absolute', left: 16, right: 16, backgroundColor: '#FFF5F5', height: 80, borderRadius: 20, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, borderWidth: 1.5, borderColor: '#FFE0E0', ...Platform.select({ ios: { shadowColor: Colors.maroon, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 10 }, android: { elevation: 6 } }) },
  personalAvatar: { width: 44, height: 44, borderRadius: 22, borderWidth: 2, borderColor: '#FFD700' },
  personalInfo: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 12 },
  personalPosText: { fontSize: 16, fontWeight: '900', color: Colors.maroon },
  personalName: { fontSize: 15, fontWeight: '800', color: '#1A237E' },
  personalLocationRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  personalLocation: { fontSize: 11, color: '#D84315', fontWeight: '700' },
  proSmallPillGold: { backgroundColor: '#FFD700', paddingHorizontal: 4, paddingVertical: 1, borderRadius: 4 },
  proSmallTextGold: { fontSize: 7, fontWeight: '900', color: Colors.maroon },
  personalRuns: { fontSize: 16, fontWeight: '900', color: '#1A237E', marginHorizontal: 10 },
  personalAvg: { fontSize: 16, fontWeight: '800', color: '#1A237E', marginHorizontal: 10 },
});

export default RankingsScreen;
