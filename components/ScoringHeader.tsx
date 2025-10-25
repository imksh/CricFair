import { View, TouchableOpacity } from "react-native";
import React from "react";
import { Heading, Mid, SubHeading } from "./Typography";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import useThemeStore from "../store/themeStore";

export default function ScoringHeader({ screen, setScreen }) {
  const { colors } = useThemeStore();
  const router = useRouter();
  return (
    <View
      className="pt-16"
      style={{ backgroundColor: colors.bg, elevation: 2 }}
    >
      <View className="flex-row">
        <TouchableOpacity className="ml-4" onPress={() => router.back()}>
          <Ionicons name="arrow-back-outline" color={colors.text} size={30} />
        </TouchableOpacity>
        <Heading className="ml-8">Match Center</Heading>
      </View>
      <View className="flex-row justify-center mt-4">
        <TouchableOpacity className="mx-2" onPress={() => setScreen("scoring")}>
          <Mid
            style={
              screen === "scoring"
                ? {
                    color: colors.primary,
                    borderBottomWidth: 1,
                    borderBottomColor: colors.primary,
                    padding: 5,
                  }
                : { color: colors.text, padding: 5 }
            }
          >
            Scoring
          </Mid>
        </TouchableOpacity>
        <TouchableOpacity
          className="mx-2"
          onPress={() => setScreen("scorecard")}
        >
          <Mid
            style={
              screen === "scorecard"
                ? {
                    color: colors.primary,
                    borderBottomWidth: 1,
                    borderBottomColor: colors.primary,
                    padding: 5,
                  }
                : { color: colors.text, padding: 5 }
            }
          >
            Scorecard
          </Mid>
        </TouchableOpacity>
        <TouchableOpacity className="mx-2" onPress={() => setScreen("balls")}>
          <Mid
            style={
              screen === "balls"
                ? {
                    color: colors.primary,
                    borderBottomWidth: 1,
                    borderBottomColor: colors.primary,
                    padding: 5,
                  }
                : { color: colors.text, padding: 5 }
            }
          >
            Balls
          </Mid>
        </TouchableOpacity>
        <TouchableOpacity className="mx-2" onPress={() => setScreen("info")}>
          <Mid
            style={
              screen === "info"
                ? {
                    color: colors.primary,
                    borderBottomWidth: 1,
                    borderBottomColor: colors.primary,
                    padding: 5,
                  }
                : { color: colors.text, padding: 5 }
            }
          >
            Info
          </Mid>
        </TouchableOpacity>
      </View>
    </View>
  );
}
