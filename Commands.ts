// base code https://github.com/Caesar2011/rhinoder

import { readJsonSync, existsSync } from "https://deno.land/std/fs/mod.ts";

import { red, green } from "https://deno.land/std/fmt/colors.ts";

interface IrunJson {
  config: {
    [key: string]: string;
  };

  files?: string[];
}
/*
 * get object data from run file
 */
const data = readJsonSync("./run.json") as IrunJson;

let throttle = 500;
let timeout: number | null = null;

let errorTrace: string[] = [];

interface Icommands {
  name: string;
  run: string[];
}

const commands: Array<Icommands> = [];

function logMessages() {
  console.log(green("[0] files:"));
  console.info(
    red(
      `[1] ${
        data?.files
          ? data?.files
              .map((el) => {
                console.log(" |- ", el);
                return "";
              })
              .join("")
          : "all files [ .* ]"
      } `
    )
  );
}

if (existsSync("./run.json")) {
  if (!data.config) {
    errorTrace.push("[Error]: config param not found in run.json");
  } else {
    console.log(green("[0] listening to changes..."));

    logMessages();

    const entries = Object.entries(data.config);

    entries.forEach((entrie) => {
      commands.push({ name: entrie[0], run: entrie[1].split(" ") });
    });
  }
} else {
  errorTrace.push("[Error]: run.json not found");
}

if (errorTrace.length) {
  for (const error of errorTrace) {
    console.error(red(error) + "\n");
  }
}

const args: string[] = ["run"];

commands.forEach(({ name }, index) => {
  if (name === Deno.args[0]) {
    commands[index].run.forEach((el: string) => {
      args.push(el.trim());
    });
  }
});

let taks: Deno.Process = startProcess(args);

function startProcess(args: Array<string>): Deno.Process {
  if (args.length <= 1) {
    console.error(red("[Error]: Command not found"));
  }
  return Deno.run({ cmd: ["deno", ...args] });
}

function runApp() {
  logMessages();

  taks && taks.close();
  taks = startProcess(args);
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
      timeout = setTimeout(runApp, throttle);
    }
  }
}
