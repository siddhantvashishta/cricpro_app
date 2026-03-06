import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, SafeAreaView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
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
  MatchDetailsScreen
} from './src/screens';
import { RootTabNavigator } from './src/navigation/RootTabNavigator';

const Stack = createNativeStackNavigator();
import { colors } from './src/theme';

export default function App() {
  const [isAppReady, setIsAppReady] = useState(false);

  const handleSplashAnimationComplete = () => {
    setIsAppReady(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      {isAppReady ? (
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
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
          </Stack.Navigator>
        </NavigationContainer>
      ) : (
        <SplashScreen onAnimationComplete={handleSplashAnimationComplete} />
      )}
      <StatusBar style="light" backgroundColor={colors.primary} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
});
