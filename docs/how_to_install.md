# How to install

Mail for good uses lots of different services (redis, Postgres and so on) that would make manual installation arduous. To streamline this process, we use Docker.

## Your machine

Mail for good is designed to be memory efficient, nonetheless the amount of memory needed will depend on how many emails you are capable of sending per second (this limited is placed by Amazon). We **strongly suggest you enable swap space** if your VPS does not enable this automatically (such as DigitalOcean).

We suggest a machine with at least 2gb memory.

## Installing with Docker

The first step is to download Docker itself. The process for this differs depending your OS. You can find a guide here https://docs.docker.com/engine/installation/.

Now, clone the repository and change into it.

After this, you'll need to create your own .env file. Check out the .env.example file in this repo. From the terminal, you can run `cp .env.example .env` then edit the .env file with any editor of your choice. There are instruction in this file that you can follow.

Now run `docker-compose up`. This will run all the containers needed to launch this app, and will take some time to finish.

When the process is finished, the app will be exposed on port 80 and accessible by visiting `http://[hostname]`.

## Summary

1. Install and run the Docker daemon.
2. Clone the repository and change into it `git clone https://github.com/freeCodeCamp/Mail-for-Good && cd Mail-for-Good`.
3. Run `cp .env.example .env` then open `.env` and edit it, passing in your own values.
4. Run `docker-compose up`. Wait for it to finish.
5. Visit `http://[hostname]` or `localhost` if running locally.

## Troubleshooting

We're keen to tackle any issues people encounter. If you experience any problems, please create an issue and we'll get back to you.
