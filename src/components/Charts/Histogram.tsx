import { Bar } from "react-chartjs-2";
import { Chart, BarElement, CategoryScale, LinearScale } from "chart.js";
import { useState, useEffect } from "react";
import { runMonteCarloHowMany } from "../../simulation/monteCarlo";

Chart.register(BarElement, CategoryScale, LinearScale);

interface CycleTimeData {
  cycleTime: number;
  startDate: Date;
  completedDate: Date;
}

interface HistogramProps {
  cycleTimes: CycleTimeData[];
}

export default function Histogram({ cycleTimes }: HistogramProps) {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [throughputStartDate, setThroughputStartDate] = useState("");
  const [throughputEndDate, setThroughputEndDate] = useState("");
  const [results, setResults] = useState<number[]>([]);

  const runSimulation = () => {
    if (startDate && endDate && cycleTimes.length > 0) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const timeLimit = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
      console.log('Time limit:', timeLimit);
      if (timeLimit <= 0) {
        setResults([]);
        return;
      }
      let filteredCycleTimes = cycleTimes;
      if (throughputStartDate && throughputEndDate) {
        const tStart = new Date(throughputStartDate);
        const tEnd = new Date(throughputEndDate);
        filteredCycleTimes = cycleTimes.filter(c => c.startDate >= tStart && c.startDate <= tEnd);
      }
      // Compute daily completions from historical data
      const dailyMap = new Map<string, number>();
      filteredCycleTimes.forEach(c => {
        const dateKey = c.completedDate.toISOString().split('T')[0];
        dailyMap.set(dateKey, (dailyMap.get(dateKey) || 0) + 1);
      });
      const dailyCompletions = Array.from(dailyMap.values());
      if (dailyCompletions.length === 0) {
        setResults([]);
        return;
      }
      const simResults = runMonteCarloHowMany(dailyCompletions, timeLimit, 10000);
      console.log('Daily completions distribution:', dailyCompletions.slice(0,10));
      console.log('Sim results sample:', simResults.slice(0,5));
      setResults(simResults);
    } else {
      setResults([]);
    }
  };

  useEffect(() => {
    runSimulation();
  }, [startDate, endDate, throughputStartDate, throughputEndDate, cycleTimes]);

  return (
    <div style={{ background: "#fff", padding: "24px", borderRadius: "8px" }}>
      <h3>How Many</h3>
      <div style={{ display: "flex", gap: "20px", alignItems: "flex-start", marginBottom: "16px" }}>
        <div>
          <h4 style={{ marginBottom: "8px", fontSize: "14px" }}>Forecast Timebox</h4>
          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            <label>Start Date: <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} /></label>
            <label>End Date: <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} /></label>
          </div>
          <p style={{ fontSize: "12px", color: "#666", marginTop: "4px" }}>
            Select a date range to forecast how many items will complete
          </p>
        </div>
        <div>
          <h4 style={{ marginBottom: "8px", fontSize: "14px" }}>Throughput Dates</h4>
          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            <label>Start Date: <input type="date" value={throughputStartDate} onChange={(e) => setThroughputStartDate(e.target.value)} /></label>
            <label>End Date: <input type="date" value={throughputEndDate} onChange={(e) => setThroughputEndDate(e.target.value)} /></label>
          </div>
          <p style={{ fontSize: "12px", color: "#666", marginTop: "4px" }}>
            Filter historical data used for Monte Carlo trials (optional)
          </p>
        </div>
        <div style={{ display: "flex", alignItems: "flex-end" }}>
          <button onClick={runSimulation} style={{ padding: "8px 16px", background: "#007bff", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}>
            Re-simulate
          </button>
        </div>
      </div>
      {results.length === 0 ? (
        <p>No simulation results. Forecast dates set: {startDate && endDate ? 'Yes' : 'No'}, Time limit: {startDate && endDate ? Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24)) : 'N/A'}, CycleTimes: {cycleTimes.length}, Filtered: {throughputStartDate && throughputEndDate ? cycleTimes.filter(c => {
          const tStart = new Date(throughputStartDate);
          const tEnd = new Date(throughputEndDate);
          return c.startDate >= tStart && c.startDate <= tEnd;
        }).length : 'N/A'}, Daily completions: {(() => {
          const filtered = throughputStartDate && throughputEndDate ? cycleTimes.filter(c => {
            const tStart = new Date(throughputStartDate);
            const tEnd = new Date(throughputEndDate);
            return c.startDate >= tStart && c.startDate <= tEnd;
          }) : cycleTimes;
          const dailyMap = new Map<string, number>();
          filtered.forEach(c => {
            const completionDate = new Date(c.startDate);
            completionDate.setDate(completionDate.getDate() + c.cycleTime);
            const dateKey = completionDate.toISOString().split('T')[0];
            dailyMap.set(dateKey, (dailyMap.get(dateKey) || 0) + 1);
          });
          return dailyMap.size;
        })()}</p>
      ) : (
        <>
          {(() => {
            const sorted = [...results].sort((a, b) => a - b);
            const max = sorted[sorted.length - 1];
            const distinct = new Set(results).size;
            let labels: string[];
            let counts: number[];
            if (distinct > 50) {
              const binSize = Math.max(1, Math.ceil((max + 1) / 50));
              const bins = new Map<number, number>();
              // Initialize bins from 0 to cover the range
              for (let b = 0; b <= max; b += binSize) {
                bins.set(b, 0);
              }
              for (const r of results) {
                const bin = Math.floor(r / binSize) * binSize;
                bins.set(bin, (bins.get(bin) || 0) + 1);
              }
              const binKeys = Array.from(bins.keys()).sort((a, b) => a - b);
              labels = binKeys.map(b => {
                const end = Math.min(b + binSize - 1, max);
                return `${b}-${end}`;
              });
              counts = binKeys.map(b => bins.get(b) || 0);
            } else {
              const valueCounts = new Map<number, number>();
              for (const r of results) {
                valueCounts.set(r, (valueCounts.get(r) || 0) + 1);
              }
              const sortedValues = Array.from(valueCounts.keys()).sort((a, b) => a - b);
              labels = sortedValues.map(v => v.toString());
              counts = sortedValues.map(v => valueCounts.get(v)!);
            }
            return (
              <>
                <Bar
                  data={{
                    labels,
                    datasets: [
                      {
                        label: "Frequency",
                        data: counts,
                        backgroundColor: "rgba(0, 123, 255, 0.5)",
                      },
                    ],
                  }}
                  options={{
                    scales: {
                      x: {
                        min: 0,
                      },
                    },
                  }}
                />
                <div style={{ marginTop: "16px", padding: "12px", background: "#f8f9fa", borderRadius: "4px", border: "1px solid #dee2e6" }}>
                  <h4 style={{ margin: "0 0 8px 0", fontSize: "14px" }}>Completion Probabilities</h4>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: "8px", fontSize: "12px" }}>
                    <div>50% chance of {results[Math.floor(0.50 * results.length)]} or more</div>
                    <div>70% chance of {results[Math.floor(0.30 * results.length)]} or more</div>
                    <div>85% chance of {results[Math.floor(0.15 * results.length)]} or more</div>
                    <div>95% chance of {results[Math.floor(0.05 * results.length)]} or more</div>
                  </div>
                </div>
              </>
            );
          })()}
        </>
      )}
    </div>
  );
}