import { getCommand } from "../managers/commandManager.js";

async function handleCommand(interaction, client) {
    let command = await getCommand(interaction.commandName);
    if(!command) return;

    try {
        await command.run(interaction, client);
    } catch (e) {
        console.error(e);
        await interaction.reply({ content: "error", ephemeral: true });
    }
};

export { handleCommand };