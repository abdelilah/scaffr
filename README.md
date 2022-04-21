# Scaffr

A simple code scaffolding tool to speed up repetitive coding tasks.

## Installation

### Install globally

```shell
npm install -g scaffr
```

### Use without installing

```shell
npx scaffr /path/to/template/folder /path/to/destination
```

## Usage

```shell
scaffr /path/to/template/folder /path/to/destination

# Example:
# scaffr ~/templates/project-template ./HelloWorld
```

## Creating a template

A template can have any number/kind of files. Scaffr will then interpret contents and file names when it encounters template syntax.

For example:

```shell
scaffr ~/templates/project-template ./HelloWorld
```

will result in:

| Source file                              | Destination file           |
| ---------------------------------------- | -------------------------- |
| ~/templates/project-template/{{name}}.js | ./HelloWorld/HelloWorld.js |

### The templating engine

Scaffr uses [Lodash](https://lodash.com/docs/4.17.15#template)'s `_.template` function to process templates. Variables use `{{` and `}}` for interpolation.

Example:

```javascript
// {{name}}.js
const hello = () => 'Hello, from {{name}}!';

export default hello;
```

will be compiled into:

```javascript
// HelloWorld.js
const hello = () => 'Hello, from HelloWorld!';

export default hello;
```

For more informations on templating please refer to [Lodash documentation](https://lodash.com/docs).

### Variables

The following list of variables is available for every file:

| Variable     | Description                                                                                    |
| ------------ | ---------------------------------------------------------------------------------------------- |
| name         | Folder name. Example: if destination path is `/path/to/MyProject`, `name` would be `MyProject` |
| destPath     | Destination full path                                                                          |
| templatePath | Template full path                                                                             |
| \_           | Lodash library passed in for convenience                                                       |

## Example templates

A sample template can be found in the `/examples` folder.
