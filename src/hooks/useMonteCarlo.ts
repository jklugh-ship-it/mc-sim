import { useState } from "react";
import { runMonteCarlo } from "../simulation/monteCarlo";

export function useMonteCarlo(cycleTimes: {cycleTime: number, startDate: Date}[], workItemCount: number) {
  const [results, setResults] = useState<number[]>([]);

  function runSimulation() {
    console.log("Running simulation with cycleTimes:", cycleTimes.length);
    if (cycleTimes.length === 0) {
      console.log("No cycle times, skipping");
      return;
    }
    const cycleTimeValues = cycleTimes.map(c => c.cycleTime);
    const output = runMonteCarlo(cycleTimeValues, workItemCount, 10000);
    console.log("Simulation results:", output.length);
    setResults(output);
  }

  return { results, runSimulation };
}