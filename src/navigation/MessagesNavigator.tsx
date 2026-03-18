import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MessagesListScreen from '../screens/MessagesListScreen';
import ChatDetailScreen from '../screens/ChatDetailScreen';

const Stack = createNativeStackNavigator();

const MessagesNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MessagesList" component={MessagesListScreen} />
      <Stack.Screen name="ChatDetail" component={ChatDetailScreen} />
    </Stack.Navigator>
  );
};

export default MessagesNavigator;
