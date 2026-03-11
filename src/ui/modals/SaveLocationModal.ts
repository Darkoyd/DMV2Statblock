import { AbstractInputSuggest, App, Modal, Notice, Setting, TFolder, normalizePath } from "obsidian";

class FolderSuggest extends AbstractInputSuggest<TFolder> {
	private el: HTMLInputElement;

	constructor(app: App, inputEl: HTMLInputElement) {
		super(app, inputEl);
		this.el = inputEl;
	}

	getSuggestions(query: string): TFolder[] {
		const lower = query.toLowerCase();
		return this.app.vault
			.getAllFolders()
			.filter((f) => f.path.toLowerCase().includes(lower))
			.slice(0, 20);
	}

	renderSuggestion(folder: TFolder, el: HTMLElement): void {
		el.createEl("div", { text: folder.path || "/" });
	}

	selectSuggestion(folder: TFolder): void {
		this.setValue(folder.path);
		this.el.dispatchEvent(new Event("input"));
		this.close();
	}
}

export class SaveLocationModal extends Modal {
	private folderPath = "";
	private filename: string;
	private onSubmit: (fullPath: string) => void;

	constructor(app: App, defaultFilename: string, onSubmit: (fullPath: string) => void) {
		super(app);
		this.filename = defaultFilename;
		this.onSubmit = onSubmit;
	}

	onOpen(): void {
		const { contentEl } = this;

		contentEl.createEl("h2", { text: "Save statblock note." });

		new Setting(contentEl)
			.setName("Folder")
			.setDesc("Destination folder (leave empty for vault root)")
			.addText((text) => {
				text.setPlaceholder("Vault root").setValue(this.folderPath).onChange((v) => {
					this.folderPath = v;
				});
				new FolderSuggest(this.app, text.inputEl);
			});

		new Setting(contentEl)
			.setName("Filename")
			.setDesc("Name of the note (without .md)")
			.addText((text) => {
				text.setValue(this.filename).onChange((v) => {
					this.filename = v;
				});
			});

		new Setting(contentEl)
			.addButton((btn) =>
				btn
					.setButtonText("Save")
					.setCta()
					.onClick(() => void this.submit())
			)
			.addButton((btn) =>
				btn.setButtonText("Cancel").onClick(() => this.close())
			);
	}

	onClose(): void {
		this.contentEl.empty();
	}

	private async submit(): Promise<void> {
		const folder = this.folderPath.trim();
		const name = this.filename.trim() || "Untitled";
		const fullPath = normalizePath(folder ? `${folder}/${name}.md` : `${name}.md`);

		// Ensure intermediate folders exist
		if (folder) {
			const folderExists = this.app.vault.getAbstractFileByPath(folder) instanceof TFolder;
			if (!folderExists) {
				try {
					await this.app.vault.createFolder(folder);
				} catch {
					new Notice(`Could not create folder: ${folder}`);
					return;
				}
			}
		}

		this.onSubmit(fullPath);
		this.close();
	}
}
