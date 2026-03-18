import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MatchesMainScreen from '../screens/MatchesMainScreen';
import MatchSetupScreen from '../screens/MatchSetupScreen';
import SelectPlayingXIScreen from '../screens/SelectPlayingXIScreen';
import BattingOrderScreen from '../screens/BattingOrderScreen';

const Stack = createNativeStackNavigator();

const MatchesNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="MatchesList" component={MatchesMainScreen} />
    <Stack.Screen name="MatchSetup" component={MatchSetupScreen} />
    <Stack.Screen name="SelectPlayingXI" component={SelectPlayingXIScreen} />
    <Stack.Screen name="BattingOrder" component={BattingOrderScreen} />
  </Stack.Navigator>
);

export default MatchesNavigator;
