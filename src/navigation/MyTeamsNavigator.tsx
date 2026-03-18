import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MyTeamsScreen from '../screens/MyTeamsScreen';
import CreateTeamScreen from '../screens/CreateTeamScreen';
import TeamDetailScreen from '../screens/TeamDetailScreen';
import TeamSettingsScreen from '../screens/TeamSettingsScreen';

const Stack = createNativeStackNavigator();

const MyTeamsNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="MyTeamsList" component={MyTeamsScreen} />
    <Stack.Screen name="CreateTeam" component={CreateTeamScreen} />
    <Stack.Screen name="TeamDetail" component={TeamDetailScreen} />
    <Stack.Screen name="TeamSettings" component={TeamSettingsScreen} />
  </Stack.Navigator>
);

export default MyTeamsNavigator;
