// Interface for Dungeon Master's Vault (DMV) JSON Export Format
// Based on actual DMV character exports from dungeonmastersvault.com

export interface DMVJSON {
    schema_version: number;
    player_name: string;
    character: DMVCharacter[];
}

export interface DMVCharacter {
    // Core Stats
    passive_perception: number;
    ac: number;
    proficiency_bonus: string;
    initiative_bonus: number;

    // Basic Info
    character_name: string;
    race: string;
    subrace: string;
    alignment: string;
    background: string;
    experience: number | null;

    // Abilities & Bonuses
    abilities_bonuses: AbilitiesBonuses[];
    save_bonuses: SaveBonuses;

    // Combat
    hp: HitPoints[];
    attacks: Attacks;

    // Defenses & Resistances
    immunities: DamageType[];
    damage_resistances: DamageType[];
    damage_vulnerabilities: DamageType[] | null;
    condition_immunities: string[];
    saving_throw_advantages: string[] | null;

    // Skills & Proficiencies
    skills: Skills;
    proficiencies: Proficiency[];

    // Equipment & Treasure
    equipment: Equipment[];
    treasure: Treasure;

    // Spells
    spells: Spell[];

    // Classes
    classes: Classes;

    // Characteristics
    characteristics: Characteristics[];

    // Traits & Features
    traits: Traits;

    // Images
    image_url: string | null;
}

export interface AbilitiesBonuses {
    abilities: {
        str: number;
        dex: number;
        con: number;
        int: number;
        wis: number;
        cha: number;
    };
    bonuses: {
        str: number;
        dex: number;
        con: number;
        int: number;
        wis: number;
        cha: number;
    };
}

export interface SaveBonuses {
    str: number;
    dex: number;
    con: number;
    int: number;
    wis: number;
    cha: number;
}

export interface HitPoints {
    hp_current: number | null;
    hp_max: number;
}

export interface Attacks {
    "attacks-and-spellcasting": string;
    "weapon-name-1"?: string;
    "weapon-attack-bonus-1"?: string;
    "weapon-damage-1"?: string;
    "weapon-name-2"?: string;
    "weapon-attack-bonus-2"?: string;
    "weapon-damage-2"?: string;
    "weapon-name-3"?: string;
    "weapon-attack-bonus-3"?: string;
    "weapon-damage-3"?: string;
    [key: string]: string | undefined; // For additional weapon entries
}

export interface DamageType {
    value: string;
    qualifier: string | null;
}

export interface Skills {
    // Skill values
    "religion": string;
    "persuasion": string;
    "investigation": string;
    "acrobatics": string;
    "performance": string;
    "perception": string;
    "sleight-of-hand": string;
    "survival": string;
    "history": string;
    "animal-handling": string;
    "nature": string;
    "deception": string;
    "intimidation": string;
    "arcana": string;
    "athletics": string;
    "insight": string;
    "medicine": string;
    "stealth": string;

    // Proficiency checks (boolean)
    "animal-handling-check": boolean;
    "sleight-of-hand-check": boolean;
    "religion-check": boolean;
    "nature-check": boolean;
    "performance-check": boolean;
    "medicine-check": boolean;
    "investigation-check": boolean;
    "history-check": boolean;
    "perception-check": boolean;
    "intimidation-check": boolean;
    "survival-check": boolean;
    "insight-check": boolean;
    "stealth-check": boolean;
    "deception-check": boolean;
    "athletics-check": boolean;
    "persuasion-check": boolean;
    "arcana-check": boolean;
    "acrobatics-check": boolean;
}

export interface Proficiency {
    all: string;
    tool: string | null;
    weapon: string | null;
    armor: string | null;
    language: string | null;
}

export interface Equipment {
    equipment: Record<string, EquipmentItem>;
    armor: Record<string, EquipmentItem> | null;
    "magic-armor": Record<string, EquipmentItem> | null;
    "magic-items": Record<string, EquipmentItem> | null;
    weapons: [string, WeaponItem][];
    "magic-weapons": [string, WeaponItem][];
}

export interface EquipmentItem {
    id?: number;
    quantity: number;
    "equipped?": boolean;
    "background-starting-equipment?"?: boolean;
    "class-starting-equipment?"?: boolean;
}

export interface WeaponItem {
    quantity: number;
    "equipped?": boolean;
}

export interface Treasure {
    cp?: number;
    sp?: number;
    gp?: number;
    pp?: number;
    treasure: string;
}

export interface Spell {
    spellcasting_fields: string;
    // Additional spell fields may be added as the spell system is further developed
}

export interface Classes {
    [className: string]: ClassInfo;
}

export interface ClassInfo {
    "class-name": string;
    "class-level": number;
    "hit-die": number;
    subclass: string;
    "subclass-name": string;
}

export interface Characteristics {
    factions_and_organizations: string | null;
    faction_image_url: string | null;
    eyes: string;
    age: string;
    sex: string;
    ideals: string | null;
    speed: number;
    "personality-trait-2": string;
    bonds: string | null;
    personality_trait_1: string;
    weight: string;
    hair: string;
    skin: string;
    height: string;
    character_backstory: string | null;
    flaws: string | null;
}

export interface Traits {
    "features-and-traits-2": string;
    [key: string]: string; // For additional trait fields
}
