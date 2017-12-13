---
title: "How to Contribute"
date: 2017-09-30T16:55:37-05:00
---

Found a bug? Please let us know by [creating an issue](https://github.com/freeCodeCamp/Mail-for-Good/issues/new).

## How to run Mail For Good in development mode

_This guide was written for linux-based machines (using Debian). It will also work with OSX, but you'll need to install things differently (e.g. with Brew). Deployment on Windows is untested, and the current suggestion is to run Ubuntu in a virtual machine using software such as VirtualBox._

In development mode, Mail 4 Good has a number of useful utilities:

* Hot reloading with webpack hot middleware
* The ability to use Redux Dev Tools (a browser extension that allows for redux time travel & viewing state)
* Additional debugging information on the server

## Prerequisites

Your machine should have NPM and Node >=7.6x installed. It will also need Redis and Postgres. A full guide for installing each of these is given below. Before you install any packages, ensure your package list is up to date with:

```
sudo apt-get update
```

### NPM

```
sudo apt-get install -y npm
```

### Node

```
curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### Redis

```
sudo apt-get install -y redis-server
```

### Postgres

```
sudo apt-get install -y postgresql postgresql-contrib
```

## Setup

*Before you start, run `node -v` and ensure you are using >=7.6x. Check out [node version manager](https://github.com/creationix/nvm) for an easy way to handle this.

- Clone the repository. If you have forked the repo, make sure you clone the fork rather than the link below.

```
git clone https://github.com/freeCodeCamp/Mail-for-Good.git
```

- Change into the cloned directory. Install packages.

```
cd Mail-for-Good && npm install
```

- Set up your Google API key with [this guide](/google-api-guide). There are only a few environment variables that need to be changed, these are listed below.

```
mv .env.example .env
# You need to edit the .env file. You can use nano, vim, atom, gedit - take your pick.
nano .env
```

```
# EXAMPLE .env FILE
GOOGLE_CONSUMER_KEY= Put your consumer key from Google here
GOOGLE_CONSUMER_SECRET= Put your consumer secret key from Google here
GOOGLE_CALLBACK= Put your Google Authorised redirect URI here (we use http://localhost:8080/auth/google/callback)
ENCRYPTION_PASSWORD= Put a long random password here, you don't need to remember it yourself

# The below lines are for configuring Postgres.
# If you know what you're doing, feel free to ignore the suggestions.
PSQL_USERNAME= Put your username here (which can be found with the command 'whoami')
PSQL_PASSWORD= Put the password you intend to use for your Postgres user here
PSQL_DATABASE= Put 'mail_for_good' here
```

- Start both redis-server and postgresql as background services.

```
sudo service redis-server start
sudo service postgresql start

# You can stop these services by replacing 'start' with 'stop', restart them with 'restart', and
# check their status with 'status'.
```

- We now need to configure the Postgres DB. We'll keep this part as simple as possible, but feel free to setup your own config if you wish.

```
# Running the command below will let you know your username.
whoami
# When you run the command below, enter your username and password. Answer 'y' when asked to be a superuser.
# Make sure the username and password match those specified in the .env file.
sudo -u postgres createuser --interactive --pwprompt
# Next, we need to create a database.
# feel free to skip this step and customise things on your own if you wish.
# The .env.example file contains info on environment variables used with PSQL.
createdb mail_for_good
```

-- Done! Run the command below then check out http://localhost:8080

```
npm run dev
```


## Help

Got an issue? Want to report a bug or a new feature you're thinking of? Please let us know [here](https://github.com/freeCodeCamp/Mail-for-Good/issues)!