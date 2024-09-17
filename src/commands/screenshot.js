import { SlashCommandBuilder, AttachmentBuilder } from "discord.js";
import ms from "ms";
import { format } from "../managers/utilitiesManager.js";

export default {
    data: new SlashCommandBuilder()
        .setName("screenshot")
        .setDescription("Make a screenshot of OWOP")
        .addNumberOption(o => 
            o.setName("x1")
            .setDescription("First X coordinate")
            .setRequired(true)
        )
        .addNumberOption(o => 
            o.setName("y1")
            .setDescription("First Y coordinate")
            .setRequired(true)
        )
        .addNumberOption(o => 
            o.setName("x2")
            .setDescription("Second X coordinate")
            .setRequired(true)
        )
        .addNumberOption(o => 
            o.setName("y2")
            .setDescription("Second Y coordinate")
            .setRequired(true)
        ),
    async run(int, client) {
        if(client.screenshot.jobs > 0) return int.reply("Wait until the previous screenshot is completed.")

        let x1 = int.options.getNumber("x1"),
            y1 = int.options.getNumber("y1"),
            x2 = int.options.getNumber("x2"),
            y2 = int.options.getNumber("y2");

        let xx1 = Math.floor(x1 / 16),
            yy1 = Math.floor(y1 / 16),
            xx2 = Math.floor(x2 / 16),
            yy2 = Math.floor(y2 / 16);

        let chunks = client.screenshot.chunksBreak,
            timeout = client.screenshot.sleepTimeout;

        let area = (xx2 - xx1 + 1) * (yy2 - yy1 + 1),
            time = Math.round((area / chunks) * timeout);

        await int.reply(`Taking a screenshot, please wait for ~${format.bold(ms(time))}.`);

        let output = await client.screenshot.takeScreenshot(x1, y1, x2, y2);
        if(!output || !output[0]) return int.reply(`Catched error while taking screenshot, it took ${format.bold(ms(output[2] - output[1]))}.`);

        await int.editReply({ content: `Here's your screenshot, it took ${format.bold(ms(output[2] - output[1]))}.`, files: [new AttachmentBuilder(output[0])] });
    }
}