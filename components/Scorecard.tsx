import { View, TouchableOpacity } from "react-native";
import { useState } from "react";
import { Heading, Mid } from "./Typography";
import { useScoreStore } from "../store/scoreStore";
import useThemeStore from "../store/themeStore";
import InningScorecard from './InningScorecard';

export default function Scorecard() {
  const { inning, team1, team2 } = useScoreStore();
  const { colors } = useThemeStore();
  const [show, setShow] = useState(inning === 1 ? "team1" : "team2");
  return (
    <View className="mt-2">
      <View className="flex-row" style={{backgroundColor:"gray"}} >
        <TouchableOpacity
          style={
            show === "team1"
              ? {
                  backgroundColor: colors.primary,
                  borderTopRightRadius: 30,
                  borderBottomRightRadius: 30,
                }
              : { }
          }
          className="w-[50%] py-3"
          onPress={()=>setShow("team1")}
        >
          <Mid className="text-center">{team1.name}</Mid>
        </TouchableOpacity>
        <TouchableOpacity
          style={
            show === "team2"
              ? {
                  backgroundColor: colors.primary,
                  borderTopLeftRadius: 30,
                  borderBottomLeftRadius: 30,
                }
              : { }
          }
          className="w-[50%] py-3"
          onPress={()=>setShow("team2")}
        >
          <Mid className="text-center">{team2.name}</Mid>
        </TouchableOpacity>
      </View>
      <View>
        {
          show==="team1"?<InningScorecard innings={1}/> : <InningScorecard innings={2}/>
        }
      </View>
    </View>
  );
}
