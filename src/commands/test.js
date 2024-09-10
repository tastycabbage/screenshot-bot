import { SlashCommandBuilder } from "discord.js";

export default {
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("test"),
    async run(int) {
        await int.reply(`pong`)
    }
}