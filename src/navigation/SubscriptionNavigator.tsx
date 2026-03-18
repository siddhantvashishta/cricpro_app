import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SubscriptionScreen from '../screens/SubscriptionScreen';
import CheckoutScreen from '../screens/CheckoutScreen';
import SubscriptionSuccessScreen from '../screens/SubscriptionSuccessScreen';

const Stack = createNativeStackNavigator();

const SubscriptionNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false, presentation: 'modal' }}>
    <Stack.Screen name="SubscriptionPlans" component={SubscriptionScreen} />
    <Stack.Screen name="Checkout" component={CheckoutScreen} options={{ presentation: 'card' }} />
    <Stack.Screen name="SubscriptionSuccess" component={SubscriptionSuccessScreen} />
  </Stack.Navigator>
);

export default SubscriptionNavigator;
