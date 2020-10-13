// base code https://github.com/Caesar2011/rhinoder

import { existsSync } from "https://deno.land/std@0.74.0/fs/mod.ts";

import { readJsonSync } from "https://raw.githubusercontent.com/crewdevio/Trex/master/temp_deps/writeJson.ts";

import { red, green, yellow } from "https://deno.land/std/fmt/colors.ts";

interface runJson {
  config: {
    [key: string]: string;
  };

  files?: string[];
}
/*
 * get object data from run file
 */
const data = readJsonSync("./run.json") as runJson;

let throttle = 700;
let timeout: number | null = null;

let errorTrace: string[] = [];

interface Commands {
  name: string;
  run: string[];
}

const commands: Array<Commands> = [];

function logMessages() {
  console.clear();
  console.log(green("[Commands]"));
  console.log(green("[0] watching files:"));
  console.info(
    red(
      `[1] ${
        data?.files
          ? data?.files
              .map((el) => {
                console.log(" |- ", yellow(el));
                return "";
              })
              .join("")
          : "- watching all files [ .* ]"
      } `
    )
  );
}

if (existsSync("./run.json")) {
  if (!data.config) {
    errorTrace.push("[Error]: the config key was not found in the run.json file");
  } else {
    console.log(green("commands starting..."));

    setTimeout(logMessages, 1000);

    const entries = Object.entries(data.config);

    entries.forEach((entries) => {
      commands.push({ name: entries[0], run: entries[1].split(" ") });
    });
  }
} else {
  errorTrace.push("[Error]: run.json not found");
}

if (errorTrace.length) {
  for (const error of errorTrace) {
    throw new Error(red(error) + "\n").message;
  }
}

const args: string[] = [];

commands.forEach(({ name }, index) => {
  if (name === Deno.args[0]) {
    commands[index].run.forEach((el: string) => {
      args.push(el.trim());
    });
  }
});

let task: Deno.Process = startProcess(args);

function startProcess(args: Array<string>): Deno.Process {
  if (args.length < 1) {
    console.error(red("[Error]: Command not found"));
  }
  return Deno.run({ cmd: ["deno", "run", ...args] });
}

function runApp() {
  logMessages();

  task && task.close();
  task = startProcess(args);
}

let files: string[] | string = data?.files
  ? data.files && data.files.length
    ? data.files
    : "."
  : ".";

if (import.meta.main) {
  for await (const event of Deno.watchFs(files)) {
    if (event.kind !== "access") {
      if (timeout) clearTimeout(timeout);
      console.log(yellow("reloading..."));
      timeout = setTimeout(runApp, throttle);
    }
  }
}
