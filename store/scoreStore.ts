import { create } from "zustand";
import { save, getData, remove } from "../utils/storage";
import { nanoid } from "nanoid/non-secure";

const getInitialState = () => ({
  team1: {
    name: "",
    runs: 0,
    over: 0,
    ball: 0,
    wicket: 0,
    extras: 0,
    batsmanList: [],
    bowlerList: [],
    recentBalls: [],
  },
  team2: {
    name: "",
    runs: 0,
    over: 0,
    ball: 0,
    wicket: 0,
    extras: 0,
    batsmanList: [],
    bowlerList: [],
    recentBalls: [],
  },
  inning: 1,
  totalOvers: 0,
  totalWickets: 0,
  totalRuns: 0,
  extras: 0,
  over: 0,
  ball: 0,
  wicket: 0,
  isMatchStarted: false,
  isOverCompleted: false,
  venue: "",
  opt: "",
  tossWon: "",
  batsman1: {
    id: "",
    name: "",
    runs: 0,
    balls: 0,
    four: 0,
    six: 0,
    isStriker: false,
    isOut:false,
    order: 1,
  },
  batsman2: {
    id: "",
    name: "",
    runs: 0,
    balls: 0,
    four: 0,
    six: 0,
    isStriker: false,
    isOut:false,
    order: 2,
  },
  bowler: { id: "", name: "", over: 0, ball: 0, maiden: 0, run: 0, wicket: 0 },
  past: [] as any[],
});

