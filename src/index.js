import * as dotenv from "dotenv";
import { WakaTimeClient } from "wakatime-client";
import dayjs from "dayjs";
import { notifyAll } from "./notification.mjs";
dotenv.config();

const { WAKATIME_API_KEY } = process.env;

const wakatime = new WakaTimeClient(WAKATIME_API_KEY);

function getItemContent(title, content) {
	let itemContent = `#### ${title} \n`;
	content.forEach((item) => {
		itemContent += `* ${item.name}: ${item.text} \n`;
	});
	return itemContent;
}

function getMessageContent(date, summary) {
	if (summary.length > 0) {
		const { projects, grand_total, languages, categories, editors } =
			summary[0];

		return `## Wakatime Daily Report\nTotal: ${
			grand_total.text
		}\n${getItemContent("Projects", projects)}\n${getItemContent(
			"Languages",
			languages
		)}\n${getItemContent("Editors", editors)}\n${getItemContent(
			"Categories",
			categories
		)}\n`;
	}
}

(async function main() {
	const yesterday = dayjs().subtract(1, "day").format("YYYY-MM-DD");
	try {
		const mySummary = await wakatime.getMySummary({
			dateRange: {
				startDate: yesterday,
				endDate: yesterday,
			},
		});
		const content = getMessageContent(yesterday, mySummary.data);
		await notifyAll(content);
	} catch (error) {
		console.error(error);
		return;
	}
})();
