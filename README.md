Example of use of passport-jwt 
===============================

First of all you must create *.env* file with these variables:
```
MONGO_URI=mongodb+srv://user:password@server/db

# number of rounds for blowfish
BCRYPT_ROUNDS=12

# server port
PORT=3000

# enable mocha tests
NODE_ENV=test


```
**You can create use a mongodb server at mongodb Atlas service for free.**

# Install
* git clone https://github.com/davidpoza/fcc-anonymous-messageboard.git
* npm Install
* npm start
* go localhost:3000 on your browser