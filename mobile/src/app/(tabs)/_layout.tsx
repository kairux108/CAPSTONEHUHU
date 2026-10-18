import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

import { Colors } from '../../constants/colors';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,

        tabBarActiveTintColor:
          Colors.primary,

        tabBarInactiveTintColor:
          Colors.muted,

        tabBarHideOnKeyboard: true,

        tabBarStyle: {
          position: 'absolute',

          left: 14,
          right: 14,
          bottom: 14,

          height: 66,

          borderRadius: 22,
          borderTopWidth: 0,

          backgroundColor:
            'rgba(255,255,255,0.97)',

          paddingTop: 7,
          paddingBottom: 7,

          shadowColor:
            'rgba(11,110,98,0.18)',

          shadowOffset: {
            width: 0,
            height: 4,
          },

          shadowOpacity: 1,
          shadowRadius: 10,

          elevation: 8,
        },

        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '600',
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',

          tabBarIcon: ({
            color,
            size,
          }) => (
            <Ionicons
              name="home-outline"
              size={size}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="book"
        options={{
          title: 'Book',

          tabBarIcon: ({
            color,
            size,
          }) => (
            <Ionicons
              name="calendar-outline"
              size={size}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="records"
        options={{
          title: 'Records',

          tabBarIcon: ({
            color,
            size,
          }) => (
            <Ionicons
              name="document-text-outline"
              size={size}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="medicine"
        options={{
          title: 'Medicine',

          tabBarIcon: ({
            color,
            size,
          }) => (
            <Ionicons
              name="medkit-outline"
              size={size}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',

          tabBarIcon: ({
            color,
            size,
          }) => (
            <Ionicons
              name="person-outline"
              size={size}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}