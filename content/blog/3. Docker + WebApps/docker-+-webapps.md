---
title: "Docker + WebApps = ♥"
author: "Dhanraj Padmashali"
tags: ["The Build Series"]
image: "./images/docker.png"
date: "2021-04-17T12:08:44.912Z"
draft: false
permalink: "docker-webapps"
excerpt: In this episode, we will configure our web application to run inside a Docker container
---

Welcome to the second episode of *The Build Series.* In this episode we will deploy Angular and React applications using Docker.

> This can essentially be used for any web framework which spits out a distributable folder with all the static files required to run the application.

# Pre-requisites

1. You know how to create a production build of [Angular](https://angular.io/cli/build)/[React](https://create-react-app.dev/docs/production-build/).
2. [Docker](https://docs.docker.com/get-started/) is setup and installed on your machine.
3. You know how a [web server works](https://developer.mozilla.org/en-US/docs/Learn/Common_questions/What_is_a_web_server).

Let's get started.

# Configuring Web Server

We're going to configure a simple web server using `express`.  We will configure it to return the `index.html` file from our dist/build folder.

Create an `index.js` file in the root of your project and add the following code.

```javascript
var port = process.env.SERVER_PORT;
var path = require('path');
var express = require('express');
var app = express();
var router = express.Router(express);

// Provide the path to where our static files are located
router.use(express.static(path.join(__dirname, 'dist')));

// Setup an optional heartbeat function for health-checks
router.get("/ping", function (req, res) {
    return res.send('Pong');
});

// Catch all other routes and return the index file
router.get('*', function (req, res) {
    return res.sendFile(path.join(__dirname, 'dist/index.html'));
});

var server = app.listen(port, function () {
    console.log("server started on " + port);
});
```

We're creating a simple express server and configuring the router to server our static files when user enters the url in the browser.

> We can also configure routes with `/api` which acts as a proxy web server for our application. 🤓

We will be copying this to the docker container and will start using a process manager (We will be using pm2 for this example).

Before we configure our `Dockerfile`, we need to create a create a `package-deploy.json` file for our web server.

> No, it's not a typo. We already have a `package.json` file for our base application. We don't need all those dependencies for our simple web server so we create another file just for docker.

Our `package-deploy.json` will look something like this

```json
{
    "name": "my-big-project",
    "version": "0.0.0",
    "license": "MIT",
    "dependencies": {
        "body-parser": "^1.15.2",
        "express": "^4.14.0"
    }
}
```

# Configuring Docker

Create a `Dockerfile` in the root of your project and add the following

```docker
FROM node:9.2.0-alpine
COPY ./package-deploy.json /package.json
COPY ./index.js /index.js
RUN npm install pm2 -g
COPY ./dist /dist
RUN npm install --only=production
ENV SERVER_PORT 8080
EXPOSE 8080
CMD pm2-docker index.js
```

Let's breakdown what each lines mean:

1. `FROM node:9.2.0-alpine` - Fetch the Node Alpine image from the Docker registry
2. `COPY ./package-deploy.json /package.json` - Copy the `package-deploy.json` from the root of our project into the docker image as `package.json`
3. `COPY ./index.js /index.js` - Copy the server file into the docker image
4. `RUN npm install pm2 -g` - Install pm2 process manager to start/stop/manage our express server
5. `COPY ./dist /dist` - Copy all the static files generated when creating a production build.
6. `RUN npm install --only=production` - Install the required dependencies for the web server.
7. ` ENV SERVER_PORT 8080``EXPOSE 8080 ` - Run the web server on 8080 port and expose it to the outside world.
8. `CMD pm2-docker index.js` - Start our web server.

Now that our `Dockerfile` is ready let's build the container.

```bash
docker build -t awesome-web-app .
```

> Note the `.` is intentional. It tells Docker where to look for the `Dockerfile` that is needed for the build.

This will start the Docker build process as outlined in our `Dockerfile` above. This might take a while depending on your machine/internet/caffeine level.

To check if the image has been created we can type `docker images` which will list out all the images currently on your machine.

Now that our image has been created, let's run the container. Note that images on it's own doesn't do anything. It is simply a packaged system of all the software that we want to run. Containers are the actual running environments where our application is executed.

Here is what a run command looks like:

```bash
docker run -d -it -p 4200:8080 awesome-web-app
```

Let's understand what this script does. `docker run` is the command to run any Docker image. `-d -it` tells the Docker machine to run the container in daemon mode (background mode), with an `interactive terminal` giving us a way to interact with the running container. `-p 4200:8080` maps port 4200 of our machine to the exposed 8080 port of the container (Recall that we specified `EXPOSE 8080` in our `Dockerfile`. The last argument is the image name which we want to run.

We can verify if the container is running by typing `docker ps -a`. Our app is now online and running inside a Docker container! To check if this works, open up `http://localhost:4200` in a web browser.

# End points

We configured a `Dockerfile` to containerize our web application and run it using a process manager exposed using a proxy web server. Now we can deploy multiple Docker images on the same machine without worrying about environment specific configs.

That's it for this episode. Reach out in case of any issues/help.

Until next time! ✌🏽
