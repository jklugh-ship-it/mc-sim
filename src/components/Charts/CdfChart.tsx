import { Line } from "react-chartjs-2";
import { Chart, LineElement, CategoryScale, LinearScale, PointElement } from "chart.js";

Chart.register(LineElement, CategoryScale, LinearScale, PointElement);

interface CdfChartProps {
  completionDays: number[];
}

export default function CdfChart({ completionDays }: CdfChartProps) {
  const sorted = [...completionDays].sort((a, b) => a - b);
  const labels = sorted;
  const cdf = sorted.map((_, i) => (i + 1) / sorted.length);

  return (
    <div style={{ background: "#fff", padding: "24px", borderRadius: "8px" }}>
      <h3>CDF</h3>
      <Line
        data={{
          labels,
          datasets: [
            {
              label: "CDF",
              data: cdf,
              borderColor: "#007bff",
              fill: false,
            },
          ],
        }}
      />
    </div>
  );
}