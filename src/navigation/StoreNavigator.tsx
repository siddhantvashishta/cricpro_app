import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
    StoreHomeScreen,
    ProductListScreen,
    ProductDetailScreen,
    CartScreen,
    CheckoutScreen,
    OrderSuccessScreen,
    WishlistScreen,
    TrackOrderScreen
} from '../screens';

export type StoreStackParamList = {
    StoreHome: undefined;
    ProductList: { categoryId?: string; brand?: string; search?: string };
    ProductDetail: { productId: string };
    Cart: undefined;
    Checkout: undefined;
    OrderSuccess: { orderId: string };
    Wishlist: undefined;
    TrackOrder: { orderId: string };
};

const Stack = createNativeStackNavigator<StoreStackParamList>();

export const StoreNavigator = () => {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
                animation: 'slide_from_right'
            }}
        >
            <Stack.Screen name="StoreHome" component={StoreHomeScreen} />
            <Stack.Screen name="ProductList" component={ProductListScreen} />
            <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
            <Stack.Screen name="Cart" component={CartScreen} />
            <Stack.Screen name="Checkout" component={CheckoutScreen} />
            <Stack.Screen name="OrderSuccess" component={OrderSuccessScreen} />
            <Stack.Screen name="Wishlist" component={WishlistScreen} />
            <Stack.Screen name="TrackOrder" component={TrackOrderScreen} />
        </Stack.Navigator>
    );
};
