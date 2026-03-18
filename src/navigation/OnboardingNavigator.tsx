import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from '../screens/SplashScreen';
import OnboardingCarousel from '../screens/OnboardingCarousel';
import LoginScreen from '../screens/LoginScreen';
import OTPScreen from '../screens/OTPScreen';
import ProfileSetupStep1 from '../screens/ProfileSetupStep1';
import ProfileSetupStep2 from '../screens/ProfileSetupStep2';
import RoleSelectionScreen from '../screens/RoleSelectionScreen';
import MainNavigator from './MainNavigator';
import SubscriptionNavigator from './SubscriptionNavigator';
import TournamentsNavigator from './TournamentsNavigator';
import RecruitNavigator from './RecruitNavigator';
import MyTeamsNavigator from './MyTeamsNavigator';
import LiveNavigator from './LiveNavigator';
import CommunityNavigator from './CommunityNavigator';
import CoinTossScreen from '../screens/CoinTossScreen';
import MessagesNavigator from './MessagesNavigator';
import NotificationScreen from '../screens/NotificationScreen';
import LeaderboardScreen from '../screens/LeaderboardScreen';
import CricketNewsScreen from '../screens/CricketNewsScreen';
import GroundFinderScreen from '../screens/GroundFinderScreen';
import LocalCricketMapScreen from '../screens/LocalCricketMapScreen';
import RankingsScreen from '../screens/RankingsScreen';
import InstantMatchSetupScreen from '../screens/InstantMatchSetupScreen';
import InstantScoringScreen from '../screens/InstantScoringScreen';
import RecentInstantMatchesScreen from '../screens/RecentInstantMatchesScreen';
import LiveMatchDetailScreen from '../screens/LiveMatchDetailScreen';
import CheckoutScreen from '../screens/CheckoutScreen';
import BookingSuccessScreen from '../screens/BookingSuccessScreen';
import MyBookingsScreen from '../screens/MyBookingsScreen';
import GroundDetailScreen from '../screens/GroundDetailScreen';

const Stack = createNativeStackNavigator();

const OnboardingNavigator = () => {
  return (
    <Stack.Navigator 
      screenOptions={{ 
        headerShown: false,
        animation: 'fade_from_bottom'
      }}
      initialRouteName="Splash"
    >
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Onboarding" component={OnboardingCarousel} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="OTP" component={OTPScreen} />
      <Stack.Screen name="ProfileSetup1" component={ProfileSetupStep1} />
      <Stack.Screen name="ProfileSetup2" component={ProfileSetupStep2} />
      <Stack.Screen name="RoleSelection" component={RoleSelectionScreen} />
      <Stack.Screen name="Main" component={MainNavigator} />
      {/* Full-screen sections accessible from Home quick actions */}
      <Stack.Screen 
        name="Tournaments" 
        component={TournamentsNavigator}
        options={{ animation: 'slide_from_right' }}
      />
      <Stack.Screen 
        name="Recruit" 
        component={RecruitNavigator}
        options={{ animation: 'slide_from_right' }}
      />
      <Stack.Screen
        name="MyTeams"
        component={MyTeamsNavigator}
        options={{ animation: 'slide_from_right' }}
      />
      <Stack.Screen
        name="Live"
        component={LiveNavigator}
        options={{ animation: 'slide_from_right' }}
      />
      <Stack.Screen
        name="Community"
        component={CommunityNavigator}
        options={{ animation: 'slide_from_right' }}
      />
      {/* Modal */}
      <Stack.Screen 
        name="Subscription" 
        component={SubscriptionNavigator} 
        options={{ presentation: 'modal', animation: 'slide_from_bottom' }} 
      />
      <Stack.Screen
        name="CoinToss"
        component={CoinTossScreen}
        options={{ presentation: 'modal', animation: 'slide_from_bottom' }}
      />
      <Stack.Screen
        name="Messages"
        component={MessagesNavigator}
        options={{ presentation: 'modal', animation: 'slide_from_bottom' }}
      />
      <Stack.Screen
        name="Notifications"
        component={NotificationScreen}
        options={{ animation: 'slide_from_right' }}
      />
      <Stack.Screen
        name="Leaderboard"
        component={LeaderboardScreen}
        options={{ animation: 'slide_from_right' }}
      />
      <Stack.Screen
        name="CricketNews"
        component={CricketNewsScreen}
        options={{ animation: 'slide_from_right' }}
      />
      <Stack.Screen
        name="GroundFinder"
        component={GroundFinderScreen}
        options={{ animation: 'slide_from_right' }}
      />
      <Stack.Screen
        name="LocalCricketMap"
        component={LocalCricketMapScreen}
        options={{ animation: 'slide_from_right' }}
      />
      <Stack.Screen
        name="Rankings"
        component={RankingsScreen}
        options={{ animation: 'slide_from_right' }}
      />
      <Stack.Screen
        name="InstantMatchSetup"
        component={InstantMatchSetupScreen}
        options={{ animation: 'slide_from_right' }}
      />
      <Stack.Screen
        name="InstantScoring"
        component={InstantScoringScreen}
        options={{ animation: 'slide_from_right' }}
      />
      <Stack.Screen
        name="RecentInstantMatches"
        component={RecentInstantMatchesScreen}
        options={{ animation: 'slide_from_bottom' }}
      />
      <Stack.Screen
        name="LiveMatchDetail"
        component={LiveMatchDetailScreen}
        options={{ animation: 'slide_from_right' }}
      />
      <Stack.Screen
        name="Checkout"
        component={CheckoutScreen}
        options={{ animation: 'slide_from_bottom' }}
      />
      <Stack.Screen
        name="BookingSuccess"
        component={BookingSuccessScreen}
        options={{ animation: 'fade' }}
      />
      <Stack.Screen
        name="MyBookings"
        component={MyBookingsScreen}
        options={{ animation: 'slide_from_right' }}
      />
      <Stack.Screen
        name="GroundDetail"
        component={GroundDetailScreen}
        options={{ animation: 'slide_from_right' }}
      />
    </Stack.Navigator>
  );
};

export default OnboardingNavigator;
