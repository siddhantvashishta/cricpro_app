import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, StyleSheet, SafeAreaView, BackHandler, ToastAndroid, Platform } from 'react-native';
import { NavigationContainer, createNavigationContainerRef } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  SplashScreen,
  DirectMessagesScreen,
  SearchScreen,
  CreateTeamScreen,
  StartTournamentScreen,
  ScheduleMatchScreen,
  WritePostScreen,
  InstantScoringScreen,
  RenewProScreen,
  PlayerProfileScreen,
  MatchDetailsScreen,
  SchedulesScreen,
  ResultsScreen,
  FantasyTipsScreen,
  FantasyTipDetailsScreen,
  NewsDetailScreen,
  ChatListScreen,
  ChatDetailScreen,
  NewChatScreen,
  ProPrivilegesScreen,
  GoLiveScreen,
  PerformanceScreen,
  LeaderboardsScreen,
  AwardsScreen,
  ScorecardEntryScreen,
  AssociationsScreen,
  ClubsScreen,
  ContactScreen,
  MessageRequestsScreen,
  ProClubScreen,
  ProPaymentScreen
} from './src/screens';
import { RootTabNavigator } from './src/navigation/RootTabNavigator';
import { useAppStore } from './src/store/useAppStore';

const Stack = createNativeStackNavigator();
const navigationRef = createNavigationContainerRef();
import { LoginScreen, RegisterScreen, CreateProfileScreen } from './src/screens';
import { colors } from './src/theme';

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const isAuthenticated = useAppStore((state) => state.isAuthenticated);
  const lastBackPressed = React.useRef(0);

  React.useEffect(() => {
    const onBackPress = () => {
      // If we are on a screen that can go back, let navigation handle it
      if (navigationRef.isReady() && navigationRef.canGoBack()) {
        return false;
      }

      // If we are at the root, handle double tap to exit
      const now = Date.now();
      if (lastBackPressed.current && now - lastBackPressed.current < 2000) {
        BackHandler.exitApp();
        return true;
      }

      lastBackPressed.current = now;
      if (Platform.OS === 'android') {
        ToastAndroid.show('Press back again to exit', ToastAndroid.SHORT);
      }
      return true;
    };

    const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);

    return () => subscription.remove();
  }, []);

  return (
    <View style={styles.appContainer}>
      <SafeAreaView style={styles.container}>
        <NavigationContainer ref={navigationRef}>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            {!isAuthenticated ? (
              <>
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="Register" component={RegisterScreen} />
                <Stack.Screen name="CreateProfile" component={CreateProfileScreen} />
              </>
            ) : (
              <>
                <Stack.Screen name="MainTabs" component={RootTabNavigator} />
                <Stack.Screen name="DirectMessages" component={DirectMessagesScreen} />
                <Stack.Screen name="Search" component={SearchScreen} />

                {/* Creation CTA Screens */}
                <Stack.Screen name="CreateTeam" component={CreateTeamScreen} />
                <Stack.Screen name="StartTournament" component={StartTournamentScreen} />
                <Stack.Screen name="ScheduleMatch" component={ScheduleMatchScreen} />
                <Stack.Screen name="WritePost" component={WritePostScreen} />
                <Stack.Screen name="InstantScoring" component={InstantScoringScreen} />
                <Stack.Screen name="RenewPro" component={RenewProScreen} />
                <Stack.Screen name="PlayerProfile" component={PlayerProfileScreen} />
                <Stack.Screen name="MatchDetails" component={MatchDetailsScreen} />
                <Stack.Screen name="Schedules" component={SchedulesScreen} />
                <Stack.Screen name="Results" component={ResultsScreen} />
                <Stack.Screen name="FantasyTips" component={FantasyTipsScreen} />
                <Stack.Screen name="FantasyTipDetails" component={FantasyTipDetailsScreen} />
                <Stack.Screen name="ChatList" component={ChatListScreen} />
                <Stack.Screen name="ChatDetail" component={ChatDetailScreen} />
                <Stack.Screen name="NewsDetail" component={NewsDetailScreen} />
                <Stack.Screen name="NewChat" component={NewChatScreen} />

                {/* More Section Screens */}
                <Stack.Screen name="ProPrivileges" component={ProPrivilegesScreen} />
                <Stack.Screen name="GoLive" component={GoLiveScreen} />
                <Stack.Screen name="Performance" component={PerformanceScreen} />
                <Stack.Screen name="Leaderboards" component={LeaderboardsScreen} />
                <Stack.Screen name="Awards" component={AwardsScreen} />
                <Stack.Screen name="ScorecardEntry" component={ScorecardEntryScreen} />
                <Stack.Screen name="Associations" component={AssociationsScreen} />
                <Stack.Screen name="Clubs" component={ClubsScreen} />
                <Stack.Screen name="Contact" component={ContactScreen} />
                <Stack.Screen name="MessageRequests" component={MessageRequestsScreen} />
                <Stack.Screen name="ProClub" component={ProClubScreen} />
                <Stack.Screen name="ProPayment" component={ProPaymentScreen} />
              </>
            )}
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaView>

      {showSplash && (
        <View style={StyleSheet.absoluteFill}>
          <SplashScreen onAnimationComplete={() => setShowSplash(false)} />
        </View>
      )}

      <StatusBar style="light" backgroundColor={showSplash ? '#020912' : colors.primary} translucent />
    </View>
  );
}

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    backgroundColor: '#020912',
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
});
