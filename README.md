# Commands 📦 

### Commands for node users

create a file called run.config

inside he writes:

``` yml
config:
  server: node server.js
```

then execute with node js the file Commands.js and enter your command.

### Commands for deno users

for deno users now you can create command shortcuts to run files in deno and listen to changes in files.

create a file called run.json

inside he writes:

``` json
{
   "config": {
      "yourCommand": "--[any] anyFile.ts or .js"
   },
   "files": ["myWatch.ts", "index.js"]
}

```

>__note:__ by default listen to all files

to install `Commands` for deno you must run the command:

``` sh
$ deno install --allow-read --allow-run --unstable https://deno.land/x/commands/Commands.ts
```

install using [Trex](https://deno.land/x/trex) package manager

``` sh
$ Trex getTool Commands
```

to update `Commands` run:

```sh
$ deno install -f --allow-read --allow-run --unstable https://deno.land/x/commands/Commands.ts
```

## Use with deno

example:

in run.json
``` json
{
  "config": {
    "start": "--allow-net server.ts"
  },
  "files": ["app.ts", "server.ts"]
}
```
in command line

```sh
$ Commands start
```

## info ⚠

the run.json file must be at the root of the directory to function.

Commands for deno is created with the standard libraries which are not yet completely stable, any problem can create an issue to the repository

## installation permissions

- Read: to read the run.json file

- Run: to run deno in background

[![nest badge](https://nest.land/badge.svg)](https://nest.land/package/Commands@1.0.2)