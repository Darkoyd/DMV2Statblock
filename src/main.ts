import { Plugin } from "obsidian";
import { ConversionService } from "./services/conversionService";
import { registerCommands } from "./commands/index";

export default class DMV2StatblockPlugin extends Plugin {
	async onload() {
		const service = new ConversionService(this.app);
		registerCommands(this, service);
	}

	onunload() {}
}
