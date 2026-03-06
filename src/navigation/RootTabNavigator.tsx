import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HomeScreen, LookingScreen, MyCricketScreen, CommunityScreen, StoreScreen, ProfileScreen } from '../screens';
import { BottomTabBar, TabItem } from '../components';

const Tab = createBottomTabNavigator();

export const RootTabNavigator = () => {
    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
            }}
            tabBar={(props) => {
                // Map React Navigation state to our custom activeTab prop
                const routeName = props.state.routes[props.state.index].name;

                // We map Route Name to Tab ID (e.g. 'Home' -> 'home')
                const activeTabId = routeName.toLowerCase().replace(' ', '');

                return (
                    <BottomTabBar
                        activeTab={activeTabId}
                        onTabPress={(id) => {
                            // Find the correct route name based on ID
                            const routeMap: Record<string, string> = {
                                'home': 'Home',
                                'looking': 'Looking',
                                'mycricket': 'My Cricket',
                                'community': 'Community',
                                'store': 'Store',
                                'profile': 'Profile'
                            };

                            const targetRoute = routeMap[id];
                            if (targetRoute) {
                                props.navigation.navigate(targetRoute);
                            }
                        }}
                    />
                );
            }}
        >
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen name="Looking" component={LookingScreen} />
            <Tab.Screen name="My Cricket" component={MyCricketScreen} />
            <Tab.Screen name="Community" component={CommunityScreen} />
            <Tab.Screen name="Store" component={StoreScreen} />
            <Tab.Screen name="Profile" component={ProfileScreen} />
        </Tab.Navigator>
    );
};
