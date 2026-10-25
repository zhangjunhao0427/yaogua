// 英文的卦名、八卦与梅花取象。
// 卦名用英语易学通行的短名，全称带上卦序号——英语读者手边多半有一本带编号的译本。
import type { TrigramName } from '../../../core/types';
import type { TrigramLoreText } from '../../types';

export const hexagramNames: readonly string[] = [
  'The Creative', 'The Receptive', 'Sprouting', 'Youthful Folly', 'Waiting', 'Conflict', 'The Army', 'Holding Together',
  'Small Restraint', 'Treading', 'Peace', 'Standstill', 'Fellowship', 'Great Possession', 'Modesty', 'Enthusiasm',
  'Following', 'Repair', 'Approach', 'Contemplation', 'Biting Through', 'Grace', 'Stripping Away', 'Return',
  'Innocence', 'Great Restraint', 'Nourishment', 'Great Excess', 'The Abyss', 'Radiance', 'Influence', 'Duration',
  'Retreat', 'Great Power', 'Progress', 'Darkening of the Light', 'The Family', 'Opposition', 'Obstruction', 'Deliverance',
  'Decrease', 'Increase', 'Breakthrough', 'Encounter', 'Gathering', 'Ascending', 'Confinement', 'The Well',
  'Revolution', 'The Cauldron', 'Shock', 'Keeping Still', 'Gradual Progress', 'The Marrying Maiden', 'Abundance', 'The Wanderer',
  'The Gentle', 'The Joyous', 'Dispersion', 'Limitation', 'Inner Truth', 'Small Excess', 'After Completion', 'Before Completion',
];

export const hexagramFullNames: readonly string[] = hexagramNames.map((name, i) => `${i + 1}. ${name}`);

export const trigramName: Record<TrigramName, string> = {
  乾: 'Qian',
  兑: 'Dui',
  离: 'Li',
  震: 'Zhen',
  巽: 'Xun',
  坎: 'Kan',
  艮: 'Gen',
  坤: 'Kun',
};

export const trigramImage: Record<TrigramName, string> = {
  乾: 'Heaven',
  兑: 'Lake',
  离: 'Fire',
  震: 'Thunder',
  巽: 'Wind',
  坎: 'Water',
  艮: 'Mountain',
  坤: 'Earth',
};

export const trigramLore: Record<TrigramName, TrigramLoreText> = {
  乾: {
    image: 'Heaven',
    nature: 'firm and tireless',
    person: 'the father, an elder, someone above you, someone who decides',
    body: 'head, bones, lungs',
    thing: 'gold and jade, round things, carriages, high places',
  },
  兑: {
    image: 'Lake',
    nature: 'pleasure',
    person: 'the youngest daughter, a good talker, a singer',
    body: 'mouth, tongue, throat, lungs',
    thing: 'speech, food and drink, things with a gap in them, metal vessels',
  },
  离: {
    image: 'Fire',
    nature: 'clinging',
    person: 'the middle daughter, a writer, someone who sees clearly',
    body: 'eyes, heart, blood',
    thing: 'documents, hearth fire, bright things, hollow things',
  },
  震: {
    image: 'Thunder',
    nature: 'movement',
    person: 'the eldest son, a hot-tempered person, someone quick to act',
    body: 'feet, liver, nerves',
    thing: 'sound, vehicles, trees, anything newly started',
  },
  巽: {
    image: 'Wind',
    nature: 'entering',
    person: 'the eldest daughter, a trader or traveller, someone always on the move',
    body: 'thighs, breath, gallbladder',
    thing: 'wind, rope, grass and trees, messages going back and forth',
  },
  坎: {
    image: 'Water',
    nature: 'the pit',
    person: 'the middle son, someone who toils, someone who keeps their thoughts deep',
    body: 'ears, kidneys, blood',
    thing: 'water, wine, dangerous places, things done in the dark',
  },
  艮: {
    image: 'Mountain',
    nature: 'stillness',
    person: 'the youngest son, someone who holds what they have, someone stubborn',
    body: 'hands, back, spleen and stomach',
    thing: 'rocks, gates and paths, things at a standstill, houses',
  },
  坤: {
    image: 'Earth',
    nature: 'yielding',
    person: 'the mother, the crowd, someone compliant',
    body: 'belly, spleen, flesh',
    thing: 'land, cloth, square things, things in great number',
  },
};

/** 天干地支用拼音，英语读者至少念得出来 */
export const stems: readonly string[] = ['Jia', 'Yi', 'Bing', 'Ding', 'Wu', 'Ji', 'Geng', 'Xin', 'Ren', 'Gui'];

export const branches: readonly string[] = [
  'Zi', 'Chou', 'Yin', 'Mao', 'Chen', 'Si', 'Wu', 'Wei', 'Shen', 'You', 'Xu', 'Hai',
];
