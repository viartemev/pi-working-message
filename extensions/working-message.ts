import { access, readFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import type { ExtensionAPI, ExtensionContext } from "@mariozechner/pi-coding-agent";

type SelectionMode = "random" | "round-robin";

type WorkingMessageConfig = {
	enabled: boolean;
	selection: SelectionMode;
	phrases: string[];
};

type LoadedConfig = WorkingMessageConfig & {
	sources: string[];
};

const DEFAULT_CONFIG: WorkingMessageConfig = {
	enabled: true,
	selection: "random",
	phrases: [
		"Обкашляю вопросик",
		"Решаю вопросик",
		"Сейчас подскочу",
		"Шуршу в соцсетях",
		"Вопросик на контроле",
		"На подскоке",
		"Дельце одно есть",
		"Добро",
		"Словимся",
		"Тема мутная",
		"Обрисуй ситуацию",
		"А ты парень смекалистый",
		"Здарова, бандит",
		"Фактурочку откройте",
		"По красоте всё сделаем",
		"Поставил дело на карандаш",
		"Всё в ажуре",
		"Вопросик на тормозах",
		"Принял и понял",
		"Всё на мази",
		"Порешаем",
		"Разрулим",
		"Забились",
		"Без базара",
		"Тема рабочая",
		"Всё схвачено",
		"Закинул удочку",
		"Жду обратку",
		"Тут такое дело",
		"Тема зашла",
	],
};

const PROJECT_CONFIG_NAME = path.join(".pi", "working-message.json");
const USER_CONFIG_NAME = path.join(os.homedir(), ".pi", "agent", "working-message.json");

async function fileExists(filePath: string): Promise<boolean> {
	try {
		await access(filePath);
		return true;
	} catch {
		return false;
	}
}

function normalizeConfig(input: unknown, fallback: WorkingMessageConfig): WorkingMessageConfig {
	const data = typeof input === "object" && input !== null ? (input as Record<string, unknown>) : {};
	const phrases = Array.isArray(data.phrases)
		? data.phrases.filter((item): item is string => typeof item === "string").map((item) => item.trim()).filter(Boolean)
		: fallback.phrases;
	const selection = data.selection === "round-robin" ? "round-robin" : data.selection === "random" ? "random" : fallback.selection;
	const enabled = typeof data.enabled === "boolean" ? data.enabled : fallback.enabled;

	return {
		enabled,
		selection,
		phrases: phrases.length > 0 ? phrases : fallback.phrases,
	};
}

async function readJsonConfig(filePath: string, fallback: WorkingMessageConfig): Promise<WorkingMessageConfig | null> {
	if (!(await fileExists(filePath))) {
		return null;
	}

	const raw = await readFile(filePath, "utf8");
	const parsed = JSON.parse(raw) as unknown;
	return normalizeConfig(parsed, fallback);
}

async function loadConfig(cwd: string): Promise<LoadedConfig> {
	const projectConfigPath = path.join(cwd, PROJECT_CONFIG_NAME);
	const sources: string[] = [];
	let config = DEFAULT_CONFIG;

	for (const candidate of [USER_CONFIG_NAME, projectConfigPath]) {
		const loaded = await readJsonConfig(candidate, config);
		if (!loaded) continue;
		config = loaded;
		sources.push(candidate);
	}

	return {
		...config,
		sources,
	};
}

export default function workingMessage(pi: ExtensionAPI) {
	let roundRobinIndex = 0;

	const clearUi = (ctx: ExtensionContext) => {
		ctx.ui.setWorkingMessage();
	};

	const pickPhrase = (config: WorkingMessageConfig): string => {
		if (config.phrases.length === 0) {
			return DEFAULT_CONFIG.phrases[0] ?? "Думаю...";
		}

		if (config.selection === "round-robin") {
			const phrase = config.phrases[roundRobinIndex % config.phrases.length] ?? config.phrases[0]!;
			roundRobinIndex = (roundRobinIndex + 1) % config.phrases.length;
			return phrase;
		}

		const randomIndex = Math.floor(Math.random() * config.phrases.length);
		return config.phrases[randomIndex] ?? config.phrases[0]!;
	};

	pi.on("agent_start", async (_event, ctx) => {
		if (!ctx.hasUI) return;

		try {
			const config = await loadConfig(ctx.cwd);
			if (!config.enabled) {
				clearUi(ctx);
				return;
			}

			ctx.ui.setWorkingMessage(pickPhrase(config));
		} catch (error) {
			clearUi(ctx);
			ctx.ui.notify(
				`working-message: failed to load config (${error instanceof Error ? error.message : String(error)})`,
				"warning",
			);
		}
	});

	pi.on("agent_end", async (_event, ctx) => {
		clearUi(ctx);
	});

	pi.on("session_shutdown", async (_event, ctx) => {
		clearUi(ctx);
	});

	pi.registerCommand("working-message", {
		description: "Show working-message status or preview the next phrase. Usage: /working-message [status|preview]",
		handler: async (args, ctx) => {
			const action = args.trim().toLowerCase() || "status";

			try {
				const config = await loadConfig(ctx.cwd);
				if (action === "preview") {
					ctx.ui.notify(pickPhrase(config), "info");
					return;
				}

				const sourceText = config.sources.length > 0 ? config.sources.join(" → ") : "built-in defaults";
				ctx.ui.notify(
					`working-message: ${config.enabled ? "enabled" : "disabled"}, selection=${config.selection}, phrases=${config.phrases.length}, source=${sourceText}`,
					"info",
				);
			} catch (error) {
				ctx.ui.notify(
					`working-message: failed to load config (${error instanceof Error ? error.message : String(error)})`,
					"warning",
				);
			}
		},
	});
}
