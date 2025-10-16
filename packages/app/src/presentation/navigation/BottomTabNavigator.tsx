import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Feather } from '@react-native-vector-icons/feather';

import HomeScreen from '../screens/home/HomeScreen';
import CalendarScreen from '../screens/calendar/CalendarScreen';
import LibraryScreen from '../screens/library/LibraryScreen';
import MyPageScreen from '../screens/settings/MyPageScreen';

// 바텀 탭 네비게이터 타입 정의
type BottomTabParamList = {
  Home: undefined;
  Calendar: undefined;
  Library: undefined;
  MyPage: undefined;
};

const Tab = createBottomTabNavigator<BottomTabParamList>();

function BottomTabNavigator() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={'dark-content'} />
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={{
            headerShown: false,
            tabBarStyle: {
              backgroundColor: isDarkMode ? '#000000' : '#ffffff',
            },
            tabBarActiveTintColor: isDarkMode ? '#007AFF' : '#007AFF',
            tabBarInactiveTintColor: isDarkMode ? '#ffffff' : '#8e8e93',
          }}
        >
          <Tab.Screen
            name="Home"
            component={HomeScreen}
            options={{
              tabBarLabel: 'Home',
              tabBarIcon: ({ color, size }) => (
                <Feather name="home" color={color} size={size} />
              ),
            }}
          />
          <Tab.Screen
            name="Calendar"
            component={CalendarScreen}
            options={{
              tabBarLabel: 'Calendar',
              tabBarIcon: ({ color, size }) => (
                <Feather name="calendar" color={color} size={size} />
              ),
            }}
          />
          <Tab.Screen
            name="Library"
            component={LibraryScreen}
            options={{
              tabBarLabel: 'Library',
              tabBarIcon: ({ color, size }) => (
                <Feather name="book" color={color} size={size} />
              ),
            }}
          />
          <Tab.Screen
            name="MyPage"
            component={MyPageScreen}
            options={{
              tabBarLabel: 'My Page',
              tabBarIcon: ({ color, size }) => (
                <Feather name="user" color={color} size={size} />
              ),
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default BottomTabNavigator;
