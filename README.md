## Commands js

create a file called run.config

inside he writes:
```yml
config:
   yourCommand: any
```
then execute with node js the file Commands.js and enter your command.

## New 😎

for deno users now you can create command shortcuts to run files in deno and listen to changes in files.

create a file called run.json

inside he writes:

```javascript
{
   "config": {
      "yourCommand": "--[any] anyFile.ts or .js"
   },
   "files": ["myWatch.ts", "index.js"] // by default listen to all files
}

```

to install `Commands` for deno you must run the command:

```bash

deno install --allow-read --allow-run --unstable https://deno.land/x/commands/Commands.ts

```
## Use

in your terminal run the command `Commands yourCommand`

## info ⚠

the run.json file must be at the root of the directory to function.

Commands for deno is created with the standard libraries which are not yet completely stable, any problem can create an issue to the repository


## installation permissions

- Read: to read the run.json file

- Run: to run deno in background
