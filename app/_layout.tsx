import { Stack } from "expo-router";
import "./global.css";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import useThemeStore from "../store/themeStore.ts";
import { Provider as PaperProvider } from "react-native-paper";
import useLocalStore from '../store/localStore';

export default function RootLayout() {
  const { loadTheme } = useThemeStore();
  const { loadData } = useLocalStore();
  const [fontsLoaded] = useFonts({
    MontserratBold: require("../assets/fonts/Montserrat-Bold.ttf"),
    MontserratSemiBold: require("../assets/fonts/Montserrat-SemiBold.ttf"),
    MontserratRegular: require("../assets/fonts/Montserrat-Regular.ttf"),
    InterRegular: require("../assets/fonts/Inter-Regular.ttf"),
    InterMedium: require("../assets/fonts/Inter-Medium.ttf"),
  });

  const [ready, setReady] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        await SplashScreen.preventAutoHideAsync(); 
        await loadTheme();
        await loadData();
        setReady(true);
      } catch (err) {
        console.log("Error during app init:", err);
      }
    };
    init();
  }, []);

  useEffect(() => {
    const hideSplash = async () => {
      if (fontsLoaded && ready) {
        await SplashScreen.hideAsync();
      }
    };
    hideSplash();
  }, [fontsLoaded, ready]);

  if (!fontsLoaded || !ready) return null;

  return (
    <PaperProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
      </Stack>
    </PaperProvider>
  );
}