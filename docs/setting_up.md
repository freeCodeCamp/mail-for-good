# Setting up

## Creating your account and deleting the default admin account

To connect for the first time you'll have to use the default admin account. The email is "admin@admin.com" and the password is "admin".

In the menu on the left of your screen you'll see the "accounts management section". There you'll find a form to create your first admin account and another to delete the default one.

## Retrieving your AWS credentials

Here is a video from Quincy showing how to get your Amazon credentials to allow your instance to send through the Amazon Simple Email Service.
https://www.youtube.com/watch?v=_7U03GVD4a8

## Last step: Getting out of Amazon's sandbox mode

Right now you can only send emails to the verified address you provided during the last step.

Here is a link on how to proceed.
https://docs.aws.amazon.com/ses/latest/DeveloperGuide/request-production-access.html

When filling the form, be aware that they will want to know about how you plan to handle bounces and complaints. You will send your emails through their service and if you let the complaints pile up you will lower the reputation of their servers, degrading their service. Show them you understand that. Be serious and honest while filling your submission.
