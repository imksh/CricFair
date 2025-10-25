import { View, Text } from "react-native";
import React from "react";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import  useThemeStore  from "../../store/themeStore.ts";

const TabLayout = () => {
const {colors} = useThemeStore();
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopWidth: 1,
          borderTopColor: colors.border,
          height: 70,
          paddingTop: 10,
          paddingBottom: 10,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
        },
        headerShown:false
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => <Ionicons name="home-outline" size={size} color={color}/>,
        }}
        
      />
      <Tabs.Screen
        name="predict"
        options={{
          title: "Predict",
          tabBarIcon: ({ color, size }) => <Ionicons name="tennisball-outline" size={size} color={color}/>,
        }}
        
      />
        <Tabs.Screen
          name="score"
          options={{
            title: "Score",
            tabBarIcon: ({ color, size }) => <Ionicons name="add"  size={size} color={color} style={{transform:[{scale:1.5}]}}/>,
          }}
        />
      <Tabs.Screen
        name="dashboard"
        options={{
          title: "Dashboard",
          tabBarIcon: ({ color, size }) => <Ionicons name="apps-outline"  size={size} color={color}/>,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color, size }) => <Ionicons name="settings"  size={size} color={color}/>,
        }}
      />
    </Tabs>
  );
};

export default TabLayout;
