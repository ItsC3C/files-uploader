// Imports
import cors from "cors";
import express, { NextFunction, Request, Response } from "express";
import chalk from "chalk";
import { PORT } from "./utils/envs";
import multer from "multer";
import path from "path";

// Variables
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static("src/public"));
app.use("/uploads", express.static("uploads"));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    const newName =
      file.fieldname + "-" + Date.now() + path.extname(file.originalname);
    cb(null, newName);
  },
});

const upload = multer({ storage, limits: { fileSize: 3000000 } });

// Routes
app.post("/upload", upload.single("image"), (req, res) => {
  if (!req.file) {
    res.status(200).send("File uploaded successfully!");
    return;
  }
  const imageUrl = `/uploads/${req.file.filename}`;
  console.log(imageUrl);
  res.status(200).send(`
    <h1>Image uploaded successfully!</h1>
    <img src="http://localhost:3000${imageUrl}" alt="Uploaded Image" with="200" height="200"/>
  `);
});

app.get("/", (req, res) => {
  res.sendFile("/index.html");
});

// Foutafhandeling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  res.status(500).send(err.message);
});

// Server Listening
app.listen(PORT, () => {
  console.log(
    chalk.bgBlue.bold(` 🚀 Server is up and running on port ${PORT}! 🚀 `)
  );
});
