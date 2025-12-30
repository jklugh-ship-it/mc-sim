import { Scatter } from "react-chartjs-2";
import { Chart, PointElement, LineElement, CategoryScale, LinearScale } from "chart.js";

Chart.register(PointElement, LineElement, CategoryScale, LinearScale);

interface WipItem {
  key: string;
  status: string;
  age: number;
}

interface CycleTimeScatterPlotProps {
  wipItems: WipItem[];
  cycleTimes: {cycleTime: number, startDate: Date, completedDate: Date}[];
}

export default function CycleTimeScatterPlot({ wipItems, cycleTimes }: CycleTimeScatterPlotProps) {
  if (cycleTimes.length === 0) return null;

  // Sample predicted cycle times for WIP items
  const wipData = wipItems.map(item => {
    const predictedCycle = cycleTimes[Math.floor(Math.random() * cycleTimes.length)].cycleTime;
    return {
      x: item.age,
      y: item.age + predictedCycle,
    };
  });

  // Percentiles
  const cycleTimeValues = cycleTimes.map(c => c.cycleTime).sort((a, b) => a - b);
  const p50 = cycleTimeValues[Math.floor(0.5 * cycleTimeValues.length)];
  const p85 = cycleTimeValues[Math.floor(0.85 * cycleTimeValues.length)];
  const p95 = cycleTimeValues[Math.floor(0.95 * cycleTimeValues.length)];

  const datasets = [
    {
      label: "WIP Items",
      data: wipData,
      backgroundColor: "rgba(0, 123, 255, 0.5)",
      pointRadius: 5,
    },
    {
      label: "50th Percentile",
      data: [{ x: 0, y: p50 }, { x: Math.max(...wipItems.map(i => i.age)), y: p50 }],
      borderColor: "green",
      borderWidth: 2,
      fill: false,
      showLine: true,
      pointRadius: 0,
    },
    {
      label: "85th Percentile",
      data: [{ x: 0, y: p85 }, { x: Math.max(...wipItems.map(i => i.age)), y: p85 }],
      borderColor: "orange",
      borderWidth: 2,
      fill: false,
      showLine: true,
      pointRadius: 0,
    },
    {
      label: "95th Percentile",
      data: [{ x: 0, y: p95 }, { x: Math.max(...wipItems.map(i => i.age)), y: p95 }],
      borderColor: "red",
      borderWidth: 2,
      fill: false,
      showLine: true,
      pointRadius: 0,
    },
  ];

  return (
    <div style={{ background: "#fff", padding: "24px", borderRadius: "8px" }}>
      <h3>Cycle Time Scatter Plot</h3>
      <Scatter
        data={{
          datasets,
        }}
        options={{
          scales: {
            x: { title: { display: true, text: "Current Age (days)" } },
            y: { title: { display: true, text: "Predicted Completion (days)" } },
          },
        }}
      />
    </div>
  );
}