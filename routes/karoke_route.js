import express from "express";
import {multerAudioUpload} from "#utils/multer";
import { createKarokeTrack, getAllKaroke, getOneKaroke } from "#controllers/karokeController";


const karokeRoute = express.Router();

// Create Karoke
karokeRoute.post("/karoke",multerAudioUpload.fields([
  {
    name: "lyrics",
    maxCount: 1,
  },
  {
    name: "song",
    maxCount: 1,
  }])
  , createKarokeTrack);

// Admin All Karoke
karokeRoute.get("/karoke", getAllKaroke);

// Admin One Karoke
karokeRoute.get("/karoke/:id", getOneKaroke);


export default karokeRoute;
