import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TournamentListScreen from '../screens/TournamentListScreen';
import CreateTournamentScreen from '../screens/CreateTournamentScreen';
import TournamentDetailScreen from '../screens/TournamentDetailScreen';

const Stack = createNativeStackNavigator();

const TournamentsNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="TournamentList" component={TournamentListScreen} />
    <Stack.Screen name="CreateTournament" component={CreateTournamentScreen} />
    <Stack.Screen name="TournamentDetail" component={TournamentDetailScreen} />
  </Stack.Navigator>
);

export default TournamentsNavigator;
