import { View, Text, TouchableOpacity, TextInput } from "react-native";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import {
  Heading,
  SubHeading,
  Caption,
  Body,
  Mid,
} from "../components/Typography";
import useThemeStore from "../store/themeStore";
import { LinearGradient } from "expo-linear-gradient";
import { Portal } from "react-native-paper";
import ConfirmationToast from "./ConfirmationToast";

const Card = ({item,onUpdate, onDelete, onEdit }) => {
  const [input, setInput] = useState({
    name:item.name,
    role:item.role,
  });
  const [show, setShow] = useState(false);
  const [showBtn, setShowBtn] = useState(false);
  const { colors } = useThemeStore();
  const cancel = () => {
    setInput({name:item.name,role:item.role,});
    setShowBtn(false);
  };
  return (
    <>
      <LinearGradient
        colors={colors.gradients.surface}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="my-2 py-8 px-4"
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
        <View className="flex-row ">
          <TouchableOpacity
            className="w-[20%] inputs-center"
            onPress={() => onUpdate(item)}
          >
            {!item.isSelected ? (
              <Ionicons name="radio-button-off-outline" size={35} />
            ) : (
              <Ionicons name="checkmark-circle" size={35} color={colors.success} />
            )}
          </TouchableOpacity>
          <View className=" w-[75%]">
            <View className="">
              {!showBtn ? (
                <>
                  <Heading
                    style={item.isSelected ?{ color: colors.success }:{color: colors.text}}
                  >
                    {item.name}
                  </Heading>
                  <Body>{item.role}</Body>
                </>
              ) : (
                <>
                  <TextInput
                    style={{
                      borderWidth: 1,
                      borderColor: colors.border,
                      paddingVertical: 15,
                      paddingHorizontal: 20,
                      borderRadius: 22,
                      color: colors.text,
                      backgroundColor: colors.bg,
                      elevation: 2,
                    }}
                    value={input.name}
                    onChangeText={(text)=>setInput((prev)=>({...prev,name:text}))}
                    className="w-[90%]"
                  />
                  <View className="flex-row w-[75%] mt-4">
                    <Mid>Role: </Mid>
                    <View className="ml-10">
                      <TouchableOpacity
                        onPress={() =>
                          setInput((prev) => ({
                            ...prev,
                            role: "Batsman",
                          }))
                        }
                        className="flex-row mb-2"
                      >
                        {input.role !== "Batsman" ? (
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
                          setInput((prev) => ({
                            ...prev,
                            role: "Bowler",
                          }))
                        }
                        className="flex-row mb-2"
                      >
                        {input.role !== "Bowler" ? (
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
                          setInput((prev) => ({
                            ...prev,
                            role: "All-Rounder",
                          }))
                        }
                        className="flex-row"
                      >
                        {input.role !== "All-Rounder" ? (
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
                </>
              )}
            </View>

            {!showBtn ? (
              <View className="flex-row mt-4">
                <TouchableOpacity onPress={() => setShowBtn(!showBtn)}>
                  <Ionicons
                    name="pencil"
                    size={20}
                    color="#fff"
                    className="bg-orange-500 p-3 rounded-full"
                  />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setShow(!show)}>
                  <Ionicons
                    name="trash-outline"
                    size={20}
                    color="#fff"
                    className="bg-red-700 p-3 rounded-full ml-8"
                  />
                </TouchableOpacity>
              </View>
            ) : (
              <View className="flex-row mt-4">
                <TouchableOpacity
                  onPress={() => {
                    onEdit(item, input);
                    setShowBtn(!showBtn);
                  }}
                >
                  <Ionicons
                    name="send-outline"
                    size={20}
                    color="#fff"
                    className="bg-blue-600 p-3 rounded-full ml-8"
                  />
                </TouchableOpacity>
                <TouchableOpacity onPress={cancel}>
                  <Ionicons
                    name="close-circle-outline"
                    size={20}
                    color="#fff"
                    className=" p-3 rounded-full ml-8"
                    style={{ backgroundColor: colors.textMuted }}
                  />
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </LinearGradient>
      <Portal>
        {show && (
          <ConfirmationToast
            name={"Delete"}
            fun={() => onDelete(item)}
            message={
              "This wil delete the input permanently. This action cannot be undone. "
            }
            setShow={setShow}
          />
        )}
      </Portal>
    </>
  );
};

export default Card;
