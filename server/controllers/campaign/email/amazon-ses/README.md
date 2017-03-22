# Everything in this folder handles the process of sending emails via Amazon SES

Folder structure:
lib - pure functions that configure things necessary for the email send.
controllers - functions that interact with the database

Below is some information pertaining to sending emails via Amazon SES.

```
https://docs.aws.amazon.com/ses/latest/DeveloperGuide/mailbox-simulator.html
success@simulator.amazonses.com (Successful email)
bounce@simulator.amazonses.com (Soft bounce)
ooto@simulator.amazonses.com (Out of office response from ISP)
complaint@simulator.amazonses.com (Complaint from ISP)
suppressionlist@simulator.amazonses.com (Hard bounce as target email is on Amazon's suppression list)
API endpoints
US East (N. Virginia)	us-east-1
US West (Oregon)	us-west-2
EU (Ireland)	eu-west-1
Successful response has form:
{ ResponseMetadata: { RequestId: 'e8a3d6b4-94fd-11z6-afac-757cax279ap5' },
  MessageId: '01020157a1261241-90a5e1cd-3a5z-4sb7-1r41-957a4cae8e58-000000' }
Throttling error:
{ Throttling: Maximum sending rate exceeded.
    at ...
  message: 'Maximum sending rate exceeded.',
  code: 'Throttling',
  time: 2016-10-18T07:50:11.286Z,
  requestId: '7f2d1781-9507-11e6-8885-675506266ba7',
  statusCode: 400,
  retryable: true }
```
