import { Bar } from "react-chartjs-2";
import { Chart, BarElement, CategoryScale, LinearScale } from "chart.js";

Chart.register(BarElement, CategoryScale, LinearScale);

interface HowLongHistogramProps {
  completionDays: number[];
  workItemCount: number;
  setWorkItemCount: (count: number) => void;
}

export default function HowLongHistogram({ completionDays, workItemCount, setWorkItemCount }: HowLongHistogramProps) {
  const sorted = [...completionDays].sort((a, b) => a - b);
  const bins = 20;
  const min = sorted[0];
  const max = sorted[sorted.length - 1];
  const binSize = (max - min) / bins;

  const counts = new Array(bins).fill(0);
  sorted.forEach((value) => {
    const index = Math.min(
      bins - 1,
      Math.floor((value - min) / binSize)
    );
    counts[index]++;
  });

  const labels = counts.map((_, i) => `${Math.round(min + i * binSize)}`);

  return (
    <div style={{ background: "#fff", padding: "24px", borderRadius: "8px" }}>
      <h3>How Long</h3>
      <div style={{ marginBottom: "16px" }}>
        <label>Work Item Count: <input type="number" min="1" value={workItemCount} onChange={(e) => setWorkItemCount(parseInt(e.target.value))} /></label>
      </div>
      <Bar
        data={{
          labels,
          datasets: [
            {
              label: "Frequency",
              data: counts,
              backgroundColor: "rgba(255, 123, 0, 0.5)",
            },
          ],
        }}
      />
    </div>
  );
}