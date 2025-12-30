import Sidebar from "../components/Sidebar/Sidebar";
import Histogram from "../components/Charts/Histogram";
import CdfChart from "../components/Charts/CdfChart";
import AgingWipChart from "../components/Charts/AgingWipChart";
import CycleTimeScatterPlot from "../components/Charts/CycleTimeScatterPlot";
import HowLongHistogram from "../components/Charts/HowLongHistogram";
import { useCycleTimeData } from "../hooks/useCycleTimeData";
import { useMonteCarlo } from "../hooks/useMonteCarlo";
import { useState } from "react";

interface WipItem {
  key: string;
  status: string;
  age: number;
}

export default function Dashboard() {
  const {
    cycleTimes,
    setCycleTimes,
    workItemCount,
    setWorkItemCount,
  } = useCycleTimeData();

  const { results, runSimulation } = useMonteCarlo(cycleTimes, workItemCount);

  const [wipItems, setWipItems] = useState<WipItem[]>([]);
  const [dataMinDate, setDataMinDate] = useState<string | null>(null);
  const [dataMaxDate, setDataMaxDate] = useState<string | null>(null);

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <Sidebar
        setCycleTimes={setCycleTimes}
        runSimulation={runSimulation}
        setWipItems={setWipItems}
        setDataMinDate={setDataMinDate}
        setDataMaxDate={setDataMaxDate}
        dataMinDate={dataMinDate}
        dataMaxDate={dataMaxDate}
      />

      <div style={{ flex: 1, padding: "24px", overflowY: "auto" }}>
        <div style={{ marginTop: "24px", display: "grid", gap: "24px" }}>
          <Histogram cycleTimes={cycleTimes} />
          {results.length > 0 && (
            <>
              <HowLongHistogram completionDays={results} workItemCount={workItemCount} setWorkItemCount={setWorkItemCount} />
              <CdfChart completionDays={results} />
              <AgingWipChart wipItems={wipItems} />
              <CycleTimeScatterPlot wipItems={wipItems} cycleTimes={cycleTimes} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}