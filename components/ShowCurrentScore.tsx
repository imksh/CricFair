import { View, Text } from "react-native";
import { useState, useEffect } from "react";
import { useScoreStore } from "../store/scoreStore";
import useThemeStore from "../store/themeStore";
import { Mid, Heading, Regular, Body } from "./Typography";

export default function ShowCurrentScore() {
  const { colors } = useThemeStore();
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
  }, [team1.runs, team2.runs, ball, batsman1, batsman2, bowler]);

  useEffect(() => {
    setPlayer1(batsman1);
    setPlayer2(batsman2);
  }, [batsman1, batsman2]);
  return (
    <View className="border pt-2 my-4 w-[100%]" style={{borderColor:colors.border}}>
      <View
        style={{ borderBottomWidth: 1, borderBottomColor: colors.border }}
        className="pb-2 w-[100%] mx-auto px-4 "
      >
        <View className="flex-row my-2 mx-auto">
          <Mid className="w-[30%] text-center">Batsman</Mid>
          <Mid className="w-[13%] text-center">R</Mid>
          <Mid className="w-[13%] text-center">B</Mid>
          <Mid className="w-[13%] text-center">4s</Mid>
          <Mid className="w-[13%] text-center">6s</Mid>
          <Mid className="w-[18%] text-center">SR</Mid>
        </View>
        <View className="flex-row mx-auto mb-1">
          <View className="w-[30%] text-center">
            <Body
              className="text-center rounded-2xl"
              style={
                player1.isStriker ? { backgroundColor: colors.primary } : {}
              }
            >
              {player1.name || "-"}
            </Body>
          </View>
          <Body className="w-[13%] text-center">{player1.runs}</Body>
          <Body className="w-[13%] text-center">{player1.balls}</Body>
          <Body className="w-[13%] text-center">{player1.four}</Body>
          <Body className="w-[13%] text-center">{player1.six}</Body>
          <Body className="w-[18%] text-center">{player1sr ?? 0}</Body>
        </View>
        <View className="flex-row mx-auto ">
          <View
            className="w-[30%]"
          >
            <Body
              className="text-center rounded-2xl"
              style={
                player2.isStriker ? { backgroundColor: colors.primary } : {}
              }
            >
              {player2.name || "-"}
            </Body>
          </View>
          <Body className="w-[13%] text-center">{player2.runs}</Body>
          <Body className="w-[13%] text-center">{player2.balls}</Body>
          <Body className="w-[13%] text-center">{player2.four}</Body>
          <Body className="w-[13%] text-center">{player2.six}</Body>
          <Body className="w-[18%] text-center">{player2sr ?? 0}</Body>
        </View>
      </View>

      <View
        style={{ borderBottomWidth: 1, borderBottomColor: colors.border }}
        className="pb-2  w-[94%] mx-auto px-4"
      >
        <View className="flex-row my-2 mx-auto">
          <Mid className="w-[30%] text-center">Bowler</Mid>
          <Mid className="w-[13%] text-center">O</Mid>
          <Mid className="w-[13%] text-center">M</Mid>
          <Mid className="w-[13%] text-center">R</Mid>
          <Mid className="w-[13%] text-center">W</Mid>
          <Mid className="w-[18%] text-center">Eco</Mid>
        </View>

        <View className="flex-row mx-auto">
          <View className="w-[30%]">
            <Body className="text-center">{bowler.name || "-"}</Body>
          </View>
          <Body className="w-[13%] text-center">
            {bowler.over}.{bowler.ball}
          </Body>
          <Body className="w-[13%] text-center">{bowler.maiden}</Body>
          <Body className="w-[13%] text-center">{bowler.run}</Body>
          <Body className="w-[13%] text-center">{bowler.wicket}</Body>
          <Body className="w-[18%] text-center">{eco || 0}</Body>
        </View>
      </View>
    </View>
  );
}
