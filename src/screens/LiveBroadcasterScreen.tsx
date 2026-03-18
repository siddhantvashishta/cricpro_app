import * as React from 'react';
import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ImageBackground,
  Dimensions,
  StatusBar,
  Switch,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { 
  X, 
  MessageSquare, 
  Share2, 
  Wand2, 
  SwitchCamera, 
  Zap, 
  Mic, 
  MicOff,
  Settings,
  Eye,
  Clock
} from 'lucide-react-native';
import { Colors } from '../constants/Colors';

const { width, height } = Dimensions.get('window');

const LiveBroadcasterScreen = ({ navigation }: any) => {
  const insets = useSafeAreaInsets();
  const [showScore, setShowScore] = useState(true);
  const [micOn, setMicOn] = useState(true);
  const [flashOn, setFlashOn] = useState(false);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      
      <ImageBackground 
        source={{ uri: 'https://images.unsplash.com/photo-1540747913346-19e3adca174f?q=80&w=1000&auto=format&fit=crop' }} 
        style={styles.preview}
        resizeMode="cover"
      >
        <View style={styles.darkOverlay} />
        
        {/* Top Stats Bar */}
        <View style={[styles.topBar, { paddingTop: insets.top + 10 }]}>
          <View style={styles.broadcasterInfo}>
             <View style={styles.liveBadge}>
                <View style={styles.liveDot} />
                <Text style={styles.liveText}>LIVE</Text>
             </View>
             <View style={styles.statChip}>
                <Clock color="#FFFFFF" size={14} />
                <Text style={styles.statText}>00:23:14</Text>
             </View>
             <View style={styles.statChip}>
                <Eye color="#FFFFFF" size={14} />
                <Text style={styles.statText}>142</Text>
             </View>
          </View>
          
          <View style={styles.scoreToggle}>
             <Text style={styles.toggleLabel}>Show Score</Text>
             <Switch 
                value={showScore} 
                onValueChange={setShowScore}
                trackColor={{ false: '#767577', true: Colors.maroon }}
                thumbColor="#FFFFFF"
             />
          </View>
        </View>

        {/* Floating Scorecard */}
        {showScore && (
          <View style={styles.floatingScorecard}>
             <View style={styles.teamBadgeA}>
                <Text style={styles.teamBadgeText}>IND</Text>
             </View>
             <View style={styles.scoreMain}>
                <Text style={styles.scoreValue}>184/3</Text>
                <Text style={styles.oversValue}>18.4 OVERS</Text>
             </View>
             <View style={styles.divider} />
             <View style={styles.batsmanInfo}>
                <Text style={styles.batsmanName}>Kohli 45* (32)</Text>
                <Text style={styles.crrText}>CRR: 9.85</Text>
             </View>
             <View style={styles.teamBadgeB}>
                <Text style={styles.teamBadgeText}>AUS</Text>
             </View>
          </View>
        )}

        {/* Side Actions */}
        <View style={styles.sideActions}>
           <Pressable style={styles.actionBtn}>
              <View style={styles.actionIconBg}><MessageSquare color="#FFFFFF" size={24} /></View>
              <Text style={styles.actionLabel}>CHAT</Text>
           </Pressable>
           <Pressable style={styles.actionBtn}>
              <View style={styles.actionIconBg}><Share2 color="#FFFFFF" size={24} /></View>
              <Text style={styles.actionLabel}>SHARE</Text>
           </Pressable>
           <Pressable style={styles.actionBtn}>
              <View style={styles.actionIconBg}><Wand2 color="#FFFFFF" size={24} /></View>
              <Text style={styles.actionLabel}>EFFECTS</Text>
           </Pressable>
        </View>

        {/* Top Left Close */}
        <Pressable 
          onPress={() => navigation.goBack()} 
          style={[styles.closeBtn, { top: insets.top + 10 }]}
        >
          <X color="#FFFFFF" size={28} />
        </Pressable>

        {/* Bottom Bar Controls */}
        <View style={[styles.bottomBar, { paddingBottom: insets.bottom + 20 }]}>
           <Pressable style={styles.qualityBtn}>
              <Text style={styles.qualityText}>720P</Text>
           </Pressable>
           
           <View style={styles.controlRow}>
              <Pressable style={styles.controlBtn}><SwitchCamera color="#FFFFFF" size={28} /></Pressable>
              
              <Pressable 
                style={[styles.controlBtn, flashOn && styles.controlBtnActive]}
                onPress={() => setFlashOn(!flashOn)}
              >
                <Zap color="#FFFFFF" size={28} fill={flashOn ? '#FFFFFF' : 'transparent'} />
              </Pressable>

              <Pressable 
                style={[styles.controlBtn, !micOn && styles.micOffBtn]}
                onPress={() => setMicOn(!micOn)}
              >
                {micOn ? <Mic color="#FFFFFF" size={28} /> : <MicOff color="#FFFFFF" size={28} />}
              </Pressable>

              <Pressable style={styles.controlBtn}><Settings color="#FFFFFF" size={28} /></Pressable>
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
  preview: {
    width: width,
    height: height,
  },
  darkOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  broadcasterInfo: {
    flexDirection: 'row',
    gap: 12,
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(139,0,0,0.9)', // Deep maroon
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FFFFFF',
    marginRight: 6,
  },
  liveText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1,
  },
  statChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    gap: 6,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  statText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  scoreToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  toggleLabel: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  floatingScorecard: {
    position: 'absolute',
    top: 100,
    alignSelf: 'center',
    width: width - 32,
    height: 70,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  teamBadgeA: {
    backgroundColor: Colors.maroon,
    width: 60,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  teamBadgeB: {
    backgroundColor: 'rgba(139,0,0,0.8)',
    width: 60,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  teamBadgeText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 1,
  },
  scoreMain: {
    flex: 1.2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreValue: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '900',
  },
  oversValue: {
    color: '#B0BEC5',
    fontSize: 10,
    fontWeight: '800',
  },
  divider: {
    width: 1,
    height: '60%',
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  batsmanInfo: {
    flex: 2,
    paddingHorizontal: 12,
    justifyContent: 'center',
  },
  batsmanName: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  crrText: {
    color: '#B0BEC5',
    fontSize: 11,
    fontWeight: '700',
  },
  sideActions: {
    position: 'absolute',
    right: 16,
    top: height * 0.4,
    gap: 20,
  },
  actionBtn: {
    alignItems: 'center',
    gap: 6,
  },
  actionIconBg: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionLabel: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
  },
  closeBtn: {
    position: 'absolute',
    left: 16,
    padding: 8,
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 20,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    paddingHorizontal: 20,
  },
  qualityBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 24,
    alignSelf: 'flex-start',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  qualityText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 1,
  },
  controlRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  controlBtn: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  controlBtnActive: {
    backgroundColor: Colors.maroon,
    borderColor: '#FFFFFF',
  },
  micOffBtn: {
    backgroundColor: '#D32F2F',
  },
});

export default LiveBroadcasterScreen;
