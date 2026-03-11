import type { DMVJSON, DMVCharacter, Classes } from '../types/dmv';
import type { Statblock, ParsedAttack } from '../types/statblock';

/**
 * Converts a DMV JSON object to a Statblock
 */
export function dmvToStatblock(dmvJson: DMVJSON): Statblock {
  const character = dmvJson.character[0];
  if (!character) {
    throw new Error('No character data found in JSON');
  }

  const abilitiesAndBonuses = character.abilities_bonuses[0];
  if (!abilitiesAndBonuses) {
    throw new Error('No abilities data found');
  }

  const acClass = calculateACClass(character);
  const skillSaves = calculateSaves(character);
  const actions = calculateActions(character.attacks);
  const cr = calculateCR(character.classes);
  const hitDice = calculateHitDice(character.classes);

  const statblock: Statblock = {
    characterName: character.character_name,
    size: 'Medium',
    type: character.race,
    alignment: character.alignment,
    ac: character.ac,
    acClass: acClass,
    hp: character.hp[0]?.hp_max || 0,
    hitDice: hitDice,
    modifier: Number(character.proficiency_bonus),
    speed: character.characteristics[0]?.speed || 30,
    str: abilitiesAndBonuses.abilities.str,
    dex: abilitiesAndBonuses.abilities.dex,
    con: abilitiesAndBonuses.abilities.con,
    int: abilitiesAndBonuses.abilities.int,
    wis: abilitiesAndBonuses.abilities.wis,
    cha: abilitiesAndBonuses.abilities.cha,
    skillsaves: skillSaves || [],
    resistances: character.damage_resistances.map((r) => r.value),
    damageImmunities: [],
    conditionImmunities: character.condition_immunities,
    languages: character.proficiencies[0]?.language
      ? character.proficiencies[0].language.split(';').map((lang) => lang.trim())
      : [],
    cr,
    actions: actions,
    notes: character.traits['features-and-traits-2'] || '',
    senses: `Passive Perception ${character.passive_perception}`
  };

  return statblock;
}

function calculateACClass(character: DMVCharacter): string {
  const armor = character.equipment[0]?.armor;

  if (armor) {
    const armorKey = Object.keys(armor)[0];
    if (armorKey) {
      const armorName = armorKey.replace(/_/g, ' ');
      const armorParts = armorName.split('-');

      const capitalizedParts = armorParts.map((part) => {
        return part.charAt(0).toUpperCase() + part.slice(1);
      });

      return capitalizedParts.join(' ');
    }
  }

  return 'Unarmored';
}

function calculateActions(attacks: Record<string, string | undefined>): { name: string; desc: string }[] {
  const attackMap = new Map<string, Partial<ParsedAttack>>();

  for (const [key, value] of Object.entries(attacks)) {
    if (key === 'attacks-and-spellcasting') continue;

    const nameMatch = key.match(/^weapon-name-(\d+)$/);
    const bonusMatch = key.match(/^weapon-attack-bonus-(\d+)$/);
    const damageMatch = key.match(/^weapon-damage-(\d+)$/);

    if (nameMatch) {
      const idx = nameMatch[1]!;
      const existing = attackMap.get(idx) ?? {};
      existing.name = value;
      attackMap.set(idx, existing);
    } else if (bonusMatch) {
      const idx = bonusMatch[1]!;
      const existing = attackMap.get(idx) ?? {};
      existing.attackBonus = value;
      attackMap.set(idx, existing);
    } else if (damageMatch) {
      const idx = damageMatch[1]!;
      const existing = attackMap.get(idx) ?? {};
      existing.damage = value;
      attackMap.set(idx, existing);
    }
  }

  const sortedIndices = Array.from(attackMap.keys()).sort((a, b) => Number(a) - Number(b));

  return sortedIndices
    .map((idx) => {
      const attack = attackMap.get(idx)!;
      if (!attack.name) return null;

      const bonus = attack.attackBonus ?? '+0';
      const damage = attack.damage ?? 'unknown';

      return {
        name: attack.name,
        desc: `*Weapon Attack:* ${bonus} to hit. *Hit:* ${damage}.`
      };
    })
    .filter((action): action is { name: string; desc: string } => action !== null);
}

function calculateSaves(character: DMVCharacter): { name: string; desc: string }[] | undefined {
  const abilitiesAndBonuses = character.abilities_bonuses[0];
  if (!abilitiesAndBonuses) return undefined;

  const diffs = [
    character.save_bonuses.str - abilitiesAndBonuses.bonuses.str,
    character.save_bonuses.dex - abilitiesAndBonuses.bonuses.dex,
    character.save_bonuses.con - abilitiesAndBonuses.bonuses.con,
    character.save_bonuses.int - abilitiesAndBonuses.bonuses.int,
    character.save_bonuses.wis - abilitiesAndBonuses.bonuses.wis,
    character.save_bonuses.cha - abilitiesAndBonuses.bonuses.cha
  ];

  const names = ['Str', 'Dex', 'Con', 'Int', 'Wis', 'Cha'];
  const saves: { name: string; desc: string }[] = [];

  if (diffs.some((diff) => diff !== 0)) {
    diffs.forEach((diff, index) => {
      if (diff !== 0) {
        saves.push({
          name: names[index]!,
          desc: `${diff > 0 ? '+' : ''}${diff}`
        });
      }
    });
    return saves;
  }

  return undefined;
}

function calculateCR(classes: Classes): number {
  let totalLevel = 0;
  for (const key in classes) {
    if (Object.prototype.hasOwnProperty.call(classes, key) && classes[key]) {
      totalLevel += classes[key]['class-level'];
    }
  }
  return totalLevel;
}

function calculateHitDice(classes: Classes): string {
  const hitDiceByType = new Map<number, number>();

  for (const key in classes) {
    if (Object.prototype.hasOwnProperty.call(classes, key)) {
      const classInfo = classes[key];
      if (classInfo) {
        const dieSize = classInfo['hit-die'];
        const level = classInfo['class-level'];
        hitDiceByType.set(dieSize, (hitDiceByType.get(dieSize) || 0) + level);
      }
    }
  }

  if (hitDiceByType.size === 0) {
    return 'No Hit Dice';
  }

  const sortedDice = Array.from(hitDiceByType.entries()).sort((a, b) => b[0] - a[0]);

  return sortedDice.map(([dieSize, count]) => `${count}d${dieSize}`).join(' + ');
}
