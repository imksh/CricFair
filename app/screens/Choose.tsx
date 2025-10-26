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
import { Portal } from "react-native-paper";
import AddPlayer from "../../components/AddPlayer";

export default function Choose() {
  const [input, setInput] = useState("");
  const { players, updateData ,setPlayers} = useLocalStore();
  const { player } = useLocalSearchParams();
  const [back, setBack] = useState(false);
  const [name, setName] = useState("");
  const [inputPlayer, setInputPlayer] = useState({
    name: "",
    role: "Batsman",
  });
  const [showAdd, setShowAdd] = useState(false);
  const { setBatsman1, setBatsman2, setBowler, team1, team2, inning, bowler } =
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
      if (bowler.id === id) {
        ToastAndroid.show("Choose other bowler", ToastAndroid.SHORT);
        return;
      }
      setBowler(id, name);
    }
    setBack("true");
    setName(name);
  };

  const handleAdd = async () => {
    if (!inputPlayer.name.trim()) return;
    try {
      const newPlayer = {
        id: Date.now().toString(),
        name: inputPlayer.name.trim(),
        role: inputPlayer.role,
        isSelected: false,
        didntBat: false,
        didntBowl: false,
        lastMatches: [],
        last2: false,
        battingQueuePosition: null,
        bowlingQueuePosition: null,
        match: [],
        createdAt: Date.now(),
      };
      const updatedPlayers = [...players, newPlayer];
      setPlayers(updatedPlayers);
      updateData();
      setInputPlayer({ name: "", role: "Batsman" });
      setInputPlayer({
        name: "",
        role: "Batsman",
      });
      setShowAdd(false);
    } catch (error) {
      console.log("Error saving Player:", error);
      setShowAdd(false);
    }
  };
  return (
    <>
      <LinearGradient colors={colors.gradients.background} style={{ flex: 1 }}>
        <StatusBar
          barStyle={statusBarStyle}
          backgroundColor={Platform.OS === "android" ? colors.bg : undefined}
          animated
        />
        <ScreenHeader
          name={player === "bowler" ? "Select Bowler" : "Select Batsman"}
        />
        <View className="w-100%">
          <TouchableOpacity
            onPress={() => setShowAdd(true)}
            className="py-4 px-4 w-[100%] mx-auto"
            style={{ backgroundColor: colors.primary }}
          >
            <Mid
              style={{ textAlign: "center", color: "#fff" }}
              className="text-center"
            >
              Add new Player
            </Mid>
          </TouchableOpacity>
        </View>
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
                  style={
                    bowler?.id === item.id
                      ? { borderColor: colors.primary, borderWidth: 1 }
                      : {
                          borderRadius: 20,
                          shadowColor: "#000",
                          shadowOffset: { width: 0, height: 4 },
                          shadowOpacity: 0.1,
                          shadowRadius: 8,
                          elevation: 1,
                        }
                  }
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
      {back && (
        <Portal>
          <View className="absolute top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%] w-[90%]">
            <LinearGradient
              colors={colors.gradients.surface}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              className="my-4 p-8 "
              style={{
                borderRadius: 20,
                shadowColor: "#000",
                shadowOffset: {
                  width: 0,
                  height: 4,
                },
                shadowOpacity: 0.1,
                shadowRadius: 8,
                elevation: 8,
              }}
            >
              <Heading className="mx-auto">Selected the player</Heading>
              <Mid className="mx-auto my-2">{name}</Mid>
              <TouchableOpacity
                onPress={() => router.back()}
                className="py-3 mt-4 mb-4 rounded-2xl px-4  items-center mx-auto"
                style={{ backgroundColor: colors.primary }}
              >
                <Mid style={{ textAlign: "center", color: "#fff" }}>
                  Continue
                </Mid>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setBack(false)}
                className="py-3 mt-4 mb-4 rounded-2xl px-4 items-center mx-auto"
                style={{ backgroundColor: colors.primary }}
              >
                <Mid style={{ textAlign: "center", color: "#fff" }}>Change</Mid>
              </TouchableOpacity>
            </LinearGradient>
          </View>
        </Portal>
      )}
      {showAdd && (
        <Portal>
          <View className="absolute top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%] w-[90%]">
            <AddPlayer
              onAdd={handleAdd}
              inputPlayer={inputPlayer}
              setShowAdd={setShowAdd}
              setInputPlayer={setInputPlayer}
            />
          </View>
        </Portal>
      )}
    </>
  );
}
