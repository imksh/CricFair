import { View, TextInput, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import useThemeStore from "../store/themeStore";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Heading, Mid } from "./Typography";

const AddPlayer = ({ onAdd, inputPlayer, setInputPlayer, setShowAdd }) => {
  const { colors } = useThemeStore();
  return (
    <LinearGradient
      colors={colors.gradients.surface}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      className="my-4 py-8 w-[94%] mx-auto"
      style={{
        borderRadius: 20,
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 4,
        },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
      }}
    >
      <View className="items-center justify-between w-[100%]">
        <Heading className="mb-4">Add New Player</Heading>
        <TextInput
          placeholderTextColor={colors.text}
          style={{
            borderWidth: 1,
            borderColor: colors.border,
            padding: 20,
            fontColor: colors.text,
            borderRadius: 22,
            color: colors.text,
            backgroundColor: colors.bg,
            elevation: 2,
          }}
          placeholder="Name"
          value={inputPlayer}
          onChangeText={(text) =>
            setInputPlayer((prev) => ({ ...prev, name: text }))
          }
          className="w-[80%]"
        />
        <View className="flex-row w-[75%] mt-4">
          <Mid>Role: </Mid>
          <View className="ml-10">
            <TouchableOpacity
              onPress={() =>
                setInputPlayer((prev) => ({ ...prev, role: "Batsman" }))
              }
              className="flex-row mb-2"
            >
              {inputPlayer.role !== "Batsman" ? (
                <Ionicons name="radio-button-off-outline" size={25} />
              ) : (
                <Ionicons
                  name="radio-button-on-outline"
                  size={25}
                  color={colors.text}
                />
              )}
              <Mid className="ml-3">Batsman</Mid>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                setInputPlayer((prev) => ({ ...prev, role: "Bowler" }))
              }
              className="flex-row mb-2"
            >
              {inputPlayer.role !== "Bowler" ? (
                <Ionicons name="radio-button-off-outline" size={25} />
              ) : (
                <Ionicons
                  name="radio-button-on-outline"
                  size={25}
                  color={colors.text}
                />
              )}
              <Mid className="ml-3">Bowler</Mid>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                setInputPlayer((prev) => ({ ...prev, role: "All-Rounder" }))
              }
              className="flex-row"
            >
              {inputPlayer.role !== "All-Rounder" ? (
                <Ionicons name="radio-button-off-outline" size={25} />
              ) : (
                <Ionicons
                  name="radio-button-on-outline"
                  size={25}
                  color={colors.text}
                />
              )}
              <Mid className="ml-3">All Rounder</Mid>
            </TouchableOpacity>
          </View>
        </View>
        <View className="flex-row w-[90%]">
          <TouchableOpacity
            className="mx-auto py-3 px-8 mt-8 rounded-2xl"
            style={{
              backgroundColor: inputPlayer.name.trim()
                ? colors.primary
                : colors.textMuted,
            }}
            disabled={!inputPlayer.name.trim()}
            onPress={onAdd}
          >
            <Mid style={{ color: "#fff" }}>Add</Mid>
          </TouchableOpacity>
          <TouchableOpacity
            className="mx-auto py-3 px-8 mt-8 rounded-2xl"
            style={{
              backgroundColor: colors.textMuted,
            }}
            onPress={()=>setShowAdd(false)}
          >
            <Mid style={{ color: "#fff" }}>Cancle</Mid>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
};

export default AddPlayer;
