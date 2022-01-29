# API-Demo

Simple demonstration of NodeJS API in Express and Azure Functions

> This repository does **NOT** includes deployment scripts and is for learning and testing purposes only.

## Environment

To test this application, you need [Docker](https://www.docker.com/), [NodeJS](https://nodejs.org/en/), and the [Azure Functions Core Tools](https://www.npmjs.com/package/azure-functions-core-tools) npm package on **major version 4** installed globally.

### Database

Before running any of the APIs, you will need to run the [`up.js`](environment/up.js) script to create and migrate a [PostgreSQL](https://www.postgresql.org/) database container.

In order to do that, run the following commands from the root directory of this repository:

```bash
cd environment
npm install
npm run up
```

After the command succeeds, the postgres database should be available on the port 5432.

If you want to stop the database you can run the [`down.js`](environment/down.js) script to remove the database container and delete the volumes created.

> Keep in mind that any data in the database will be lost if you run this script.

In order to do that, run the following commands from the root directory of this repository:

```bash
cd environment
npm run down
```

### Environment Variables

If you want to change the database credentials, port, or other application settings, you can set environment variables in the following files:
* Environment: [`.env`](environment/.env), with key-value pairs following separated by `=`.
* Azure Functions: [`local.settings.json`](azure-functions/local.settings.json) on the `Values` object, this file should have [this schema](https://docs.microsoft.com/pt-br/azure/azure-functions/functions-develop-local#local-settings-file).
* Standalone: [`.env`](standalone/.env), with key-value pairs following separated by `=`.

#### Environment

Variables available in the [`.env`](environment/.env) file:

```env
CONTAINER_NAME="postgres"
CONTAINER_IMAGE="postgres:latest"
CONTAINER_PORT=5432
POSTGRES_USER="postgres"
POSTGRES_PASSWORD="postgres"
POSTGRES_DATABASE="postgres"
```

#### Standalone

Variables available in the [`.env`](standalone/.env) file:

```env
PORT=3000
DB_PORT=5432
DB_USER="postgres"
DB_PASSWORD="postgres"
DB_DATABASE="postgres"
```

#### Azure Functions

Variables available in the [`local.settings.json`](azure-functions/local.settings.json) file:

```json
{
    "IsEncrypted": false,
    "Values": {
        "AzureWebJobsStorage": "UseDevelopmentStorage=true",
        "FUNCTIONS_WORKER_RUNTIME": "node",
  
        "DB_PORT": 5432,
        "DB_USER": "postgres",
        "DB_PASSWORD": "postgres",
        "DB_DATABASE": "postgres"
    }
}
```

## Usage

After setting up the environment, you can start one of the APIs or both:

### Standalone

This API is made using [NodeJS](https://nodejs.org/en/) and the [Express](https://expressjs.com/) API framework. It can be deployed in any environment with NodeJS installed or even dockerized.

This API is to show an example of an platform-agnostic backend project in NodeJS.

To run this API, run the following command from the root directory of this repository:

```bash
cd standalone
npm install
npm start
```

This will start the API on port 3000, or the PORT [environment variable](#environment-variables).

#### Endpoints

This API is RESTful, you can call the following endpoints:

> These example responses are considering that you have **NOT** changed the database initial state and are calling the endpoints in order.

##### Query all users

**Request**

```http
GET /user HTTP/1.1
Host: localhost:3000
```

**Expected Response Body**

```json
[
    {
        "id": 1,
        "username": "admin",
        "name": "Administrator",
        "license": "Pro"
    },
    {
        "id": 2,
        "username": "the_master_j0hn",
        "name": "John",
        "license": "Basic"
    },
    {
        "id": 3,
        "username": "the_p00r_jane",
        "name": "Jane",
        "license": "Free"
    }
]
```

##### Get a user by id

**Request**

```http
GET /user/1 HTTP/1.1
Host: localhost:3000
```

**Expected Response Body**

```json
{
    "id": 1,
    "username": "admin",
    "name": "Administrator",
    "license": "Pro"
}
```

##### Create a user

**Request**

```http
POST /user/ HTTP/1.1
Host: localhost:3000
Content-Type: application/json
Content-Length: 88

{
    "name": "Giancarlo Luz",
    "username": "Giancarl021",
    "licenseType": 3
}
```

**Expected Response Status Code**

```http
201 Created
```

##### Update a user

**Request**

```http
PUT /user/1 HTTP/1.1
Host: localhost:3000
Content-Type: application/json
Content-Length: 95

{
    "name": "Master Administrator",
    "username": "master-adm",
    "licenseType": 3
}
```

**Expected Response Status Code**

```http
204 No Content
```

##### Delete a user

**Request**

```http
DELETE /user/1 HTTP/1.1
Host: localhost:3000
```

**Expected Response Status Code**

```http
204 No Content
```

##### Query all licenses

**Request**

```http
GET /license HTTP/1.1
Host: localhost:3000
```

**Expected Response Body**

```json
[
    {
        "id": 1,
        "name": "Free",
        "price": 0
    },
    {
        "id": 2,
        "name": "Basic",
        "price": 9.99
    },
    {
        "id": 3,
        "name": "Pro",
        "price": 19.99
    }
]
```

### Azure Functions

This API is made using [NodeJS](https://nodejs.org/en/) and the [Azure Functions Core Tools](https://www.npmjs.com/package/azure-functions-core-tools) scaffolding. It can be deployed only on Azure and, even though it can be dockerized, it's not as easy as in the [Standalone](#standalone) API.

To run this API, run the following command from the root directory of this repository:

```bash
cd azure-functions
npm install
npm start
```

This will start the API on port 7071.

#### Endpoints

This API is RESTful, you can call the following endpoints:

> These example responses are considering that you have **NOT** changed the database initial state and are calling the endpoints in order.

##### Query all users

**Request**

```http
GET /api/listUsers HTTP/1.1
Host: localhost:7071
```

**Expected Response Body**

```json
[
    {
        "id": 1,
        "username": "admin",
        "name": "Administrator",
        "license": "Pro"
    },
    {
        "id": 2,
        "username": "the_master_j0hn",
        "name": "John",
        "license": "Basic"
    },
    {
        "id": 3,
        "username": "the_p00r_jane",
        "name": "Jane",
        "license": "Free"
    }
]
```

##### Get a user by id

**Request**

```http
GET /api/getUser?id=1 HTTP/1.1
Host: localhost:7071
```

**Expected Response Body**

```json
{
    "id": 1,
    "username": "admin",
    "name": "Administrator",
    "license": "Pro"
}
```

##### Create a user

**Request**

```http
POST /api/createUser HTTP/1.1
Host: localhost:7071
Content-Type: application/json
Content-Length: 88

{
    "name": "Giancarlo Luz",
    "username": "Giancarl021",
    "licenseType": 3
}
```

**Expected Response Status Code**

```http
201 Created
```

##### Update a user

**Request**

```http
PUT /api/editUser?id=1 HTTP/1.1
Host: localhost:7071
Content-Type: application/json
Content-Length: 95

{
    "name": "Master Administrator",
    "username": "master-adm",
    "licenseType": 3
}
```

**Expected Response Status Code**

```http
204 No Content
```

##### Delete a user

**Request**

```http
DELETE /api/deleteUser?id=1 HTTP/1.1
Host: localhost:7071
```

**Expected Response Status Code**

```http
204 No Content
```

##### Query all licenses

**Request**

```http
GET /api/listLicenses HTTP/1.1
Host: localhost:7071
```

**Expected Response Body**

```json
[
    {
        "id": 1,
        "name": "Free",
        "price": 0
    },
    {
        "id": 2,
        "name": "Basic",
        "price": 9.99
    },
    {
        "id": 3,
        "name": "Pro",
        "price": 19.99
    }
]
```
