function random(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min }

function randomColor() { return [utils.random(0, 255), utils.random(0, 255), utils.random(0, 255)] }

function hexToRgb(hex) {
    let shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function (m, r, g, b) {
        return r + r + g + g + b + b;
    });

    let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? [
        parseInt(result[1], 16),
        parseInt(result[2], 16),
        parseInt(result[3], 16)
    ] : null;
}

function rgbToHex(r, g, b) { return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1) }

const format = {
    code(string, type = "js") { return "```" + `${string ? type : ""}\n${string}` + "```" },
    embed(string) { return "`" + string + "`" },
    italic(string) { return "*" + string + "*" },
    bold(string) { return "**" + string + "**" },
    strikethrough(string) { return "~~" + string + "~~" }
}

export { random, randomColor, hexToRgb, rgbToHex, format};