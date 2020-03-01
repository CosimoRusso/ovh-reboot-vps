require("dotenv").config();
const ovh = require('ovh')({
    appKey: process.env.OVH_APPLICATION_KEY,
    appSecret: process.env.OVH_SECRET_KEY,
    consumerKey: process.env.OVH_CONSUMER_KEY
});
const cron = require("node-cron");
const fs = require("fs");
const path = require("path");

const cronSchedule = "0 4 * * 0"; //sunday at 4 am
const logPath = path.join(__dirname, "logs/logs.txt");

if(!fs.existsSync(logPath)){
    fs.writeFileSync(logPath, "");
}
log("Hello");
cron.schedule(cronSchedule, () => {
    run()
        .then(()=>log("DONE " + new Date().toLocaleString()))
        .catch(log);
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
    }
}

function log(text){
    const content = new Date().toISOString() + " " + text + "\n";
    fs.appendFileSync(logPath, content);
}