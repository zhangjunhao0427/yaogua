/**
 * 全项目唯一的随机数来源，禁止 Math.random。
 * 底层用 crypto.getRandomValues，randomInt 做取模偏差剔除。
 */

export interface Rng {
  /** 返回 [0, 2^32) 内均匀分布的整数 */
  nextUint32(): number;
}

interface RandomValuesSource {
  getRandomValues(array: Uint32Array<ArrayBuffer>): unknown;
}

const UINT32_RANGE = 2 ** 32;
const POOL_SIZE = 256;

/** 批量取随机数存入池中，减少 getRandomValues 调用次数 */
export function createCryptoRng(source: RandomValuesSource | undefined = globalThis.crypto): Rng {
  if (typeof source?.getRandomValues !== 'function') {
    throw new Error('当前环境不支持 crypto.getRandomValues');
  }
  const pool = new Uint32Array(POOL_SIZE);
  let cursor = POOL_SIZE;
  return {
    nextUint32() {
      if (cursor === POOL_SIZE) {
        source.getRandomValues(pool);
        cursor = 0;
      }
      return pool[cursor++];
    },
  };
}

let defaultRng: Rng | undefined;

export function cryptoRng(): Rng {
  return (defaultRng ??= createCryptoRng());
}

/** 返回 [0, n) 内均匀分布的整数 */
export function randomInt(n: number, rng: Rng = cryptoRng()): number {
  if (!Number.isInteger(n) || n < 1 || n > UINT32_RANGE) {
    throw new RangeError(`randomInt：n 须为 1 到 2^32 之间的整数，收到 ${n}`);
  }
  // 丢弃末尾凑不满 n 个的余段，保证每个结果等概率
  const limit = UINT32_RANGE - (UINT32_RANGE % n);
  let x = rng.nextUint32();
  while (x >= limit) x = rng.nextUint32();
  return x % n;
}
