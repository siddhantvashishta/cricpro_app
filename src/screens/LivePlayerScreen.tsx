import * as React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ImageBackground,
  Dimensions,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, Pause, SkipForward, SkipBack, Eye } from 'lucide-react-native';
import { Colors } from '../constants/Colors';
import { useTeamStore } from '../store/useTeamStore';

const { width, height } = Dimensions.get('window');

const LivePlayerScreen = ({ navigation, route }: any) => {
  const insets = useSafeAreaInsets();
  const { matches } = useTeamStore();
  
  const matchId = route?.params?.matchId;
  const stream = route?.params?.stream;
  
  const match = matches.find(m => m.id === matchId);
  
  // Dynamic data from match or stream fallback
  const team1Label = match ? match.teamAInfo.shortName : (stream?.title?.split(' ')[0] || 'IND');
  const team2Label = match ? match.teamBInfo.shortName : (stream?.title?.split(' vs ')[1] || 'AUS');
  const score1 = match ? (match.scoreA || '0/0') : (stream?.title?.split(' ')[1] || '0/0');
  const score2 = match ? (match.scoreB || 'Yet to Bat') : 'Yet to Bat';
  const overs = match ? (match.oversPlayed ? `(${match.oversPlayed})` : '') : (stream?.title?.split('(')[1]?.split(')')[0] ? `(${stream.title.split('(')[1].split(')')[0]})` : '');
  const thumbnail = stream?.thumbnail || 'https://images.unsplash.com/photo-1540747913346-19e3adca174f?q=80&w=1000&auto=format&fit=crop';

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      
      <ImageBackground 
        source={{ uri: stream.thumbnail }} 
        style={styles.videoPlayer}
        resizeMode="cover"
      >
        <View style={styles.darkOverlay} />
        
        {/* Top Controls */}
        <View style={[styles.topRow, { paddingTop: insets.top + 10 }]}>
          <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
            <ArrowLeft color="#FFFFFF" size={24} />
          </Pressable>
          
          <View style={styles.scoreOverlay}>
            <View style={styles.liveIndicator}>
               <View style={styles.liveDot} />
               <Text style={styles.liveText}>LIVE</Text>
            </View>
            <View style={styles.divider} />
             <View style={styles.scoreInfo}>
                <View style={styles.teamScore}>
                   <Text style={styles.teamLabel}>{team1Label}</Text>
                   <Text style={styles.teamRunCount}>{score1}</Text>
                   <Text style={styles.oversCount}>{overs}</Text>
                </View>
                <Text style={styles.vsText}>VS</Text>
                <View style={styles.teamScore}>
                   <Text style={styles.teamLabel}>{team2Label}</Text>
                   <Text style={score2 === 'Yet to Bat' ? styles.yetToBat : styles.teamRunCount}>
                     {score2}
                   </Text>
                </View>
             </View>
            <View style={styles.divider} />
            <View style={styles.rrrBox}>
               <Text style={styles.rrrLabel}>RRR</Text>
               <Text style={styles.rrrValue}>7.2</Text>
            </View>
          </View>
        </View>

        {/* Center Controls */}
        <View style={styles.centerControls}>
          <Pressable style={styles.skipBtn}><SkipBack color="#FFFFFF" size={32} opacity={0.6} /></Pressable>
          <Pressable style={styles.playBtn}>
            <Pause color="#FFFFFF" size={40} fill="#FFFFFF" />
          </Pressable>
          <Pressable style={styles.skipBtn}><SkipForward color="#FFFFFF" size={32} opacity={0.6} /></Pressable>
        </View>

        {/* Bottom Info */}
        <View style={[styles.bottomRow, { paddingBottom: insets.bottom + 20 }]}>
          <View style={styles.viewersBadge}>
            <Eye color="#FFFFFF" size={16} />
            <Text style={styles.viewersText}>2,458 watching</Text>
          </View>
          
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: '80%' }]} />
            </View>
            <Text style={styles.timeLabel}>42:15</Text>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  videoPlayer: {
    width: width,
    height: height,
  },
  darkOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  scoreOverlay: {
    flex: 1,
    height: 64,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 32,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#E53935',
    marginRight: 6,
  },
  liveText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1,
  },
  divider: {
    width: 1,
    height: 20,
    backgroundColor: 'rgba(255,255,255,0.3)',
    marginHorizontal: 16,
  },
  scoreInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  teamScore: {
    alignItems: 'center',
  },
  teamLabel: {
    color: '#B0BEC5',
    fontSize: 10,
    fontWeight: '800',
  },
  teamRunCount: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '900',
  },
  oversCount: {
    color: '#B0BEC5',
    fontSize: 10,
    fontWeight: '700',
  },
  vsText: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 11,
    fontWeight: '800',
    marginHorizontal: 8,
  },
  yetToBat: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  rrrBox: {
    alignItems: 'center',
  },
  rrrLabel: {
    color: '#B0BEC5',
    fontSize: 10,
    fontWeight: '800',
  },
  rrrValue: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '900',
  },
  centerControls: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 40,
  },
  playBtn: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: 'rgba(139,0,0,0.8)', // Maroon translucent
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  skipBtn: {
    padding: 10,
  },
  bottomRow: {
    paddingHorizontal: 20,
  },
  viewersBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    alignSelf: 'flex-start',
    marginBottom: 20,
  },
  viewersText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
    marginLeft: 6,
  },
  progressContainer: {
    width: '100%',
  },
  progressBar: {
    width: '100%',
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#E53935',
  },
  timeLabel: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
    marginTop: 8,
  },
});

export default LivePlayerScreen;
