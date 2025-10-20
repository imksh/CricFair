import { View, Text, TouchableOpacity } from "react-native";
import { useState, useEffect } from "react";
import { Heading, SubHeading, Mid } from "./Typography";
import { LinearGradient } from "expo-linear-gradient";
import useThemeStore from "../store/themeStore";
import useLocalStore from "../store/localStore";

export default function Predict({ predict, todayBatsman, todayBowler }) {
  const { undoPredict, date, setDate,updateData } = useLocalStore();
  const [show, setShow] = useState(false);
  const todayDate = new Date();
  const { colors } = useThemeStore();

  useEffect(() => {
  const todayDateString = new Date().toISOString().split("T")[0]; 
  if (date !== todayDateString) {
    setShow(false); 
    setDate(todayDateString);
    updateData();
  }else{
    setShow(true); 
  }
}, []);
  

  const undo = async () => {
    undoPredict();
    setShow(false);
  };

  const predictBtn = async () => {
    await predict();
    setShow(true);
  };
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
        elevation: 1,
      }}
    >
      <View className="flex justify-center items-center">
        <Heading className="mx-auto">Date: {todayDate.toLocaleDateString()}</Heading>
        {show ? (
          <>
            <View className="flex-row mt-8">
              <View className="w-[50%] items-center">
                <SubHeading className="mb-4">Batsman</SubHeading>
                <View>
                  {(todayBatsman || []).map((i) => (
                    <Mid key={i.id}>{i.name}</Mid>
                  ))}
                </View>
              </View>
              <View className="w-[50%] items-center">
                <SubHeading className="mb-4">Bowlers</SubHeading>
                <View>
                  {(todayBowler || []).map((i) => (
                    <Mid key={i.id}>{i.name}</Mid>
                  ))}
                </View>
              </View>
            </View>
            <View className="flex-row justify-between w-[100%]">
              {/* <TouchableOpacity
                className="mx-auto py-3 px-8 mt-8 rounded-2xl"
                style={{ backgroundColor: colors.primary }}
                onPress={undo}
              >
                <Mid style={{ color: "#fff" }}>Update</Mid>
              </TouchableOpacity> */}
              <TouchableOpacity
                className="mx-auto py-3 px-8 mt-8 rounded-2xl"
                style={{ backgroundColor: colors.primary }}
                onPress={undo}
              >
                <Mid style={{ color: "#fff" }}>Undo</Mid>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <View>
            <TouchableOpacity
              className="mx-auto py-3 px-8 mt-8 rounded-2xl"
              style={{ backgroundColor: colors.primary }}
              onPress={predictBtn}
            >
              <Mid style={{ color: "#fff" }}>Predict</Mid>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </LinearGradient>
  );
}
