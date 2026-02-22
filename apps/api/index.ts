import express from "express";
import cors from "cors";
import { APP_NAME } from "@repo/shared/constants";

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Sample data
const items = [
  { id: "1", title: "Backend Item 1", createdAt: new Date().toISOString() },
  { id: "2", title: "Backend Item 2", createdAt: new Date().toISOString() },
];

app.get("/", (req, res) => {
  res.send(`Welcome to ${APP_NAME} API`);
});

app.get("/api/items", (req, res) => {
  res.json(items);
});

app.post("/api/items", (req, res) => {
  const newItem = {
    id: Math.random().toString(36).substring(7),
    ...req.body,
    createdAt: new Date().toISOString(),
  };
  items.push(newItem);
  res.status(201).json(newItem);
});

app.listen(port, () => {
  console.log(`[API] Server is running at http://localhost:${port}`);
});
