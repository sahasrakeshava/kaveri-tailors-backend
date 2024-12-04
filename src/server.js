const app = require(".");
const { connectDb } = require("./config/db");

const PORT = process.env.PORT || 3000; // Use the PORT provided by Render or fallback to 3000

app.listen(PORT, async () => {
  await connectDb();
  console.log(`Backend Running on Port: ${PORT}`);
});