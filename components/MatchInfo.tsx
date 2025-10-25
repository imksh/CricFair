import { View, Text } from "react-native";
import {useEffect} from "react";
import { useScoreStore } from "../store/scoreStore";
import useThemeStore from "../store/themeStore";
import { Heading,Mid } from './Typography';

export default function MatchInfo({match}) {
  const {
    team1,
    team2,
    venue,
    tossWon,
    opt,
    inning,
    totalOvers,
    totalWickets,
  } = useScoreStore();
  const { colors } = useThemeStore();
  
  return (
    <View className="w-[94%]  mx-auto">
      <View className="flex-row justify-around my-8">
        <Heading >{match.team1.name}</Heading>
        <Heading>V/S</Heading>
        <Heading>{match.team2.name}</Heading>
      </View>
      <Mid>Playning: {parseInt(match.totalWickets)+1}</Mid>
      <Mid>Overs: {match.totalOvers}</Mid>
      <Mid>Venue: {match.venue}</Mid>
      <Mid>Toss won by: {match.tossWon}</Mid>
      <Mid>Decided to: {match.tossWon===match.opt?"Bat":"Field"}</Mid>
    </View>
  );
}
