import {
  View,
  Text,
  ScrollView,
  StatusBar,
  Platform,
  TouchableOpacity,
} from "react-native";
import { useState, useEffect } from "react";
import { save, get } from "../../utils/storage.ts";
import useThemeStore from "../../store/themeStore";
import { LinearGradient } from "expo-linear-gradient";
import HomeHeader from "../../components/HomeHeader";
import { Mid, Heading, Regular } from "../../components/Typography";
import useLocalStore from "../../store/localStore";
import CustomImage from "../../components/CustomImage";
import { useRouter } from "expo-router";
import Toss from '../../components/Toss';

export default function Dashboard() {
  const router = useRouter();
  const { colors, statusBarStyle } = useThemeStore();

  const {
    players,
    attendance,
    batsmanQueue,
    bowlerQueue,
    lastdayPlayers,
    todayPlayers,
    todayBatsman,
    todayBowlers,
    setPlayers,
    setAttendance,
    setBatsmanQueue,
    setBowlerQueue,
    setLastdayPlayers,
    setTodayPlayers,
    setTodayBatsman,
    setTodayBowlers,
    updateData,
  } = useLocalStore();

  const [yesterday, setYesterday] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    return d;
  });

  useEffect(() => {
    const temp = new Date();
    temp.setDate(yesterday.getDate() - 1);
    setYesterday(temp);
  }, []);

  return (
    <LinearGradient colors={colors.gradients.background} style={{ flex: 1 }}>
      <StatusBar
        barStyle={statusBarStyle}
        backgroundColor={Platform.OS === "android" ? colors.bg : undefined}
        animated
      />
      <HomeHeader />

      <ScrollView
        contentContainerStyle={{ flexGrow: 1, padding: 16 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Toss */}
        <Toss />
        {/* Players List */}
        <LinearGradient
          colors={colors.gradients.surface}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="my-4 p-4 w-[100%] mx-auto"
          style={{
            borderRadius: 20,
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 4,
            },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 1,
          }}
        >
          <Heading className="mx-auto mb-4">All Players</Heading>
          <View className="flex-row justify-between">
            <View>
              <Mid>Batsman</Mid>
              {players?.length === 0 ? (
                <Regular className="mt-2">Empty List</Regular>
              ) : (
                players
                  .filter((p) => p.role === "Batsman")
                  .map((p) => <Regular key={p.id}>{p.name}</Regular>)
              )}
            </View>
            <View>
              <Mid>Bowler</Mid>
              {players?.length === 0 ? (
                <Regular className="mt-2">Empty List</Regular>
              ) : (
                players
                  .filter((p) => p.role === "Bowler")
                  .map((p) => <Regular key={p.id}>{p.name}</Regular>)
              )}
            </View>
            <View>
              <Mid>All-Rounder</Mid>
              {players?.length === 0 ? (
                <Regular className="mt-2">Empty List</Regular>
              ) : (
                players
                  .filter((p) => p.role === "All-Rounder")
                  .map((p) => <Regular key={p.id}>{p.name}</Regular>)
              )}
            </View>
          </View>
        </LinearGradient>

        {/* Today’s Queues */}

        <LinearGradient
          colors={colors.gradients.surface}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="my-4 p-4 w-[100%] mx-auto"
          style={{
            borderRadius: 20,
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 4,
            },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 1,
          }}
        >
          <Heading className="mb-4 mx-auto ">Upcomming</Heading>
          <View className="flex-row justify-around">
            <View>
              <Mid className="mb-1">Batsman</Mid>
              {batsmanQueue?.length === 0 ? (
                <Regular className="mt-2">Empty List</Regular>
              ) : (
                batsmanQueue?.map((p) => <Regular key={p.id}>{p.name}</Regular>)
              )}
            </View>
            <View>
              <Mid className="mb-1">Bowler</Mid>
              {bowlerQueue?.length === 0 ? (
                <Regular className="mt-2">Empty List</Regular>
              ) : (
                bowlerQueue?.map((p) => <Regular key={p.id}>{p.name}</Regular>)
              )}
            </View>
          </View>
        </LinearGradient>

        {/* Today’s Selected Players */}
        <LinearGradient
          colors={colors.gradients.surface}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="my-4 p-4 w-[100%] mx-auto"
          style={{
            borderRadius: 20,
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 4,
            },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 1,
          }}
        >
          <Heading className="mb-4 mx-auto ">Selected</Heading>
          <View className="flex-row justify-around">
            <View>
              <Mid className="mb-1">Batsman</Mid>
              {todayBatsman?.length === 0 ? (
                <Regular className="mt-2">Empty List</Regular>
              ) : (
                todayBatsman.map((p) => <Regular key={p.id}>{p.name}</Regular>)
              )}
            </View>
            <View>
              <Mid className="mb-1">Bowler</Mid>
              {todayBowlers?.length === 0 ? (
                <Regular className="mt-2">Empty List</Regular>
              ) : (
                todayBowlers.map((p) => <Regular key={p.id}>{p.name}</Regular>)
              )}
            </View>
          </View>
        </LinearGradient>

        <LinearGradient
          colors={colors.gradients.surface}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="my-4 p-4 w-[100%] mx-auto"
          style={{
            borderRadius: 20,
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 4,
            },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 1,
          }}
        >
          <Heading className="mb-4 mx-auto ">Attendance</Heading>
          <View className="flex-row justify-around">
            <View>
              <Mid className="mb-1">Today</Mid>
              {(attendance[new Date().toISOString().split("T")[0]]?.length ||
                0) === 0 ? (
                <Regular className="mt-2">Empty List</Regular>
              ) : (
                attendance[new Date().toISOString().split("T")[0]].map((p,indx) => (
                  <Regular key={indx}>{p.name}</Regular>
                ))
              )}
            </View>
            <View>
              <Mid className="mb-1">Yesterday</Mid>
              {(attendance[yesterday.toISOString().split("T")[0]]?.length ||
                0) === 0 ? (
                <Regular className="mt-2">Empty List</Regular>
              ) : (
                attendance[yesterday.toISOString().split("T")[0]].map((p,indx) => (
                  <Regular key={indx}>{p.name}</Regular>
                ))
              )}
            </View>
          </View>
        </LinearGradient>

        {/* Dummy Predict Button */}
        <TouchableOpacity
          className="py-3 px-6 rounded-2xl mt-4 mx-auto"
          style={{ backgroundColor: colors.primary }}
          onPress={() => router.push("/(tabs)")}
        >
          <Mid style={{ color: "#fff" }}>Predict Today</Mid>
        </TouchableOpacity>
        <CustomImage source={require("@/assets/images/cricket/img2.png")} />
      </ScrollView>
    </LinearGradient>
  );
}
