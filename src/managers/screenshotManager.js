import { promisify } from "node:util";
import { writeFile, existsSync, mkdirSync } from "node:fs";

import { createCanvas } from "canvas";

import { sleep, absMod, addAlphaToData } from "./utilitiesManager.js";

const file = promisify(writeFile);

export class Screenshot {
	constructor(bot, imagesPath, chunksBreak, sleepTimeout) {
		if(!existsSync(imagesPath)) mkdirSync(imagesPath);
        bot.setMaxListeners(0);
		this.imagesPath = imagesPath;
		this.bot = bot;
		this.jobs = 0;
		this.chunksBreak = chunksBreak;
		this.sleepTimeout = sleepTimeout;
	}
	async requestArea(x1, y1, x2, y2) {
		x1 = Math.floor(x1 / 16);
		y1 = Math.floor(y1 / 16);
		x2 = Math.floor(x2 / 16);
		y2 = Math.floor(y2 / 16);

		let i = 0;
		let chunksLasted = (x2 - x1 + 1) * (y2 - y1 + 1);

		return new Promise(async (resolve, reject) => {
			for (let xx = x1; xx <= x2; xx++) {
				for (let yy = y1; yy <= y2; yy++) {   
					while (this.bot.ws.readyState !== 1) await sleep(1000);

					if (this.bot.chunkSystem.getChunk(xx, yy)) {
						chunksLasted--;
						if (chunksLasted === 0) resolve(true);
					} else {
						i++;
						this.bot.world.requestChunk(xx, yy).then(() => {
							chunksLasted--;
							if (chunksLasted === 0) resolve(true);
						});
						if (i % this.chunksBreak === 0 && this.sleepTimeout !== 0) {
							console.log("Sleeping for " + (this.sleepTimeout / 1000) + " seconds", chunksLasted, i);
							await sleep(this.sleepTimeout);
						}
					}
				}
			}
		});
	}

	putOnCanvas(x1, y1, x2, y2) {
		let canvasWidth = x2 - x1;
		let canvasHeight = y2 - y1;

		let canvas = createCanvas(canvasWidth, canvasHeight);
		let ctx = canvas.getContext("2d");

		let x1c = Math.floor(x1 / 16);
		let y1c = Math.floor(y1 / 16);
		let x2c = Math.floor(x2 / 16);
		let y2c = Math.floor(y2 / 16);

		for (let canvasX = -Math.abs(absMod(x1, 16)), xx = x1c; xx <= x2c; xx++, canvasX += 16) {
			for (let canvasY = -Math.abs(absMod(y1, 16)), yy = y1c; yy <= y2c; yy++, canvasY += 16) {
				let chunk = this.bot.chunkSystem.getChunk(xx, yy);
				if (!chunk) continue;

				let imgData = addAlphaToData(chunk, ctx.createImageData(16, 16));
				ctx.putImageData(imgData, canvasX, canvasY);
			}
		}
		return canvas;
	}
	async save(canvas) {
		let fileName = `${this.imagesPath}${Date.now()}.png`;

		await file(fileName, canvas.toBuffer());

		return fileName;
	}
	async takeScreenshot(x1, y1, x2, y2) {
		x1 = x1 < x2 ? x1 : x2;
		y1 = y1 < y2 ? y1 : y2;
		x2 = x1 > x2 ? x1 : x2;
		y2 = y1 > y2 ? y1 : y2;

		x1 = Math.round(x1);
		y1 = Math.round(y1);
		x2 = Math.round(x2);
		y2 = Math.round(y2);

		let start = Date.now();
		this.jobs++;

		await this.requestArea(x1, y1, x2, y2);
		try {
			let canvas = await this.putOnCanvas(x1, y1, x2, y2);
			let fileName = await this.save(canvas);

			this.jobs--;
			return [fileName, start, Date.now()];
		} catch(e) {
			console.error(e);
			return [undefined, start, Date.now()];
		}
	}
}
