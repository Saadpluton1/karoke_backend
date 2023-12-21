import asyncHandler from "#middlewares/asyncHandler";
import { MP3, PATH,LIVEPATH, MPEG, XML } from "#constant/constant";
import { Karoke } from "#models/karoke";
import B2 from "backblaze-b2";
import rp from "request-promise";
import fs from "fs";

import { v4 as uuidv4 } from "uuid";
import path from "path";

// Function to fetch data from the API in frontend
// const fetchData = async (id) => {
//   try {
//     const apiUrl = `http://localhost:5000/api/karoke/65735cdf45ad4902fffc9a23`;
//     const response = await fetch(apiUrl);
//     if (!response.ok) {
//       throw new Error(`HTTP error! Status: ${response.status}`);
//     }
//     const data = await response.json();

//     console.log(data,"DATAAAAAAA")
//     if (data) {

//    const base64File = `data:audio/mp3;base64,${data?.songFile}`;
// const binaryData = atob(base64File.split(',')[1]);
// const blob = new Blob([new Uint8Array([...binaryData].map(char => char.charCodeAt(0)))], { type: 'audio/mp3' });
// const audioUrl = URL.createObjectURL(blob);

//       audio.value.src = audioUrl;


      
//       const xml = await fetch(data?.song?.lyrics).then((res) => res.text());
      

//     console.log(xml,"xmlxmlxml")
//       song.value = getJson({ xml: xml });
//     }
//   } catch (error) {
//     console.error("Error fetching API data:", error.message);
//   }
// };


//@desc  All track Get
//@route  /Alltrack
//@request Get Request
//@acess  public

export const getAllKaroke = asyncHandler(async (req, res) => {
  let songs = await Karoke.find({});

  if (songs?.length > 0) {
    return res.status(200).json({ status: true, songs });
  } else {
    return res.status(404).json({ status: false, message: "No record found" });
  }
});

//@desc  Get One Track
//@route  /track/id
//@request Get Request
//@acess  public

export const getOneKaroke = asyncHandler(async (req, res) => {

  const song = await Karoke.findById(req.params.id);

  if (song) {
    const b2 = new B2({
      applicationKeyId: "005d5ef51a9061c0000000002",
      applicationKey: "K0059zvkb1yu0WPALKZg9AEKMjQWiUg",
    });
    await b2.authorize();
    const responseId = await b2.downloadFileById({
      fileId: song?.audio,
    });
    
    return res
      .status(200)
      .json({ status: true, song, songFile: responseId.data });
  } else {
    return res.status(404).json({ status: false, message: "No record found" });
  }
});

export const createKarokeTrack = asyncHandler(async (req, res, next) => {
  let songFile = req.files?.song?.[0];

  let lyricsFile = req.files?.lyrics?.[0];

  if (!songFile?.filename) {
    return res
      .status(400)
      .json({ status: false, message: "Please Select the audio file" });
  }

  if (!lyricsFile?.filename) {
    return res
      .status(400)
      .json({ status: false, message: "Please Select the lyrics file" });
  }

  if (![MP3, MPEG].includes(songFile?.mimetype)) {
    return res.status(400).json({
      status: false,
      message: "Upload audio type should be mp3 , mpeg",
    });
  }
  if (![XML].includes(lyricsFile?.mimetype)) {
    return res.status(400).json({
      status: false,
      message: "Upload lyrics type should be xml",
    });
  }

  const { originalname, buffer, mimetype } = songFile;

  // const response = await b2.uploadFile({
  //   fileName: originalname,
  //   data: buffer,
  //   bucketId,
  //   contentType: mimetype
  // });

  await uploadToBackBlaze(req, res, next);
});


export const createSongFile = asyncHandler(async (req, res, next) => {
  let songFile = req.files?.song?.[0]

  let song = await new Karoke(req.body);

  song.audio = `${LIVEPATH}uploads/${songFile?.filename}`;

  song.save();

  return res
  .status(201)
  .json({ status: true, message: "Karoke Created Successfully", song });

});

export const uploadToBackBlaze = async (req, res, next) => {
  const b2 = new B2({
    applicationKeyId: "005d5ef51a9061c0000000002",
    applicationKey: "K0059zvkb1yu0WPALKZg9AEKMjQWiUg",
  });

  await b2.authorize();

  const bucketId = "cd05fe2f65516a9980c6011c";

  let uid = uuidv4();

  let file = req.files?.song?.[0];

  const fileData = fs.readFileSync(file.path);
  const originalFileName = file.originalname;

  const uploadFileName = path.join(uid, originalFileName);
  const uploadUrl = await b2.getUploadUrl(bucketId);
  const response = await b2.uploadFile({
    uploadUrl: uploadUrl.data.uploadUrl,
    uploadAuthToken: uploadUrl.data.authorizationToken,
    fileName: uploadFileName,
    data: fileData,
    contentType: file.mimetype,
  });

  req.fileId = response.data.fileId;

  let song = await new Karoke(req.body);

  // song.audio = `${PATH}uploads/${songFile?.filename}`;

  let lyricsFile = req.files?.lyrics?.[0];

  song.audio = response?.data?.fileId;
  song.lyrics = `${PATH}uploads/${lyricsFile?.filename}`;

  song.save();
  fs.unlinkSync(file.path);
  return res
    .status(201)
    .json({ status: true, message: "Karoke Created Successfully", song });
};
