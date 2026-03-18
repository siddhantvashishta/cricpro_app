import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Marker } from 'react-native-maps';
import { Colors } from '../constants/Colors';

interface PulsatingMarkerProps {
  coordinate: { latitude: number; longitude: number };
  title: string;
  description: string;
  bgColor: string;
  icon: any;
  label: string;
  isLive?: boolean;
}

const PulsatingMarker: React.FC<PulsatingMarkerProps> = ({ 
  coordinate, title, description, bgColor, icon: Icon, label, isLive 
}) => {
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (isLive) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [isLive]);

  return (
    <Marker coordinate={coordinate} title={title} description={description}>
      <View style={{ alignItems: 'center', width: 140 }}>
        {isLive && (
          <Animated.View 
            style={[
              styles.pulseCircle, 
              { 
                backgroundColor: bgColor,
                transform: [{ scale: pulseAnim }],
                opacity: pulseAnim.interpolate({
                  inputRange: [1, 1.2],
                  outputRange: [0.6, 0]
                })
              }
            ]} 
          />
        )}
        <View style={[styles.pinBubble, { backgroundColor: bgColor }]}>
          <Text style={styles.pinText} numberOfLines={1}>{label}</Text>
        </View>
        <View style={[styles.pinIconContainer, { backgroundColor: bgColor }]}>
          <Icon color={Colors.white} size={16} />
        </View>
      </View>
    </Marker>
  );
};

const styles = StyleSheet.create({
  pulseCircle: {
    position: 'absolute',
    top: 25,
    width: 40,
    height: 40,
    borderRadius: 20,
    zIndex: -1,
  },
  pinBubble: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.white,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  pinText: {
    color: Colors.white,
    fontSize: 11,
    fontWeight: '900',
    textAlign: 'center',
  },
  pinIconContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -4,
    borderWidth: 2,
    borderColor: Colors.white,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
});

export default PulsatingMarker;
