# Reclamation application

## Requirements

* Node 16
* Git
* Contentful CLI (only for write access)

## Common setup

Clone the repo and install the dependencies.

```bash
git clone https://github.com/askribilel/reclamation.git
cd reclamation
```

```bash
npm install
```

## Steps for read-only access

To start the express server, run the following

```bash
npm run start
```

Open [http://localhost:3000](http://localhost:3000) and take a look around.


## Steps to run application (recommended)

step 1: create .env file
```
Step 1: touch .env
```
step 2: add the following lines to .env file
```

dbName="database_name"
dbUser="database_user"
dbPassword="database_password"
dbHost="database_host"
dbDialect="database dialect example mysql"
PORT=3000
max_allowed_packet=100777216 // to configure mysql 

```

step 3: run the server and test application

```
Step 3: To start the express server, run the following
npm run start
```
