import * as dotenv from "dotenv";
import Axios from "axios";
import dayjs from "dayjs";
import { WakaTimeClient } from "wakatime-client";
dotenv.config();

const { WAKATIME_API_KEY, TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID } = process.env;

const client = new WakaTimeClient(WAKATIME_API_KEY);

function getItemContent(title: string, content: any[]) {
	let itemContent = `#### ${title} \n`;
	content.forEach((item) => {
		itemContent += `* ${item.name}: ${item.text} \n`;
	});
	return itemContent;
}

function getMessageContent(date: string, summary: any) {
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
	return "No data";
}

async function sendMessageToTelegram(content: string) {
	if (typeof TELEGRAM_BOT_TOKEN !== "undefined") {
		return Axios.get(
			`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
			{
				params: {
					chat_id: TELEGRAM_CHAT_ID,
					text: content,
				},
			}
		).then((response) => response.data);
	}
}

const fetchSummaryWithRetry = async (times: number) => {
	const yesterday = dayjs().subtract(1, "day").format("YYYY-MM-DD");
	try {
		const response = await client.getMySummary({
			dateRange: {
				startDate: yesterday,
				endDate: yesterday,
			},
		});
		await sendMessageToTelegram(getMessageContent(yesterday, response.data));
	} catch (error) {
		if (times === 1) {
			console.error(`Unable to fetch wakatime summary\n ${error} `);
		}
		console.log(`retry fetch summary data: ${times - 1} time`);
		fetchSummaryWithRetry(times - 1);
	}
};

(function main() {
	fetchSummaryWithRetry(3);
})();
