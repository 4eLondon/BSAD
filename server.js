require("dotenv").config();
const express = require("express");
const app = express();

app.use(express.static("public"));

// Views
app.get("/", (req, res) => res.sendFile(__dirname + "index.html"));
app.get("/auth", (req, res) =>
  res.sendFile(__dirname + "/views/user/auth.html"),
);
app.get("/forgot", (req, res) =>
  res.sendFile(__dirname + "/views/user/forgot.html"),
);
app.get("/dashboard", (req, res) =>
  res.sendFile(__dirname + "/views/user/dashboard.html"),
);
app.get("/apply", (req, res) =>
  res.sendFile(__dirname + "/views/forms/application.html"),
);

app.listen(process.env.PORT || 3000, () =>
  console.log("Running on http://localhost:3000"),
);

// in server.js
app.get("/config", (req, res) => {
  res.json({
    supabaseUrl: process.env.SUPABASE_URL,
    supabaseKey: process.env.SUPABASE_ANON_KEY,
  });
});
