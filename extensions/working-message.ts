import type { ExtensionAPI, ExtensionContext } from "@mariozechner/pi-coding-agent";

const PHRASES = [
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
];

export default function workingMessage(pi: ExtensionAPI) {
	const clearUi = (ctx: ExtensionContext) => {
		ctx.ui.setWorkingMessage();
	};

	const pickPhrase = (): string => {
		const randomIndex = Math.floor(Math.random() * PHRASES.length);
		return PHRASES[randomIndex] ?? "Думаю...";
	};

	pi.on("agent_start", async (_event, ctx) => {
		if (!ctx.hasUI) return;
		ctx.ui.setWorkingMessage(pickPhrase());
	});

	pi.on("agent_end", async (_event, ctx) => {
		clearUi(ctx);
	});

	pi.on("session_shutdown", async (_event, ctx) => {
		clearUi(ctx);
	});

	pi.registerCommand("working-message", {
		description: "Preview the next working-message phrase.",
		handler: async (args, ctx) => {
			const action = args.trim().toLowerCase() || "status";

			if (action === "preview") {
				ctx.ui.notify(pickPhrase(), "info");
				return;
			}

			ctx.ui.notify(`working-message: enabled, phrases=${PHRASES.length}`, "info");
		},
	});
}
