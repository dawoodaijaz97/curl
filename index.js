const fs = require("fs");
const readline = require("readline");

let flag = "req";
let t_string = "";
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
    let writer1 = fs.createWriteStream("./request.log", { flags: "a" });
    let writer2 = fs.createWriteStream("./response.log", { flags: "a" });

    if (line === "" && prev_line === "") {
        flag = "req";
        console.log(t_string);
        writer2.write("\r\n");
        t_string = "";
    } else if (line === "" && prev_line !== "") {
        flag = "res";
        console.log(t_string);
        writer1.write("\r\n");
        t_string = "";
    } else {
        if (flag === "req") {
            writer1.write(line + "\r\n");
        } else {
            writer2.write(line + "\r\n");
        }
    }
    prev_line = line;
});