import { describe, expect, it } from 'vitest';
import { createShakeDetector } from './motion';

describe('摇动检测', () => {
  it('静止不触发，猛晃触发，冷却期内不重复', () => {
    const detect = createShakeDetector({ threshold: 15, cooldownMs: 1000 });
    const still = { x: 0, y: 9.8, z: 0 };
    const jolt = { x: 12, y: -3, z: 8 };

    expect(detect(still, 0)).toBe(false);
    expect(detect(still, 16)).toBe(false);
    expect(detect(jolt, 32)).toBe(true);
    expect(detect(still, 48)).toBe(false);
    expect(detect(jolt, 1100)).toBe(true);
  });
});
