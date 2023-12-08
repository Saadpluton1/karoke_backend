import mongoose from "mongoose";

const karokeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  audio: {
    type: String,
  },
  lyrics: {
    type: String,
  }
},{timestamps:true});

export const Karoke = mongoose.model("karoke", karokeSchema);

