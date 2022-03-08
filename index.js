const express = require("express");
const app = express();
const path = require("path");
const public = path.join(__dirname, "public");

app.get("/", function (req, res) {
  res.sendFile(path.join(public, "video_overlay.html"));
});
app.get("/config", function (req, res) {
  res.sendFile(path.join(public, "config.html"));
});
app.use("/", express.static(public));

const port = 80;
app.listen(port, () =>
  console.log(`Server running on ${port}, http://localhost:${port}`)
);
