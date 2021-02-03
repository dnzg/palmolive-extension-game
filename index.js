const express = require("express");
const app = express();
const path = require("path");
const public = path.join(__dirname, "public");

app.get("/", function(req, res) {
	res.sendFile(path.join(public, "video_overlay.html"));
});
app.get("/test", function(req, res) {
	res.sendFile(path.join(public, "index2.html"));
});
app.use("/", express.static(public));

const port = 80;
app.listen(port, () => console.log(`Server running on ${port}, http://localhost:${port}`));

function makeid(length) {
	var result = "";
	var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	var charactersLength = characters.length;
	for (var i = 0; i < length; i++) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength));
	}
	return result;
}