export const useScoreStore = create((set, get) => ({
  ...getInitialState(),

  // ---- Internal: Save to history for undo ----
  _saveToHistory: () => {
    const state = get();
    set({
      past: [...state.past, { ...state, past: undefined }],
    });
  },

  undo: () => {
    const state = get();
    if (state.past.length === 0) return;
    const past = [...state.past];
    const previous = past.pop();
    if (!previous) return;
    set({ ...previous, past });
  },

  // ---- Getters ----
  getRunRate: (team) => {
    const t = get()[team];
    if (!t) return "0.00";
    const { runs, over, ball } = t;
    const totalOvers = over + ball / 6;
    return totalOvers > 0 ? (runs / totalOvers).toFixed(2) : "0.00";
  },

  getStrikeRate: (batsman: any) => {
    return batsman.balls > 0
      ? ((batsman.runs / batsman.balls) * 100).toFixed(2)
      : "0.00";
  },

  getEconomy: () => {
    const b = get().bowler;
    const totalOvers = b.over + b.ball / 6;
    return totalOvers > 0 ? (b.run / totalOvers).toFixed(2) : "0.00";
  },

  // ---- Setters ----

  setInitialData: (
    team1name: string,
    team2name: string,
    totalOvers: number,
    totalWickets: number,
    tossWon: number,
    opt: string
  ) => {
    set({
      team1: { ...get().team1, name: team1name },
      team2: { ...get().team2, name: team2name },
      totalOvers,
      totalWickets,
      isMatchStarted: true,
      tossWon,
      opt,
    });
  },

  setInning: () => {
    const newBatsman1 = {
      id: "",
      name: "",
      runs: 0,
      balls: 0,
      four: 0,
      six: 0,
      isStriker: false,
      order: 1,
    };
    const newBatsman2 = {
      id: "",
      name: "",
      runs: 0,
      balls: 0,
      four: 0,
      six: 0,
      isStriker: false,
      order: 2,
    };
    const newBowler = {
      id: "",
      name: "",
      over: 0,
      ball: 0,
      maiden: 0,
      run: 0,
      wicket: 0,
    };

    set({
      batsman1: newBatsman1,
      batsman2: newBatsman2,
      bowler: newBowler,
      inning: get().inning + 1,
      past: [],
    });
    
  },

  setIsOverCompleted: () => {
    const { batsman1, batsman2, inning, team1, team2 } = get();
    const currentTeamKey = inning === 1 ? "team1" : "team2";
    const team = get()[currentTeamKey];

    // Swap striker status
    const updatedBatsman1 = { ...batsman1, isStriker: !batsman1.isStriker };
    const updatedBatsman2 = { ...batsman2, isStriker: !batsman2.isStriker };

    // Also update the batsmanList
    const updatedBatsmanList = team.batsmanList.map((b) => {
      if (b.id === updatedBatsman1.id) return updatedBatsman1;
      if (b.id === updatedBatsman2.id) return updatedBatsman2;
      return b;
    });

    set({
      isOverCompleted: false,
      batsman1: updatedBatsman1,
      batsman2: updatedBatsman2,
      [currentTeamKey]: { ...team, batsmanList: updatedBatsmanList },
    });
  },

  setBatsman1: (id: string, name: string, isOut = true) => {
    const { inning, team1, team2 } = get();
    const currentTeam = inning === 1 ? team1 : team2;

    if (isOut) {
      const nextOrder = (currentTeam.batsmanList?.length || 0) + 1;

      const newBatsman = {
        id,
        name,
        runs: 0,
        balls: 0,
        four: 0,
        six: 0,
        isStriker: false,
        order: nextOrder,
        isOut: false,
      };

      set({
        batsman1: newBatsman,
        [inning === 1 ? "team1" : "team2"]: {
          ...currentTeam,
          batsmanList: [...(currentTeam.batsmanList || []), newBatsman],
        },
      });
      return;
    }

    // Just update existing batsman1
    set((state) => ({
      batsman1: { ...state.batsman1, id, name }, // fresh object
      batsman2: { ...state.batsman2 }, // clone existing to avoid reference sharing
    }));
  },

  setBatsman2: (id: string, name: string, isOut = true) => {
    const { inning, team1, team2 } = get();
    const currentTeam = inning === 1 ? team1 : team2;

    if (isOut) {
      const nextOrder = (currentTeam.batsmanList?.length || 0) + 1;

      const newBatsman = {
        id,
        name,
        runs: 0,
        balls: 0,
        four: 0,
        six: 0,
        isStriker: false,
        order: nextOrder,
        isOut: false,
      };

      set({
        batsman2: newBatsman,
        [inning === 1 ? "team1" : "team2"]: {
          ...currentTeam,
          batsmanList: [...(currentTeam.batsmanList || []), newBatsman], // push into array
        },
      });
      return;
    }

    set((state) => ({
      batsman2: { ...state.batsman2, id, name },
      batsman1: { ...state.batsman1 }, // clone existing
    }));
  },

  setRecentBalls: (
    run: number,
    type: string,
    bowler: string,
    batsman: string
  ) => {
    const newBall = { run, type, bowler, batsman };
    const { inning } = get();
    const currentTeamKey = inning === 1 ? "team1" : "team2";

    set((state) => ({
      ...state,
      [currentTeamKey]: {
        ...state[currentTeamKey],
        recentBalls: [...state[currentTeamKey].recentBalls, newBall],
      },
    }));
  },

  setIsStriker: (player) => {
    const { batsman1, batsman2 } = get();
    if (player.id === batsman1.id) {
      set((state) => ({
        batsman1: { ...state.batsman1, isStriker: true },
        batsman2: { ...state.batsman2, isStriker: false },
      }));
    }

    if (player.id === batsman2.id) {
      set((state) => ({
        batsman2: { ...state.batsman2, isStriker: true },
        batsman1: { ...state.batsman1, isStriker: false },
      }));
    }
  },

  setBowler: (id: string, name: string) => {
    const { inning } = get();
    const teamKey = inning === 1 ? "team1" : "team2";
    const currentTeam = get()[teamKey];

    const bowlerList = [...(currentTeam.bowlerList || [])];
    const existingIndex = bowlerList.findIndex((b) => b.id === id);

    if (existingIndex >= 0) {
      // Update existing bowler's name only, keep over/ball/run intact
      bowlerList[existingIndex] = {
        ...bowlerList[existingIndex],
        name,
      };
    } else {
      // Add new bowler with initial stats
      bowlerList.push({
        id,
        name,
        over: 0,
        ball: 0,
        run: 0,
        wicket: 0,
        maiden: 0,
      });
    }

    set({
      bowler:
        bowlerList[existingIndex >= 0 ? existingIndex : bowlerList.length - 1],
      [teamKey]: { ...currentTeam, bowlerList },
    });
  },

  // ---- Actions ----
  swapStrike: () => {
    const { batsman1, batsman2 } = get();
    set({
      batsman1: { ...batsman1, isStriker: !batsman1.isStriker },
      batsman2: { ...batsman2, isStriker: !batsman2.isStriker },
    });
  },

  addRun: (runs: number) => {
    get()._saveToHistory();

    const { batsman1, batsman2, inning, bowler } = get();
    const currentTeamKey = inning === 1 ? "team1" : "team2";
    const team = get()[currentTeamKey];

    const striker = batsman1.isStriker ? batsman1 : batsman2;
    const nonStriker = batsman1.isStriker ? batsman2 : batsman1;

    get().setRecentBalls(runs, "run", bowler.name, striker.name);

    const isOddRun = runs % 2 !== 0;

    // Update striker
    const updatedStriker = {
      ...striker,
      runs: striker.runs + runs,
      balls: striker.balls + 1,
      four: striker.four + (runs === 4 ? 1 : 0),
      six: striker.six + (runs === 6 ? 1 : 0),
      isStriker: isOddRun ? false : true,
    };

    // Update non-striker
    const updatedNonStriker = isOddRun
      ? { ...nonStriker, isStriker: true }
      : { ...nonStriker, isStriker: false };

    let updatedBatsman1, updatedBatsman2;
    if (batsman1.isStriker) {
      updatedBatsman1 = updatedStriker;
      updatedBatsman2 = updatedNonStriker;
    } else {
      updatedBatsman2 = updatedStriker;
      updatedBatsman1 = updatedNonStriker;
    }

    // Update batsman list in team
    const updatedBatsmanList = (team.batsmanList || []).map((b) => {
      if (b.id === updatedStriker.id) return updatedStriker;
      if (b.id === updatedNonStriker.id) return updatedNonStriker;
      return b;
    });

    // Update team balls and overs
    const nextBall = (team.ball + 1) % 6;
    const nextOver = team.over + Math.floor((team.ball + 1) / 6);
    const overCompleted = nextBall === 0;

    // Update bowler stats
    const nextBallBowler = (bowler.ball + 1) % 6;
    const nextOverBowler = bowler.over + Math.floor((bowler.ball + 1) / 6);

    const updatedBowler = {
      ...bowler,
      ball: nextBallBowler,
      run: bowler.run + runs,
      over: nextOverBowler,
    };
    // Update bowler list in team
    const updatedBowlerList = (team.bowlerList || []).map((b) => {
      if (b.id === bowler.id) return updatedBowler;
      return b;
    });

    set({
      batsman1: updatedBatsman1,
      batsman2: updatedBatsman2,
      bowler: updatedBowler,
      [currentTeamKey]: {
        ...team,
        runs: team.runs + runs,
        ball: nextBall,
        over: nextOver,
        batsmanList: updatedBatsmanList,
        bowlerList: updatedBowlerList,
      },

      isOverCompleted: overCompleted,
    });
  },

  addBonusRun: (run) => {
    const currentTeamKey = get().inning === 1 ? "team1" : "team2";
    const team = get()[currentTeamKey];
    get().setRecentBalls(run, "bonus", "", "");
    set({
      [currentTeamKey]: {
        ...team,
        runs: team.runs + run,
      },
    });
  },

  addExtra: (type: string, runs = 1) => {
    get()._saveToHistory();

    const { batsman1, batsman2, inning, bowler } = get();
    const striker = batsman1.isStriker ? batsman1 : batsman2;
    const nonStriker = batsman1.isStriker ? batsman2 : batsman1;
    const currentTeamKey = inning === 1 ? "team1" : "team2";
    const team = get()[currentTeamKey];
    const isOddRun = runs % 2 !== 0;

    get().setRecentBalls(runs, type, bowler, striker.name);

    if (type === "bye" || type === "lb") {
      const nextBall = (team.ball + 1) % 6;
      const nextOver = team.over + Math.floor((team.ball + 1) / 6);
      const overCompleted = nextBall === 0;
      const updatedStriker = {
        ...striker,
        balls: striker.balls + 1,
        isStriker: isOddRun ? false : true,
      };
      let updatedBatsman1, updatedBatsman2;
      const updatedNonStriker = isOddRun
        ? { ...nonStriker, isStriker: true }
        : { ...nonStriker, isStriker: false };

      if (batsman1.isStriker) {
        updatedBatsman1 = updatedStriker;
        updatedBatsman2 = updatedNonStriker;
      } else {
        updatedBatsman2 = updatedStriker;
        updatedBatsman1 = updatedNonStriker;
      }

      set({
        [currentTeamKey]: {
          ...team,
          runs: team.runs + runs,
          extras: team.extras + runs,
          ball: nextBall,
          over: nextOver,
        },
        batsman1: updatedBatsman1,
        batsman2: updatedBatsman2,
        isOverCompleted: overCompleted,
        bowler: { ...bowler, ball: bowler.ball + 1 },
      });

      return;
    }

    if (type === "nb") {
      // Update striker
      const updatedStriker = {
        ...striker,
        runs: striker.runs + runs + 1,
        four: striker.four + (runs === 4 ? 1 : 0),
        six: striker.six + (runs === 6 ? 1 : 0),
        isStriker: isOddRun ? false : true,
      };

      // Update non-striker
      const updatedNonStriker = isOddRun
        ? { ...nonStriker, isStriker: true }
        : { ...nonStriker, isStriker: false };

      let updatedBatsman1, updatedBatsman2;
      if (batsman1.isStriker) {
        updatedBatsman1 = updatedStriker;
        updatedBatsman2 = updatedNonStriker;
      } else {
        updatedBatsman2 = updatedStriker;
        updatedBatsman1 = updatedNonStriker;
      }

      set({
        batsman1: updatedBatsman1,
        batsman2: updatedBatsman2,
        [currentTeamKey]: {
          ...team,
          runs: team.runs + runs + 1,
        },
        bowler: { ...bowler, run: bowler.run + runs + 1 },
      });
      return;
    }

    if (type === "wide") {
      const updatedStriker = {
        ...striker,
        isStriker: isOddRun ? false : true,
      };

      // Update non-striker
      const updatedNonStriker = isOddRun
        ? { ...nonStriker, isStriker: true }
        : { ...nonStriker, isStriker: false };

      let updatedBatsman1, updatedBatsman2;
      if (batsman1.isStriker) {
        updatedBatsman1 = updatedStriker;
        updatedBatsman2 = updatedNonStriker;
      } else {
        updatedBatsman2 = updatedStriker;
        updatedBatsman1 = updatedNonStriker;
      }
      set({
        [currentTeamKey]: {
          ...team,
          runs: team.runs + runs + 1,
          extras: team.extras + runs + 1,
        },
        bowler: { ...bowler, run: bowler.run + runs + 1 },
        batsman1: updatedBatsman1,
        batsman2: updatedBatsman2,
      });
      return;
    }
    set({
      [currentTeamKey]: {
        ...team,
        runs: team.runs + runs,
        extras: team.extras + runs,
      },
      bowler: { ...bowler, run: bowler.run + runs },
    });
  },

  addWicket: (type = "bowled", whoOut = "striker", runsCompleted = 0) => {
    get()._saveToHistory();

    const { batsman1, batsman2, inning, bowler } = get();

    const currentTeamKey = inning === 1 ? "team1" : "team2";
    const team = get()[currentTeamKey];

    const striker = batsman1.isStriker ? batsman1 : batsman2;
    const nonStriker = batsman1.isStriker ? batsman2 : batsman1;

    const gotOut = whoOut === "striker" ? striker : nonStriker;

    get().setRecentBalls(runsCompleted, type, bowler, gotOut);

    let updatedTeam = { ...team };
    let updatedBowler = { ...bowler };
    let updatedStriker = { ...striker };
    let updatedNonStriker = { ...nonStriker };

    // ✅ Always count the ball
    updatedTeam.ball = (team.ball + 1) % 6;
    updatedTeam.over = team.over + Math.floor((team.ball + 1) / 6);
    const overCompleted = updatedTeam.ball === 0;

    updatedBowler.ball = (bowler.ball + 1) % 6;
    updatedBowler.over = bowler.over + Math.floor((bowler.ball + 1) / 6);

    // ✅ Common team wicket increment (unless retired)
    if (type !== "retired") updatedTeam.wicket += 1;

    // ============================
    // 🔹 Normal wicket types
    // ============================
    if (["bowled", "lbw", "caught", "stumped", "hitwicket"].includes(type)) {
      updatedStriker.isOut = true;
      updatedStriker.dismissalType = type;
      updatedStriker.isStriker = false;
      updatedBowler.wicket += 1;
    }

    // ============================
    // 🔹 Retired (not a team wicket)
    // ============================
    else if (type === "retired") {
      if (whoOut === "striker") updatedStriker.isOut = true;
      else updatedNonStriker.isOut = true;
    }

    // ============================
    // 🔹 Run Out logic (special case)
    // ============================
    else if (type === "runout") {
      // Bowler does NOT get wicket
      // Runs that were completed before the wicket still count
      updatedTeam.runs += runsCompleted;
      

      // If runs are odd → strike changes
      const strikeChanged = runsCompleted % 2 !== 0;

      if (whoOut === "striker") {
        // striker out
        updatedStriker.isOut = true;
        updatedStriker.dismissalType = "runout";
        updatedStriker.isStriker = false;

        // Non-striker becomes striker only if strike changes
        updatedNonStriker.isStriker = strikeChanged;
        updatedStriker.isStriker = !strikeChanged;
      } else {
        // non-striker out
        updatedNonStriker.isOut = true;
        updatedNonStriker.dismissalType = "runout";
        updatedNonStriker.isStriker = false;

        // Striker becomes non-striker only if strike changes
        updatedStriker.isStriker = !strikeChanged;
        updatedNonStriker.isStriker = strikeChanged;
      }
    }

    // ============================
    // 🔹 Reset the new striker (for next batsman selection)
    // ============================
    const newBatsmanTemplate = {
      id: null,
      name: "",
      runs: 0,
      balls: 0,
      four: 0,
      six: 0,
      isStriker: whoOut === "striker" ? false : true,
      isOut: false,
    };

    // Replace the out batsman with empty slot
    let finalBatsman1, finalBatsman2;
    if (whoOut === "striker") {
      finalBatsman1 = batsman1.isStriker
        ? newBatsmanTemplate
        : updatedNonStriker;
      finalBatsman2 = batsman1.isStriker
        ? updatedNonStriker
        : newBatsmanTemplate;
    } else {
      finalBatsman1 = batsman1.isStriker ? updatedStriker : newBatsmanTemplate;
      finalBatsman2 = batsman1.isStriker ? newBatsmanTemplate : updatedStriker;
    }

    // ✅ Update store
    set({
      batsman1: finalBatsman1,
      batsman2: finalBatsman2,
      bowler: updatedBowler,
      isOverCompleted: overCompleted,
      [currentTeamKey]: updatedTeam,
    });
  },

  addBatsman: (player: { id: string; name: string }, isStriker = false) => {
    get()._saveToHistory();

    const { inning } = get();
    const currentTeamKey = inning === 1 ? "team1" : "team2";
    const team = get()[currentTeamKey];

    const existingBatsman = (team.batsmanList || []).find(
      (b) => b.id === player.id
    );

    if (existingBatsman) {
      // Optionally update striker status
      const updatedBatsmanList = (team.batsmanList || []).map((b) =>
        b.id === player.id ? { ...b, isStriker } : b
      );
      set({
        [currentTeamKey]: { ...team, batsmanList: updatedBatsmanList },
      });
      return;
    }

    const newBatsman = {
      id: player.id,
      name: player.name,
      runs: 0,
      balls: 0,
      four: 0,
      six: 0,
      isOut: false,
      isStriker,
      order: team.batsmanList?.length || 0,
    };

    set({
      [currentTeamKey]: {
        ...team,
        batsmanList: [...(team.batsmanList || []), newBatsman],
      },
    });
  },

  addBowler: (player: { id: string; name: string }) => {
    get()._saveToHistory();

    const { inning } = get();
    const currentTeamKey = inning === 1 ? "team2" : "team1"; // opposite team bowls
    const team = get()[currentTeamKey];

    const bowlerList = team.bowlerList || [];

    // Check if bowler already exists
    const existingBowler = bowlerList.find((b) => b.id === player.id);

    if (existingBowler) {
      set({
        [currentTeamKey]: { ...team, bowlerList: bowlerList },
        bowler: { ...existingBowler },
      });
      return;
    }

    // Add new bowler
    const newBowler = {
      id: player.id,
      name: player.name,
      over: 0,
      ball: 0,
      run: 0,
      wicket: 0,
      maiden: 0,
    };

    set({
      [currentTeamKey]: { ...team, bowlerList: [...bowlerList, newBowler] },
      bowler: newBowler,
    });
  },

  // ---- Local storage ----
  persistMatch: async () => {
    const state = get();

    // Create match object with unique id
    const match = {
      id: nanoid(),
      date: new Date().toISOString(),
      team1: state.team1,
      team2: state.team2,
      totalOvers: state.totalOvers,
      totalWickets: state.totalWickets,
      venue: state.venue,
      tossWon: state.tossWon,
      opt: state.opt,
    };

    // Get existing history from local storage
    const existingHistory = (await getData("matchHistory")) || [];

    // Add new match
    const updatedHistory = [match,...existingHistory];

    // Save updated history
    await save("matchHistory", updatedHistory);

    // Also update state
    set({ matchHistory: updatedHistory });

    get().resetScore();
    
  },

  // Load match history on app start
  loadHistory: async () => {
    const history = (await getData("matchHistory")) || [];
    set({ matchHistory: history });
  },
  resetScore: async () => {
    set(getInitialState());
  },
}));
