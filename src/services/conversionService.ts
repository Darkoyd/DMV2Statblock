import { App, Notice } from "obsidian";
import type { DMVJSON } from "../types/dmv";
import { dmvToStatblock } from "../converter/converter";
import { generateCompleteNote } from "../converter/markdown";
import { SaveLocationModal } from "../ui/modals/SaveLocationModal";

export class ConversionService {
	constructor(private app: App) {}

	async selectJsonFile(): Promise<void> {
		const input = document.createElement("input");
		input.type = "file";
		input.accept = ".json,application/json";

		input.onchange = async (e: Event) => {
			const target = e.target as HTMLInputElement;
			const file = target.files?.[0];

			if (!file) {
				new Notice("No file selected.");
				return;
			}

			try {
				const jsonData = await this.readJsonFile(file);
				await this.convertToStatblock(jsonData);
			} catch (error) {
				new Notice(`Error: ${(error as Error).message}`);
				console.error(error);
			} finally {
				document.body.removeChild(input);
			}
		};

		document.body.appendChild(input);
		input.click();
	}

	async readJsonFile(file: File): Promise<DMVJSON> {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();

			reader.onload = (e) => {
				try {
					const content = e.target?.result as string;
					const json = JSON.parse(content) as DMVJSON;
					resolve(json);
				} catch {
					reject(new Error("Invalid JSON file."));
				}
			};
			reader.onerror = () => {
				reject(new Error("Error reading file."));
			};

			reader.readAsText(file);
		});
	}

	async convertToStatblock(dmvJson: DMVJSON): Promise<void> {
		try {
			const statblock = dmvToStatblock(dmvJson);
			const markdownContent = generateCompleteNote(statblock);

			new SaveLocationModal(this.app, statblock.characterName, (fullPath) => {
				void (async () => {
					try {
						const existingFile = this.app.vault.getAbstractFileByPath(fullPath);
						if (existingFile) {
							new Notice(`File already exists: ${fullPath}`);
							return;
						}
						await this.app.vault.create(fullPath, markdownContent);
						new Notice(`Created statblock note: ${fullPath}`);
					} catch (error) {
						new Notice(`Save error: ${(error as Error).message}`);
						console.error("Save error:", error);
					}
				})();
			}).open();
		} catch (error) {
			new Notice(`Conversion error: ${(error as Error).message}`);
			console.error("Conversion error:", error);
		}
	}
}
