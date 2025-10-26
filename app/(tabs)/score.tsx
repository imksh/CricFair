import {
  View,
  Text,
  StatusBar,
  ScrollView,
  Platform,
  TextInput,
  TouchableOpacity,
  keyboard,
} from "react-native";
import { useState, useEffect } from "react";
import { LinearGradient } from "expo-linear-gradient";
import HomeHeader from "../../components/HomeHeader";
import { useRouter } from "expo-router";
import useThemeStore from "../../store/themeStore";
import { Mid, Heading, Regular, Body } from "../../components/Typography";
import Toss from "../../components/Toss";
import { Ionicons } from "@expo/vector-icons";
import { useScoreStore } from "../../store/scoreStore";
import ShowCurrentScore from "../../components/ShowCurrentScore";
import { getData, save } from "../../utils/storage.ts";
import { Portal } from "react-native-paper";
import ConfirmationToast from "../../components/ConfirmationToast";

export default function score() {
  const [showBtn, setShowBtn] = useState(false);
  const [del, setDel] = useState("");
  const router = useRouter();
  const { colors, statusBarStyle } = useThemeStore();
  const [input, setInput] = useState("");
  const {
    setInitialData,
    isMatchStarted,
    resetScore,
    team1,
    team2,
    loadLiveMatchData,
  } = useScoreStore();
  const [matches, setMatches] = useState([]);
  const [match, setMatch] = useState({
    team1: "",
    team2: "",
    overs: "",
    wickets: "",
    venue: "Alamnagar",
    tossWon: "",
    opt: "",
  });
  const [show, setShow] = useState(false);
  const [showToss, setShowToss] = useState(false);

  useEffect(() => {
    loadLiveMatchData();
  }, []);

  useEffect(() => {
    setMatch({
      team1: "",
      team2: "",
      overs: "",
      wickets: "",
      venue: "Alamnagar",
      tossWon: "",
      opt: "",
    });
    setShow(false);
  }, [isMatchStarted]);

  useEffect(() => {
    const fetchMatches = async () => {
      const m = (await getData("matchHistory")) || [];
      setMatches(m);
    };
    fetchMatches();
  }, [isMatchStarted]);

  const startScoring = () => {
    const t1 =
      (match.tossWon === match.team1 && match.opt === "Bat") ||
      (match.tossWon === match.team2 && match.opt === "Bowl")
        ? match.team1
        : match.team2;
    const t2 = t1 === match.team1 ? match.team2 : match.team1;
    setInitialData(
      t1,
      t2,
      match.overs,
      match.wickets,
      match.venue,
      match.tossWon,
      match.opt
    );
    router.push("screens/ScoringScreen");
  };

  const deleteMatch = async () => {
    const updatedMatches = matches.filter((i) => del.id !== i.id);
    await save("matchHistory", updatedMatches);
    setMatches(updatedMatches);
    setDel("");
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
          contentContainerStyle={{ flexGrow: 1, padding: 16 }}
          showsVerticalScrollIndicator={false}
        >
          <LinearGradient
            colors={colors.gradients.surface}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="my-4 p-4 w-[100%] mx-auto h-[500] justify-center"
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
            {isMatchStarted ? (
              <View>
                <Heading className="mx-auto my-8">
                  {team1.name} V/S {team2.name}
                </Heading>
                <ShowCurrentScore />
                <TouchableOpacity
                  className="py-3 mt-4 mb-4 rounded-2xl  items-center mx-auto p-4"
                  style={{ backgroundColor: colors.primary }}
                  onPress={() => router.push("screens/ScoringScreen")}
                >
                  <Mid style={{ color: "white" }}>Continue Scoring</Mid>
                </TouchableOpacity>
                <TouchableOpacity
                  className="py-3 mt-4 mb-4 rounded-2xl items-center mx-auto p-4"
                  style={{ backgroundColor: colors.primary }}
                  onPress={() => resetScore()}
                >
                  <Mid style={{ color: "white" }}>Start New Match</Mid>
                </TouchableOpacity>
              </View>
            ) : show ? (
              <View>
                {showToss ? (
                  <View>
                    <TouchableOpacity
                      className="ml-[90%] "
                      onPress={() => setShowToss(!showToss)}
                    >
                      <Ionicons name="close" color={colors.text} size={30} />
                    </TouchableOpacity>
                    <Toss />
                  </View>
                ) : (
                  <View className="">
                    <TouchableOpacity
                      className="ml-8"
                      onPress={() => setShow(!show)}
                    >
                      <Ionicons
                        name="arrow-back-outline"
                        color={colors.text}
                        size={30}
                      />
                    </TouchableOpacity>

                    <TouchableOpacity
                      className="py-3 mt-4 mb-4 rounded-2xl w-[40%] items-center mx-auto"
                      style={{ backgroundColor: colors.primary }}
                      onPress={() => setShowToss(!showToss)}
                    >
                      <Mid style={{ color: "#fff" }}>Open Toss</Mid>
                    </TouchableOpacity>
                    <View className="w-[75%] mt-4 ml-8">
                      <Mid>Who won the Toss? </Mid>
                      <View className="ml-10 mt-4">
                        <TouchableOpacity
                          onPress={() =>
                            setMatch((prev) => ({
                              ...prev,
                              tossWon: match.team1,
                            }))
                          }
                          className="flex-row mb-3"
                        >
                          {match.tossWon !== match.team1 ? (
                            <Ionicons
                              name="radio-button-off-outline"
                              size={25}
                            />
                          ) : (
                            <Ionicons
                              name="radio-button-on-outline"
                              size={25}
                              color={colors.text}
                            />
                          )}
                          <Mid className="ml-3">{match.team1}</Mid>
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() =>
                            setMatch((prev) => ({
                              ...prev,
                              tossWon: match.team2,
                            }))
                          }
                          className="flex-row mb-2"
                        >
                          {match.tossWon !== match.team2 ? (
                            <Ionicons
                              name="radio-button-off-outline"
                              size={25}
                            />
                          ) : (
                            <Ionicons
                              name="radio-button-on-outline"
                              size={25}
                              color={colors.text}
                            />
                          )}
                          <Mid className="ml-3">{match.team2}</Mid>
                        </TouchableOpacity>
                      </View>
                    </View>
                    <View className="w-[75%] mt-4 ml-8">
                      <Mid>Decided to? </Mid>
                      <View className="ml-10 mt-4">
                        <TouchableOpacity
                          onPress={() =>
                            setMatch((prev) => ({
                              ...prev,
                              opt: "Bat",
                            }))
                          }
                          className="flex-row mb-3"
                        >
                          {match.opt !== "Bat" ? (
                            <Ionicons
                              name="radio-button-off-outline"
                              size={25}
                            />
                          ) : (
                            <Ionicons
                              name="radio-button-on-outline"
                              size={25}
                              color={colors.text}
                            />
                          )}
                          <Mid className="ml-3">Bat</Mid>
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() =>
                            setMatch((prev) => ({
                              ...prev,
                              opt: "Bowl",
                            }))
                          }
                          className="flex-row mb-2"
                        >
                          {match.opt !== "Bowl" ? (
                            <Ionicons
                              name="radio-button-off-outline"
                              size={25}
                            />
                          ) : (
                            <Ionicons
                              name="radio-button-on-outline"
                              size={25}
                              color={colors.text}
                            />
                          )}
                          <Mid className="ml-3">Bowl</Mid>
                        </TouchableOpacity>
                      </View>
                    </View>
                    <TouchableOpacity
                      className="py-3 mt-6 mb-4 rounded-2xl w-[40%] items-center mx-auto"
                      style={
                        !match.tossWon.trim() || !match.opt.trim()
                          ? { backgroundColor: colors.textMuted }
                          : { backgroundColor: colors.primary }
                      }
                      onPress={startScoring}
                      disabled={!match.tossWon.trim() || !match.opt.trim()}
                    >
                      <Mid style={{ color: "#fff" }}>Start Scoring</Mid>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            ) : (
              <View>
                <Heading className="mx-auto mb-8">Start Match</Heading>
                <View className="flex-row justify-between items-center mb-4">
                  <TextInput
                    placeholderTextColor={colors.text}
                    style={{
                      borderWidth: 1,
                      borderColor: colors.border,
                      padding: 20,
                      fontColor: colors.text,
                      borderRadius: 15,
                      color: colors.text,
                      backgroundColor: colors.bg,
                      elevation: 2,
                      textAlign: "center",
                    }}
                    placeholder="Team 1"
                    value={match.team1}
                    onChangeText={(text) =>
                      setMatch((prev) => ({ ...prev, team1: text }))
                    }
                    className="w-[40%]"
                  />
                  <Mid>V/S</Mid>
                  <TextInput
                    placeholderTextColor={colors.text}
                    style={{
                      borderWidth: 1,
                      borderColor: colors.border,
                      padding: 20,
                      fontColor: colors.text,
                      borderRadius: 15,
                      color: colors.text,
                      backgroundColor: colors.bg,
                      elevation: 2,
                      textAlign: "center",
                    }}
                    placeholder="Team 2"
                    value={match.team2}
                    onChangeText={(text) =>
                      setMatch((prev) => ({ ...prev, team2: text }))
                    }
                    className="w-[40%]"
                  />
                </View>
                <TextInput
                  placeholderTextColor={colors.text}
                  style={{
                    borderWidth: 1,
                    borderColor: colors.border,
                    padding: 20,
                    fontColor: colors.text,
                    borderRadius: 15,
                    color: colors.text,
                    backgroundColor: colors.bg,
                    elevation: 2,
                    textAlign: "center",
                  }}
                  keyboardType="numeric"
                  placeholder="Overs"
                  value={match.overs}
                  onChangeText={(text) => {
                    if (/^\d*$/.test(text))
                      setMatch((prev) => ({ ...prev, overs: text }));
                  }}
                  className="w-[90%] mb-4 mx-auto"
                />
                <TextInput
                  placeholderTextColor={colors.text}
                  style={{
                    borderWidth: 1,
                    borderColor: colors.border,
                    padding: 20,
                    fontColor: colors.text,
                    borderRadius: 15,
                    color: colors.text,
                    backgroundColor: colors.bg,
                    elevation: 2,
                    textAlign: "center",
                  }}
                  keyboardType="numeric"
                  placeholder="Wickets"
                  value={match.wickets}
                  onChangeText={(text) => {
                    if (/^\d*$/.test(text))
                      setMatch((prev) => ({ ...prev, wickets: text }));
                  }}
                  className="w-[90%] mb-4 mx-auto"
                />
                <TextInput
                  placeholderTextColor={colors.text}
                  style={{
                    borderWidth: 1,
                    borderColor: colors.border,
                    padding: 20,
                    fontColor: colors.text,
                    borderRadius: 15,
                    color: colors.text,
                    backgroundColor: colors.bg,
                    elevation: 2,
                    textAlign: "center",
                  }}
                  placeholder="Venue"
                  value={match.venue}
                  onChangeText={(text) =>
                    setMatch((prev) => ({ ...prev, venue: text }))
                  }
                  className="w-[90%] mb-4 mx-auto"
                />
                <TouchableOpacity
                  className="py-3 mt-4 mb-4 rounded-2xl w-[40%] items-center mx-auto"
                  style={
                    !match.team1.trim() ||
                    !match.team2.trim() ||
                    !match.overs.trim() ||
                    !match.wickets.trim()
                      ? { backgroundColor: colors.textMuted }
                      : { backgroundColor: colors.primary }
                  }
                  onPress={() => setShow(true)}
                  disabled={
                    !match.team1.trim() ||
                    !match.team2.trim() ||
                    !match.overs.trim() ||
                    !match.wickets.trim()
                  }
                >
                  <Mid style={{ color: "#fff" }}>Start</Mid>
                </TouchableOpacity>
              </View>
            )}
          </LinearGradient>

          <View>
            <Heading>Recent Matches</Heading>
            <View className="flex-row items-center justify-between w-[95%] mx-auto mt-8 pb-4">
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
                placeholder="Search"
                value={input}
                onChangeText={setInput}
                className="w-[80%]"
              />
              <TouchableOpacity
                className="p-2 rounded-2xl ml-4"
                style={{
                  backgroundColor: input?.trim()
                    ? colors.primary
                    : colors.border,
                }}
                disabled={!input?.trim()}
                onPress={() => keyboard?.dissmiss()}
              >
                <Ionicons name="search-outline" size={25} color="#fff" />
              </TouchableOpacity>
            </View>
            {matches?.length > 0 &&
              matches
                .filter((i) => {
                  const query = input.trim().toLowerCase();
                  return (
                    i.team1.name.trim().toLowerCase().includes(query) ||
                    i.team2.name.trim().toLowerCase().includes(query) ||
                    i.date.split("T")[0].trim().toLowerCase().includes(query)
                  );
                })
                .map((m, indx) => (
                  <LinearGradient
                    key={indx}
                    colors={colors.gradients.surface}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    className="my-4 p-8 w-[100%] mx-auto justify-center items-center"
                    style={{
                      borderRadius: 20,
                      shadowColor: "#000",
                      shadowOffset: { width: 0, height: 4 },
                      shadowOpacity: 0.1,
                      shadowRadius: 8,
                      elevation: 1,
                    }}
                  >
                    <Mid>
                      {m.team1.name} V/S {m.team2.name}
                    </Mid>
                    <Body>
                      {m.team1.name}: {m.team1.runs}-{m.team1.wicket}
                    </Body>
                    <Body>
                      {m.team2.name}: {m.team2.runs}-{m.team2.wicket}
                    </Body>
                    <Body>Date: {m.date.split("T")[0]}</Body>

                    <View className="flex-row mt-8">
                      <TouchableOpacity
                        onPress={() => {
                          setShowBtn(!showBtn);
                          setDel(m);
                        }}
                      >
                        <Ionicons
                          name="trash-outline"
                          size={20}
                          color="#fff"
                          className="bg-red-700 p-3 rounded-full ml-8"
                        />
                      </TouchableOpacity>

                      <TouchableOpacity
                        onPress={() =>
                          router.push({
                            pathname: "screens/MatchShow",
                            params: { matchData: JSON.stringify(m) },
                          })
                        }
                      >
                        <Ionicons
                          name="send-outline"
                          size={20}
                          color="#fff"
                          className="bg-blue-600 p-3 rounded-full ml-8"
                        />
                      </TouchableOpacity>
                    </View>
                  </LinearGradient>
                ))}
          </View>
        </ScrollView>
      </LinearGradient>
      <Portal>
        {showBtn && (
          <ConfirmationToast
            name={"Delete"}
            fun={deleteMatch}
            message={
              "This wil delete the Match permanently. This action cannot be undone. "
            }
            setShow={setShowBtn}
          />
        )}
      </Portal>
    </>
  );
}
