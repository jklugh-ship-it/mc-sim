import { Bar } from "react-chartjs-2";
import { Chart, BarElement, CategoryScale, LinearScale } from "chart.js";

Chart.register(BarElement, CategoryScale, LinearScale);

interface WipItem {
  key: string;
  status: string;
  age: number;
}

interface AgingWipChartProps {
  wipItems: WipItem[];
}

export default function AgingWipChart({ wipItems }: AgingWipChartProps) {
  const statuses = ["Ready For Development", "In Progress", "Ready for Testing", "In Testing", "Ready for Acceptance"];
  const buckets = [
    { label: "0-7 days", min: 0, max: 7 },
    { label: "8-14 days", min: 8, max: 14 },
    { label: "15-30 days", min: 15, max: 30 },
    { label: "31-60 days", min: 31, max: 60 },
    { label: "61-90 days", min: 61, max: 90 },
    { label: "91+ days", min: 91, max: Infinity },
  ];

  const data = statuses.map(status => {
    const counts = buckets.map(() => 0);
    wipItems.filter(item => item.status === status).forEach(item => {
      const bucketIndex = buckets.findIndex(bucket => item.age >= bucket.min && item.age <= bucket.max);
      if (bucketIndex !== -1) {
        counts[bucketIndex]++;
      }
    });
    return counts;
  });

  const datasets = buckets.map((bucket, index) => ({
    label: bucket.label,
    data: data.map(statusData => statusData[index]),
    backgroundColor: `hsl(${index * 60}, 70%, 50%)`,
  }));

  return (
    <div style={{ background: "#fff", padding: "24px", borderRadius: "8px" }}>
      <h3>Aging Work in Progress</h3>
      <Bar
        data={{
          labels: statuses,
          datasets,
        }}
        options={{
          scales: {
            x: { stacked: true },
            y: { stacked: true },
          },
        }}
      />
    </div>
  );
}