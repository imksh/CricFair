import React, { useEffect, useState } from "react";
import { View, Text, ScrollView } from "react-native";
import { useScoreStore } from "../store/scoreStore";

const Balls = () => {
  // ✅ Select only what you need separately to avoid new object references
  const inning = useScoreStore((state) => state.inning);
  const team1 = useScoreStore((state) => state.team1);
  const team2 = useScoreStore((state) => state.team2);

  // ✅ Determine which team is currently batting
  const team = inning === 1 ? team1 : team2;

  // ✅ State to store frozen over snapshot (won’t change even if over increases)
  const [frozenOver, setFrozenOver] = useState("");

  useEffect(() => {
    // Store the current over once when this component mounts
    setFrozenOver(`${team.over}.${team.ball}`);
    console.log(team.recentBalls);
    
  }, []); // runs only once

  return (
    <View style={{ flex: 1, padding: 10 }}>
      <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>
        Current Over (Frozen): {frozenOver}
      </Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ flexDirection: "row", gap: 10 }}
      >
        {team.recentBalls?.length ? (
          team.recentBalls.map((ball, index) => (
            <View
              key={index}
              style={{
                padding: 10,
                borderRadius: 8,
                backgroundColor: "#60a5fa",
                minWidth: 40,
                alignItems: "center",
              }}
            >
              <Text style={{ color: "#fff", fontWeight: "600" }}>{ball}</Text>
            </View>
          ))
        ) : (
          <Text>No balls recorded yet</Text>
        )}
      </ScrollView>
    </View>
  );
};

export default Balls;