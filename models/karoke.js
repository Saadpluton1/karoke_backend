import mongoose from "mongoose";

const karokeSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  audio: {
    type: String,
  },
  lyrics: {
    type: String,
  }
},{timestamps:true});

export const Karoke = mongoose.model("karoke", karokeSchema);

