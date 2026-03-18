import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import RecruitScreen from '../screens/RecruitScreen';
import RecruitmentDetailScreen from '../screens/RecruitmentDetailScreen';

const Stack = createNativeStackNavigator();

const RecruitNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="RecruitList" component={RecruitScreen} />
    <Stack.Screen name="RecruitmentDetail" component={RecruitmentDetailScreen} />
  </Stack.Navigator>
);

export default RecruitNavigator;
