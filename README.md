# DMV2Statblock

An Obsidian plugin that converts [Dungeon Master Vault](https://www.dungeonmastersvault.com/) (formerly Orcpub) character sheet JSON exports into Obsidian notes compatible with the **Fantasy Statblocks** and **Initiative Tracker** plugins by [Javalent](https://github.com/valentine195).

Each converted character becomes an Initiative Tracker-valid player entry with an attached inline statblock.

## Requirements

- [Fantasy Statblocks](https://github.com/valentine195/fantasy-statblocks) by Javalent
- [Initiative Tracker](https://github.com/valentine195/obsidian-initiative-tracker) by Javalent

Both plugins must be installed and enabled in your vault before using DMV2Statblock.

## How to Use

1. Export your character from [Dungeon Master Vault](https://www.dungeonmastersvault.com/) as a JSON file.
2. In Obsidian, open the command palette (`Ctrl/Cmd + P`).
3. Run **"Convert a JSON to stat block."**
4. Select your exported `.json` file.
5. Choose a destination folder and filename for the new note.
6. The plugin creates a note with YAML frontmatter and an inline `statblock` code block ready for Fantasy Statblocks to render.

## What Gets Converted

| DMV Field                  | Statblock Field                     |
| -------------------------- | ----------------------------------- |
| Character name             | `name`                            |
| Race                       | `type`                            |
| Alignment                  | `alignment`                       |
| AC + equipped armor        | `ac` / `ac_class`               |
| Max HP                     | `hp`                              |
| Hit dice (from classes)    | `hit_dice`                        |
| Proficiency bonus          | `modifier`                        |
| Speed                      | `speed`                           |
| Ability scores             | `stats` (STR/DEX/CON/INT/WIS/CHA) |
| Saving throw proficiencies | `skillsaves`                      |
| Damage resistances         | `damage_resistances`              |
| Condition immunities       | `condition_immunities`            |
| Languages                  | `languages`                       |
| Weapon attacks             | `actions`                         |
| Passive perception         | `senses`                          |
| Features & traits          | Notes section                       |

The generated note also includes frontmatter fields (`hp`, `ac`, `modifier`, `level`) used by Initiative Tracker to register the character as a player.

## Known Limitations

- **Size is hardcoded to Medium.** DMV JSON exports do not include creature size. If your character is Small, Large, or any other size, update the `size` field in the generated note manually.
- **CR uses total class level.** Player characters do not have a Challenge Rating. The plugin sums all class levels and writes that value to the `cr` field as a stand-in, which Initiative Tracker uses as the character's level.
- **Damage immunities are not parsed.** The DMV export format does not surface damage immunities in a structured way; this field will be empty in the output.
- **Spells are not parsed.** The DMV export format does not include a spellcasting section.
- **Multiclass hit dice are aggregated by die size.** A Fighter 3 / Wizard 2 becomes `3d10 + 2d6`, which is correct, but displayed as a single string rather than per-class.

## Installation

### From the Community Plugin List (once published)

Search for **"Dungeon Master Vault to Statblock"** in Obsidian's community plugin browser.

### Manual Installation

1. Download `main.js`, `manifest.json`, and `styles.css` from the latest [GitHub release](https://github.com/Darkoyd/DMV2Statblock/releases).
2. Copy the three files into `<your vault>/.obsidian/plugins/DMV2Statblock/`.
3. Reload Obsidian and enable the plugin in **Settings → Community Plugins**.

## Development

### Setup

```bash
git clone https://github.com/Darkoyd/DMV2Statblock
cd DMV2Statblock
npm install
```

### Commands

| Command           | Description                   |
| ----------------- | ----------------------------- |
| `npm run dev`   | Compile in watch mode         |
| `npm run build` | Type-check + production build |
| `npm run lint`  | Run ESLint                    |

### Project Structure

```
src/
├── main.ts                        # Plugin lifecycle
├── commands/index.ts              # Command registration
├── services/conversionService.ts  # File I/O + orchestration
├── types/
│   ├── dmv.ts                     # DMV input types
│   └── statblock.ts               # Statblock output types
├── ui/modals/SaveLocationModal.ts # Save location modal
└── converter/
    ├── converter.ts               # DMV → Statblock conversion logic
    └── markdown.ts                # Statblock → markdown generation
```

### Releasing

1. Update the version in `manifest.json` and set `minAppVersion`.
2. Run `npm version patch|minor|major` — this bumps `manifest.json`, `package.json`, and updates `versions.json`.
3. Create a GitHub release tagged with the exact version number (no `v` prefix).
4. Attach `main.js`, `styles.css`, and `manifest.json` as release assets.

## License

0-BSD — see [LICENSE](LICENSE).

## Support

If this plugin saves you time, consider [sponsoring the author](https://github.com/sponsors/Darkoyd).
