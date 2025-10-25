import { View, Text,TouchableOpacity,ScrollView } from "react-native";
import { useState } from "react";
import { useLocalSearchParams } from "expo-router";
import useThemeStore from '../../store/themeStore';
import { Ionicons } from '@expo/vector-icons';
import { Heading, Mid,Body } from "../../components/Typography";
import MatchScorecard from '../../components/MatchScorecard';
import MatchInfo from '../../components/MatchInfo';
import { useRouter } from "expo-router";

export default function MatchShow() {
  const { colors } = useThemeStore();
  const { matchData } = useLocalSearchParams();
  const match = JSON.parse(matchData);
  const [screen, setScreen] = useState("scorecard");
  const team1 = match.team1;
  const team2 = match.team2;
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
        <Heading className="ml-8">
          {team1.name} V/S {team2.name}
        </Heading>
      </View>
      <View className="flex-row justify-center mt-4">
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
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        {screen === "scorecard" && <MatchScorecard match={match} />}
        {screen === "info" && <MatchInfo match={match} />}
        {/* {screen === "balls" && <Balls />} */}
      </ScrollView>
    </View>
  );
}
