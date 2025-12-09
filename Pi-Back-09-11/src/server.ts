import express, { Application } from "express";
import { AppDataSource } from "./config/data-source";
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import professionalRoutes from "./routes/professionalRoutes";
import * as dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app: Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use(cors({
  origin: "http://127.0.0.1:5500",  
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"]
}));


app.use("/sunmile", authRoutes);
app.use("/sunmile", userRoutes);
app.use("/sunmile", professionalRoutes);

const PORT = Number(process.env.PORT || 3000);

AppDataSource.initialize()
  .then(() => {
    console.log("Database initialized successfully");

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Error initializing database:", err);
  });
