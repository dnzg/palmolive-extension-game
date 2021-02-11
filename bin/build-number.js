const fs = require("fs");
const path = require("path");
const packageJson = require("../package.json");

module.exports = {
  update() {
    packageJson.buildNumber = (Number.parseInt(packageJson.buildNumber) + 1).toString();
    fs.writeFileSync("package.json", JSON.stringify(packageJson, null, 2));
    console.log("Updated buildNumber: " + packageJson.buildNumber);
  },
  get() {
    return packageJson.buildNumber;
  },
};
