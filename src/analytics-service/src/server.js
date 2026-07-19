const app = require("./app")

const port = process.env.PORT || 3004;

app.listen(port, () => {
  console.log(`Analytics service is running on port ${port}`);
});