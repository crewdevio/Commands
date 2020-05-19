const exec = require("child_process").exec;
const readLine = require("readline");
const path = require("path");
const fs = require("fs");

const path_config = path.join(__dirname, "run.config");

const commandsList = {};

fs.readFile(path_config, { encoding: "utf-8" }, (error, data) => {
  if (!error) {
    const extract = data.split("\n").map((keys) => keys.replace("\r", ""));

    if (extract.includes("config:")) {
      extract.forEach((items) => {
        if (items === "config:") {
          commandsList[items.replace(":", "")] = {};
        } else {
          const trimmed = items.split(":").map((_) => _.trim(" "));
          commandsList.config[trimmed[0]] = trimmed[1];
        }
      });
    }

    Run(commandsList);
  } else {
    console.log("run.config not found!");
  }
});

function Run(inputCommands) {
  try {
    const list = Object.keys(inputCommands.config);

    const prompt = readLine.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    prompt.question("run: ", (answer) => {
      if (list.includes(answer)) {
        const command = exec(inputCommands.config[answer]);

        command.stdout.on("data", (data) => console.log(data));

        command.stderr.on("data", (data) => console.log(data));
      } else {
        console.log("command not found!");
      }
      prompt.close();
    });
  } catch (err) {
    console.log("[config:] not found!");
  }
}
