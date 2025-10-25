import { View, StatusBar, ScrollView, Platform } from "react-native";
import { useState, useEffect } from "react";
import { LinearGradient } from "expo-linear-gradient";
import ScoringHeader from "../../components/ScoringHeader";
import useThemeStore from "../../store/themeStore";
import Info from '../../components/Info';
import Scoring from "../../components/Scoring"
import Scorecard from '../../components/Scorecard';
import Balls from '../../components/Balls';

export default function ScoringScreen() {
  const { colors, statusBarStyle } = useThemeStore();
  const [screen, setScreen] = useState("scoring");
  return (
    <LinearGradient colors={colors.gradients.background} style={{ flex: 1 }}>
      <StatusBar
        barStyle={statusBarStyle}
        backgroundColor={Platform.OS === "android" ? colors.bg : undefined}
        animated
      />
      <ScoringHeader screen={screen} setScreen={setScreen} />

      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        {screen === "scoring" && <Scoring />}
        {screen === "scorecard" && <Scorecard />}
        {screen === "info" && <Info />}
        {screen === "balls" && <Balls />}
      </ScrollView>
    </LinearGradient>
  );
}
