import axios from "axios";

export async function notifyAll(content) {
	const notifies = [wecom(content), telegram(content)];
	Promise.all(notifies)
		.then(() => {
			console.log("Notification sent successfully.");
		})
		.catch((error) => {
			console.error("Notification Error: ", error);
		});
}

export async function wecom(content) {
	if (typeof process.env.WECOM_WEBHOOK !== "undefined") {
		return axios
			.post(process.env.WECOM_WEBHOOK, {
				msgtype: "markdown",
				markdown: {
					content: content,
				},
			})
			.then((response) => response.data);
	}
}

export async function telegram(content) {
	if (typeof process.env.TELEGRAM_BOT_TOKEN !== "undefined") {
		return axios
			.get(
				`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`,
				{
					params: {
						chat_id: process.env.TELEGRAM_CHAT_ID,
						text: content,
					},
				}
			)
			.then((response) => response.data);
	}
}
