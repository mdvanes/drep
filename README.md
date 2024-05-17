DREP
=================

Deduplicate RTKQ EndPoints

When creating Redux Toolkit Query (RTKQ) endpoints with rtk-query-codegen-openapi, it is possible to have duplicate endpoint names from different schemas. Drep will run a check and fail if there are duplicates. It is possible to add endpoint names to a .drepignore file. Those endpoint names will not fail the run, but will still be listed as "ignored".

Requires an openapi-config.ts in de root of directory.


[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/@mdworld/drep.svg)](https://npmjs.org/package/@mdworld/drep)
[![Downloads/week](https://img.shields.io/npm/dw/@mdworld/drep.svg)](https://npmjs.org/package/@mdworld/drep)


<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
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
* [`drep hello PERSON`](#drep-hello-person)
* [`drep hello world`](#drep-hello-world)
* [`drep help [COMMAND]`](#drep-help-command)
* [`drep plugins`](#drep-plugins)
* [`drep plugins add PLUGIN`](#drep-plugins-add-plugin)
* [`drep plugins:inspect PLUGIN...`](#drep-pluginsinspect-plugin)
* [`drep plugins install PLUGIN`](#drep-plugins-install-plugin)
* [`drep plugins link PATH`](#drep-plugins-link-path)
* [`drep plugins remove [PLUGIN]`](#drep-plugins-remove-plugin)
* [`drep plugins reset`](#drep-plugins-reset)
* [`drep plugins uninstall [PLUGIN]`](#drep-plugins-uninstall-plugin)
* [`drep plugins unlink [PLUGIN]`](#drep-plugins-unlink-plugin)
* [`drep plugins update`](#drep-plugins-update)

## `drep hello PERSON`

Say hello

```
USAGE
  $ drep hello PERSON -f <value>

ARGUMENTS
  PERSON  Person to say hello to

FLAGS
  -f, --from=<value>  (required) Who is saying hello

DESCRIPTION
  Say hello

EXAMPLES
  $ drep hello friend --from oclif
  hello friend from oclif! (./src/commands/hello/index.ts)
```

_See code: [src/commands/hello/index.ts](https://github.com/mdvanes/drep/blob/v0.0.0/src/commands/hello/index.ts)_

## `drep hello world`

Say hello world

```
USAGE
  $ drep hello world

DESCRIPTION
  Say hello world

EXAMPLES
  $ drep hello world
  hello world! (./src/commands/hello/world.ts)
```

_See code: [src/commands/hello/world.ts](https://github.com/mdvanes/drep/blob/v0.0.0/src/commands/hello/world.ts)_

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

## `drep plugins`

List installed plugins.

```
USAGE
  $ drep plugins [--json] [--core]

FLAGS
  --core  Show core plugins.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  List installed plugins.

EXAMPLES
  $ drep plugins
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.0.21/src/commands/plugins/index.ts)_

## `drep plugins add PLUGIN`

Installs a plugin into drep.

```
USAGE
  $ drep plugins add PLUGIN... [--json] [-f] [-h] [-s | -v]

ARGUMENTS
  PLUGIN...  Plugin to install.

FLAGS
  -f, --force    Force npm to fetch remote resources even if a local copy exists on disk.
  -h, --help     Show CLI help.
  -s, --silent   Silences npm output.
  -v, --verbose  Show verbose npm output.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Installs a plugin into drep.

  Uses bundled npm executable to install plugins into /Users/NAME/.local/share/drep

  Installation of a user-installed plugin will override a core plugin.

  Use the DREP_NPM_LOG_LEVEL environment variable to set the npm loglevel.
  Use the DREP_NPM_REGISTRY environment variable to set the npm registry.

ALIASES
  $ drep plugins add

EXAMPLES
  Install a plugin from npm registry.

    $ drep plugins add myplugin

  Install a plugin from a github url.

    $ drep plugins add https://github.com/someuser/someplugin

  Install a plugin from a github slug.

    $ drep plugins add someuser/someplugin
```

## `drep plugins:inspect PLUGIN...`

Displays installation properties of a plugin.

```
USAGE
  $ drep plugins inspect PLUGIN...

ARGUMENTS
  PLUGIN...  [default: .] Plugin to inspect.

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Displays installation properties of a plugin.

EXAMPLES
  $ drep plugins inspect myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.0.21/src/commands/plugins/inspect.ts)_

## `drep plugins install PLUGIN`

Installs a plugin into drep.

```
USAGE
  $ drep plugins install PLUGIN... [--json] [-f] [-h] [-s | -v]

ARGUMENTS
  PLUGIN...  Plugin to install.

FLAGS
  -f, --force    Force npm to fetch remote resources even if a local copy exists on disk.
  -h, --help     Show CLI help.
  -s, --silent   Silences npm output.
  -v, --verbose  Show verbose npm output.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Installs a plugin into drep.

  Uses bundled npm executable to install plugins into /Users/NAME/.local/share/drep

  Installation of a user-installed plugin will override a core plugin.

  Use the DREP_NPM_LOG_LEVEL environment variable to set the npm loglevel.
  Use the DREP_NPM_REGISTRY environment variable to set the npm registry.

ALIASES
  $ drep plugins add

EXAMPLES
  Install a plugin from npm registry.

    $ drep plugins install myplugin

  Install a plugin from a github url.

    $ drep plugins install https://github.com/someuser/someplugin

  Install a plugin from a github slug.

    $ drep plugins install someuser/someplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.0.21/src/commands/plugins/install.ts)_

## `drep plugins link PATH`

Links a plugin into the CLI for development.

```
USAGE
  $ drep plugins link PATH [-h] [--install] [-v]

ARGUMENTS
  PATH  [default: .] path to plugin

FLAGS
  -h, --help          Show CLI help.
  -v, --verbose
      --[no-]install  Install dependencies after linking the plugin.

DESCRIPTION
  Links a plugin into the CLI for development.
  Installation of a linked plugin will override a user-installed or core plugin.

  e.g. If you have a user-installed or core plugin that has a 'hello' command, installing a linked plugin with a 'hello'
  command will override the user-installed or core plugin implementation. This is useful for development work.


EXAMPLES
  $ drep plugins link myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.0.21/src/commands/plugins/link.ts)_

## `drep plugins remove [PLUGIN]`

Removes a plugin from the CLI.

```
USAGE
  $ drep plugins remove [PLUGIN...] [-h] [-v]

ARGUMENTS
  PLUGIN...  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ drep plugins unlink
  $ drep plugins remove

EXAMPLES
  $ drep plugins remove myplugin
```

## `drep plugins reset`

Remove all user-installed and linked plugins.

```
USAGE
  $ drep plugins reset [--hard] [--reinstall]

FLAGS
  --hard       Delete node_modules and package manager related files in addition to uninstalling plugins.
  --reinstall  Reinstall all plugins after uninstalling.
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.0.21/src/commands/plugins/reset.ts)_

## `drep plugins uninstall [PLUGIN]`

Removes a plugin from the CLI.

```
USAGE
  $ drep plugins uninstall [PLUGIN...] [-h] [-v]

ARGUMENTS
  PLUGIN...  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ drep plugins unlink
  $ drep plugins remove

EXAMPLES
  $ drep plugins uninstall myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.0.21/src/commands/plugins/uninstall.ts)_

## `drep plugins unlink [PLUGIN]`

Removes a plugin from the CLI.

```
USAGE
  $ drep plugins unlink [PLUGIN...] [-h] [-v]

ARGUMENTS
  PLUGIN...  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ drep plugins unlink
  $ drep plugins remove

EXAMPLES
  $ drep plugins unlink myplugin
```

## `drep plugins update`

Update installed plugins.

```
USAGE
  $ drep plugins update [-h] [-v]

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Update installed plugins.
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.0.21/src/commands/plugins/update.ts)_
<!-- commandsstop -->

# Development

```
npm run build && ./bin/run.js run
npm publish --access=public
```