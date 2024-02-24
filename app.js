const express = require("express");
const app = express();
app.set("view engine","ejs");


const iotRoute = require("./routes/iotRoute");
app.use("/iot",iotRoute);

app.listen("8001");