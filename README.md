# UNSW Value Eats

## Requirements

- Node.js
- Yarn (recommended)

## Initialize and run back-end

- Navigate to the `backend` folder
```bash
cd backend
```

- Install all the dependencies for backend 
```bash
yarn
```
- Run your backend server. The server will run on port `8000` by default so please make sure no other applications run on the port `8000`. If you want to run your backend server in another port please see the Debug part as below. 

```bash
yarn start
```
- When everything runs successfully, the output from your backend terminal should look like as below after you run `yarn start`

```bash
$ nodemon -r esm server.js
[nodemon] 2.0.7
[nodemon] to restart at any time, enter `rs`
[nodemon] watching path(s): *.*
[nodemon] watching extensions: js,mjs,json
[nodemon] starting `node -r esm server.js`
mongodb+srv://chickenAPI:comp3900chicken@valueeatbooking.sckj8.mongodb.net/chickenapis?retryWrites=true&w=majority
Server is running on port 8000
DB connected
```
## Initialize and run front-end

- Open the repo in the new terminal if you want to run both backend and frontend at the same time.

- Navigate to the `frontend` folder
```bash
cd frontend
```

- Install all the dependencies for frontend 
```bash
yarn
```
- Run your frontend 

```bash
yarn start
```
## View app

The application will be available at http://localhost:3000 by default

The backend server will be available at http://localhost:8000

## Debug

If you want to run your backend server in another port, you must following the two below steps:

- Navigate to the `backend` folder and change the value of the variable `PORT` to your new port. i.e

```
PORT = <your new port>
// keep other variables in this .env file the same
```

- Navigate to the `frontend` folder and change the value of the variable `REACT_APP_API` to your new port. i.e

```
REACT_APP_API='http://localhost:<your new backend port>/api'
```


