import { View, TouchableOpacity } from "react-native";
import { useEffect } from "react";
import useThemeStore from "../store/themeStore";
import { Heading, Mid, Body } from "./Typography";
import { useScoreStore } from "../store/scoreStore";
import { useRouter } from "expo-router";

export default function InningScorecard({ innings }) {
  const { team1, team2 } = useScoreStore();

  const { colors } = useThemeStore();
  const router = useRouter();

  const team = innings === 1 ? team1 : team2;
  const batsmenArray = [...(team?.batsmanList || [])].sort(
    (a, b) => (a.order || 0) - (b.order || 0)
  );

  const bowlersArray = [...(team?.bowlerList || [])];

  const calculateStrikeRate = (runs: number, balls: number) =>
    balls > 0 ? ((runs / balls) * 100).toFixed(2) : "0.00";

  const calculateEconomy = (runs: number, over: number, ball: number) => {
    const totalOvers = over + ball / 6;
    return totalOvers > 0 ? (runs / totalOvers).toFixed(2) : "0.00";
  };

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
    <View>
      {/* Batsman Table */}
      <View className="w-[96%] mx-auto">
        <View className="flex-row mt-4 mb-2 mx-auto">
          {["Batsman", "R", "B", "4s", "6s", "SR"].map((title, idx) => (
            <Mid
              key={idx}
              className={`text-center`}
              style={{
                color: colors.primary,
                width: idx === 0 ? "30%" : "14%",
              }}
            >
              {title}
            </Mid>
          ))}
        </View>

        {batsmenArray.map((item, indx) => (
          <TouchableOpacity
            key={indx}
            className="flex-row mx-auto py-4 border-b"
            style={{
              borderColor: colors.border,
            }}
          >
            <Body className="w-[30%] text-center rounded-2xl">
              {item.name || "-"} <Body style={{color:colors.success}}>{item.isStriker && "*"}</Body>
            </Body>
            <Body className="w-[14%] text-center">{item.runs}</Body>
            <Body className="w-[14%] text-center">{item.balls}</Body>
            <Body className="w-[14%] text-center">{item.four}</Body>
            <Body className="w-[14%] text-center">{item.six}</Body>
            <Body className="w-[14%] text-center">
              {calculateStrikeRate(item.runs, item.balls)}
            </Body>
          </TouchableOpacity>
        ))}

        {/* Extras & Total */}
        <View className="flex-row justify-between my-4 mx-2">
          <View>
            <Mid className="my-1">Extras: {team.extras}</Mid>
            <Mid style={{ color: colors.primary }} className="my-1">
              Total: {team.runs}/{team.wicket}
            </Mid>
          </View>
          <View>
            <Mid className="my-1">Overs: {team.over}.{team.ball}</Mid>
            <Mid className="my-1">Run Rate: {calculateRunRate(team.runs,team.over,team.ball)}</Mid>
          </View>
        </View>
      </View>

      {/* Bowler Table */}
      <View className="w-[96%] mx-auto">
        <View className="flex-row mt-4 mb-2 mx-auto">
          {["Bowler", "O", "M", "R", "W", "Eco"].map((title, idx) => (
            <Mid
              key={idx}
              className="text-center"
              style={{
                color: colors.primary,
                width: idx === 0 ? "30%" : "14%",
              }}
            >
              {title}
            </Mid>
          ))}
        </View>

        {(bowlersArray || []).map((item, indx) => {
          const economy = calculateEconomy(item.run, item.over, item.ball);

          return (
            <TouchableOpacity
              key={indx}
              className="flex-row mx-auto py-2 border-b"
              style={{ borderColor: colors.border }}
            >
              <Body className="w-[30%] text-center">{item.name || "-"}</Body>
              <Body className="w-[14%] text-center">
                {item.over}.{item.ball}
              </Body>
              <Body className="w-[14%] text-center">{item.maiden}</Body>
              <Body className="w-[14%] text-center">{item.run}</Body>
              <Body className="w-[14%] text-center">{item.wicket}</Body>
              <Body className="w-[14%] text-center">{economy}</Body>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}
