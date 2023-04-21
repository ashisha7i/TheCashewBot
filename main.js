const { Telegraf } = require('telegraf');
const { v4: uuidV4 } = require('uuid');

require('dotenv').config();

let factGenerator = require('./factGenerator.js');
let jokeGenerator = require('./jokeGenerator.js');
let kittyGenerator = require('./kittyGenerator.js');
let puppyGenerator = require('./puppyGenerator.js');

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start((ctx) => {
    //process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0
    let message = ` Welcome, welcome, welcome...\nUse the /fact command to receive a new fact! \nUse /joke command to fetch a new joke!\nUse /kitty command to fetch a new cat image!\nUse /puppy command to fetch a new puppy image!`;
    ctx.reply(message);
});

bot.command('fact', async (ctx) => {
    try {
        ctx.reply("Generating fact, please wait..."); 
        let imagePath = `./temp/${uuidV4()}.jpg`;
        await factGenerator.generateImage(imagePath);
        await ctx.replyWithPhoto({ source: imagePath });
        factGenerator.deleteImage(imagePath);
    } catch(error) {
        console.log(error);
        ctx.reply("Error generating fact, please try again later.");
    }
});

bot.command('joke', async (ctx) => {
    try {
        ctx.reply("Generating joke, please wait...");
        let joke = await jokeGenerator.fetchJoke();
        ctx.reply(joke);
    } catch(error) {
        console.log(error);
        ctx.reply("Error generating joke, please try again later.");
    }
});

bot.command('puppy', async (ctx) => {
    try {
        ctx.reply("Fetching an adorable puppy for you, please wait...");
        let imagePath = `./temp/puppy-${uuidV4()}.jpg`;
        let joke = await puppyGenerator.fetchPuppy(imagePath);
        await ctx.replyWithPhoto({ source: imagePath });
        puppyGenerator.deletePuppyImage(imagePath);
    } catch(error) {
        console.log(error);
        ctx.reply("Error generating a puppy image :'(, please try again later.");
    }
});


bot.command('kitty', async (ctx) => {
    try {
        ctx.reply("Fetching an adorable kitty for you, please wait...");
        let imagePath = `./temp/kitty-${uuidV4()}.jpg`;
        let joke = await kittyGenerator.fetchKitty(imagePath);
        await ctx.replyWithPhoto({ source: imagePath });
        kittyGenerator.deleteKittyImage(imagePath);
    } catch(error) {
        console.log(error);
        ctx.reply("Error generating a kitty image :'(, please try again later.");
    }
});

bot.launch();