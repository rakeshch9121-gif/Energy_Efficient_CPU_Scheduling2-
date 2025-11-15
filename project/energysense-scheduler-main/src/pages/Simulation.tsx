import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, RotateCcw } from "lucide-react";

// Process class
class Process {
  pid: number;
  arrival_time: number;
  burst_time: number;
  completion_time: number = 0;
  turnaround_time: number = 0;
  waiting_time: number = 0;
  execution_time_actual: number = 0;
  energy_consumption: number = 0;

  constructor(pid: number, arrival_time: number, burst_time: number) {
    this.pid = pid;
    this.arrival_time = arrival_time;
    this.burst_time = burst_time;
  }
}

type DVFSLevel = {
  freq: number;
  volt: number;
  C: number;
};

type DVFSLevels = {
  HIGH: DVFSLevel;
  LOW: DVFSLevel;
};

type SimulationResult = {
  avg_wt: number;
  avg_tat: number;
  total_time: number;
  total_energy: number;
  processes: Process[];
};

const DVFS_LEVELS: DVFSLevels = {
  HIGH: { freq: 2000, volt: 1.2, C: 10 },
  LOW: { freq: 1000, volt: 0.8, C: 10 },
};

const BASE_FREQ = DVFS_LEVELS.HIGH.freq;

