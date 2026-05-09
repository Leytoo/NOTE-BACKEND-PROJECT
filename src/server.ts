import "dotenv/config";
import app from "@/app";

const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || "development";

app.listen(PORT, () => {
  console.log(`[${NODE_ENV.toUpperCase()}] Server is running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});
