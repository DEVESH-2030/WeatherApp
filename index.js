const http = require('http');
const fs = require('fs');
var requests = require("requests");

const homeFile = fs.readFileSync("home.html", "utf-8");

const replaceVal = (tempVal, orgVal) => {
    let temperature = tempVal.replace("{%tempvalue%}", orgVal.main.temp);
    temperature = temperature.replace("{%tempmin%}", orgVal.main.temp_min);
    temperature = temperature.replace("{%tempmax%}", orgVal.main.temp_max);
    temperature = temperature.replace("{%location%}", orgVal.name);
    temperature = temperature.replace("{%country%}", orgVal.sys.country);
    temperature = temperature.replace("{%tempstatus%}", orgVal.weather[0].main);

    return temperature;
}
const server = http.createServer(function (req, res) {
    if (req.url == "/") {
        requests("https://api.openweathermap.org/data/2.5/weather?q=Mohali&appid=712137a1c96ff1faae22126421a0309b")
            .on("data", (chunk) => {
                const objectData = JSON.parse(chunk);
                const arrayData = [objectData];
                const realTimeData = arrayData.map(val => replaceVal(homeFile, val)).join("");
                res.write(realTimeData);
            })
            .on("end", (err) => {
                if (err) return console.log("connection closed due to error", err);
                res.end();
            });
    }
});

server.listen(5000, "127.0.0.1");