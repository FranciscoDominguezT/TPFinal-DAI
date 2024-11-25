import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './screens/LoginScreen';
import EventScreen from './screens/EventScreen';
import EventDetailScreen from './screens/EventDetailScreen';
import EventDetailScreenII from './screens/EventDetailScreenII';
import ProfileScreen from './screens/ProfileScreen';
import CategoriesScreen from './screens/CategoriesScreen';
import EventsByCategoryScreen from './screens/EventsByCategoryScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Events" component={EventScreen} options={{ headerShown: false }} />
        <Stack.Screen name="EventDetail" component={EventDetailScreen} options={{ headerShown: false }} />
        <Stack.Screen name="EventDetailII" component={EventDetailScreenII} options={{ headerShown: false }} />
        <Stack.Screen name="Profile" component={ProfileScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Categories" component={CategoriesScreen} options={{ headerShown: false }} />
        <Stack.Screen name="EventsByCategoryScreen" component={EventsByCategoryScreen} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
