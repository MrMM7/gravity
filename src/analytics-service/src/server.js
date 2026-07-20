const { consumeClickAnalytics, consumeNewAnalytics } = require("./consumer")
const port = process.env.PORT || 3004;

async function start() {
  await consumeNewAnalytics();
  await consumeClickAnalytics();

  const app = require("./app")
  app.listen(port, () => {
    console.log(`Analytics service is running on port ${port}`);
  });
}

start();