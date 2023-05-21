
# Node Login Website

This project is built using Node.js React.js and for database I have used Mysql. It allows to register the new user and store it in database and the user is only able to login if the crediantials are correct. It additionally has a functionality that if the user tries to login the website incorrectly for 5 times consequently then he will be blocked for 24 hrs.


## Tech Stack

**Client:** React

**Server:** Node, Express

**Database:** Mysql

## Screenshots
### Already Registered
![image](https://github.com/Sumit-Mundhe/node-login-website/assets/109456344/6132e927-91fa-4645-a997-9d49cc5eb36f)

### Wrong Credentials
![image](https://github.com/Sumit-Mundhe/node-login-website/assets/109456344/b47c1596-9321-438a-81e2-bcb1796a8ecb)

### Blocked
![image](https://github.com/Sumit-Mundhe/node-login-website/assets/109456344/e96ddd67-f7f4-4767-91d8-43e9ede2825a)

### Successfull Login
![image](https://github.com/Sumit-Mundhe/node-login-website/assets/109456344/8abe4b52-3ad6-4ba3-b4c2-d0a0a3b44bbe)

### Mysql Database
The database consist of 2 tables
1. users : To store registered users data.
2. blocked_users : To store the blocked users.
![image](https://github.com/Sumit-Mundhe/node-login-website/assets/109456344/18e518f4-5b4e-425b-81c1-e95ca00a5bd1)


## Run Locally
Note : Before running the project you need to create the database with the 2 tables as shown in the above image.

Clone the project

```bash
  git clone https://github.com/Sumit-Mundhe/node-login-website
```

Go to the backend directory

```bash
  cd node-login-website/backend
```

Install dependencies

```bash
  npm install
```
Go to the frontend directory

```bash
  cd node-login-website/backend
```

Install dependencies

```bash
  npm install
```

Start the server in backend directory

```bash
  npm start
```

Start the React app in frontend directory

```bash
  npm start
```


## Feedback

If you have any feedback, please reach out to me at sumitmundhe100@gmail.com

