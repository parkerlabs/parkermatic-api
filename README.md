# Automaticator

A node.js app to demonstrate the use of the [Automatic Webook API](https://developer.automatic.com/).  It shows driving events, such as ignition on, for the logged in user in real time on a map.

The [Automatic API](https://developer.automatic.com/) exposes data collected by [Automatic](https://automatic.com), a small device that syncs your car's computer with your phone.

## Demo

A version of this application is available at [https://parkermatic.herokuapp.com/](https://parkermatic.herokuapp.com/.

![automaticator-screenshot](https://cloud.githubusercontent.com/assets/96217/7171637/e41c3ab6-e38f-11e4-858c-e77baf670f1d.png)


## One-Click deploy to Heroku

Click this button to instantly deploy this app to Heroku. You'll need an [Automatic client ID and secret](http://developer.automatic.com) as well as a [mapbox access token](https://www.mapbox.com/signup/).

[![Deploy](https://www.herokucdn.com/deploy/button.png)](https://heroku.com/deploy)

After deploying, you will need to use the Automatic [Developer Apps Manager](https://developer.automatic.com/my-apps/) to set your application's redirect URL and webhook URL to match the Heroku app name you selected when deploying. For instance, if you name your app `automaticator-test` in Heroku your redirect URL should be `https://automaticator-test.herokuapp.com/redirect` and your webhook URL should be `https://automaticator-test.herokuapp.com/webhook`. Note that the URLs must start with `https`.


## Running Locally

### Install node and gulp

    brew install node

    npm install gulp -g

### Install required packages from NPM and Bower:

    npm install

This will also grab frontend packages needed from bower and put them in `public/bower_components`

### Configure your client id and client secret

Copy the file `config-sample.json` to `config.json` and add your Automatic client id and client secret.  Alternatively, create environment variables named `AUTOMATIC_CLIENT_ID` and `AUTOMATIC_CLIENT_SECRET`.

Get a [mapbox access token](https://www.mapbox.com/signup/) and add it to the `config.json` file.

### Run the app

    gulp develop

### View the app

Open `localhost:3000` in your browser.

### Testing locally, skipping OAuth

You can test locally as a logged in user, bypassing OAuth by including an `TOKEN` and `USER_ID` when running the app.

    USER_ID=<YOUR_USER_ID> TOKEN=<YOUR-AUTOMATIC-ACCESS-TOKEN> gulp develop

## Deploying

If you have the [heroku toolbelt](https://toolbelt.heroku.com/) installed, you can create, configure and deploy this app to Heroku.  To create an app:

    heroku create

If you already created an app, add it as a git remote:

    git remote add heroku YOUR-HEROKU-GIT-URL

Configure the heroku app's environment variables:

    heroku config:add AUTOMATIC_ACCOUNTS_URL=https://accounts.automatic.com
    heroku config:add AUTOMATIC_CLIENT_ID=<YOUR AUTOMATIC CLIENT ID>
    heroku config:add AUTOMATIC_CLIENT_SECRET=<YOUR AUTOMATIC CLIENT SECRET>
    heroku config:add SESSION_SECRET=<YOUR SESSION SECRET>

Deploy your app to heroku:

    git push heroku master

See [deploying a node.js app](https://devcenter.heroku.com/articles/getting-started-with-nodejs#introduction) for more information.

### Support

Please write to developer@automatic.com if you have any questions or need help.

## License

This project is licensed under the terms of the Apache 2.0 license.
