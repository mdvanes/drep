# DREP

Deduplicate RTKQ EndPoints

When creating Redux Toolkit Query (RTKQ) endpoints with rtk-query-codegen-openapi, it is possible to have duplicate endpoint names from different schemas. Drep will run a check and fail if there are duplicates. It is possible to add endpoint names to a .drepignore file. Those endpoint names will not fail the run, but will still be listed as "ignored".

Requires an openapi-config.ts in de root of directory.

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/@mdworld/drep.svg)](https://npmjs.org/package/@mdworld/drep)
[![Downloads/week](https://img.shields.io/npm/dw/@mdworld/drep.svg)](https://npmjs.org/package/@mdworld/drep)

<!-- toc -->

- [Usage](#usage)
- [Commands](#commands)
<!-- tocstop -->

# Usage

<!-- usage -->

```sh-session
$ npm i -D @mdworld/drep
$ npx drep run
running command...
...
```

<!-- usagestop -->

# Commands

<!-- commands -->

- [`drep run`](#drep-hello-person)
- [`drep help [COMMAND]`](#drep-help-command)

## `drep run`

Find duplicate Redux Toolkit Query endpoints

```
USAGE
  $ drep run

DESCRIPTION
  Find duplicate Redux Toolkit Query endpoints

EXAMPLES
  $ drep run
  Found 2 duplicates
```

_See code: [src/commands/run.ts](https://github.com/mdvanes/drep/blob/v0.0.0/src/commands/run.ts)_

## `drep help [COMMAND]`

Display help for drep.

```
USAGE
  $ drep help [COMMAND...] [-n]

ARGUMENTS
  COMMAND...  Command to show help for.

FLAGS
  -n, --nested-commands  Include all nested commands in the output.

DESCRIPTION
  Display help for drep.
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v6.0.22/src/commands/help.ts)_

<!-- commandsstop -->

# Development

```
npm run build && ./bin/run.js run
npm publish --access=public
```
