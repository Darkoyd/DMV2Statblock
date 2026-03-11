/**
 * Statblock interface for D&D 5e character representation
 * This is the intermediate format used to generate markdown notes
 */
export interface Statblock {
  characterName: string;
  size: 'Medium';
  type: string;
  alignment: string;
  ac: number;
  acClass: string;
  hp: number;
  hitDice: string;
  modifier: number;
  speed: number;
  str: number;
  dex: number;
  con: number;
  int: number;
  wis: number;
  cha: number;
  skillsaves: SaveBonus[];
  resistances: string[];
  senses: string;
  damageImmunities: string[];
  conditionImmunities: string[];
  languages: string[];
  cr: number;
  actions: Action[];
  notes: string;
}

export interface Action {
  name: string;
  desc: string;
}

export interface SaveBonus {
  name: string;
  desc: string;
}

export interface ParsedAttack {
  name: string;
  attackBonus: string;
  damage: string;
}
