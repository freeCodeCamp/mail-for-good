---
title: "Local Deployment Guide"
date: 2017-09-30T16:53:35-05:00
---

## Preinstallation

First, keep in mind that this application uses [Amazon SES](https://aws.amazon.com/ses/). Your account will initially be [limited by Amazon](http://docs.aws.amazon.com/ses/latest/DeveloperGuide/manage-sending-limits.html). To increase these limits, check out Amazon's documentation [here](http://docs.aws.amazon.com/ses/latest/DeveloperGuide/increase-sending-limits.html).

Before installing this application, you'll need some API keys from Google to handle authentication. This can be done in a few steps:

1. Login to [Google API Manager](https://console.developers.google.com/apis/).
2. In the left menu, select **Dashboard**. Now select **Enable API**, search for `Google+` and select it. At the top of the screen, ensure it's enabled by clicking on **Enable**.
3. In the left menu, select **Credentials**. Then click **Create Credentials** > **OAuth client ID**.
4. Select **Web Application**. Name is as you wish, but under **Authorised Javascript Origins** put `http://localhost`, and under **Authorised redirect URIs** put `http://localhost/auth/google/callback`.
5. Click **Create**. You will now have a Client ID and Client Secret. In your .env file, put the Client ID as your GOOGLE_CONSUMER_KEY, and the Client Secret as your GOOGLE_CONSUMER_SECRET.

## Installing with Docker

The first step is to download Docker itself. The process for this differs depending your OS. You can find a guide here https://docs.docker.com/engine/installation/.

Now, clone the repository and change into it.

Edit the `.env.example` file in your root directory.

After this, you'll need to create your own .env file. Check out the .env.example file in this repo. From the terminal, you can run `cp .env.example .env` then edit the .env file with any editor of your choice. There are instruction in this file that you can follow.

Now run `docker-compose up`. This will run all the containers needed to launch this app, and will take some time to finish.

When the process is finished, the app will be exposed on port 80 and accessible by visiting `http://[hostname]`.

## Installation summary

1. Install and run the Docker daemon.
2. Clone the repository and change into it `git clone https://github.com/freeCodeCamp/Mail-for-Good && cd Mail-for-Good`.
3. Run `cp .env.example .env` then open `.env` and edit it, passing in your own values.
4. Run `docker-compose up`. Wait for it to finish.
5. Visit `http://[hostname]` or `localhost` if running locally.