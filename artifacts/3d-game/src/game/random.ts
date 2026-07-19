export function randomBetween(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

export function randomCentered(span: number): number {
  return randomBetween(-span / 2, span / 2);
}

export function randomAngle(): number {
  return randomBetween(0, Math.PI * 2);
}

export function pickRandom<T>(items: readonly T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}
