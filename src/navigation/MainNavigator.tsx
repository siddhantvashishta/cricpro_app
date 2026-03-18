import * as React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View } from 'react-native';
import HomeScreen from '../screens/HomeScreen';
import CommunityNavigator from './CommunityNavigator';
import ProfileNavigator from './ProfileNavigator';
import MatchesNavigator from './MatchesNavigator';
import ShopScreen from '../screens/ShopScreen';
import RankingsScreen from '../screens/RankingsScreen';
import { Colors } from '../constants/Colors';
import { 
  Home, 
  LayoutDashboard, 
  Swords, 
  MessageSquare, 
  User, 
  PlayCircle, 
  Trophy, 
  Medal, 
  Zap, 
  Users2, 
  UserCircle,
  Plus,
  ShoppingBag,
  Circle
} from 'lucide-react-native';
import { useProStore } from '../store/useProStore';

const Tab = createBottomTabNavigator();

const MainNavigator = ({ navigation }: any) => {
  const { isPro } = useProStore();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: Colors.maroon,
        tabBarInactiveTintColor: Colors.textSecondary,
        tabBarStyle: {
          backgroundColor: Colors.white,
          borderTopWidth: 1,
          borderTopColor: '#F0F0F0',
          height: 65,
          paddingBottom: 10,
          paddingTop: 8,
          elevation: 10,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.05,
          shadowRadius: 10,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '700',
        },
        tabBarIcon: ({ color, size, focused }) => {
          let IconComponent;
          let iconName = route.name;

          if (iconName === 'Home') IconComponent = LayoutDashboard;
          else if (iconName === 'Matches') IconComponent = Swords;
          else if (iconName === 'Community') IconComponent = MessageSquare;
          else if (iconName === 'Shop') IconComponent = ShoppingBag;
          else if (iconName === 'More') IconComponent = UserCircle;
          else IconComponent = LayoutDashboard;

          return (
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
              <IconComponent 
                color={color} 
                size={focused ? 24 : 22} 
                strokeWidth={focused ? 2.5 : 2}
                fill={focused && iconName !== 'Community' ? `${color}20` : 'none'} 
              />
              {focused && (
                <View 
                  style={{ 
                    width: 4, 
                    height: 4, 
                    borderRadius: 2, 
                    backgroundColor: Colors.maroon, 
                    marginTop: 4 
                  }} 
                />
              )}
            </View>
          );
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Matches" component={MatchesNavigator} />
      <Tab.Screen name="Community" component={CommunityNavigator} />
      <Tab.Screen name="Shop" component={ShopScreen} />
      <Tab.Screen name="More" component={ProfileNavigator} />
    </Tab.Navigator>
  );
};

export default MainNavigator;
