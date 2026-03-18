import * as React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Image, Dimensions } from 'react-native';
import { Colors } from '../constants/Colors';
import { Play, Circle } from 'lucide-react-native';

const { width } = Dimensions.get('window');

const OnboardingCarousel = ({ navigation }: any) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.brandName}>CRICPRO</Text>
        <TouchableOpacity>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={styles.illustrationContainer}>
          <View style={styles.illustrationCircle}>
              {/* Placeholder for the bat/ball illustration */}
              <View style={styles.iconBackground}>
                <View style={{ transform: [{ rotate: '-45deg' }, { translateX: 8 }] }}>
                  <Play color={Colors.maroon} size={60} fill={Colors.maroon} />
                </View>
                <Circle color={Colors.maroon} size={15} fill={Colors.maroon} style={{ position: 'absolute', top: 30, right: 30 }} />
              </View>
          </View>
        </View>

        <View style={styles.textContainer}>
          <Text style={styles.title}>Score Every Ball</Text>
          <Text style={styles.description}>
            Experience real-time updates and lightning fast commentary for every match across the globe.
          </Text>
        </View>

        <View style={styles.pagination}>
          <View style={[styles.dot, styles.activeDot]} />
          <View style={styles.dot} />
          <View style={styles.dot} />
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.button}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.loginLink}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.loginText}>Log In</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  brandName: {
    fontSize: 18,
    fontWeight: '900',
    color: Colors.text,
    letterSpacing: 1,
  },
  skipText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.maroon,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  illustrationContainer: {
    width: width * 0.7,
    aspectRatio: 1,
    backgroundColor: Colors.peach,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  illustrationCircle: {
     width: 140,
     height: 140,
     borderRadius: 70,
     backgroundColor: 'rgba(128, 0, 0, 0.05)',
     justifyContent: 'center',
     alignItems: 'center',
  },
  iconBackground: {
     width: 100,
     height: 100,
     justifyContent: 'center',
     alignItems: 'center',
  },
  textContainer: {
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 15,
  },
  description: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  pagination: {
    flexDirection: 'row',
    marginTop: 40,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E0E0E0',
    marginHorizontal: 4,
  },
  activeDot: {
    width: 20,
    backgroundColor: Colors.maroon,
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  button: {
    backgroundColor: Colors.maroon,
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: Colors.maroon,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  buttonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '700',
  },
  loginLink: {
    marginTop: 20,
    alignItems: 'center',
  },
  loginText: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.text,
    textDecorationLine: 'underline',
  },
});

export default OnboardingCarousel;
