export function runMonteCarlo(
  cycleTimes: number[],
  workItemCount: number,
  trials: number
): number[] {
  const results = new Array(trials);

  for (let i = 0; i < trials; i++) {
    let total = 0;

    for (let j = 0; j < workItemCount; j++) {
      const sample =
        cycleTimes[Math.floor(Math.random() * cycleTimes.length)];
      total += sample;
    }

    results[i] = total;
  }

  return results.sort((a, b) => a - b);
}

export function runMonteCarloHowMany(
  dailyCompletions: number[],
  timeLimit: number,
  trials: number
): number[] {
  const results = new Array(trials);

  for (let i = 0; i < trials; i++) {
    let total = 0;
    for (let j = 0; j < timeLimit; j++) {
      const sample = dailyCompletions[Math.floor(Math.random() * dailyCompletions.length)];
      total += sample;
    }
    results[i] = total;
  }

  return results.sort((a, b) => a - b);
}