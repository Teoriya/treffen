# Backend for Treffen
## Running the backend.

Clone the project

```bash
  git clone https://github.com/Teoriya/treffen.git
```

Go to the backend folder in the project directory

```bash
  cd treffen/backend
```

Install dependencies

```bash
  npm install
```

Make sure you have a `.env` file in the backend folder.
```
{project root}\backend\.env
``` 

Start the server for development 
```bash
  npm run dev
```

Start the server for deployment
```bash
  npm start
```


## Folder Structure
### ./backend/

    |-- .env                        (stores the environment variables)
    |-- .gitignore                  (gitignore for version control)
    |-- demo.env                    (dummy data having all the environment variables)
    |-- package-lock.json           (stores an exact, versioned dependency tree)
    |-- package.json                (manifest file of Node.js project, contains the metadata of the project)
    |-- README.md                   (This file , which contains the documentation)
    |-- server.js                   (The entry file of the backend)
    |-- controllers                 (This folder contains all the controllers)
    |   |-- activate.controller.js  (controllers related to activation)
    |   |-- auth.controller.js      (controllers related to authentication)
    |   |-- room.controller.js      (controllers related to rooms)
    |-- dtos                        (Data Transfer Objects)
    |   |-- room.dto.js             (room DTO)
    |   |-- user.dto.js             (user DTO)
    |-- middlewares                 (Express middlewares)
    |   |-- auth.middleware.js      (Authentication Middleware)
    |-- models                      (Mongo DB Models)
    |   |-- refresh.model.js        (Model for storing refresh tokens)
    |   |-- room.model.js           (Model for storing room data)
    |   |-- user.model.js           (Model for storing user data)
    |-- routes                      (Contains all the router which will handle the incoming routes)
    |   |-- room.routes.js          (Router for routing to respective handlers for all room related routes)
    |   |-- user.routes.js          (Router for routing to respective handlers for all user related routes)
    |-- services                    (Service layer above the DB)
    |   |-- room.service.js         (Room Service Layer)
    |   |-- token.service.js        (Token Service Layer)
    |   |-- user.service.js         (User Service Layer)
    |-- socket                      (All logic related to Sockets.io)
    |   |-- actions.js              (A map of actions to strings of all events that will be emitted by the websocket)
    |   |-- codeEditor.js           (All the code editor related websocket logic)
    |   |-- index.js                (Entry file for the sockets logic, connection is initialized here)
    |   |-- webRTC.js               (All the Web RTC related websocket logic)
    |-- ssl_certificates            (Folder to hold the ssl certificates)
    |   |-- demo.certificate.crt    (dummfile to show how to store certificate.crt file)
    |   |-- demo.private.key        (dummfile to show how to store private.key file)
    |-- utils                       (utilities for the project)
        |-- boilerPlate.utils.js    (boilerplate code for new room data)
        |-- db.utils.js             (utility to initialize the DB connection)
        |-- jwt.utils.js            (JWT utilites to create and handle JWT tokes)
        |-- otp.utils.js            (Fast2sms and crypto utilites to generate send and hash otps)


## Environment Variables

To run this project, you will need to add the following environment variables to your .env file. You can also find the same in demo.env int the backend folder.

`OTP_SECRET` - Secret key used to generate one-time passwords (OTP) for user authentication.(Can be any random string)

`JWT_SECRET_ACCESS` - Secret key used to generate and verify access tokens for user authentication.(Can be any random string)

`JWT_SECRET_REFRESH`  - Secret key used to generate and verify refresh tokens for user authentication.(Can be any random string)

