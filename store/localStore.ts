import { create } from "zustand";
import { save, getData } from "../utils/storage.ts";

const useLocalStore = create((set, get) => ({
  // State
  players: [],
  attendance: {},
  batsmanQueue: [],
  bowlerQueue: [],
  lastdayPlayers: [],
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
        lastdayPlayers: (await getData("lastdayPlayers")) || [],
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
      await save("lastdayPlayers", state.lastdayPlayers);
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
  setLastdayPlayers: (lastdayPlayers) => set({ lastdayPlayers }),
  setTodayPlayers: (todayPlayers) => set({ todayPlayers }),
  setTodayBatsman: (todayBatsman) => set({ todayBatsman }),
  setTodayBowlers: (todayBowlers) => set({ todayBowlers }),
  setDate: (date) => set({ date }),

  // Prediction logic
  predict: () => {
    const state = get();
    const { players, attendance, batsmanQueue, bowlerQueue, lastdayPlayers } =
      state;

    const today = new Date().toISOString().split("T")[0];
    const selectedToday =
      attendance[today] || players.filter((p) => p.isSelected);
    if (!selectedToday.length) return;

    // Split by role
    const todayBat = selectedToday.filter(
      (p) => p.role === "Batsman" || p.role === "All-Rounder"
    );
    const todayBall = selectedToday.filter(
      (p) => p.role === "Bowler" || p.role === "All-Rounder"
    );

    // --- PRIORITY: players who played last match ---
    const lastBatsmenIds = new Set(
      (lastdayPlayers?.batsmanList || []).map((p) => p.id)
    );
    const lastBowlersIds = new Set(
      (lastdayPlayers?.bowlerList || []).map((p) => p.id)
    );

    // Players who played last match & are present today
    const returningBatsmen = todayBat.filter((p) => lastBatsmenIds.has(p.id));
    const returningBowlers = todayBall.filter((p) => lastBowlersIds.has(p.id));

    // Fill remaining if less than 4
    const finalBatsmen = [
      ...returningBatsmen,
      ...todayBat.filter((p) => !lastBatsmenIds.has(p.id)),
    ].slice(0, 4);

    const finalBowlers = [
      ...returningBowlers,
      ...todayBall.filter((p) => !lastBowlersIds.has(p.id)),
    ].slice(0, 4);

    // Remove today's selected players from existing queues
    const remainingBatsmanQueue = batsmanQueue.filter(
      (p) => !finalBatsmen.some((f) => f.id === p.id)
    );

    const remainingBowlerQueue = bowlerQueue.filter(
      (p) => !finalBowlers.some((f) => f.id === p.id)
    );

    // Merge remaining queue with today's final selection (avoid duplicates)
    const updatedBatsmanQueue = Array.from(
      new Map(
        [...remainingBatsmanQueue, ...finalBatsmen].map((p) => [p.id, p])
      ).values()
    );

    const updatedBowlerQueue = Array.from(
      new Map(
        [...remainingBowlerQueue, ...finalBowlers].map((p) => [p.id, p])
      ).values()
    );

    // Update state
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
    set({ lastdayPlayers: [] });
    set({ todayPlayers: [] });
    set({ todayBatsman: [] });
    set({ todayBowlers: [] });
    set({ date: "" });
    get().updateData();
  },
}));

export default useLocalStore;
