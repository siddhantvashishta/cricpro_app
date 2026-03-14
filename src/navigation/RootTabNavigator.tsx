import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HomeScreen, LookingScreen, MyCricketScreen, CommunityScreen, ProfileScreen } from '../screens';
import { StoreNavigator } from '../navigation/StoreNavigator';
import { useAppStore } from '../store/useAppStore';
import { BottomTabBar, TabItem, AppHeader } from '../components';
import { View, StyleSheet } from 'react-native';

const Tab = createBottomTabNavigator();

export const RootTabNavigator = () => {
    const { setActiveTab, headerConfig } = useAppStore();

    return (
        <View style={styles.container}>
            <AppHeader
                title={headerConfig.title}
                rightIcons={headerConfig.rightIcons}
                showBack={headerConfig.showBack}
            />
            <Tab.Navigator
            backBehavior="none"
            screenOptions={{
                headerShown: false,
            }}
            screenListeners={{
                state: (e: any) => {
                    const state = e.data.state;
                    if (state) {
                        const routeName = state.routes[state.index].name;
                        const activeTabId = routeName.toLowerCase().replace(' ', '');
                        setActiveTab(activeTabId);
                    }
                },
            }}
            tabBar={(props) => {
                // Map React Navigation state to our custom activeTab prop
                const routeName = props.state.routes[props.state.index].name;

                // We map Route Name to Tab ID (e.g. 'Home' -> 'home')
                const activeTabId = routeName.toLowerCase().replace(' ', '');

                return (
                    <BottomTabBar
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
            <Tab.Screen name="Store" component={StoreNavigator} />
            <Tab.Screen name="Profile" component={ProfileScreen} />
        </Tab.Navigator>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
});
