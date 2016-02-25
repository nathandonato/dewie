# dewie
A mock resource management framework

### To set up an instance of dewie:

Before we being, you'll need a few things.

```
sudo apt-get install npm mongodb-server
sudo npm install -g mongo forever
```

Once you have the necessary system-level tools, you're ready to begin.

First, clone this repository.

```
git clone https://github.com/nathandonato/dewie.git
cd dewie
```

Next, install necessary dependencies:

`npm install`

Then, we need mongoDb to be running, and we need to create our database. (Note, our app will assume your mongo is listening on the default port 28017.)

Finally, you are ready to run dewie.

```
forever dewie.js
```
Once it's up and running, visit http://127.0.0.1:3000/

Start typing to request or add company resources.

_Hint: the server seeds some data into its database, so start by typing "mac" to see how it works._
