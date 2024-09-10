import { Client as DCClient, IntentsBitField, Events } from "discord.js";
import { Client as OWOPClient } from "owop-js";
import { config } from "dotenv"; config();

import { handleCommand } from "./src/handlers/interactionHandler.js"

import { registerCommands } from "./src/managers/commandManager.js";
import { format } from "./src/managers/utilitiesManager.js";

const OWOPBot = new OWOPClient({
    world: "kapyctaxyulo",
    controller: true,
    reconnect: true,
    noLog: true
});

OWOPBot.once("join", (world) => {
    console.log(`OWOP Bot joined in "${world}" world`);
})

const DCBot = new DCClient({ intents: new IntentsBitField(121823) });

await registerCommands();

DCBot.on(Events.InteractionCreate, async (interaction) => {
    if(interaction.isChatInputCommand()) {
        await handleCommand(interaction);
    }
});

DCBot.once(Events.ClientReady, (client) => {
    console.log(`Discord Bot logged in as "${client.user.tag}"`);
});

DCBot.login(process.env.token);