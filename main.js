require("dotenv").config();
const ovh = require('ovh')({
    appKey: process.env.OVH_APPLICATION_KEY,
    appSecret: process.env.OVH_SECRET_KEY,
    consumerKey: process.env.OVH_CONSUMER_KEY
});
const cron = require("node-cron");
const fs = require("fs");
const path = require("path");
const Telegram = require("telegraf/telegram");

const botToken = process.env.TELEGRAM_BOT_TOKEN;
const chatId = process.env.TELEGRAM_CHAT_ID;
const telegram = (botToken && chatId) ? new Telegram(botToken) : null;

const cronSchedule = "0 4 * * 0"; //sunday at 4 am
const logPath = path.join(__dirname, "logs/logs.txt");

if(!fs.existsSync(logPath)){
    fs.writeFileSync(logPath, "");
}

if(getLastLogLine() != "Hello"){
    sendMessage("Server Started");
}
log("Hello");
if(!telegram){
    log("Telegram not available");
}

cron.schedule(cronSchedule, () => {
    run()
        .then(()=>log("All servers done"))
        .catch(e => log(e.stack));
});

async function run(){
    const vpsList = await ovh.requestPromised("GET", "/vps");
    const promises = [];
    for(let vps of vpsList){
        promises.push(ovh.requestPromised("POST", "/vps/" + vps + "/reboot"));
    }
    const results = await Promise.allSettled(promises);
    for(let i =0; i<vpsList.length; i++){
        log(vpsList[i] + ": " + results[i].status);
        sendMessage(vpsList[i] + ": " + results[i].status);
    }
}

function log(text){
    const content = new Date().toISOString() + " " + text + "\n";
    fs.appendFileSync(logPath, content);
}

function sendMessage(text){
    if(telegram){
        telegram.sendMessage(chatId, text)
            .then(log("Telegram, message sent"))
            .catch(e => log("Unable to send message: " + text + "\n" + e));
    }
}

function getLastLogLine(){
    const text = fs.readFileSync(logPath, "utf-8");
    if(!text) return null;
    return text.split("\n").reverse()[0].substring(25);
}