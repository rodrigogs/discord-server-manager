# discord-server-manager

>### Configuration
* Install Node.js 16.x >
* Install pnpm `npm install -g pnpm`
* Run `pnpm install`
* Copy `.env.sample` to `.env`
* Populate `.env` with your [Discord API](https://discord.com/developers/applications) token and bot settings

>### Usage
* Run `pnpm run dev`
* Enabled features will be available for all the servers the bot is in

>### Bot Settings

#### Age verification
##### Age verification is a feature that requires users to be at least 18 years old to join a server with the `+18` role.

To enable age verification, add the following to your `.env` file:
* **AGE_VERIF_ENABLED=true**
* **AGE_VERIF_OVER_18_ROLE=< role-name >**
* **AGE_VERIF_UNDER_18_ROLE=< role-name >**
