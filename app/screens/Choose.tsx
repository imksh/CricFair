import {
  View,
  Text,
  ScrollView,
  StatusBar,
  Platform,
  TouchableOpacity,
  ToastAndroid,
} from "react-native";
import { useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import useThemeStore from "../../store/themeStore";
import { LinearGradient } from "expo-linear-gradient";
import ScreenHeader from "../../components/ScreenHeader";
import Search from "../../components/Search";
import useLocalStore from "../../store/localStore";
import { Heading, Caption, Mid } from "../../components/Typography";
import { useScoreStore } from "../../store/scoreStore";

export default function Choose() {
  const [input, setInput] = useState("");
  const { players } = useLocalStore();
  const { player, isNew } = useLocalSearchParams();
  const { setBatsman1, setBatsman2, setBowler, team1, team2, inning ,bowler} =
    useScoreStore();
  const { colors, statusBarStyle } = useThemeStore();
  const router = useRouter();
  const team = inning === 1 ? team1 : team2;
  const selectPlayer = (id, name) => {
    
    if (player === "batsman1") {
      setBatsman1(id, name);
    } else if (player === "batsman2") {
      setBatsman2(id, name);
    } else if (player === "bowler") {
      if(bowler.id===id){
        ToastAndroid.show("Choose other bowler", ToastAndroid.SHORT);
        return;
      }
      setBowler(id, name);
    }
    router.back();
  };
  return (
    <LinearGradient colors={colors.gradients.background} style={{ flex: 1 }}>
      <StatusBar
        barStyle={statusBarStyle}
        backgroundColor={Platform.OS === "android" ? colors.bg : undefined}
        animated
      />
      <ScreenHeader
        name={player === "bowler" ? "Select Bowler" : "Select Batsman"}
      />

      <Search input={input} setInput={setInput} />
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="w-[92%] mx-auto">
          {players
            .filter((i) => {
              const matchesSearch = i.name
                .toLowerCase()
                .includes(input.trim().toLowerCase());

              if (player === "batsman1" || player === "batsman2") {
                const existingBatsmanIds = (team.batsmanList || []).map(
                  (p) => p.id
                );
                return matchesSearch && !existingBatsmanIds.includes(i.id);
              }

              return matchesSearch;
            })
            .map((item, indx) => (
              <LinearGradient
                key={indx}
                colors={colors.gradients.surface}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                className="my-2 py-8 px-8"
                style={bowler?.id===item.id?{borderColor:colors.primary,borderWidth:1}:{
                  borderRadius: 20,
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.1,
                  shadowRadius: 8,
                  elevation: 1,
                }}
              >
                <TouchableOpacity
                  className="flex-row items-center"
                  onPress={() => selectPlayer(item.id, item.name)}
                  
                >
                  <View className="mr-auto">
                    <Heading>{item.name}</Heading>
                    <Caption>@{item.id}</Caption>
                  </View>
                  <Mid>{item.role}</Mid>
                </TouchableOpacity>
              </LinearGradient>
            ))}
        </View>
      </ScrollView>
    </LinearGradient>
  );
}
