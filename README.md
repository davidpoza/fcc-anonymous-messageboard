Example of testing with Mocha + Chai
=====================================

First of all you must create *.env* file with these variables:
```
MONGO_URI_PROD="mongodb+srv://user:password@server/database"
MONGO_URI_DEV="mongodb+srv://user:password@server/database"
MONGO_URI_TEST="mongodb+srv://user:password@server/database"

# number of rounds for blowfish
BCRYPT_ROUNDS=12

# server port
PORT=3000
PORT_TEST=3001

# enable mocha tests
NODE_ENV=fcctesting


```
**You can create use a mongodb server at mongodb Atlas service for free.**

# Install
* git clone https://github.com/davidpoza/fcc-anonymous-messageboard.git
* npm Install
* npm start
* go localhost:3000 on your browser