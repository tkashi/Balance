# Balance
Balance Application to manage your schedule at MIT

# Prerequisite
- Install Java
- Install Node.js
- Install & start Mongodb

# How to Start
1. npm install
2. npm start
3. access http://localhost:3000/index.html

# How to Use Sample Data
1. open terminal
2. move balance/data folder
3. execute the below command to import data for each collection ({collection} = task, subject, user or usersubject)

    mongoimport --db balance -c {collection} {collection}.json
