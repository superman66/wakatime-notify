# WakaTime notify

> Sending wakatime daily report to telegram or Wecom

<img width="259" alt="image" src="https://user-images.githubusercontent.com/12592949/214556347-472fdd2b-55e9-40bf-bd5c-03ee646fcd5a.png">



## Setup

### Preparatory work

1. Create a WakaTime account (https://wakatime.com/signup)
2. In your account settings, copy the existing WakaTime API Key (https://wakatime.com/settings/account)
3. Fork this repo
4. Go to the repo Settings > Secrets
5. Add the following environment variables:
    * `WAKATIME_API_KEY`: The API key for your WakaTime account.

### Telegram
You should create a telegram bot and get chat id. And add the following environment variables:
  * `TELEGRAM_BOT_TOKEN`: The telegram bot token;
  * `TELEGRAM_CHAT_ID`: The telegram chat ID.

### WeCom
You should create a wecom bot and add it to environment vairables:
  * `WECOM_WEBHOOK`: The WeCom bot webhook url
