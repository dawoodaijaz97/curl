const fs = require("fs");
const readline = require("readline");

let t_string = "";
let t_obj = {};
let prev_line;

const args = require('minimist')(process.argv.slice(2));
let file = args["f"];

const readInterface = readline.createInterface({
    input: fs.createReadStream(file, {
        encoding: "utf8"
    }),
    console: false
});
readInterface.on("line", (line) => {
    let writer = fs.createWriteStream("./request.csv", {
        flags: "a"
    });

    let data = "";
    if (line === "" && prev_line === "") {
        console.log(t_obj);
        let string = t_obj["method"] + "," + t_obj["user_agent"] + "," + t_obj["cookie"] + "," + t_obj["content_length"] + "," + t_obj["content_type"] + "," + t_obj["data"] + "," + t_obj["url"]
        t_obj = {};
        writer.write(string + "\r\n");
    } else if (line != "") {

        if (line.indexOf("--request") !== -1) {
            let method = line.slice(10, line.length - 2);
            method = method.replace(/"/g, "");
            t_obj["method"] = method;
        } else if (line.indexOf("--header") !== -1) {
            if (line.indexOf("User-Agent") !== -1) {
                let user_agent = line.slice(line.indexOf("User-Agent") + 12, line.length - 3);
                t_obj["user_agent"] = user_agent;
            } else if (line.indexOf("Cookie") !== -1) {
                let cookie = line.slice(line.indexOf("Cookie") + 8, line.length - 3);
                t_obj["cookie"] = cookie;
            } else if (line.indexOf("Content-Length") !== -1) {
                let content_length = line.slice(line.indexOf("Content-Length") + 16, line.length - 3);
                t_obj["content_length"] = content_length;
            } else if (line.indexOf("Content-Type") !== -1) {
                let content_type = line.slice(line.indexOf("Content-Type") + 14, line.length - 3);
                t_obj["content_type"] = content_type;
            }

        } else if (line.indexOf("--data") !== -1) {
            data = line.slice(line.indexOf("--data") + 8, line.length - 3);
            t_obj["data"] = data;
        } else if (line.slice(0, 4) === "http") {
            let url = line;
            t_obj["url"] = url;
        }
    }

    prev_line = line;
});