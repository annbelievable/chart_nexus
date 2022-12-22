# Chart Nexus

## Steps to start the project
1. Make sure you have Node installed in your computer. Follow this link if you have not install Node js: https://nodejs.dev/en/learn/how-to-install-nodejs/
1. Navigate to the project folder, run the command `npm install` to install necessary packages.
1. Under the same folder, run the command `DEBUG=chart_nexus:* & npm start` to start the project.
1. The project can be accessed at the url: http://localhost:3000/

## Features
1. User can view listing from different market by using the select dropdown for market.
1. User can choose to view "Top Volume", "Top Gainers" and "Top Losers" of a market by clicking on the 3 tabs shown.
1. Updated rows in the listing will be highlighted in yellow colour.
1. Dark mode toggle

## Notes
1. Currently the interval is set to 5 seconds, for the highlight to look as if they are blinking, set the interval to 1 second. 