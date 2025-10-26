import {
  View,
  Text,
  Animated,
  StatusBar,
  Platform,
  ScrollView,
  TouchableOpacity,
  ToastAndroid,
} from "react-native";
import { useState, useEffect } from "react";
import { LinearGradient } from "expo-linear-gradient";
import HomeHeader from "../../components/HomeHeader";
import useThemeStore from "../../store/themeStore";
import Predict from "../../components/Predict";
import Card from "../../components/Card";
import Search from "../../components/Search";
import { Mid } from "../../components/Typography";
import AddPlayer from "../../components/AddPlayer";
import { save, get, remove } from "../../utils/storage.ts";
import ConfirmationToast from "../../components/ConfirmationToast";
import useLocalStore from "../../store/localStore";
import CustomImage from "../../components/CustomImage";
import { useRouter } from 'expo-router';

const predict = () => {
  const router = useRouter();
  // useEffect(() => {
  //   router.push("screens/ScoringScreen")
  // }, [])
  
  const { colors, statusBarStyle } = useThemeStore();
  const {
    players,
    attendance,
    todayBatsman,
    todayBowlers,
    setPlayers,
    setAttendance,
    setTodayPlayers,
    updateData,
    predict,
    boostBat,
    boostBowl,
  } = useLocalStore();
  const [input, setInput] = useState("");
  const [inputPlayer, setInputPlayer] = useState({
    name: "",
    role: "Batsman",
  });
  const [showAdd, setShowAdd] = useState(false);
  const [showAttendanceConfirm, setShowAttendanceConfirm] = useState(false);
  const [showBowlConfirm, setShowBowlConfirm] = useState(false);
  const [showBatConfirm, setShowBatConfirm] = useState(false);

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
        createdAt: Date.now(),
      };
      const updatedPlayers = [...players, newPlayer];
      setPlayers(updatedPlayers);
      updateData();
      setInputPlayer({ name: "", role: "Batsman" });
      setShowAdd(false);
    } catch (error) {
      console.log("Error saving Player:", error);
      setShowAdd(false);
    }
  };

  const handleUpdate = async (player) => {
    try {
      const updatedPlayer = players.map((item) =>
        item.id === player.id ? { ...item, isSelected: !item.isSelected } : item
      );
      setPlayers(updatedPlayer);
      updateData();
    } catch (error) {
      console.log("Error Updating Player:", error);
    }
  };

  const handleDelete = async (player) => {
    try {
      const updatedPlayers = players.filter((item) => item.id !== player.id);
      setPlayers(updatedPlayers);
      updateData();
    } catch (error) {
      console.log("Error Deleting Player:", error);
    }
  };

  const handleEdit = async (player, newPlayer) => {
    try {
      const updatedPlayers = players.map((item) =>
        item.id === player.id
          ? { ...item, name: newPlayer.name, role: newPlayer.role }
          : item
      );
      setPlayers(updatedPlayers);
      updateData();
    } catch (error) {
      console.log("Error Editing Player:", error);
    }
  };

  const handleAttendance = async () => {
    try {
      const selected = players.filter((item) => item.isSelected);
      const today = new Date().toISOString().split("T")[0];

      // Update attendance
      const updatedAttendance = {
        ...attendance,
        [today]: attendance[today]
          ? [
              ...attendance[today],
              ...selected.filter(
                (p) => !attendance[today].some((ap) => ap.id === p.id)
              ),
            ]
          : [...selected],
      };
      // Update lastMatches for each player
      const updatedPlayers = players.map((p) => {
        const playedToday = selected.some((tp) => tp.id === p.id);
        const lastMatches = [...(p.lastMatches || []), playedToday]; // add today
        const trimmedLastMatches = lastMatches.slice(-10); // keep only last 10

        return {
          ...p,
          lastMatches: trimmedLastMatches,
        };
      });

      // Update state
      setAttendance(updatedAttendance);
      setTodayPlayers(selected);
      setPlayers(updatedPlayers);
      updateData();
      ToastAndroid.show("Attendance Added", ToastAndroid.SHORT);
      clearSelection();
    } catch (error) {
      console.log("Error updating attendance:", error);
    }
  };

  const clearSelection = () => {
    const updatedPlayers = players.map((p) => ({ ...p, isSelected: false }));
    setPlayers(updatedPlayers);
    updateData();
  };

  const batPriority = () => {
    const updatedPlayers = players.map((p) => ({
      ...p,
      didntBat: p.isSelected ? true : p.didntBat, // only mark selected players
    }));
    setPlayers(updatedPlayers);

    boostBat(); // will pick top 4 based on didntBat
    ToastAndroid.show("Batsman added to Priority", ToastAndroid.SHORT);
    updateData();
    clearSelection();
    setShowBatConfirm(false);
  };

  const bowlPriority = () => {
    const updatedPlayers = players.map((p) => ({
      ...p,
      didntBowl: p.isSelected ? true : p.didntBowl, // only mark selected players
    }));
    setPlayers(updatedPlayers);

    boostBowl(); // will pick top 4 based on didntBat
    ToastAndroid.show("Bowler added to Priority", ToastAndroid.SHORT);
    updateData();
    clearSelection();
    setShowBowlConfirm(false);
  };

  const predictData = () => {
    predict();
  };

  return (
    <>
      <LinearGradient colors={colors.gradients.background} style={{ flex: 1 }}>
        <StatusBar
          barStyle={statusBarStyle}
          backgroundColor={Platform.OS === "android" ? colors.bg : undefined}
          animated
        />
        <HomeHeader />
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
          }}
          showsVerticalScrollIndicator={false}
        >
          <Predict
            todayBatsman={todayBatsman}
            todayBowler={todayBowlers}
            predict={predictData}
          />
          {!showAdd ? (
            <View className="flex-row flex-wrap justify-around w-[94%] mx-auto">
              <TouchableOpacity
                className="py-3 mt-8 rounded-2xl w-[40%] items-center"
                style={{ backgroundColor: colors.primary }}
                onPress={() => setShowAdd(true)}
              >
                <Mid style={{ color: "#fff" }}>Add New</Mid>
              </TouchableOpacity>

              <TouchableOpacity
                className="py-3 w-[40%] items-center mt-8 rounded-2xl"
                style={{ backgroundColor: colors.primary }}
                onPress={() => setShowAttendanceConfirm(true)}
              >
                <Mid style={{ color: "#fff" }}>Attendance</Mid>
              </TouchableOpacity>
              <TouchableOpacity
                className="py-3 w-[40%] items-center mt-8 rounded-2xl"
                style={{ backgroundColor: colors.primary }}
                onPress={() => setShowBatConfirm(true)}
              >
                <Mid style={{ color: "#fff" }}>Bat ⚡️</Mid>
              </TouchableOpacity>
              <TouchableOpacity
                className="py-3 w-[40%] items-center mt-8 rounded-2xl"
                style={{ backgroundColor: colors.primary }}
                onPress={() => setShowBowlConfirm(true)}
              >
                <Mid style={{ color: "#fff" }}>Bowl ⚡️</Mid>
              </TouchableOpacity>

              <TouchableOpacity
                className="py-3 w-[40%] items-center mt-8 rounded-2xl"
                style={{ backgroundColor: colors.primary }}
                onPress={clearSelection}
              >
                <Mid style={{ color: "#fff" }}>Clear</Mid>
              </TouchableOpacity>

              <TouchableOpacity
                className=" py-3 w-[40%] items-center mt-8 rounded-2xl"
                style={{ backgroundColor: colors.primary }}
              >
                <Mid style={{ color: "#fff" }}>Sync</Mid>
              </TouchableOpacity>
            </View>
          ) : (
            <AddPlayer
              inputPlayer={inputPlayer}
              setInputPlayer={setInputPlayer}
              setShowAdd={setShowAdd}
              onAdd={handleAdd}
            />
          )}
          <Search input={input} setInput={setInput} onAdd={handleAdd} />
          <View className="w-[92%] mx-auto">
            {players
              .filter((i) =>
                i.name.toLowerCase().includes(input.trim().toLowerCase())
              )
              .map((item, indx) => (
                <Card
                  key={indx}
                  item={item}
                  onUpdate={handleUpdate}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
          </View>
          <CustomImage source={require("@/assets/images/cricket/img1.png")} />
        </ScrollView>
      </LinearGradient>
      {showAttendanceConfirm && (
        <ConfirmationToast
          name="Update Attendence"
          message="This wil update the attendence. This action cannot be undone."
          fun={handleAttendance}
          setShow={setShowAttendanceConfirm}
        />
      )}
      {showBatConfirm && (
        <ConfirmationToast
          name="Boost Batsman Priority"
          message="This wil update Upcomming Batsman order. This action cannot be undone."
          fun={batPriority}
          setShow={setShowBatConfirm}
        />
      )}
      {showBowlConfirm && (
        <ConfirmationToast
          name="Boost Bowler Priority"
          message="This wil update Upcomming Bowler order. This action cannot be undone."
          fun={bowlPriority}
          setShow={setShowBowlConfirm}
        />
      )}
    </>
  );
};

export default predict;
