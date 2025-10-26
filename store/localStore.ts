import { create } from "zustand";
import { save, getData } from "../utils/storage.ts";

const useLocalStore = create((set, get) => ({
  // State
  players: [],
  attendance: {},
  batsmanQueue: [],
  bowlerQueue: [],
  todayPlayers: [],
  todayBatsman: [],
  todayBowlers: [],
  date: "",

  // Load from AsyncStorage
  loadData: async () => {
    try {
      set({
        players: (await getData("players")) || [],
        attendance: (await getData("attendance")) || {},
        batsmanQueue: (await getData("batsmanQueue")) || [],
        bowlerQueue: (await getData("bowlerQueue")) || [],
        todayPlayers: (await getData("todayPlayers")) || [],
        todayBatsman: (await getData("todayBatsman")) || [],
        todayBowlers: (await getData("todayBowlers")) || [],
        date: await getData("date"),
      });
    } catch (error) {
      console.log("Error loading data:", error);
    }
  },

  // Save current state to AsyncStorage
  updateData: async () => {
    try {
      const state = get();
      await save("players", state.players);
      await save("attendance", state.attendance);
      await save("batsmanQueue", state.batsmanQueue);
      await save("bowlerQueue", state.bowlerQueue);
      await save("todayPlayers", state.todayPlayers);
      await save("todayBatsman", state.todayBatsman);
      await save("todayBowlers", state.todayBowlers);
      await save("date", state.date);
    } catch (error) {
      console.log("Error updating data:", error);
    }
  },

  // Setters
  setPlayers: (players) => set({ players }),
  setAttendance: (attendance) => set({ attendance }),
  setBatsmanQueue: (batsmanQueue) => set({ batsmanQueue }),
  setBowlerQueue: (bowlerQueue) => set({ bowlerQueue }),
  setTodayPlayers: (todayPlayers) => set({ todayPlayers }),
  setTodayBatsman: (todayBatsman) => set({ todayBatsman }),
  setTodayBowlers: (todayBowlers) => set({ todayBowlers }),
  setDate: (date) => set({ date }),

  // Prediction logic
  predict: () => {
  const state = get();
  const { players, attendance, batsmanQueue, bowlerQueue } = state;

  const today = new Date().toISOString().split("T")[0];
  const day = new Date();
  day.setDate(day.getDate() - 1);
  const yesterday = day.toISOString().split("T")[0];

  const selectedToday = attendance[today] || players.filter((p) => p.isSelected);
  if (!selectedToday.length) return;

  const todayBat = selectedToday.filter(
    (p) => p.role === "Batsman" || p.role === "All-Rounder"
  );
  const todayBall = selectedToday.filter(
    (p) => p.role === "Bowler" || p.role === "All-Rounder"
  );

  // Filter only attendees
  const filterQueue = (queue, todayPlayers) =>
    queue.filter((p) => todayPlayers.some((t) => t.id === p.id));

  // Rotate queue to put first 4 as today’s players
  const pickToday = (queue, todayPlayers) => {
    const filteredQueue = filterQueue(queue, todayPlayers);
    const top4 = filteredQueue.slice(0, 4);
    const rest = queue.filter((p) => !top4.some((t) => t.id === p.id));
    return { top4, newQueue: [...rest, ...top4] }; // rotate
  };

  const { top4: finalBatsmen, newQueue: updatedBatsmanQueue } = pickToday(
    [...batsmanQueue, ...todayBat.filter((p) => !batsmanQueue.map((b) => b.id).includes(p.id))],
    todayBat
  );

  const { top4: finalBowlers, newQueue: updatedBowlerQueue } = pickToday(
    [...bowlerQueue, ...todayBall.filter((p) => !bowlerQueue.map((b) => b.id).includes(p.id))],
    todayBall
  );

  console.log("Attendance: ", selectedToday.map((b) => b.name));
  console.log("Batsman Queue: ", updatedBatsmanQueue.map((b) => b.name));
  console.log("Today Batsmen: ", finalBatsmen.map((b) => b.name));
  console.log("Today Bowlers: ", finalBowlers.map((b) => b.name));

  set({
    batsmanQueue: updatedBatsmanQueue,
    bowlerQueue: updatedBowlerQueue,
    todayBatsman: finalBatsmen,
    todayBowlers: finalBowlers,
  });

  get().updateData();
},

  undoPredict: () => {
    const { todayBatsman, todayBowlers, batsmanQueue, bowlerQueue } = get(); // zustand get

    // Put batsmen back at front
    set({
      batsmanQueue: [...todayBatsman, ...batsmanQueue],
      bowlerQueue: [...todayBowlers, ...bowlerQueue],
      todayBatsman: [],
      todayBowlers: [],
    });
    get().updateData();
  },
  boostBat: () => {
    const { batsmanQueue, players } = get();

    // Update queue with the latest didNotBat flags from players
    const updatedQueue = batsmanQueue.map((p) => {
      const player = players.find((pl) => pl.id === p.id);
      return player ? { ...p, didntBat: player.didntBat } : p;
    });

    // Sort so players who didn’t bat come first
    const sortedQueue = [
      ...updatedQueue.filter((p) => p.didntBat),
      ...updatedQueue.filter((p) => !p.didntBat),
    ];

    set({ batsmanQueue: sortedQueue });

    // Reset flags in players
    const updatedPlayers = players.map((p) => ({ ...p, didntBat: false }));
    set({ players: updatedPlayers });

    get().updateData();
  },

  boostBowl: () => {
    const { bowlerQueue, players } = get();

    // Update queue with the latest didNotBat flags from players
    const updatedQueue = bowlerQueue.map((p) => {
      const player = players.find((pl) => pl.id === p.id);
      return player ? { ...p, didntBowl: player.didntBowl } : p;
    });

    // Sort so players who didn’t bat come first
    const sortedQueue = [
      ...updatedQueue.filter((p) => p.didntBowl),
      ...updatedQueue.filter((p) => !p.didntBowl),
    ];

    set({ bowlerQueue: sortedQueue });

    // Reset flags in players
    const updatedPlayers = players.map((p) => ({ ...p, didntBowl: false }));
    set({ players: updatedPlayers });

    get().updateData();
  },

  clearAll: () => {
    set({ players: [] });
    set({ attendance: {} });
    set({ batsmanQueue: [] });
    set({ bowlerQueue: [] });
    set({ todayPlayers: [] });
    set({ todayBatsman: [] });
    set({ todayBowlers: [] });
    set({ date: "" });
    get().updateData();
  },
}));

export default useLocalStore;