const Simulation = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [results, setResults] = useState<{
    high: SimulationResult | null;
    low: SimulationResult | null;
    dynamic: SimulationResult | null;
  }>({ high: null, low: null, dynamic: null });
  const [animatedRows, setAnimatedRows] = useState<number[]>([]);

  const runFCFSWithDVFS = (processes: Process[], freqMode: keyof DVFSLevels): SimulationResult => {
    const sortedProcesses = [...processes].sort((a, b) => a.arrival_time - b.arrival_time);
    let currentTime = 0;
    let totalEnergy = 0;
    let totalWait = 0;
    let totalTAT = 0;
    const level = DVFS_LEVELS[freqMode];

    for (const p of sortedProcesses) {
      if (currentTime < p.arrival_time) currentTime = p.arrival_time;
      const power = level.C * Math.pow(level.volt, 2) * level.freq * 1e-9;
      p.execution_time_actual = p.burst_time * (BASE_FREQ / level.freq);
      const energy = power * p.execution_time_actual;
      p.completion_time = currentTime + p.execution_time_actual;
      p.turnaround_time = p.completion_time - p.arrival_time;
      p.waiting_time = p.turnaround_time - p.burst_time;
      p.energy_consumption = energy;
      totalEnergy += energy;
      totalWait += p.waiting_time;
      totalTAT += p.turnaround_time;
      currentTime = p.completion_time;
    }

    return {
      avg_wt: totalWait / processes.length,
      avg_tat: totalTAT / processes.length,
      total_time: currentTime,
      total_energy: totalEnergy,
      processes: sortedProcesses,
    };
  };

  const runFCFSWithPredictionDVFS = (processes: Process[]): SimulationResult => {
    const sortedProcesses = [...processes].sort((a, b) => a.arrival_time - b.arrival_time);
    let currentTime = 0;
    let totalEnergy = 0;
    let totalWait = 0;
    let totalTAT = 0;
    const WORKLOAD_THRESHOLD = 15;

    for (let i = 0; i < sortedProcesses.length; i++) {
      const p = sortedProcesses[i];
      if (currentTime < p.arrival_time) currentTime = p.arrival_time;
      const remaining = sortedProcesses.slice(i).reduce((sum, pr) => sum + pr.burst_time, 0);
      const level = remaining > WORKLOAD_THRESHOLD ? DVFS_LEVELS.HIGH : DVFS_LEVELS.LOW;
      const power = level.C * Math.pow(level.volt, 2) * level.freq * 1e-9;
      p.execution_time_actual = p.burst_time * (BASE_FREQ / level.freq);
      const energy = power * p.execution_time_actual;
      p.completion_time = currentTime + p.execution_time_actual;
      p.turnaround_time = p.completion_time - p.arrival_time;
      p.waiting_time = p.turnaround_time - p.burst_time;
      p.energy_consumption = energy;
      totalEnergy += energy;
      totalWait += p.waiting_time;
      totalTAT += p.turnaround_time;
      currentTime = p.completion_time;
    }

    return {
      avg_wt: totalWait / processes.length,
      avg_tat: totalTAT / processes.length,
      total_time: currentTime,
      total_energy: totalEnergy,
      processes: sortedProcesses,
    };
  };

  const runSimulation = () => {
    const data = [
      new Process(1, 0, 6),
      new Process(2, 0, 8),
      new Process(3, 0, 7),
      new Process(4, 0, 3),
    ];

    const high = runFCFSWithDVFS(JSON.parse(JSON.stringify(data)), "HIGH");
    const low = runFCFSWithDVFS(JSON.parse(JSON.stringify(data)), "LOW");
    const dynamic = runFCFSWithPredictionDVFS(JSON.parse(JSON.stringify(data)));

    setResults({ high, low, dynamic });
  };

  useEffect(() => {
    runSimulation();
  }, []);

  useEffect(() => {
    // Animate rows when page changes
    setAnimatedRows([]);
    const timer = setTimeout(() => {
      const result = currentPage === 1 ? results.high : currentPage === 2 ? results.low : results.dynamic;
      if (result) {
        result.processes.forEach((_, idx) => {
          setTimeout(() => {
            setAnimatedRows((prev) => [...prev, idx]);
          }, idx * 350);
        });
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [currentPage, results]);

  const ResultTable = ({ title, result }: { title: string; result: SimulationResult }) => (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-foreground">{title}</h2>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-muted/50">
              <th className="border border-border p-3 text-foreground">PID</th>
              <th className="border border-border p-3 text-foreground">Burst Time</th>
              <th className="border border-border p-3 text-foreground">Completion Time</th>
              <th className="border border-border p-3 text-foreground">Turnaround Time</th>
              <th className="border border-border p-3 text-foreground">Waiting Time</th>
              <th className="border border-border p-3 text-foreground">Energy (J)</th>
            </tr>
          </thead>
          <tbody>
            {result.processes.map((p, idx) => (
              <tr
                key={p.pid}
                className={`transition-opacity duration-500 ${
                  animatedRows.includes(idx) ? "opacity-100" : "opacity-0"
                }`}
              >
                <td className="border border-border p-3 text-center text-foreground">{p.pid}</td>
                <td className="border border-border p-3 text-center text-muted-foreground">
                  {p.burst_time.toFixed(2)}
                </td>
                <td className="border border-border p-3 text-center text-muted-foreground">
                  {p.completion_time.toFixed(2)}
                </td>
                <td className="border border-border p-3 text-center text-muted-foreground">
                  {p.turnaround_time.toFixed(2)}
                </td>
                <td className="border border-border p-3 text-center text-muted-foreground">
                  {p.waiting_time.toFixed(2)}
                </td>
                <td className="border border-border p-3 text-center text-primary">
                  {p.energy_consumption.toExponential(6)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="text-sm text-muted-foreground space-y-1">
        <p>
          <strong className="text-foreground">Avg Waiting:</strong> {result.avg_wt.toFixed(2)} |{" "}
          <strong className="text-foreground">Avg Turnaround:</strong> {result.avg_tat.toFixed(2)}
        </p>
        <p>
          <strong className="text-foreground">Makespan:</strong> {result.total_time.toFixed(2)} |{" "}
          <strong className="text-primary">Total Energy:</strong> {result.total_energy.toFixed(6)} J
        </p>
      </div>
    </div>
  );

  const ComparisonView = () => {
    if (!results.high || !results.low || !results.dynamic) return null;

    const energySavedLow = results.high.total_energy - results.low.total_energy;
    const energySavedDynamic = results.high.total_energy - results.dynamic.total_energy;

    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-foreground">Comparison & Energy Savings</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="p-6 bg-card/50 backdrop-blur-sm border-secondary/40">
            <h3 className="text-lg font-semibold text-secondary mb-3">Global Low Frequency</h3>
            <p className="text-sm text-muted-foreground mb-2">
              <strong className="text-foreground">Energy Saved:</strong> {energySavedLow.toFixed(6)} J
            </p>
            <p className="text-sm text-muted-foreground mb-2">
              <strong className="text-secondary">Savings:</strong>{" "}
              {((energySavedLow / results.high.total_energy) * 100).toFixed(2)}%
            </p>
            <p className="text-sm text-muted-foreground">
              <strong className="text-foreground">Performance Trade-off:</strong>{" "}
              {(((results.low.total_time - results.high.total_time) / results.high.total_time) * 100).toFixed(2)}%
              slower
            </p>
          </Card>

          <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/40">
            <h3 className="text-lg font-semibold text-primary mb-3">Dynamic Frequency (DVFS)</h3>
            <p className="text-sm text-muted-foreground mb-2">
              <strong className="text-foreground">Energy Saved:</strong> {energySavedDynamic.toFixed(6)} J
            </p>
            <p className="text-sm text-muted-foreground mb-2">
              <strong className="text-primary">Savings:</strong>{" "}
              {((energySavedDynamic / results.high.total_energy) * 100).toFixed(2)}%
            </p>
            <p className="text-sm text-muted-foreground">
              <strong className="text-foreground">Performance Trade-off:</strong>{" "}
              {(((results.dynamic.total_time - results.high.total_time) / results.high.total_time) * 100).toFixed(
                2
              )}
              % slower
            </p>
          </Card>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-tech-dark via-background to-tech-blue/20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link to="/">
            <Button variant="outline" className="border-primary/40 hover:bg-primary/10">
              <ArrowLeft className="mr-2 w-4 h-4" />
              Back to Home
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-foreground">CPU Scheduling Simulation</h1>
          <Button
            variant="outline"
            onClick={() => {
              runSimulation();
              setCurrentPage(1);
            }}
            className="border-secondary/40 hover:bg-secondary/10"
          >
            <RotateCcw className="mr-2 w-4 h-4" />
            Restart
          </Button>
        </div>

        {/* Content */}
        <Card className="p-8 bg-card/80 backdrop-blur-xl border-border/50 mb-6">
          {currentPage === 1 && results.high && <ResultTable title="HIGH Frequency (Before DVFS)" result={results.high} />}
          {currentPage === 2 && results.low && <ResultTable title="LOW Frequency (After DVFS Applied Globally)" result={results.low} />}
          {currentPage === 3 && results.dynamic && <ResultTable title="DYNAMIC Frequency (With Workload Prediction)" result={results.dynamic} />}
          {currentPage === 4 && <ComparisonView />}
        </Card>

        {/* Navigation */}
        <div className="flex justify-center gap-4">
          <Button
            onClick={() => setCurrentPage((p) => (p > 1 ? p - 1 : 4))}
            className="bg-primary/90 hover:bg-primary text-primary-foreground"
          >
            {currentPage === 1 ? "← Last" : "← Back"}
          </Button>
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4].map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-2 h-2 rounded-full transition-all ${
                  currentPage === page ? "bg-primary w-8" : "bg-muted"
                }`}
              />
            ))}
          </div>
          <Button
            onClick={() => setCurrentPage((p) => (p < 4 ? p + 1 : 1))}
            className="bg-primary/90 hover:bg-primary text-primary-foreground"
          >
            {currentPage === 4 ? "Restart →" : "Next →"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Simulation;
