# Getting Started

## Requirements

To contribute, you need the following tools installed on your computer:

- [Node.js](https://nodejs.org/en/) (current LTS) - to install JavaScript dependencies.

You should be running a Node version matching the [current active LTS release](https://github.com/nodejs/Release#release-schedule) or newer for this plugin to work correctly. You can check your Node.js version by typing node -v in the Terminal prompt.

If you have an incompatible version of Node in your development environment, you can use [nvm](https://github.com/creationix/nvm) to change node versions on the command line:

```bash
nvm install
```



## Development

First of all, you need to make sure that all JavaScript dependencies are installed:

Install all the required npm packages, run:

```bash
npm install
```

To watch for any JavaScript file changes and re-build it when needed, you can run the following command which open <http://localhost:8080/> url automatically.

```bash
npm run dev
```

This way you will get a development build of the JavaScript, which makes debugging easier.

To get a production build, run:

```bash
npm run build:js
```



### Deploy to Github Pages

---

If you have access, run the following command

```bash
npm run deploy
```

