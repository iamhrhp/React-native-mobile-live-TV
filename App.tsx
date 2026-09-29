import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeScreen } from './src/screens/HomeScreen';
import { PlayerScreen } from './src/screens/PlayerScreen';
import { LoginScreen } from './src/screens/LoginScreen';
import { CategoryScreen } from './src/screens/CategoryScreen';
import { View, StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';
import { fetchIptvData } from './src/api/iptv';

const Stack = createNativeStackNavigator();

export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    // Ensure splash is visible for at least 2 seconds
    const timerPromise = new Promise<void>(resolve => setTimeout(resolve, 2000));
    // Simultaneously start the API call (ignoring errors here since useChannels handles them)
    const apiPromise = fetchIptvData().catch(() => {});
    
    Promise.all([timerPromise, apiPromise]).then(() => {
      setShowSplash(false);
    });
  }, []);

  if (showSplash) {
    return (
      <View style={styles.splashContainer}>
        <LottieView
          source={require('./src/assets/splash.json')}
          autoPlay
          loop={true}
          renderMode="SOFTWARE"
          style={styles.lottie}
        />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Login"
        screenOptions={{
          headerStyle: { backgroundColor: '#0B1319' },
          headerTintColor: '#FFFFFF',
          headerTitleStyle: { fontWeight: 'bold' },
          headerShadowVisible: false,
          headerBackTitle: '',
        }}
      >
        <Stack.Screen 
          name="Login" 
          component={LoginScreen} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="Player" 
          component={PlayerScreen} 
          options={{ headerShown: false, animation: 'none' }}
        />
        <Stack.Screen 
          name="Category" 
          component={CategoryScreen} 
          options={({ route }: any) => ({ title: route.params.title })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  lottie: {
    width: 300,
    height: 300,
  }
});
