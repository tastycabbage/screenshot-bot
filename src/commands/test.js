import { SlashCommandBuilder, AttachmentBuilder } from "discord.js";
import { Screenshot } from "../managers/screenshotManager.js";
import ms from "ms";
import { format } from "../managers/utilitiesManager.js";

export default {
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("test")
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
        )
        .addNumberOption(o => 
            o.setName("chunks")
            .setDescription("How many chunks will bot do before break (default 15000)")
            .setRequired(false)
        )
        .addNumberOption(o => 
            o.setName("timeout")
            .setDescription("How much time will bot wait (default 1000)")
            .setRequired(false)
        ),
    async run(int, client) {
        let archivePath = process.cwd() + `\\archive\\`,
            chunks = int.options.getNumber("chunks") || 15000,
            timeout = int.options.getNumber("timeout") || 1000;

        const screenshot = new Screenshot(client, archivePath, chunks, timeout);
        if(screenshot.jobs) return int.reply("Wait until the previous screenshot is completed.")

        let x1 = int.options.getNumber("x1"),
            y1 = int.options.getNumber("y1"),
            x2 = int.options.getNumber("x2"),
            y2 = int.options.getNumber("y2");

        let xx1 = Math.floor(x1 / 16),
            yy1 = Math.floor(y1 / 16),
            xx2 = Math.floor(x2 / 16),
            yy2 = Math.floor(y2 / 16);

        let area = (xx2 - xx1 + 1) * (yy2 - yy1 + 1),
            time = Math.round((area / chunks) * timeout);

        //await int.reply(`Taking a screenshot, please wait for ~${ms(time)}`);

        let output = await screenshot.takeScreenshot(x1, y1, x2, y2);
        if(!output || !output[0]) return int.reply(`Catched error while taking screenshot, it took ${ms(output[2] - output[1])}`);

        let file = new AttachmentBuilder(archivePath + output[0]);
        await int.reply(`Here's your screenshot, it took ${ms(output[2] - output[1])}`, { files: [file] });
    }
}