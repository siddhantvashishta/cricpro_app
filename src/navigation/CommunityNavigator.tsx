import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CommunityFeedScreen from '../screens/CommunityFeedScreen';
import CreatePostScreen from '../screens/CreatePostScreen';
import PostDetailScreen from '../screens/PostDetailScreen';
import WeeklyChallengeScreen from '../screens/WeeklyChallengeScreen';
import ExploreScreen from '../screens/ExploreScreen';
import SocialRequestsScreen from '../screens/SocialRequestsScreen';
import NotificationScreen from '../screens/NotificationScreen';

const Stack = createNativeStackNavigator();

const CommunityNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Feed" component={CommunityFeedScreen} />
    <Stack.Screen name="PostDetail" component={PostDetailScreen} />
    <Stack.Screen name="Explore" component={ExploreScreen} />
    <Stack.Screen name="Requests" component={SocialRequestsScreen} />
    <Stack.Screen name="Notifications" component={NotificationScreen} />
    <Stack.Screen
      name="CreatePost"
      component={CreatePostScreen}
      options={{ presentation: 'modal' }}
    />
    <Stack.Screen name="WeeklyChallenge" component={WeeklyChallengeScreen} />
  </Stack.Navigator>
);

export default CommunityNavigator;
