// Example express application adding the parse-server module to expose Parse
// compatible API routes.

const express = require('express');
const { ParseServer } = require('parse-server');
const path = require('path');
const args = process.argv || [];
const port = process.env.PORT || 1337;
const databaseUri = process.env.DATABASE_URI || 'mongodb://localhost:27017/dev';


const app = express();

// / Serve static assets from the /public folder
app.use('/public', express.static(path.join(__dirname, '/public')));

// Parse Server Mount path
const mountPath = process.env.PARSE_MOUNT || '/parse';

// Parse Server options
const api = new ParseServer({
  databaseURI: databaseUri,
  cloud: process.env.CLOUD_CODE_MAIN || __dirname + '/cloud/main.js',
  appId: process.env.APP_ID || 'myAppId',
  masterKey: process.env.MASTER_KEY || '', //Add your master key here. or leave it blank for development
  serverURL:  process.env.SERVER_URL || 'http://localhost:' + port + '/parse',  // Don't forget to change to https if you are going to deploy to production
});

// Mount Parse Server on the /parse mount path
app.use(mountPath, api);

// Parse Dashboard settings
const parseDashboard = require('parse-dashboard');

const dashboard = new parseDashboard({
  "apps": [
    {
      "serverURL": 'http://localhost:' + port + '/parse',
      "appId": process.env.APP_ID || 'myAppId',
      "masterKey": process.env.MASTER_KEY || '' ,
      "appName": process.env.APP_NAME || 'MyApp'
    }
  ]
});
app.use('/dashboard', dashboard);

app.get('/', function (req, res) {
  res.status(200).send('I dream of being a web site.');
});

const httpServer = require('http').createServer(app);
httpServer.listen(port, function () {
  console.log('Parse Server is running on http://localhost:' + port + '/parse');
});
