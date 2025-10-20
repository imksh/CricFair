import { View, Text } from 'react-native'
import React from 'react'
import { Heading } from './Typography';
import useThemeStore from "../store/themeStore";

export default function HomeHeader() {
    const { colors } = useThemeStore();
  return (
    <View className="pt-16 pb-2 pl-4" style={{backgroundColor:colors.bg,elevation:2}}>
      <Heading style={{fontSize:28,color:colors.primary}}>CricFair</Heading>
    </View>
  )
}