import { View, Text } from "react-native";
import {useEffect} from "react";
import { useScoreStore } from "../store/scoreStore";
import useThemeStore from "../store/themeStore";
import { Heading,Mid } from './Typography';

export default function Info() {
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
        <Heading >{team1.name}</Heading>
        <Heading>V/S</Heading>
        <Heading>{team2.name}</Heading>
      </View>
      <Mid>Playning: {parseInt(totalWickets)+1}</Mid>
      <Mid>Overs: {totalOvers}</Mid>
      <Mid>Venue: {venue}</Mid>
      <Mid>Toss won by: {tossWon}</Mid>
      <Mid>Decided to: {tossWon===opt?"Bat":"Field"}</Mid>
      <Mid>Inning: {inning}</Mid>
    </View>
  );
}
