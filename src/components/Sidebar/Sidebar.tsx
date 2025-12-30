import React, { useState, useEffect } from 'react';

interface SidebarProps {
  setCycleTimes: (times: {cycleTime: number, startDate: Date, completedDate: Date}[]) => void;
  runSimulation: () => void;
  setWipItems: (items: WipItem[]) => void;
  setDataMinDate: (date: string | null) => void;
  setDataMaxDate: (date: string | null) => void;
  dataMinDate: string | null;
  dataMaxDate: string | null;
}

interface WipItem {
  key: string;
  status: string;
  age: number;
}

export default function Sidebar({
  setCycleTimes,
  runSimulation,
  setWipItems,
  setDataMinDate,
  setDataMaxDate,
  dataMinDate,
  dataMaxDate,
}: SidebarProps) {
  const [selectedStages, setSelectedStages] = useState<string[]>([
    "Ready For Development",
    "In Progress", 
    "Ready for Testing",
    "In Testing",
    "Ready for Acceptance",
    "Resolved"
  ]);
  const [rawData, setRawData] = useState<string[]>([]);

  useEffect(() => {
    if (rawData.length > 0) {
      parseData(rawData, selectedStages);
    }
  }, [selectedStages]);

  const [availableColumns, setAvailableColumns] = useState<string[]>([]);

  function parseData(lines: string[], stages: string[]) {
    const headers = lines[0].split(",").map(h => h.trim());
    const dateIndices = stages.map(col => headers.indexOf(col)).filter(idx => idx !== -1);

    const cycleTimes: {cycleTime: number, startDate: Date, completedDate: Date}[] = [];
    const wipItems: WipItem[] = [];
    const allDates: Date[] = [];
    const now = new Date();

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(",").map(v => v.trim());
      const key = values[0];
      const dates: { status: string; date: Date }[] = [];

      for (let j = 0; j < dateIndices.length; j++) {
        const idx = dateIndices[j];
        if (idx !== -1 && values[idx] && values[idx] !== "") {
          const date = new Date(values[idx]);
          if (!isNaN(date.getTime())) {
            dates.push({ status: stages[j], date });
            allDates.push(date);
          }
        }
      }

      if (dates.length >= 2) {
        const minDate = new Date(Math.min(...dates.map(d => d.date.getTime())));
        const maxDate = new Date(Math.max(...dates.map(d => d.date.getTime())));
        const diffTime = maxDate.getTime() - minDate.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays > 0) {
          cycleTimes.push({cycleTime: diffDays, startDate: minDate, completedDate: maxDate});
        }
      }

      // Check if resolved
      const resolvedIdx = headers.indexOf("Resolved");
      if (resolvedIdx !== -1 && (!values[resolvedIdx] || values[resolvedIdx] === "")) {
        // Unresolved, find current status and total age
        const lastDate = dates[dates.length - 1];
        if (lastDate && dates.length > 0) {
          const totalAge = Math.ceil((now.getTime() - dates[0].date.getTime()) / (1000 * 60 * 60 * 24));
          wipItems.push({ key, status: lastDate.status, age: totalAge });
        }
      }
    }

    setCycleTimes(cycleTimes);
    setWipItems(wipItems);
    if (allDates.length > 0) {
      const minD = new Date(Math.min(...allDates.map(d => d.getTime())));
      const maxD = new Date(Math.max(...allDates.map(d => d.getTime())));
      setDataMinDate(minD.toISOString().split('T')[0]);
      setDataMaxDate(maxD.toISOString().split('T')[0]);
    }
    console.log("Parsed cycle times:", cycleTimes);
    console.log("Parsed WIP items:", wipItems);
  }
  function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const text = reader.result as string;
      const lines = text.split("\n").map(line => line.trim()).filter(line => line);
      if (lines.length < 2) return; // Need at least header and one data row

      const headers = lines[0].split(",").map(h => h.trim());
      setAvailableColumns(headers);
      setRawData(lines);
      parseData(lines, selectedStages);
    };
    reader.readAsText(file);
  }

  return (
    <div
      style={{
        width: "260px",
        background: "#fff",
        padding: "24px",
        borderRight: "1px solid #eee",
      }}
    >
      <h2 style={{ marginBottom: "16px" }}>Inputs</h2>

      <label>Upload CSV</label>
      <input type="file" accept=".csv" onChange={handleFileUpload} />
      <p style={{ fontSize: "12px", color: "#666", marginTop: "4px" }}>
        CSV with date columns: Ready For Development, In Progress, etc., Resolved. Cycle times calculated from min to max date.
      </p>

      {dataMinDate && dataMaxDate && (
        <p style={{ fontSize: "12px", color: "#666", marginTop: "8px" }}>
          Data range: {dataMinDate} to {dataMaxDate}
        </p>
      )}

      {availableColumns.length > 0 && (
        <div style={{ marginTop: "16px" }}>
          <label>Workflow Stages</label>
          <p style={{ fontSize: "12px", color: "#666", marginTop: "4px" }}>
            Select which columns represent workflow stages:
          </p>
          {availableColumns.map(col => (
            <label key={col} style={{ display: "block", marginTop: "4px" }}>
              <input
                type="checkbox"
                checked={selectedStages.includes(col)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedStages([...selectedStages, col]);
                  } else {
                    setSelectedStages(selectedStages.filter(s => s !== col));
                  }
                }}
              />
              {col}
            </label>
          ))}
        </div>
      )}

      <button
        style={{
          marginTop: "24px",
          width: "100%",
          padding: "12px",
          background: "#007bff",
          color: "#fff",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
        onClick={runSimulation}
      >
        Run Simulation
      </button>
    </div>
  );
}