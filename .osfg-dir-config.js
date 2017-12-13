/*
  OPEN SOURCE FOR GOOD DIRECTORY SAMPLE CONFIG FILE 

  title: Displayed at the Top and as the WebPage Title
  demoVideo: for the moment it only works with a regular YouTube links.
  liveDemo: address to the Homepage of the Project.
  description: an ES6 Template String with Github Markdown.
               Keep it relatively short, a paragraph tops.
  body: an ES6 Template String with Github Markdown. 
        Please include the license and FreeCodeCamp copyright at the end.

  If the 'liveDemo' or the 'demoVideo' aren't yet available you can 
  exclued them, they just won't be added to the Project's page.
*/

module.exports = {
  title: 'Mail for Good',
  demoVideo: 'https://www.youtube.com/watch?v=_7U03GVD4a8',
  liveDemo: '',
  description: `An app for sending millions of emails as cheaply as possible. Mail for Good uses AWS Simple Email Service to send bulk emails at $0.10 per 1000 emails.

Mail for Good is fast and memory efficient, currently sending over 100 emails per second on a 1gb Digital Ocean VPS.

We've used Mail for Good to deliver newsletters to hundreds of thousands of campers per week.
`,
  body: `## What does Mail for Good do?

With Mail for Good you can:

- Send email campaigns of unlimited size.
- Import emails that are saved in CSV format.
- Create templates to reuse for convenience when sending email campaigns.
- Track bounce rate and other standard metrics. You can also insert tracking pixels and unsubcribe links a click of a button.
- Add custom fields to imported email lists such as names or cities.
- Grant other users (limited or otherwise) permissions to use your account on your behalf.
- Add embedded HTML newsletter sign up forms to your site. These are snippets of code that will let your users sign up with you at the click of a button.

### Performance

We're currently sending weekly email blasts of over 700,000 emails in 3-4 hours on a $10 per month Digital Ocean VPS with 1gb memory and 1 core processor.

Mail for Good is fast and scales to the rate limit enforced by AWS.

### Why are we doing this?

We want to help nonprofits manage their email campaigns as inexpensively as possible, and have full control over their data.

### License

This computer software is licensed under the Open Source [BSD-3-Clause](https://github.com/freeCodeCamp/Mail-for-Good/blob/master/LICENSE.md).

Copyright (c) 2017, freeCodeCamp.
`
};
