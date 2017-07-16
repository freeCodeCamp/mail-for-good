'''
This is a basic 'help' tool to let users configure credentials correctly, particular for developers.
'''

import os
from string import Template

template_m4g = Template('\033[37m $str \033[32m')

def main():
    # Cancel if a .env file exists
    if os.path.exists('../../.env'):
        return

    # Should probably verify that all variables are declared here

    # At this stage, the .env file is incorrect.
    print ('''\033[93m
    |==========================================================================================================|
    | This is a short guide for setting up M4G. We'll check a few things to ensure you have things configured. |
    | We will also ask you for key information, and then set things up.                                        |
    |                                                                                                          |
    | If you have already configured your .env file - you've missed one or two settings. We'll add these now.  |
    |==========================================================================================================|
    ''')

    if os.path.exists('../../.env'):
        print(template_m4g.substitute(str = '\nThis is your .env file at the moment\n=======================\n'))
        os.system('cat ../../.env')
        print(template_m4g.substitute(str = '\n=======================\n'))

    print(template_m4g.substitute(str = '''
What is your Google consumer key (client id) and secret key (client secret)?

You can find these here https://console.cloud.google.com/apis/credentials
And read our guide here https://github.com/freeCodeCamp/mail-for-good/wiki/How-to-configure-your-Google-API-Keys
    '''))
    GOOGLE_CONSUMER_KEY = raw_input('GOOGLE_CONSUMER_KEY = ')
    GOOGLE_CONSUMER_SECRET = raw_input('GOOGLE_CONSUMER_SECRET = ')

    print(template_m4g.substitute(str = '''
What is your "Authorised redirect URI"?

This is on the same page as where you saw the client id and client secret above.

You will need to make sure you set both an "Authorised JavaScript origin" and "Authorised redirect URI"
An example of these (if you are running the app on your own machine for development) is:
Authorised JavaScript origin = http://localhost:8080
Authorised redirect URI = http://localhost:8080/auth/google/callback

If you are running this on a server - you will need to replace localhost with your hostname. You may
also want to use a reverse proxy such as Nginx to serve the app from port 80.
    '''))
    GOOGLE_CALLBACK = raw_input('GOOGLE_CALLBACK = ')

    print(template_m4g.substitute(str = '''
What is your Amazon access ID and secret access key?

If you're running the app in development mode, you can leave these blank. Instead, you can run
'npm run simulator' to launch a service that will mock an SES endpoint at no cost.
    '''))
    AMAZON_ACCESS_KEY_ID = raw_input('AMAZON_ACCESS_KEY_ID = ')
    AMAZON_SECRET_ACCESS_KEY = raw_input('AMAZON_SECRET_ACCESS_KEY = ')

    print(template_m4g.substitute(str = '''
What is your Postgres username, password, and the name of the DB you're connecting to?

If you haven't installed Postgres, please read this guide https://github.com/freeCodeCamp/mail-for-good/wiki/Setup-for-development#prerequisites
You can start Postgres (and redis-server, which you will also need) with:
    '''))
    PSQL_USERNAME = raw_input('PSQL_USERNAME = ')
    PSQL_PASSWORD = raw_input('PSQL_PASSWORD = ')
    PSQL_DATABASE = raw_input('PSQL_DATABASE = ')

    print(template_m4g.substitute(str = '''
What is your encryption password?

This is a password used to encrypt your Amazon keys. It should be any random sequence of
32 characters (but it can be less). It is not something that you need to remember, but you
will need to ensure it exists in order to use the app.

Please note that this password will be used to encrypt keys of all users on this app.
    '''))
    ENCRYPTION_PASSWORD = raw_input('ENCRYPTION_PASSWORD = ')


    print(template_m4g.substitute(str = '''
Done!

A file called .env will now be written to the root of this application. This file contains
the information you've provided, and will be used as environment variables when the app runs.

Press enter to finish. If your keys are correct, you're ready to roll.
    '''))

    finalString = '''
GOOGLE_CONSUMER_KEY={}
GOOGLE_CONSUMER_SECRET={}
GOOGLE_CALLBACK={}

AMAZON_ACCESS_KEY_ID={}
AMAZON_SECRET_ACCESS_KEY={}

PSQL_USERNAME={}
PSQL_PASSWORD={}
PSQL_DATABASE={}

ENCRYPTION_PASSWORD={}
    '''.format(
        GOOGLE_CONSUMER_KEY,
        GOOGLE_CONSUMER_SECRET,
        GOOGLE_CALLBACK,

        AMAZON_ACCESS_KEY_ID,
        AMAZON_SECRET_ACCESS_KEY,

        PSQL_USERNAME,
        PSQL_PASSWORD,
        PSQL_DATABASE,

        ENCRYPTION_PASSWORD,
    )

    os.system('touch ./.env')

    writeFileCmd = 'echo "{}" > ./.env'.format(finalString)
    os.system(writeFileCmd)

    print(finalString)

### Run
if __name__ == '__main__':
    main()
###
