import { Collection, REST, Routes } from "discord.js";
import { config } from "dotenv"; config();
import { readdirSync } from "node:fs";

const rest = new REST().setToken(process.env.token);

async function getAllCommands() {
    let files = readdirSync(process.cwd() + "\\src\\commands").filter(file => file.endsWith(".js")),
        commands = new Collection();

    for (let file of files) {
        try {
            let { default: command } = await import("../commands/" + file);
            commands.set(command.data.name, command);
        } catch(e) { console.error(e) }
    }
    return commands;
}

async function getCommand(name) {
    let commands = await getAllCommands();
    return commands.get(name);
}

async function registerCommands() {
    try {
        let commands = await getAllCommands(),
            data = [];
        for(let command of commands.values()) data.push(command.data.toJSON());

        let output = await rest.put(Routes.applicationCommands(process.env.client), { body: data });
        console.log(`Successfully reloaded ${output.length} commands`);
    } catch (e) { console.error(e) }
}

export { getAllCommands, getCommand, registerCommands};