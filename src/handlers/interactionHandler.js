import { getCommand } from "../managers/commandManager.js";

async function handleCommand(interaction) {
    let command = await getCommand(interaction.commandName);
    if(!command) return;

    try {
        await command.run(interaction);
    } catch (e) {
        console.error(e);
        await interaction.reply({ content: "error", ephemeral: true });
    }
};

export { handleCommand };