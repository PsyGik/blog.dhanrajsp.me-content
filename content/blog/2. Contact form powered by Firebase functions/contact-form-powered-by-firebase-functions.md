---
title: 'The Build Series: E1 — Contact Form powered by Firebase Functions'
author: 'Dhanraj Padmashali'
tags: ['The Build Series', 'Firebase']
image: './images/contact.png'
date: '2021-04-17T11:36:36.973Z'
draft: false
permalink: 'contact-form-powered-by-firebase-functions'
excerpt: 'Welcome to the first episode of The Build Series where we will build a customized contact form and when the user submits the form, it will add all the form information to Google Sheets.'
---

Welcome to the first episode of _The Build Series_ where we will build a customized contact form and when the user submits the form, it will add all the form information to Google Sheets. At the backend, we’ll write a NodeJS function and deploy it to Firebase Functions which will update the Google Sheet for us. Let’s get started.

# Setup Firebase & CLI tools

First, let’s set up a Firebase Project to deploy our functions.

-   Open your [Firebase Console](https://console.firebase.google.com/) and Click on ‘Add Project’
-   Give it a name. Let’s call it ‘contact-form-api’
-   Install the Firebase CLI on your local machine using npm by running the install command in our terminal

`embed:./code/scripts.sh{snippet: "installFirebase"}`

-   This command installs the globally available `firebase` command
-   Sign into Firebase using your Google account by running

`embed:./code/scripts.sh{snippet: "firebaseLogin"}`

> _This command connects your local machine to Firebase and grants you access to your Firebase projects._

To test that authentication worked (and to list all of your Firebase projects), run the following command:

`embed:./code/scripts.sh{snippet: "firebaseList"}`

The above process is pretty straightforward. You can find more details regarding the installation [in the docs](https://firebase.google.com/docs/cli/).

# Setting up the Project

Open a terminal and create a new directory

`embed:./code/scripts.sh{snippet: "createDir"}`

Let’s initialize a Firebase project here

`embed:./code/scripts.sh{snippet: "firebaseInit"}`

Select the option — **\***Functions: Configure and deploy Cloud Functions**\***

-   Select the project we created in the first step — *contact-form-api*
-   Next, select the language. We’re going to go with TypeScript here. You can select JavaScript if you prefer.
-   Let the CLI install all the dependencies for us.
-   Let’s open the folder in our IDE.

# Setting up the Contact Sheet

-   Open Google Drive and create a new Google Sheet, let’s call it _Contact Sheet_
-   Add 3 columns, Name, Email Address, Message
-   Notice the URL, we need to get the ID of the sheet from the URL. We’ll be using this ID to write to the Sheet
    > `https://docs.google.com/spreadsheets/d/<COPY_THIS_ID_>/edit#gid=0`

# Configuring Auth

To edit or update Google Sheets we need user auth. However, since our Google account is configured with 2FA (if yours isn’t, then do it right now)so we need to use Service Account Keys instead.

-   Get a service account key from [https://console.cloud.google.com/apis/credentials](https://console.cloud.google.com/apis/credentials) (You can also restrict what the key is allowed to do)

> _When creating, make sure you click the `Furnish a new private key.` Select `JSON` when it asks you how to download the key._

-   The `service account key` we have just generated includes a `client_email.`
-   Open the _Contact Sheet_ sharing options, and allow this `client_email` to have write access to this document.

For more information on `Service Account Keys`[refer the docs](https://cloud.google.com/iam/docs/creating-managing-service-account-keys).

# Set up the Function

Open the project and install the following packages:

`embed:./code/scripts.sh{snippet: "npmInstallGAPI"}`

> _We can do this without express but we want to add more than one endpoint to this function. If you want to skip express you can do that._

Now let’s code the main stuff,

`embed:./code/index.js`

What we are doing here is whenever we get a `POST` request from the user at the `/api/contact` endpoint,

-   We authorize our server using the `Service Account Key,`
-   When the auth is successful, we use the token we got and append the data to the _Contact Sheet._

> _We have also added another endpoint called `/api/ping` which we will use to verify if we are able to hit the functions from our local machine._

# Test the Function

We will first test the function locally. To do that let’s open the terminal and run the script:

`embed:./code/scripts.sh{snippet: "npmRunServe"}`

> _Note: You’ll need to run this inside the `functions` directory where there is a `package.json` file._

We should see that the functions are ready to run, with a message in the terminal prompt:

`✔ functions: api: http://localhost:5000/contact-form-api/us-central1/api`

Open terminal and test the URL:

`embed:./code/scripts.sh{snippet: "curlPing"}`

We should see `Hello from the other side` in the response. This means we have configured express correctly.

Now let’s test `POST` with some form data.

Change the URL to `http://localhost:5000/contact-form-api/us-central1/api/contact` with json data

```json
{ "name": "John Doe", "email": "john@company.com", "message": "Test Message" }
```

It should look something like this:

`embed:./code/scripts.sh{snippet: "curlPost"}`

We should get the response from the API as:

```json
{
	"spreadsheetId": "SHEET_ID",
	"tableRange": "Sheet1!A1:C6",
	"updates": {
		"spreadsheetId": "SHEET_ID",
		"updatedRange": "Sheet1!A7:C7",
		"updatedRows": 1,
		"updatedColumns": 3,
		"updatedCells": 3
	}
}
```

> Note: If you get any auth related issues, double check the `private_key.json` file. If you get any issues such as cannot write to sheet, check if sharing is enabled for the sheet with the email provided in `private_key.json.`

# Build the Form

Now that we’ve build the backend, let’s build a simple contact form. I'm going to keep everything in one file for the sake of simplification.

`embed:./code/form.html`

We built a simple form here which uses the `fetch()` api to post data to our firebase function. Replace the url in the javascript file and test it out.

# Deploying Functions

Now that  the Form and the Function are built, it is time to deploy the functions.

Open a terminal within the functions directory and execute:

`embed:./code/scripts.sh{snippet: "firebaseDeploy"}`

This will take a couple of minutes. If successful, you should see something like this in the terminal.

```sh{numberLines:false}
    ✔  functions: Finished running predeploy script.
    i  functions: ensuring necessary APIs are enabled...
    ✔  functions: all necessary APIs are enabled
    i  functions: preparing functions directory for uploading...
    i  functions: packaged functions (54.02 KB) for uploading
    ✔  functions: functions folder uploaded successfully
    i  functions: creating Node.js 6 function api(us-central1)...
    ✔  functions[api(us-central1)]: Successful create operation.
    Function URL (api): https://us-central1-contact-form-api.cloudfunctions.net/api
    ✔  Deploy complete!
    Project Console: https://console.firebase.google.com/project/contact-form-api/overview
```

We can confirm if the deployment is successful by hitting our `/ping` endpoint.

# Bonus Points

If you’ve already configured Firebase Hosting, then you can use the same project to deploy functions to and have it accessed using `http://yourdomain.com/api/ping.` To do that, add the following lines to your `firebase.json` file.

```json
{
	"hosting": {
		"public": "dist",
		"ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
		"rewrites": [
			{
				"source": "/api/**",
				"function": "api"
			}
		]
	}
}
```

> _Note: The name of the function is what we exported from our _`index.ts`_ functions file._

# End Points

We did quite a lot in this episode.

-   Configured a Project in Firebase Console
-   Installed Firebase CLI
-   Created a function using NodeJS
-   Created a simple contact form
-   Connected the contact form and the contact sheet using the function

Now that we’ve built the foundation, we can also

-   Add validation so that same email doesn’t go in the form more than once,
-   Enable CORS, so only our domain can post data,
-   Enable Authentication for our functions,
-   Send out an email using `nodemailer` thanking the subscriber,
-   and a lot more…

We have reached the end of this episode of *The Build Series. *Reach out in case of any issues/queries. Stay tuned for the next episode.

Until next time! ✌🏽
