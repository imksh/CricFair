import { View, TextInput,TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import useThemeStore from "../store/themeStore";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";

const Search = ({onAdd, input, setInput}) => {
  const { colors } = useThemeStore();
  return (
    <View className="flex-row items-center justify-between w-[85%] mx-auto mt-8 pb-4">
      <TextInput
      placeholderTextColor={colors.text}
        style={{
          borderWidth: 1,
          borderColor: colors.border,
          padding: 20,
          fontColor:colors.text,
          borderRadius: 22,
          color: colors.text,
          backgroundColor: colors.bg,
          elevation:2,
        }}
        placeholder="Search"
        value={input}
        onChangeText={setInput}
        className="w-[80%]"
        
      />
      <TouchableOpacity
        className="p-2 rounded-2xl ml-4"
        style={{ backgroundColor: input?.trim() ? colors.primary : colors.border }}
        disabled={!input?.trim()}
        onPress={onAdd}
      >
        <Ionicons name="search-outline" size={25} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

export default Search;
