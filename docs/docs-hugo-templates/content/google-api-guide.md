---
title: "How to configure your Google API Keys"
date: 2017-09-30T16:56:37-05:00
---

1. Login to [Google API Manager](https://console.developers.google.com/apis/).
2. In the left menu, select **Dashboard**. Now select **Enable API**, search for `Google+` and select it. At the top of the screen, ensure it's enabled by clicking on **Enable**.
3. In the left menu, select **Credentials**. Then click **Create Credentials** > **OAuth client ID**.
4. Select **Web Application**. Name is as you wish, but under **Authorized Javascript Origins** put `http://localhost:8080`, and under **Authorized redirect URIs** put `http://localhost:8080/auth/google/callback`.
5. Click **Create**. You will now have a Client ID and Client Secret. In your .env file, put the Client ID as your GOOGLE_CONSUMER_KEY, and the Client Secret as your GOOGLE_CONSUMER_SECRET.
