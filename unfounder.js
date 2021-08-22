const fs = require("fs");

fs.renameSync("dist/404/index.html", "dist/404.html");
fs.rmdirSync("dist/404");
