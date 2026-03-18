import React, { useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  StatusBar, 
  Dimensions, 
  Image, 
  Animated, 
  Easing 
} from 'react-native';
import { Colors } from '../constants/Colors';

const { width, height } = Dimensions.get('window');

const SplashScreen = ({ navigation }: any) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    // Start animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
        easing: Easing.out(Easing.back(1)),
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
        easing: Easing.out(Easing.back(1.5)),
      }),
    ]).start();

    const timer = setTimeout(() => {
      navigation.replace('Main');
    }, 3000); // Slightly longer for the animation to finish elegantly
    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent={true} />
      
      <View style={styles.content}>
        <Animated.View 
          style={[
            styles.logoContainer, 
            { 
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }]
            }
          ]}
        >
          <Image 
            source={require('../../assets/abhiloading.png')} 
            style={styles.splashLogo} 
            resizeMode="cover"
          />
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E293B', // Deep Slate for premium contrast
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    width: width,
    height: height,
  },
  splashLogo: {
    width: '100%',
    height: '100%',
  },
});

export default SplashScreen;
