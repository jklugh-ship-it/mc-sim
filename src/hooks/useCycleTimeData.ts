import { useState } from "react";

export function useCycleTimeData() {
  const [cycleTimes, setCycleTimes] = useState<{cycleTime: number, startDate: Date, completedDate: Date}[]>([]);
  const [workItemCount, setWorkItemCount] = useState(10);

  return {
    cycleTimes,
    setCycleTimes,
    workItemCount,
    setWorkItemCount,
  };
}