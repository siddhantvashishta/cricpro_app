import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LiveStreamingMainScreen from '../screens/LiveStreamingMainScreen';
import LivePlayerScreen from '../screens/LivePlayerScreen';
import LiveBroadcasterScreen from '../screens/LiveBroadcasterScreen';

const Stack = createNativeStackNavigator();

const LiveNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="LiveMain" component={LiveStreamingMainScreen} />
      <Stack.Screen name="LivePlayer" component={LivePlayerScreen} />
      <Stack.Screen name="LiveBroadcaster" component={LiveBroadcasterScreen} />
    </Stack.Navigator>
  );
};

export default LiveNavigator;
