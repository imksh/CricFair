import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ToastAndroid,
} from "react-native";
import React from "react";
import useThemeStore from "../store/themeStore";
import { useScoreStore } from "../store/scoreStore";
import { Mid, Heading, Body } from "./Typography";
import { LinearGradient } from "expo-linear-gradient";
import { api } from '../utils/axios';

export default function ShowLive() {
  const { colors } = useThemeStore();
  const {liveData, setLiveData} = useScoreStore()

  const handleLive = async (name) => {
    try {
      const updatedData = { ...liveData, showLive: name };
      setLiveData(updatedData);
      await api.post("/overlay/add-score", updatedData);
    } catch (error) {
      console.error("Error in adding score to overlay:", error);
      ToastAndroid.show(
        `Error: ${error.message || "Failed to update overlay"}`,
        ToastAndroid.SHORT
      );
    }
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <Heading className="mx-auto mt-4">Show in Live Streaming</Heading>
      <View className="flex-row flex-wrap justify-around p-2">
        <TouchableOpacity
          onPress={() => handleLive("logo")}
          className="py-3 mt-4 mb-4 rounded-2xl px-4 items-center mx-auto"
          style={{ backgroundColor: colors.primary }}
        >
          <Mid style={{ textAlign: "center", color: "#fff" }}>Logo</Mid>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => handleLive("jsMobile")}
          className="py-3 mt-4 mb-4 rounded-2xl px-4 items-center mx-auto"
          style={{ backgroundColor: colors.primary }}
        >
          <Mid style={{ textAlign: "center", color: "#fff" }}>JS Mobile</Mid>
        </TouchableOpacity>
      </View>

      <View className="w-[92%] my-8 justify-center items-center mx-auto">
        <Heading className="mx-auto" style={{ color: colors.primary }}>
          Details
        </Heading>
        <LinearGradient
          colors={colors.gradients.surface}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="my-2 px-8 py-4 mx-auto w-full"
          style={{
            borderRadius: 20,
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 4,
            },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 1,
          }}
        >
          <Mid className="mx-auto mb-2">Logo</Mid>
          <Body classname="text-wrap">Official logo of Youth Cicket Club</Body>
          <Body classname="text-wrap">Contact : 7295038835</Body>
        </LinearGradient>

        <LinearGradient
          colors={colors.gradients.surface}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="my-2 px-8 py-4 mx-auto w-full"
          style={{
            borderRadius: 20,
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 4,
            },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 1,
          }}
        >
          <Mid className="mx-auto mb-2">JS Mobile</Mid>
          <Body classname="text-wrap">
            JS Mobile Junction belongs to Pawan Singh.
          </Body>
          <Body classname="text-wrap">Contact : 8678887520</Body>
        </LinearGradient>
      </View>
    </ScrollView>
  );
}
