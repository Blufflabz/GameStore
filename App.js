import React from 'react';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { CartProvider } from './src/context/CartContext';
import { StatusBar } from 'expo-status-bar';

import LoginRegisterScreen from './src/screens/LoginRegisterScreen';
import StoreScreen from './src/screens/StoreScreen';
import GameDetailsScreen from './src/screens/GameDetailsScreen';
import CartScreen from './src/screens/CartScreen';
import CheckoutScreen from './src/screens/CheckoutScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <CartProvider>
      <StatusBar hidden={true} />

      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Login"
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: '#121212' },
          }}
        >
          <Stack.Screen name="Login" component={LoginRegisterScreen} />
          <Stack.Screen 
            name="Store" 
            component={StoreScreen}
            options={{ gestureEnabled: false }}
          />
          <Stack.Screen name="GameDetails" component={GameDetailsScreen} />
          <Stack.Screen name="Cart" component={CartScreen} />
          <Stack.Screen name="Checkout" component={CheckoutScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </CartProvider>
  );
}
