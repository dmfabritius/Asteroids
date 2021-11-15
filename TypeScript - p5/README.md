# Asteroids using p5.js and TypeScript

The TypeScript version of Asteroids is a node project, so you will need to download and install [Node.js](https://nodejs.org/en/download/) if you haven't already.

## Getting Started

You must prepare the project for editing/running by installing the necessary dependencies. Open a command prompt and navigate to the project's folder, then run the following command:

```console
npm install
```

> HACK: This project uses v1.3.1 of p5 and @types/p5. In order to use the p5.sound addon library, it is necessary to modify `node_modules/p5/lib/addons/p5.sound.js` and add `import p5 from "p5"` as the first line of the file.

## Build the Project

To transpile the TypeScript code into JavaScript so it can run in a web browser, the project needs to be built.

```console
npm run build
```

> IMPORTANT: The _build_ script creates a `dist` folder containing just the `index.html` and JavaScript files, but doesn't copy over the asset folders. Before running the game, you need to manually copy the `audio`, `fonts`, and `images` folders from `src` to `dist`.

## Run the Project

To run the game using a local development web server (`http://localhost:1234`), you can use the following command. This will also let you make changes to the code and have the game refresh automatically.

```console
npm run start
```
