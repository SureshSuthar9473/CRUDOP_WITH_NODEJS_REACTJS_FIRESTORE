const app = require("./app");

async function main() {
  app.listen(app.get("port"), "0.0.0.0");
  console.log("Server on port", app.get("port"));
}

main();