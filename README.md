## Overview
This is the repository for the online platform for ACMEFood.com. The program is an interface for the staff to input client’s personal information (name, phone#, addresses), weekly delivery schedule (how many meals and how often do they want to eat) and dietary restrictions (to avoid giving them the default input menu for that week if needed) and the program automatically outputs the number of meals of each type to be made for that week and the labels for each meal of every active client. The labels are downloaded in a zip file containing formatted .docx documents which can be immediately printed onto Avery 4879 labels. Most of the data persists on the server side in a SQL database. I have opened it up for anyone to see the features for themselves. Some of them are:
-	Predictive search text for most text fields.
-	Flow for client self-registration, log in and management of their account.
-	Form validation in the frontend (for every form) and backend (client changes only).
-	Form inputs restrict (calendar meal choices only from those available on that day) and normalize inputs where possible (phone#s).
-	Conflicts brought on by dietary restrictions are highlighted for staff resolution.

I was trying to make it for anyone without a technical background to pick it up and use the program easily. I have been developing, deploying, and testing this application in a CentOS VM with 1 CPU core and 2gb of RAM for the server-side since that was most likely the environment it was going to run if it ever went online. I got it to a bug-free state so feel free to prove me wrong.

## Requirements and Installation
-  [.NET ](https://dotnet.microsoft.com/en-us/download) \>= 5 (for the .docx formatting)
- [NodeJS](https://nodejs.org/en/) \>= 12.x
-	[SQL Schema](https://github.com/rardlc/ACMEFood/blob/main/DB/createACMEFoodSchema.sql)

![The App's SQL Schema screenshot from MySQL Workbench](https://github.com/rardlc/ACMEFood/blob/main/public/ACMEFoodSchema.png)


Once you have the NodeJS and .NET framework installed and the mySQL ACMEFood database running in the background, execute from the root directory:

    npx next dev --port 3001
    node ./DB/dbServer.js



