import type { Statblock } from '../types/statblock';

/**
 * Generates Obsidian frontmatter for the statblock note
 */
export function generateFrontmatter(statblock: Statblock): string {
  return `---
obsidianUIMode: preview
cssclasses: json5e-monster
tags: character
statblock: inline
statblock-link: "#^statblock"
aliases:
  - ${statblock.characterName}
hp: ${statblock.hp}
ac: ${statblock.ac}
modifier: ${statblock.modifier}
level: ${statblock.cr}
---`;
}

/**
 * Generates the statblock markdown content
 */
export function generateStatblockMarkdown(statblock: Statblock): string {
  return `
# ${statblock.characterName}

\`\`\`statblock
"name": "${statblock.characterName}"
"size": "Medium"
"type": "${statblock.type}"
"alignment": "${statblock.alignment}"
"ac": !!int ${statblock.ac}
"ac_class": "${statblock.acClass}"
"hp": !!int ${statblock.hp}
"hit_dice": "${statblock.hitDice}"
"modifier": !!int ${statblock.modifier}
"stats":
  - !!int ${statblock.str}
  - !!int ${statblock.dex}
  - !!int ${statblock.con}
  - !!int ${statblock.int}
  - !!int ${statblock.wis}
  - !!int ${statblock.cha}
"speed": "${statblock.speed}"
"skillsaves":${statblock.skillsaves.length > 0 ? statblock.skillsaves.map((s) => `\n  - "desc": "${s.desc}"\n    "name": "${s.name}"`).join('') : ''}
"damage_resistances": "${statblock.resistances.join(', ')}"
"damage_immunities": "${statblock.damageImmunities.join(', ')}"
"condition_immunities": "${statblock.conditionImmunities.join(', ')}"
"actions":${statblock.actions.length > 0 ? statblock.actions.map((a) => `\n  - "desc": "${a.desc}"\n    "name": "${a.name}"`).join('') : ''}
"senses": "${statblock.senses}"
"languages": "${statblock.languages.join(', ')}"
"cr": "${statblock.cr}"
\`\`\`
^statblock

## Notes

${statblock.notes}
`;
}

/**
 * Generates the complete markdown note (frontmatter + statblock)
 */
export function generateCompleteNote(statblock: Statblock): string {
  return generateFrontmatter(statblock) + '\n' + generateStatblockMarkdown(statblock);
}
