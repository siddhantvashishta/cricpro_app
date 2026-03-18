import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MoreScreen from '../screens/MoreScreen';
import PlayerProfileScreen from '../screens/PlayerProfileScreen';
import EditProfileScreen from '../screens/EditProfileScreen';
import SettingsScreen from '../screens/SettingsScreen';
import StoreScreen from '../screens/StoreScreen';
import AssociationsScreen from '../screens/AssociationsScreen';
import ClubsScreen from '../screens/ClubsScreen';
import ContactSupportScreen from '../screens/ContactSupportScreen';
import LoginScreen from '../screens/LoginScreen';
import LegalScreen from '../screens/LegalScreen';

const Stack = createNativeStackNavigator();

const ProfileNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="More">
    <Stack.Screen name="More" component={MoreScreen} />
    <Stack.Screen name="PlayerProfile" component={PlayerProfileScreen} />
    <Stack.Screen name="EditProfile" component={EditProfileScreen} />
    <Stack.Screen name="Settings" component={SettingsScreen} />
    <Stack.Screen name="Store" component={StoreScreen} />
    <Stack.Screen name="Associations" component={AssociationsScreen} />
    <Stack.Screen name="Clubs" component={ClubsScreen} />
    <Stack.Screen name="ContactSupport" component={ContactSupportScreen} />
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Legal" component={LegalScreen} />
  </Stack.Navigator>
);

export default ProfileNavigator;
