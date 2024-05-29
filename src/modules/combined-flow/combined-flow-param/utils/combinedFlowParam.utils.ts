export class NameCounter {
  private accumulator: Record<string, number> = {};

  increment(name: string): void {
    if (this.accumulator[name]) {
      this.accumulator[name]++;
    } else {
      this.accumulator[name] = 1;
    }
  }

  getAccumulator(): Record<string, number> {
    return this.accumulator;
  }

  getNumber(name: string): number {
    return this.accumulator[name] ?? 0;
  }
}
