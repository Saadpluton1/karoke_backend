import dotenv from 'dotenv'
dotenv.config()
import express from 'express'
import cors from 'cors';
import connectDB from '#config/connectdb'
import karokeRoute from '#routes/karoke_route';

import BodyParser from "body-parser";

const app = express()
const port = process.env.PORT
const DATABASE_URL = process.env.DATABASE_URL

// CORS Policy
app.use(cors())

// Database Connection
connectDB(DATABASE_URL)

app.use(express.json());
app.use(BodyParser.urlencoded({ extended: false }));
app.use('/uploads', express.static('uploads'));



// Load Routes
app.use("/api", karokeRoute)

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`)
})