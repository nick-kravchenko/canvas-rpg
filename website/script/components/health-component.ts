type healthTick = [number, number]; // [ttl, health]

export interface HealthComponent {
  max: number;
  current: number;
  regenPerSecond: number;
  ticks: healthTick[]
}
