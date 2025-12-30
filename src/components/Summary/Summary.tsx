import { percentile } from "../../simulation/percentiles";

interface SummaryProps {
  results: number[];
}

export default function Summary({ results }: SummaryProps) {
  if (!results || results.length === 0) {
    return (
      <div
        style={{
          background: "#fff",
          padding: "24px",
          borderRadius: "8px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
        }}
      >
        <h2>No results yet</h2>
        <p>Upload data and run a simulation.</p>
      </div>
    );
  }

  const p50 = percentile(results, 0.5);
  const p85 = percentile(results, 0.85);
  const p95 = percentile(results, 0.95);

  return (
    <div
      style={{
        background: "#fff",
        padding: "24px",
        borderRadius: "8px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
      }}
    >
      <h2>Forecast Summary</h2>

      <div style={{ display: "flex", gap: "24px", marginTop: "16px" }}>
        <div>
          <div>P50</div>
          <strong>{p50} days</strong>
        </div>

        <div>
          <div>P85</div>
          <strong>{p85} days</strong>
        </div>

        <div>
          <div>P95</div>
          <strong>{p95} days</strong>
        </div>
      </div>
    </div>
  );
}