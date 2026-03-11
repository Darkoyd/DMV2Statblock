import type { Plugin } from "obsidian";
import type { ConversionService } from "../services/conversionService";

export function registerCommands(plugin: Plugin, service: ConversionService): void {
	plugin.addCommand({
		id: "json2note",
		name: "Convert a JSON to stat block.",
		callback: () => { void service.selectJsonFile(); },
	});
}
