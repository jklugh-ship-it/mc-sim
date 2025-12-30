export interface Task {
  id: string
  name: string
  opt: number // optimistic
  ml: number  // most likely
  pess: number // pessimistic
}

export interface SimulationResult {
  completionDay: number
  cycleTimes: number[]
}