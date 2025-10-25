import { View, Text, TouchableOpacity, ScrollView,ToastAndroid } from "react-native";
import { useState, useEffect } from "react";
import useThemeStore from "../store/themeStore";
import { useScoreStore } from "../store/scoreStore";
import { Heading, Mid, Body, Regular } from "./Typography";
import Keyboard from "./Keyboard";
import { useRouter } from "expo-router";

export default function Scoring() {
  const router = useRouter();
  const {
    team1,
    team2,
    totalRuns,
    wicket,
    tossWon,
    opt,
    inning,
    totalOvers,
    totalWickets,
    extras,
    getRunRate,
    over,
    ball,
    batsman1,
    batsman2,
    getStrikeRate,
    getEconomy,
    bowler,
    addBowler,
    addBatsman,
    setIsStriker,
  } = useScoreStore();
  const { colors } = useThemeStore();
  const [eco, setEco] = useState(0);
  const [player1sr, setPlayer1sr] = useState(0);
  const [player2sr, setPlayer2sr] = useState(0);
  const [player1, setPlayer1] = useState(batsman1);
  const [player2, setPlayer2] = useState(batsman2);
  const team = inning === 1 ? team1 : team2;

  useEffect(() => {
    setPlayer2sr(getStrikeRate(batsman2));
    setPlayer1sr(getStrikeRate(batsman1));
    setEco(getEconomy(bowler));
  }, [team1.runs, team2.runs, ball, batsman1, batsman2]);

  
  useEffect(() => {
    setPlayer1(batsman1);
    setPlayer2(batsman2);
  }, [batsman1, batsman2]);

  useEffect(() => {
    const currentTeam = inning === 1 ? team1 : team2;

    if (batsman1?.id && !currentTeam.batsmanList[batsman1.id]) {
      addBatsman(batsman1);
    }
    if (batsman2?.id && !currentTeam.batsmanList[batsman2.id]) {
      addBatsman(batsman2);
    }
    const existingBowler = currentTeam.bowlerList?.find(
      (b) => b.id === bowler.id
    );

    if (bowler?.id && !existingBowler) {
      addBowler(bowler);
    }
  }, [batsman1?.id, batsman2?.id, bowler?.id, inning]);

  const calculateRunRate = (runs, overs, balls) => {
  // Convert total balls bowled
  const totalBalls = overs * 6 + balls;

  // Avoid division by zero
  if (totalBalls === 0) return 0;

  // Convert back to overs (as decimal)
  const oversDecimal = totalBalls / 6;

  // Calculate run rate
  const runRate = runs / oversDecimal;

  // Return rounded to 2 decimals
  return parseFloat(runRate.toFixed(2));
};

  return (
    <View className="flex-1">
      <View
        className="justify-center items-center w-[94%] mx-auto "
        style={{ borderBottomWidth: 1, borderBottomColor: colors.border }}
      >
        <Heading className="mt-2">
          {inning === 1 ? team1.name : team2.name}
        </Heading>
        <Mid>{inning === 1 ? "1st Innings" : "2nd Innings"}</Mid>
        <View className="flex-row my-2">
          <Heading style={{ color: colors.primary, fontSize: 40 }}>
            {inning === 1 ? team1.runs : team2.runs}
          </Heading>
          <Heading style={{ color: colors.primary, fontSize: 40 }}>-</Heading>
          <Heading style={{ color: colors.primary, fontSize: 40 }}>
            {inning === 1 ? team1.wicket : team2.wicket}
          </Heading>
          {/* <Body className="mt-8">({totalWickets+1})</Body> */}
        </View>
      </View>
      <View
        className="flex-row justify-around py-4 w-[94%] mx-auto"
        style={{ borderBottomWidth: 1, borderBottomColor: colors.border }}
      >
        <Mid>Extras: {inning === 1 ? team1.extras : team2.extras}</Mid>
        <Mid>
          Overs: {inning === 1 ? team1.over : team2.over}.
          {inning === 1 ? team1.ball : team2.ball}/{totalOvers}
        </Mid>
        <Mid>crr: {calculateRunRate(team.runs,team.over,team.ball)}</Mid>
      </View>
      <View
        style={{ borderBottomWidth: 1, borderBottomColor: colors.border }}
        className="pb-2 w-[94%] mx-auto px-4"
      >
        <View className="flex-row my-2 mx-auto">
          <Mid className="w-[28%] text-center">Batsman</Mid>
          <Mid className="w-[14%] text-center">R</Mid>
          <Mid className="w-[14%] text-center">B</Mid>
          <Mid className="w-[14%] text-center">4s</Mid>
          <Mid className="w-[14%] text-center">6s</Mid>
          <Mid className="w-[16%] text-center">SR</Mid>
        </View>
        <TouchableOpacity
          className="flex-row mx-auto mb-1"
          onPress={() =>
            router.push({
              pathname: "screens/Choose",
              params: {
                player: "batsman1",
              },
            })
          }
          disabled={player1.name!==""}
        >
          <TouchableOpacity
            className="w-[28%] text-center"
            onPress={() => setIsStriker(batsman1)}
          >
            <Body
              className="text-center rounded-2xl"
              style={
                player1.isStriker ? { backgroundColor: colors.primary } : {}
              }
            >
              {player1.name || "-"}
            </Body>
          </TouchableOpacity>
          <Body className="w-[14%] text-center">{player1.runs}</Body>
          <Body className="w-[14%] text-center">{player1.balls}</Body>
          <Body className="w-[14%] text-center">{player1.four}</Body>
          <Body className="w-[14%] text-center">{player1.six}</Body>
          <Body className="w-[16%] text-center">{player1sr ?? 0}</Body>
        </TouchableOpacity>
        <TouchableOpacity
          className="flex-row mx-auto"
          onPress={() =>
            router.push({
              pathname: "screens/Choose",
              params: {
                player: "batsman2",
              },
            })
          }
          disabled={player2.name!==""}
        >
          <TouchableOpacity
            className="w-[28%]"
            onPress={() => setIsStriker(batsman2)}
          >
            <Body
              className="text-center rounded-2xl"
              style={
                player2.isStriker ? { backgroundColor: colors.primary } : {}
              }
            >
              {player2.name || "-"}
            </Body>
          </TouchableOpacity>
          <Body className="w-[14%] text-center">{player2.runs}</Body>
          <Body className="w-[14%] text-center">{player2.balls}</Body>
          <Body className="w-[14%] text-center">{player2.four}</Body>
          <Body className="w-[14%] text-center">{player2.six}</Body>
          <Body className="w-[16%] text-center">{player2sr ?? 0}</Body>
        </TouchableOpacity>
      </View>

      <View
        style={{ borderBottomWidth: 1, borderBottomColor: colors.border }}
        className="pb-2  w-[94%] mx-auto px-4"
      >
        <View className="flex-row my-2 mx-auto">
          <Mid className="w-[30%] text-center">Bowler</Mid>
          <Mid className="w-[14%] text-center">O</Mid>
          <Mid className="w-[14%] text-center">M</Mid>
          <Mid className="w-[14%] text-center">R</Mid>
          <Mid className="w-[14%] text-center">W</Mid>
          <Mid className="w-[14%] text-center">Eco</Mid>
        </View>

        <TouchableOpacity
          className="flex-row mx-auto"
          onPress={() =>
            router.push({
              pathname: "screens/Choose",
              params: {
                player: "bowler",
              },
            })
          }
          disabled={bowler?.name!=="" }
        >
          <TouchableOpacity className="w-[30%]">
            <Body className="text-center">{bowler?.name || "-"}</Body>
          </TouchableOpacity>
          <Body className="w-[14%] text-center">
            {bowler?.over}.{bowler?.ball}
          </Body>
          <Body className="w-[14%] text-center">{bowler?.maiden}</Body>
          <Body className="w-[14%] text-center">{bowler?.run}</Body>
          <Body className="w-[14%] text-center">{bowler?.wicket}</Body>
          <Body className="w-[14%] text-center">{eco || 0}</Body>
        </TouchableOpacity>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="w-[94%] mx-auto py-2 flex-row"
      >
        {team.recentBalls.map((b, index) => {
          let display = "";

          switch (b.type) {
            case "bowled":
            case "stumped":
            case "runout":
              display = "W"; // just wicket
              break;

            case "runoutWithRun":
              display = `${b.run}W`; // like 1W or 2W
              break;

            case "legbye":
              display = `${b.run}L`; // leg bye
              break;

            case "bye":
              display = `${b.run}B`; // bye
              break;

            default:
              display = b.run.toString(); // normal runs
              break;
          }

          return (
            <Mid
              key={index}
              className="rounded-full w-10 aspect-square mx-1 text-center"
              style={{
                backgroundColor: colors.textMuted,
                textAlignVertical: "center",
                lineHeight: 40,
              }}
            >
              {display}
            </Mid>
          );
        })}
      </ScrollView>
      <Keyboard />
    </View>
  );
}
