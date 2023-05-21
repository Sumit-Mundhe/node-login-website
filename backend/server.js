const mysql = require("mysql");
const express = require("express");
const path = require("path");
const cors = require("cors");
const session = require("express-session");
const cookieParser = require("cookie-parser");

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST"],
    credentials: true,
  })
);

app.use(cookieParser());

const oneDay = 1000 * 60 * 60 * 24;
app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: oneDay },
  })
);

const connection = mysql.createConnection({
  host: "localhost",
  database: "sumit_db",
  user: "root",
  password: "sumit",
});

connection.connect(function (error) {
  if (error) throw error;
  else console.log("My Sql database is connected successfully!!!");
});

app.post("/register", (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  // console.log("-->"+email+"<--");

  // Check if email already exists in the database
  connection.query(
    "SELECT * FROM users WHERE email = ?",
    [email],
    (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).send("An error occurred");
      }

      if (result.length > 0) {
        console.log("Email Already exists!!!");
        return res.send("Already_Existed");
        // return res.status(409).send('Email already exists. Please choose a different email.');
      }

      connection.query(
        "INSERT INTO users (name,email,password) VALUES (?,?,?)",
        [name, email, password],
        (err, result) => {
          if (err) {
            return console.log(err);
          }
          return res.send("Success");
        }
      );
    }
  );
});


const MAX_LOGIN_ATTEMPTS = 5;
const BLOCK_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  console.log(email, password);

  //Check if user is registered or not
  connection.query(
    "SELECT * FROM users WHERE email = ?",
    [email],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).send("An error occurred");
      }
      if (result.length == 0) {
        console.log("User has not been registered");
        return res.send("Not_Registered");
      }
      // Check if the user is blocked
      connection.query(
        "SELECT * FROM blocked_users WHERE email = ?",
        [email],
        (err, result) => {
          if (err) {
            console.error(err);
            return res.status(500).send("An error occurred");
          }
          // User is present in the Blokced_user table in our db
          if (result.length > 0) {
            const blockedTimestamp = new Date(result[0].blocked_timestamp).getTime(); // Convert to milliseconds
            const currentTime = Date.now();
            console.log(currentTime, blockedTimestamp);
            // Check if the block duration has passed
            if (currentTime < blockedTimestamp) {
              const remainingTime = blockedTimestamp - currentTime;
              const remainingHours = Math.floor(remainingTime / (1000 * 60 * 60));
              const remainingMinutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60)); 

              console.log(`User is blocked for ${remainingHours} hours and ${remainingMinutes} minutes`);
              res.send("Blocked");
            } else {
              // The block duration has passed, so remove the user from the blocked_users table
              connection.query(
                "DELETE FROM blocked_users WHERE email = ?",
                [email],
                (err, result) => {
                  if (err) {
                    console.error(err);
                    return res.status(500).send("An error occurred");
                  }
                  connection.query(
                    "UPDATE users SET login_attempts = 0 WHERE email = ?",
                    [email],
                    (err, result) => {
                      if (err) {
                        console.error(err);
                        return res.status(500).send("An error occurred");
                      }
                      // Proceed with the login process
                      performLogin();
                    }
                  );
                }
              );
            }
          } else {
            // The user is not blocked, proceed with the login process
            performLogin();
          }
        }
      );
    }
  );

  // Function to perform the login process
  function performLogin() {
    connection.query(
      "SELECT name FROM users WHERE email=? AND password=?",
      [email, password],
      (err, result) => {
        if (err) {
          console.error(err);
          return res.status(500).send("An error occurred");
        }
        if (result.length > 0) {
          const name = result[0].name;

          req.session.user = { name, email };
          res.cookie("session_id", req.session.id, {
            maxAge: 24 * 60 * 60 * 1000, // Set cookie expiration time to 1 day
            httpOnly: true, // Ensure that the cookie is accessible only through HTTP(S) requests
            secure: true, // Set the 'secure' flag to ensure that the cookie is only sent over HTTPS
          });
          connection.query(
            "UPDATE users SET login_attempts = 0 WHERE email = ?",
            [email],
            (err, result) => {
              if (err) {
                console.error(err);
                return res.status(500).send("An error occurred");
              }
            }
          );
          return res.send({ name });
        } else {
          // Increment the login attempts counter for this user
          connection.query(
            "SELECT login_attempts FROM users WHERE email = ?",
            [email],
            (err, result) => {
              if (err) {
                console.error(err);
                return res.status(500).send("An error occurred");
              }

              const loginAttempts = result.length > 0 ? result[0].login_attempts + 1 : 1;

              if (loginAttempts >= MAX_LOGIN_ATTEMPTS) {
                const blockedTime = Date.now() + BLOCK_DURATION;

                connection.query(
                  "INSERT INTO blocked_users (email, blocked_timestamp) VALUES (?, DATE_ADD(NOW(), INTERVAL 24 HOUR))",
                  [email],
                  (err, result) => {
                    if (err) {
                      console.error(err);
                      return;
                    }
                    console.log(
                      `User is blocked until: ${new Date(blockedTime)}`
                    );
                    return res.send("Blocked");
                  }
                );
              } else {
                connection.query(
                  "UPDATE users SET login_attempts = ? WHERE email = ?",
                  [loginAttempts, email],
                  (err, result) => {
                    if (err) {
                      console.error(err);
                      return res.status(500).send("An error occurred");
                    }
                    console.log(`Incorrect email or password. ${MAX_LOGIN_ATTEMPTS - loginAttempts} attempts left`);
                    return res.send("Failure");
                  }
                );
              }
            }
          );
        }
      }
    );
  }
});

app.get("/api/user", (req, res) => {
  if (req.session.user) {
    res.json({ name: req.session.user.name, email: req.session.user.email });
  } else {
    res.sendStatus(401);
  }
});

app.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.log(err);
      return res.status(500).send("Could not log out user");
    }
    res.clearCookie("session_id");
    res.status(200).send("Logged out successfully");
  });
});

app.listen(3001, () => {
  console.log("Server started at port 3001");
});
