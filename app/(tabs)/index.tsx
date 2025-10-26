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
import { useRouter } from "expo-router";

const index = () => {
  const router = useRouter();
  
  
  const { colors, statusBarStyle } = useThemeStore();
  const {
    players,
    setPlayers,
    updateData,
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
        match:[],
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

  

  const clearSelection = () => {
    const updatedPlayers = players.map((p) => ({ ...p, isSelected: false }));
    setPlayers(updatedPlayers);
    updateData();
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
          <AddPlayer
            inputPlayer={inputPlayer}
            setInputPlayer={setInputPlayer}
            setShowAdd={setShowAdd}
            onAdd={handleAdd}
          />
          <Search input={input} setInput={setInput} />
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

export default index;
