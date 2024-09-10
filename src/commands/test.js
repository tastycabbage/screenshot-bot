import { SlashCommandBuilder } from "discord.js";
import { Screenshot } from "../managers/screenshotManager.js";

export default {
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("test"),
    async run(int, client) {
        const screenshot = new Screenshot(client, `${process.cwd()}\\archive\\`, 15000, 1000);

        await screenshot.takeScreenshot(-10, -10, 10, 10);
    }
}