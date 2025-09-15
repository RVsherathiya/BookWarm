import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './HomeScreen';
import ChatGPTScreen from './ChatGPTScreen';
import HistoryScreen from './HistoryScreen';
import IconTestScreen from './IconTestScreen';

export type RootStackParamList = {
  Home: undefined;
  ChatGPT: { mode: string };
  History: { mode: string };
  IconTest: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerShown: false,
          gestureEnabled: true,
          cardStyleInterpolator: ({ current, layouts }) => {
            return {
              cardStyle: {
                transform: [
                  {
                    translateX: current.progress.interpolate({
                      inputRange: [0, 1],
                      outputRange: [layouts.screen.width, 0],
                    }),
                  },
                ],
              },
            };
          },
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="ChatGPT" component={ChatGPTScreen} />
        <Stack.Screen name="History" component={HistoryScreen} />
        <Stack.Screen name="IconTest" component={IconTestScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