`SMS_API_KEY` -  API key used to authenticate requests sent to [fast2sms](https://www.fast2sms.com/) SMS gateway service. 

`CORS_ORIGIN` - Allowed origins for [Cross-Origin Resource Sharing (CORS)](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) requests.

`MONGO_URI` - [Connection string](https://www.mongodb.com/docs/manual/reference/connection-string/) required to connect to a [MongoDB](https://www.mongodb.com/) database.


`PORT` -  [Port](https://developer.mozilla.org/en-US/docs/Glossary/Port) on which the backend API should listen for incoming requests. (If not provided defaults to port 5000)

`BASE_URL` - : Base URL for the backend API, typically the domain name or IP address of the server where the API is hosted. (`http://localhost` if you are running you project locally)




# API References
## User Routes
## Send OTP 

```http
  POST /users/send-otp
```
#### Request Body
```JSON
{
  "phone":"xxxxxxxx17"
}
```
#### Successful Response Body
```JSON
{
    "message": "OTP sent successfully",
    "hash": "49c6aefa2e85a0e71494a8083318f848f29091e383d0c2518493cd4c15da6bd4",
    "expires": 1679077803177,
    "phone": "xxxxxxxx17"
}
```


## Verify OTP 

```http
  POST /users/verify-otp
```
#### Request Body
```JSON
{
    "phone":"xxxxxxxx17",
    "hash":"38d93d642bc9e0ac58a6245686fe1ff1fcd153f505efe266b141cb89d1e77482",
    "otp":"207242",
    "expires":"1679078194016"
}
```
#### Successful Response Body for an activated user.
```JSON
{
    "user": {
        "_id": "6413da6ff2a98086f7ae7713",
        "phone": "xxxxxxxx17",
        "activated": true,
        "avatar": "http://localhost:5000/public/profileImages/1679022727314199739.jpg",
        "name": "Sid",
        "createdAt": "2023-03-17T03:11:43.850Z"
    },
    "auth": true
}
```

#### Successful Response Body for a new user.
```JSON
{
    "user": {
        "_id": "6413da6ff2a98086f7ae7713",
        "phone": "xxxxxxxx17",
        "activated": false,
        "createdAt": "2023-03-17T03:11:43.850Z"
    },
    "auth": true
}
```

**Note** -  *Along with the user data , A browser cookie containing the refreshToken and accessToken is also sent.*

## Activate a user
*NOTE* - This requests requires you to have a valid accessToken in your Cookie.
```http
  POST /users/activate
```
#### Request Body
```JSON
{
  "name": "Sam",
  "avatar": ""
}
```
#### Successful Response Body
```JSON
{
  "user":{
      "_id":"6414ba69f2a98086f7ae77ca",
      "phone":"9871359617",
      "activated":true,
      "avatar":null,
      "name":"Sam",
      "createdAt":"2023-03-17T19:07:21.385Z"},
      "auth":true
}
```

#### Logout

```http
  POST /users/logout
```

## Refresh
*NOTE* - This requests requires you to have a valid refreshToken in your Cookie.
```http
  GET /users/refresh
```
#### Successful Response Body
```JSON
{
    "user": {
        "_id": "6413da6ff2a98086f7ae7713",
        "phone": "xxxxxxxx17",
        "activated": false,
        "createdAt": "2023-03-17T03:11:43.850Z"
    },
    "auth": true
}
```
**Note** -  *Along with the user data , A browser cookie containing the refreshToken and accessToken is also sent.*

## Room Routes 
*NOTE* - All requests here need you to have a valid accessToken in your Cookie.
## Fetch a category of Rooms
```http
  GET /rooms/
```
#### Successful Response Body
```JSON
[
  {
    "id": "6413daaef2a98086f7ae771b",
    "topic": "Test Room",
    "speakers": [
      {
        "_id": "6413da6ff2a98086f7ae7713",
        "phone": "*******611",
        "activated": true,
        "avatar": "https://treffenb.civitas-comm.tech:5000/public/profileImages/1679022727352-614199739.717157.jpg",
        "name": "Sid",
        "createdAt": "2023-03-17T03:11:43.850Z"
      }
    ],
    "roomType": "open",
    "createdAt": "2023-03-17T03:12:46.624Z",
    "owner": {
      "_id": "6413da6ff2a98086f7ae7713",
      "phone": "*******611",
      "activated": true,
      "avatar": "https://treffenb.civitas-comm.tech:5000/public/profileImages/1679022727352-614199739.717157.jpg",
      "name": "Sid",
      "createdAt": "2023-03-17T03:11:43.850Z"
    }
  }
]
```

## Create a Room

```http
  POST /rooms/create
```
#### Request Body
```JSON
{
  "topic": "Devops and Deployments",
  "roomType": "open"
}
```
#### Successful Response Body
```JSON
{
  "id": "6414bda2f2a98086f7ae77d9",
  "topic": "Devops and Deployments",
  "speakers": [
    {
      "_id": "6414ba69f2a98086f7ae77ca",
      "phone": "*******123",
      "avatar": null
    }
  ],
  "roomType": "open",
  "createdAt": "2023-03-17T19:21:06.210Z"
}
```


#### Fetch a single room

```http
  GET /rooms/:roomId
```
| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`      | `string` | **Required**. Id of room to fetch |

#### Successful Response Body
```JSON
{
  "id": "6414bda2f2a98086f7ae77d9",
  "topic": "Devops and Deployments",
  "speakers": [
    {
      "_id": "6414ba69f2a98086f7ae77ca",
      "phone": "*******617",
      "activated": true,
      "avatar": null,
      "name": "Sam",
      "createdAt": "2023-03-17T19:07:21.385Z"
    }
  ],
  "roomType": "open",
  "createdAt": "2023-03-17T19:21:06.210Z",
  "owner": {
    "_id": "6414ba69f2a98086f7ae77ca",
    "phone": "*******617",
    "activated": true,
    "avatar": null,
    "name": "Sam",
    "createdAt": "2023-03-17T19:07:21.385Z"
  }
}
```
