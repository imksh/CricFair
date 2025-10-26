import { View, Text, TouchableOpacity, TextInput,ToastAndroid } from "react-native";
import { useState, useEffect } from "react";
import useThemeStore from "../store/themeStore";
import { useScoreStore } from "../store/scoreStore";
import { Heading, Mid, Body, Regular } from "./Typography";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Portal } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";
import { api } from "../utils/axios";

export default function Keyboard() {
  const router = useRouter();
  const [runComplete, setRunComplete] = useState(0);
  const { colors } = useThemeStore();
  const {
    addRun,
    undo,
    addBonusRun,
    addExtra,
    addWicket,
    inning,
    team1,
    team2,
    isOverCompleted,
    batsman1,
    batsman2,
    bowler,
    setIsStriker,
    addBowler,
    ball,
    over,
    setIsOverCompleted,
    totalOvers,
    setInning,
    totalWickets,
    persistMatch,
    liveData,
    setLiveData,
    saveLiveMatchData,
  } = useScoreStore();
  const [show, setShow] = useState("");
  const [out, setOut] = useState("");
  const [whichRun, setWhichRun] = useState("");
  const [whoout, setWhoout] = useState("striker");
  const [select, setSelect] = useState(false);
  const [showStriker, setShowStriker] = useState(false);
  const team = inning === 1 ? team1 : team2;
  useEffect(() => {
    if (
      isOverCompleted ||
      batsman1?.name === "" ||
      batsman2?.name === "" ||
      bowler?.name === ""
    ) {
      setSelect(true);
    } else {
      setSelect(false);
    }
  }, [team.ball, team.run, batsman1, batsman2]);

  useEffect(() => {
    const addScore = async () => {
      try {
        const data = {
          batsman1,
          batsman2,
          team1: team1.name,
          team2: team2.name,
          score: `${team.runs}-${team.wicket}`,
          over: `${team.over}.${team.ball}`,
          runRate: calculateRunRate(team.runs,team.over,team.ball),
          isFour: whichRun === "four",
          isSix: whichRun === "six",
          isOut: whichRun === "out",
          showLive: "",
          inning:inning,
          bowler,
        };
        setLiveData(data);
        saveLiveMatchData();
        await api.post("/overlay/add-score", data);
      } catch (error) {
        console.log("Error in adding score to overlay: ", error);
        ToastAndroid.show(`Error: ${error}`, ToastAndroid.SHORT);
      }
    };
    addScore();
  }, [
    team.runs,
    team.wicket,
    ball,
    over,
    batsman1.name,
    batsman2.name,
    bowler.name,
    whichRun,
  ]);

  const calculateRunRate = (runs, overs, balls) => {
  // Convert total balls bowled
  const totalBalls = overs * 6 + balls;

  // Avoid division by zero
  if (totalBalls === 0) return 0;

  // Convert back to overs (as decimal)
  const oversDecimal = totalBalls / 6;

  // Calculate run rate
  const runRate = runs / oversDecimal;

  // Return rounded to 2 decimals
  return parseFloat(runRate.toFixed(2));
};

  if (inning > 2) {
    return (
      <>
        <View
          className="py-12 px-6 flex-1 flex-row justify-around items-center flex-wrap"
          style={{ backgroundColor: colors.primary }}
        ></View>
        <Portal>
          <View className="absolute top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%] w-[90%]">
            <LinearGradient
              colors={colors.gradients.surface}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              className="my-4 p-8"
              style={{
                borderRadius: 20,
                shadowColor: "#000",
                shadowOffset: {
                  width: 0,
                  height: 4,
                },
                shadowOpacity: 0.1,
                shadowRadius: 8,
                elevation: 8,
              }}
            >
              <Heading className="mx-auto">Save Match Data</Heading>
              <TouchableOpacity
                className="py-3 mt-4 mb-4 rounded-2xl px-4 items-center mx-auto"
                style={{ backgroundColor: colors.primary }}
                onPress={() => {
                  persistMatch();
                  router.back();
                }}
              >
                <Mid style={{color:colors.primary}}>Save</Mid>
              </TouchableOpacity>
            </LinearGradient>
          </View>
        </Portal>
      </>
    );
  }

  if (
    team.over >= totalOvers ||
    team.wicket >= totalWickets ||
    team2.runs > team1.runs
  ) {
    return (
      <View
        className="py-12 px-6 flex-1 flex-row justify-around items-center flex-wrap"
        style={{ backgroundColor: colors.primary }}
      >
        <TouchableOpacity onPress={setInning}>
          <Mid
            className="text-center border-x border-y  py-3 mx-2 my-4 px-4"
            style={{ color: "#fff" }}
          >
            End Innings
          </Mid>
        </TouchableOpacity>
        <TouchableOpacity onPress={undo}>
          <Mid
            className="text-center border-x border-y  py-3 mx-2 my-4 px-4"
            style={{ color: "#fff" }}
          >
            Undo
          </Mid>
        </TouchableOpacity>
      </View>
    );
  }

  if (select) {
    return (
      <View
        className="py-12 px-6 flex-1 flex-row justify-around items-center flex-wrap"
        style={{ backgroundColor: colors.primary }}
      >
        <TouchableOpacity onPress={setInning}>
          <Mid
            className="text-center border-x border-y  py-3 mx-2 my-4 px-4"
            style={{ color: "#fff" }}
          >
            End Innings
          </Mid>
        </TouchableOpacity>

        <TouchableOpacity onPress={undo}>
          <Mid
            className="text-center border-x border-y  py-3 mx-2 my-4 px-4"
            style={{ color: "#fff" }}
          >
            Undo
          </Mid>
        </TouchableOpacity>

        {batsman1.name === "" && (
          <TouchableOpacity
            onPress={() =>
              router.push({
                pathname: "screens/Choose",
                params: {
                  player: "batsman1",
                },
              })
            }
          >
            <Mid
              className="text-center border-x border-y  py-3 mx-2 my-4 px-4"
              style={{ color: "#fff" }}
            >
              Select Batsman
            </Mid>
          </TouchableOpacity>
        )}

        {batsman2.name === "" && (
          <TouchableOpacity
            onPress={() =>
              router.push({
                pathname: "screens/Choose",
                params: {
                  player: "batsman2",
                },
              })
            }
          >
            <Mid
              className="text-center border-x border-y  py-3 mx-2 my-4 px-4"
              style={{ color: "#fff" }}
            >
              Select Batsman
            </Mid>
          </TouchableOpacity>
        )}

        {bowler.name === "" && (
          <TouchableOpacity
            onPress={() =>
              router.push({
                pathname: "screens/Choose",
                params: {
                  player: "bowler",
                },
              })
            }
          >
            <Mid
              className="text-center border-x border-y  py-3 mx-2 my-4 px-4"
              style={{ color: "#fff" }}
            >
              Select Bowler
            </Mid>
          </TouchableOpacity>
        )}
        {isOverCompleted && (
          <TouchableOpacity
            onPress={() => {
              router.push({
                pathname: "screens/Choose",
                params: {
                  player: "bowler",
                },
              });
              setIsOverCompleted(false);
            }}
          >
            <Mid
              className="text-center border-x border-y py-3 mx-2 my-4 px-4"
              style={{ color: "#fff" }}
            >
              Select Bowler
            </Mid>
          </TouchableOpacity>
        )}
      </View>
    );
  }

  if (show === "out") {
    return (
      <>
        <View style={{ backgroundColor: colors.primary }}>
          <TouchableOpacity onPress={() => setShow("")}>
            <Ionicons
              className="mt-4 ml-5"
              style={{ color: "#fff" }}
              name="close"
              size={30}
            />
          </TouchableOpacity>
        </View>
        <View
          className="py-12 px-6 flex-1 flex-row justify-around items-center flex-wrap"
          style={{ backgroundColor: colors.primary }}
        >
          <TouchableOpacity
            onPress={() => {
              addWicket("bowled", "striker", 0);
              setShow("");
              setWhichRun("out");
            }}
          >
            <Mid
              className="text-center border-x border-y  py-3 px-4 mx-2 my-4"
              style={{ color: "#fff" }}
            >
              Bowled
            </Mid>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              addWicket("caught", "striker", 0);
              setShow("");
              setWhichRun("out");
            }}
          >
            <Mid
              className="text-center border-x border-y  py-3 px-4 mx-2 my-4"
              style={{ color: "#fff" }}
            >
              Caught
            </Mid>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              addWicket("stumped", "striker", 0);
              setShow("");
              setWhichRun("out");
            }}
          >
            <Mid
              className="text-center border-x border-y  py-3 px-4 mx-2 my-4"
              style={{ color: "#fff" }}
            >
              Stumped
            </Mid>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              addWicket("lbw", "striker", 0);
              setShow("");
              setWhichRun("out");
            }}
          >
            <Mid
              className="text-center border-x border-y  py-3 px-4 mx-2 my-4"
              style={{ color: "#fff" }}
            >
              LBW
            </Mid>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              setOut("runOut");
            }}
          >
            <Mid
              className="text-center border-x border-y  py-3 px-4 mx-2 my-4"
              style={{ color: "#fff" }}
            >
              Run Out
            </Mid>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              addWicket("mankad", "nonStriker", 0);
              setShow("");
              setWhichRun("out");
            }}
          >
            <Mid
              className="text-center border-x border-y  py-3 px-4 mx-2 my-4"
              style={{ color: "#fff" }}
            >
              Mankad
            </Mid>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              addWicket("retired", "striker", 0);
              setShow("");
              setWhichRun("out");
            }}
          >
            <Mid
              className="text-center border-x border-y  py-3 px-4 mx-2 my-4"
              style={{ color: "#fff" }}
            >
              Retired
            </Mid>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              addWicket("hitWicket", "striker", 0);
              setShow("");
              setWhichRun("out");
            }}
          >
            <Mid
              className="text-center border-x border-y  py-3 px-4 mx-2 my-4"
              style={{ color: "#fff" }}
            >
              Hit Wicket
            </Mid>
          </TouchableOpacity>
        </View>
        {out === "runOut" && (
          <Portal>
            <View className="absolute top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%] w-[90%]">
              <LinearGradient
                colors={colors.gradients.surface}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                className="my-4 p-8 "
                style={{
                  borderRadius: 20,
                  shadowColor: "#000",
                  shadowOffset: {
                    width: 0,
                    height: 4,
                  },
                  shadowOpacity: 0.1,
                  shadowRadius: 8,
                  elevation: 8,
                }}
              >
                <Heading className="mx-auto">Who got Out</Heading>
                <TouchableOpacity
                  onPress={() => setWhoout("striker")}
                  className="border p-2 my-4"
                  style={
                    whoout === "striker"
                      ? { borderColor: colors.primary }
                      : { borderColor: colors.border }
                  }
                >
                  <Mid style={{ textAlign: "center" }}>{batsman1.name}</Mid>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setWhoout("nonStriker")}
                  className="border p-2 my-4"
                  style={
                    whoout === "nonStriker"
                      ? { borderColor: colors.primary }
                      : { borderColor: colors.border }
                  }
                >
                  <Mid style={{ textAlign: "center" }}>{batsman2.name}</Mid>
                </TouchableOpacity>
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
                  placeholder="Enter Runs Completed"
                  value={runComplete}
                  onChangeText={setRunComplete}
                  className="w-[80%] mx-auto text-center"
                />
                <TouchableOpacity
                  className="py-3 mt-4 mb-4 rounded-2xl items-center mx-auto p-4"
                  style={{ backgroundColor: colors.primary }}
                  onPress={() => {
                    addWicket("runout", whoout, parseInt(runComplete));
                    setShow("");
                    setWhichRun("out");
                  }}
                >
                  <Mid style={{ color: "#fff" }}>Submit</Mid>
                </TouchableOpacity>
              </LinearGradient>
            </View>
          </Portal>
        )}
      </>
    );
  }
  if (show === "moreRuns") {
    return (
      <>
        <View style={{ backgroundColor: colors.primary }}>
          <TouchableOpacity onPress={() => setShow("")}>
            <Ionicons
              className="mt-4 ml-5"
              style={{ color: "#fff" }}
              name="close"
              size={30}
            />
          </TouchableOpacity>
        </View>
        <View
          className="py-12 px-6 flex-1 flex-row justify-around items-center flex-wrap"
          style={{ backgroundColor: colors.primary }}
        >
          <TouchableOpacity
            className="w-[25%]"
            onPress={() => {
              addRun(5);
              setShow("");
            }}
          >
            <Mid
              className="text-center border-x border-y  py-3 mx-2 my-4"
              style={{ color: "#fff" }}
            >
              5
            </Mid>
          </TouchableOpacity>

          <TouchableOpacity
            className="w-[25%]"
            onPress={() => {
              addRun(6);
              setShow("");
            }}
          >
            <Mid
              className="text-center border-x border-y  py-3 mx-2 my-4"
              style={{ color: "#fff" }}
            >
              6
            </Mid>
          </TouchableOpacity>
          <TouchableOpacity
            className="w-[25%]"
            onPress={() => {
              addRun(7);
              setShow("");
            }}
          >
            <Mid
              className="text-center border-x border-y  py-3 mx-2 my-4"
              style={{ color: "#fff" }}
            >
              7
            </Mid>
          </TouchableOpacity>
          <TouchableOpacity
            className="w-[25%]"
            onPress={() => {
              addRun(8);
              setShow("");
            }}
          >
            <Mid
              className="text-center border-x border-y  py-3 mx-2 my-4"
              style={{ color: "#fff" }}
            >
              8
            </Mid>
          </TouchableOpacity>
          <TouchableOpacity
            className="w-[25%]"
            onPress={() => {
              addRun(9);
              setShow("");
            }}
          >
            <Mid
              className="text-center border-x border-y  py-3 mx-2 my-4"
              style={{ color: "#fff" }}
            >
              9
            </Mid>
          </TouchableOpacity>
          <TouchableOpacity
            className="w-[25%]"
            onPress={() => {
              addRun(10);
              setShow("");
            }}
          >
            <Mid
              className="text-center border-x border-y  py-3 mx-2 my-4"
              style={{ color: "#fff" }}
            >
              10
            </Mid>
          </TouchableOpacity>
          <TouchableOpacity
            className="w-[25%]"
            onPress={() => {
              addRun(11);
              setShow("");
            }}
          >
            <Mid
              className="text-center border-x border-y  py-3 mx-2 my-4"
              style={{ color: "#fff" }}
            >
              11
            </Mid>
          </TouchableOpacity>

          <TouchableOpacity
            className="w-[25%]"
            onPress={() => {
              addRun(12);
              setShow("");
            }}
          >
            <Mid
              className="text-center border-x border-y  py-3 mx-2 my-4"
              style={{ color: "#fff" }}
            >
              12
            </Mid>
          </TouchableOpacity>
        </View>
      </>
    );
  }
  if (show === "bonus") {
    return (
      <>
        <View style={{ backgroundColor: colors.primary }}>
          <TouchableOpacity onPress={() => setShow("")}>
            <Ionicons
              className="mt-4 ml-5"
              style={{ color: "#fff" }}
              name="close"
              size={30}
            />
          </TouchableOpacity>
        </View>
        <View
          className="py-12 px-6 flex-1 flex-row justify-around items-center flex-wrap"
          style={{ backgroundColor: colors.primary }}
        >
          <TouchableOpacity
            className="w-[25%]"
            onPress={() => {
              addBonusRun(1);
              setShow("");
            }}
          >
            <Mid
              className="text-center border-x border-y  py-3 mx-2 my-4"
              style={{ color: "#fff" }}
            >
              +1
            </Mid>
          </TouchableOpacity>

          <TouchableOpacity
            className="w-[25%]"
            onPress={() => {
              addBonusRun(2);
              setShow("");
            }}
          >
            <Mid
              className="text-center border-x border-y  py-3 mx-2 my-4"
              style={{ color: "#fff" }}
            >
              +2
            </Mid>
          </TouchableOpacity>
          <TouchableOpacity
            className="w-[25%]"
            onPress={() => {
              addBonusRun(3);
              setShow("");
            }}
          >
            <Mid
              className="text-center border-x border-y  py-3 mx-2 my-4"
              style={{ color: "#fff" }}
            >
              +3
            </Mid>
          </TouchableOpacity>
          <TouchableOpacity
            className="w-[25%]"
            onPress={() => {
              addBonusRun(4);
              setShow("");
            }}
          >
            <Mid
              className="text-center border-x border-y  py-3 mx-2 my-4"
              style={{ color: "#fff" }}
            >
              +4
            </Mid>
          </TouchableOpacity>
          <TouchableOpacity
            className="w-[25%]"
            onPress={() => {
              addBonusRun(-1);
              setShow("");
            }}
          >
            <Mid
              className="text-center border-x border-y  py-3 mx-2 my-4"
              style={{ color: "#fff" }}
            >
              -1
            </Mid>
          </TouchableOpacity>
          <TouchableOpacity
            className="w-[25%]"
            onPress={() => {
              addBonusRun(-2);
              setShow("");
            }}
          >
            <Mid
              className="text-center border-x border-y  py-3 mx-2 my-4"
              style={{ color: "#fff" }}
            >
              -2
            </Mid>
          </TouchableOpacity>
          <TouchableOpacity
            className="w-[25%]"
            onPress={() => {
              addBonusRun(-3);
              setShow("");
            }}
          >
            <Mid
              className="text-center border-x border-y  py-3 mx-2 my-4"
              style={{ color: "#fff" }}
            >
              -3
            </Mid>
          </TouchableOpacity>

          <TouchableOpacity
            className="w-[25%]"
            onPress={() => {
              addBonusRun(-4);
              setShow("");
            }}
          >
            <Mid
              className="text-center border-x border-y  py-3 mx-2 my-4"
              style={{ color: "#fff" }}
            >
              -4
            </Mid>
          </TouchableOpacity>
        </View>
      </>
    );
  }

  if (show === "nb") {
    return (
      <>
        <View style={{ backgroundColor: colors.primary }}>
          <TouchableOpacity onPress={() => setShow("")}>
            <Ionicons
              className="mt-4 ml-5"
              style={{ color: "#fff" }}
              name="close"
              size={30}
            />
          </TouchableOpacity>
        </View>
        <View
          className="py-12 px-6 flex-1 flex-row justify-around items-center flex-wrap"
          style={{ backgroundColor: colors.primary }}
        >
          <TouchableOpacity
            className="w-[25%]"
            onPress={() => {
              addExtra("nb", 0);
              setShow("");
            }}
          >
            <Mid
              className="text-center border-x border-y  py-3 mx-2 my-4"
              style={{ color: "#fff" }}
            >
              NB
            </Mid>
          </TouchableOpacity>
          <TouchableOpacity
            className="w-[25%]"
            onPress={() => {
              addExtra("nb", 1);
              setShow("");
            }}
          >
            <Mid
              className="text-center border-x border-y  py-3 mx-2 my-4"
              style={{ color: "#fff" }}
            >
              1 NB
            </Mid>
          </TouchableOpacity>

          <TouchableOpacity
            className="w-[25%]"
            onPress={() => {
              addExtra("nb", 2);
              setShow("");
            }}
          >
            <Mid
              className="text-center border-x border-y  py-3 mx-2 my-4"
              style={{ color: "#fff" }}
            >
              2 NB
            </Mid>
          </TouchableOpacity>
          <TouchableOpacity
            className="w-[25%]"
            onPress={() => {
              addExtra("nb", 3);
              setShow("");
            }}
          >
            <Mid
              className="text-center border-x border-y  py-3 mx-2 my-4"
              style={{ color: "#fff" }}
            >
              3 NB
            </Mid>
          </TouchableOpacity>
          <TouchableOpacity
            className="w-[25%]"
            onPress={() => {
              addExtra("nb", 4);
              setShow("");
            }}
          >
            <Mid
              className="text-center border-x border-y  py-3 mx-2 my-4"
              style={{ color: "#fff" }}
            >
              4 NB
            </Mid>
          </TouchableOpacity>
          <TouchableOpacity
            className="w-[25%]"
            onPress={() => {
              addExtra("nb", 6);
              setShow("");
            }}
          >
            <Mid
              className="text-center border-x border-y  py-3 mx-2 my-4"
              style={{ color: "#fff" }}
            >
              6 NB
            </Mid>
          </TouchableOpacity>
        </View>
      </>
    );
  }

  if (show === "bye") {
    return (
      <>
        <View style={{ backgroundColor: colors.primary }}>
          <TouchableOpacity onPress={() => setShow("")}>
            <Ionicons
              className="mt-4 ml-5"
              style={{ color: "#fff" }}
              name="close"
              size={30}
            />
          </TouchableOpacity>
        </View>
        <View
          className="py-12 px-6 flex-1 flex-row justify-around items-center flex-wrap"
          style={{ backgroundColor: colors.primary }}
        >
          <TouchableOpacity
            className="w-[25%]"
            onPress={() => {
              addExtra("bye", 1);
              setShow("");
            }}
          >
            <Mid
              className="text-center border-x border-y  py-3 mx-2 my-4"
              style={{ color: "#fff" }}
            >
              1 B
            </Mid>
          </TouchableOpacity>

          <TouchableOpacity
            className="w-[25%]"
            onPress={() => {
              addExtra("bye", 2);
              setShow("");
            }}
          >
            <Mid
              className="text-center border-x border-y  py-3 mx-2 my-4"
              style={{ color: "#fff" }}
            >
              2 B
            </Mid>
          </TouchableOpacity>
          <TouchableOpacity
            className="w-[25%]"
            onPress={() => {
              addExtra("bye", 3);
              setShow("");
            }}
          >
            <Mid
              className="text-center border-x border-y  py-3 mx-2 my-4"
              style={{ color: "#fff" }}
            >
              3 B
            </Mid>
          </TouchableOpacity>
          <TouchableOpacity
            className="w-[25%]"
            onPress={() => {
              addExtra("bye", 4);
              setShow("");
            }}
          >
            <Mid
              className="text-center border-x border-y  py-3 mx-2 my-4"
              style={{ color: "#fff" }}
            >
              4 B
            </Mid>
          </TouchableOpacity>
          <TouchableOpacity
            className="w-[25%]"
            onPress={() => {
              addExtra("bye", 5);
              setShow("");
            }}
          >
            <Mid
              className="text-center border-x border-y  py-3 mx-2 my-4"
              style={{ color: "#fff" }}
            >
              5 B
            </Mid>
          </TouchableOpacity>
          <TouchableOpacity
            className="w-[25%]"
            onPress={() => {
              addExtra("bye", 6);
              setShow("");
            }}
          >
            <Mid
              className="text-center border-x border-y  py-3 mx-2 my-4"
              style={{ color: "#fff" }}
            >
              6 B
            </Mid>
          </TouchableOpacity>
          <TouchableOpacity
            className="w-[25%]"
            onPress={() => {
              addExtra("bye", 7);
              setShow("");
            }}
          >
            <Mid
              className="text-center border-x border-y  py-3 mx-2 my-4"
              style={{ color: "#fff" }}
            >
              7 B
            </Mid>
          </TouchableOpacity>
        </View>
      </>
    );
  }

  if (show === "lb") {
    return (
      <>
        <View style={{ backgroundColor: colors.primary }}>
          <TouchableOpacity onPress={() => setShow("")}>
            <Ionicons
              className="mt-4 ml-5"
              style={{ color: "#fff" }}
              name="close"
              size={30}
            />
          </TouchableOpacity>
        </View>
        <View
          className="py-12 px-6 flex-1 flex-row justify-around items-center flex-wrap"
          style={{ backgroundColor: colors.primary }}
        >
          <TouchableOpacity
            className="w-[25%]"
            onPress={() => {
              addExtra("lb", 1);
              setShow("");
            }}
          >
            <Mid
              className="text-center border-x border-y  py-3 mx-2 my-4"
              style={{ color: "#fff" }}
            >
              1 LB
            </Mid>
          </TouchableOpacity>

          <TouchableOpacity
            className="w-[25%]"
            onPress={() => {
              addExtra("lb", 2);
              setShow("");
            }}
          >
            <Mid
              className="text-center border-x border-y  py-3 mx-2 my-4"
              style={{ color: "#fff" }}
            >
              2 LB
            </Mid>
          </TouchableOpacity>
          <TouchableOpacity
            className="w-[25%]"
            onPress={() => {
              addExtra("lb", 3);
              setShow("");
            }}
          >
            <Mid
              className="text-center border-x border-y  py-3 mx-2 my-4"
              style={{ color: "#fff" }}
            >
              3 LB
            </Mid>
          </TouchableOpacity>
          <TouchableOpacity
            className="w-[25%]"
            onPress={() => {
              addExtra("lb", 4);
              setShow("");
            }}
          >
            <Mid
              className="text-center border-x border-y  py-3 mx-2 my-4"
              style={{ color: "#fff" }}
            >
              4 LB
            </Mid>
          </TouchableOpacity>
          <TouchableOpacity
            className="w-[25%]"
            onPress={() => {
              addExtra("lb", 5);
              setShow("");
            }}
          >
            <Mid
              className="text-center border-x border-y  py-3 mx-2 my-4"
              style={{ color: "#fff" }}
            >
              5 LB
            </Mid>
          </TouchableOpacity>
          <TouchableOpacity
            className="w-[25%]"
            onPress={() => {
              addExtra("lb", 6);
              setShow("");
            }}
          >
            <Mid
              className="text-center border-x border-y  py-3 mx-2 my-4"
              style={{ color: "#fff" }}
            >
              6 LB
            </Mid>
          </TouchableOpacity>
          <TouchableOpacity
            className="w-[25%]"
            onPress={() => {
              addExtra("lb", 7);
              setShow("");
            }}
          >
            <Mid
              className="text-center border-x border-y  py-3 mx-2 my-4"
              style={{ color: "#fff" }}
            >
              7 LB
            </Mid>
          </TouchableOpacity>
        </View>
      </>
    );
  }

  if (show === "wide") {
    return (
      <>
        <View style={{ backgroundColor: colors.primary }}>
          <TouchableOpacity onPress={() => setShow("")}>
            <Ionicons
              className="mt-4 ml-5"
              style={{ color: "#fff" }}
              name="close"
              size={30}
            />
          </TouchableOpacity>
        </View>
        <View
          className="py-12 px-6 flex-1 flex-row justify-around items-center flex-wrap"
          style={{ backgroundColor: colors.primary }}
        >
          <TouchableOpacity
            className="w-[25%]"
            onPress={() => {
              addExtra("wide", 0);
              setShow("");
            }}
          >
            <Mid
              className="text-center border-x border-y  py-3 mx-2 my-4"
              style={{ color: "#fff" }}
            >
              Wd
            </Mid>
          </TouchableOpacity>
          <TouchableOpacity
            className="w-[25%]"
            onPress={() => {
              addExtra("wide", 1);
              setShow("");
            }}
          >
            <Mid
              className="text-center border-x border-y  py-3 mx-2 my-4"
              style={{ color: "#fff" }}
            >
              1 + Wd
            </Mid>
          </TouchableOpacity>

          <TouchableOpacity
            className="w-[25%]"
            onPress={() => {
              addExtra("wide", 2);
              setShow("");
            }}
          >
            <Mid
              className="text-center border-x border-y  py-3 mx-2 my-4"
              style={{ color: "#fff" }}
            >
              2 + Wd
            </Mid>
          </TouchableOpacity>
          <TouchableOpacity
            className="w-[25%]"
            onPress={() => {
              addExtra("wide", 3);
              setShow("");
            }}
          >
            <Mid
              className="text-center border-x border-y  py-3 mx-2 my-4"
              style={{ color: "#fff" }}
            >
              3 + Wd
            </Mid>
          </TouchableOpacity>
          <TouchableOpacity
            className="w-[25%]"
            onPress={() => {
              addExtra("wide", 4);
              setShow("");
            }}
          >
            <Mid
              className="text-center border-x border-y  py-3 mx-2 my-4"
              style={{ color: "#fff" }}
            >
              4 Wd
            </Mid>
          </TouchableOpacity>
          <TouchableOpacity
            className="w-[25%]"
            onPress={() => {
              addExtra("wide", 5);
              setShow("");
            }}
          >
            <Mid
              className="text-center border-x border-y  py-3 mx-2 my-4"
              style={{ color: "#fff" }}
            >
              5 + Wd
            </Mid>
          </TouchableOpacity>
          <TouchableOpacity
            className="w-[25%]"
            onPress={() => {
              addExtra("wide", 6);
              setShow("");
            }}
          >
            <Mid
              className="text-center border-x border-y  py-3 mx-2 my-4"
              style={{ color: "#fff" }}
            >
              6 + Wd
            </Mid>
          </TouchableOpacity>
          <TouchableOpacity
            className="w-[25%]"
            onPress={() => {
              addExtra("wide", 7);
              setShow("");
            }}
          >
            <Mid
              className="text-center border-x border-y  py-3 mx-2 my-4"
              style={{ color: "#fff" }}
            >
              7 Wd
            </Mid>
          </TouchableOpacity>
        </View>
      </>
    );
  }

  if (show === "more") {
    return (
      <>
        <View style={{ backgroundColor: colors.primary }}>
          <TouchableOpacity onPress={() => setShow("")}>
            <Ionicons
              className="mt-4 ml-5"
              style={{ color: "#fff" }}
              name="close"
              size={30}
            />
          </TouchableOpacity>
        </View>
        <View
          className="py-12 px-6 flex-1 flex-row justify-around items-center flex-wrap"
          style={{ backgroundColor: colors.primary }}
        >
          <TouchableOpacity onPress={() => addBonusRun(2)}>
            <Mid
              className="text-center border-x border-y  py-3 mx-2 my-4 px-4"
              style={{ color: "#fff" }}
            >
              End Innings
            </Mid>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => addBonusRun(3)}>
            <Mid
              className="text-center border-x border-y  py-3 mx-2 my-4 px-4"
              style={{ color: "#fff" }}
            >
              Retired Hurt
            </Mid>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => addBonusRun(4)}>
            <Mid
              className="text-center border-x border-y  py-3 mx-2 my-4 px-4"
              style={{ color: "#fff" }}
            >
              Overs/Format/Wickets
            </Mid>
          </TouchableOpacity>
        </View>
      </>
    );
  }

  if (!batsman1.isStriker && !batsman2.isStriker) {
    return (
      <View
        className="py-12 px-6 flex-1 flex-row justify-around items-center flex-wrap"
        style={{ backgroundColor: colors.primary }}
      >
        <TouchableOpacity onPress={setInning}>
          <Mid
            className="text-center border-x border-y  py-3 mx-2 my-4 px-4"
            style={{ color: "#fff" }}
          >
            End Innings
          </Mid>
        </TouchableOpacity>

        <TouchableOpacity onPress={undo}>
          <Mid
            className="text-center border-x border-y  py-3 mx-2 my-4 px-4"
            style={{ color: "#fff" }}
          >
            Undo
          </Mid>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setShowStriker(!showStriker)}>
          <Mid
            className="text-center border-x border-y  py-3 mx-2 my-4 px-4"
            style={{ color: "#fff" }}
          >
            Select Striker
          </Mid>
        </TouchableOpacity>
        {showStriker && (
          <Portal>
            <View className="absolute top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%] w-[90%]">
              <LinearGradient
                colors={colors.gradients.surface}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                className="my-4 p-8 "
                style={{
                  borderRadius: 20,
                  shadowColor: "#000",
                  shadowOffset: {
                    width: 0,
                    height: 4,
                  },
                  shadowOpacity: 0.1,
                  shadowRadius: 8,
                  elevation: 8,
                }}
              >
                <Heading className="mx-auto">Select Striker</Heading>
                <TouchableOpacity
                  onPress={() => setIsStriker(batsman1)}
                  className="border p-2 my-4"
                  style={{ borderColor: colors.border }}
                >
                  <Mid style={{ textAlign: "center" }}>{batsman1.name}</Mid>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setIsStriker(batsman2)}
                  className="borderp-2 my-4"
                  style={{ borderColor: colors.border }}
                >
                  <Mid style={{ textAlign: "center" }}>{batsman2.name}</Mid>
                </TouchableOpacity>
              </LinearGradient>
            </View>
          </Portal>
        )}
      </View>
    );
  }

  return (
    <>
      <View
        className="py-12 px-6 flex-1"
        style={{ backgroundColor: colors.primary }}
      >
        <View className="flex-row mx-auto">
          <TouchableOpacity className="w-[20%]" onPress={() => addRun(1)}>
            <Mid
              className="text-center border-r border-b py-6"
              style={{ color: "#fff" }}
            >
              1
            </Mid>
          </TouchableOpacity>
          <TouchableOpacity className="w-[20%]" onPress={() => addRun(2)}>
            <Mid
              className="text-center border-r border-b py-6"
              style={{ color: "#fff" }}
            >
              2
            </Mid>
          </TouchableOpacity>
          <TouchableOpacity className="w-[20%]" onPress={() => addRun(3)}>
            <Mid
              className="text-center border-r border-b py-6"
              style={{ color: "#fff" }}
            >
              3
            </Mid>
          </TouchableOpacity>
          <TouchableOpacity
            className="w-[20%]"
            onPress={() => {
              addRun(4);
              setWhichRun("four");
            }}
          >
            <Mid
              className="text-center border-r border-b py-6"
              style={{ color: "#fff" }}
            >
              4
            </Mid>
          </TouchableOpacity>
          <TouchableOpacity
            className="w-[20%]"
            onPress={() => {
              addRun(6);
              setWhichRun("six");
            }}
          >
            <Mid
              className="text-center border-b py-6"
              style={{ color: "#fff" }}
            >
              6
            </Mid>
          </TouchableOpacity>
        </View>

        <View className="flex-row mx-auto">
          <TouchableOpacity className="w-[20%]" onPress={() => setShow("lb")}>
            <Mid
              className="text-center border-r border-b py-6"
              style={{ color: "#fff" }}
            >
              LB
            </Mid>
          </TouchableOpacity>
          <TouchableOpacity className="w-[20%]" onPress={() => setShow("bye")}>
            <Mid
              className="text-center border-r border-b py-6"
              style={{ color: "#fff" }}
            >
              bye
            </Mid>
          </TouchableOpacity>
          <TouchableOpacity className="w-[20%]" onPress={() => setShow("wide")}>
            <Mid
              className="text-center border-r border-b py-6"
              style={{ color: "#fff" }}
            >
              Wide
            </Mid>
          </TouchableOpacity>
          <TouchableOpacity className="w-[20%]" onPress={() => setShow("nb")}>
            <Mid
              className="text-center border-r border-b py-6"
              style={{ color: "#fff" }}
            >
              NB
            </Mid>
          </TouchableOpacity>
          <TouchableOpacity className="w-[20%]" onPress={() => addRun(0)}>
            <Mid
              className="text-center border-b py-6"
              style={{ color: "#fff" }}
            >
              .
            </Mid>
          </TouchableOpacity>
        </View>

        <View className="flex-row mx-auto">
          <TouchableOpacity className="w-[20%]" onPress={() => setShow("more")}>
            <Mid
              className="text-center border-r py-6"
              style={{ color: "#000" }}
            >
              More
            </Mid>
          </TouchableOpacity>
          <TouchableOpacity
            className="w-[20%]"
            onPress={() => setShow("bonus")}
          >
            <Mid
              className="text-center border-r py-6"
              style={{ color: "#fff" }}
            >
              <Ionicons name="tennisball" size={23} />
            </Mid>
          </TouchableOpacity>
          <TouchableOpacity
            className="w-[20%]"
            onPress={() => setShow("moreRuns")}
          >
            <Mid
              className="text-center border-r py-6"
              style={{ color: "#fff" }}
            >
              5 6 7
            </Mid>
          </TouchableOpacity>
          <TouchableOpacity className="w-[20%]" onPress={undo}>
            <Mid
              className="text-center border-r py-6"
              style={{ color: "#fff" }}
            >
              Undo
            </Mid>
          </TouchableOpacity>
          <TouchableOpacity className="w-[20%]" onPress={() => setShow("out")}>
            <Mid className="text-center py-6" style={{ color: "#fff" }}>
              Out
            </Mid>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
}
