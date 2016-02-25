# dewie
A mock resource management framework

### To set up an instance of dewie:

Before we being, you'll need a few things.

```
sudo apt-get update
sudo apt-get install nodejs
sudo apt-get install npm mongodb-server git
sudo npm install -g mongo
```

Once you have the necessary system-level tools, you're ready to begin.

First, clone this repository.

```
git clone https://github.com/nathandonato/dewie.git
cd dewie
```

Next, install necessary dependencies:

`npm install`

Note, if you run into trouble here, try running `sudo npm install` instead.

Then, we need mongoDb to be running. (Note, our app will assume your mongo is listening on the default port 28017.)

```
mongo
exit
```

Finally, you are ready to run dewie.

```
node dewie.js
```

Note, if you run into trouble here, try running `nodejs dewie.js` instead.

Once it's up and running, visit http://127.0.0.1:3000/

Start typing to request or add company resources.

_Hint: the server seeds some data into its database, so start by typing "mac" to see how it works._
