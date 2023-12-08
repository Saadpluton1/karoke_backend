import path, {dirname, join} from "path";
import {fileURLToPath} from "url";
import multer from "multer";
import { PNG, JPG, JPEG, MP3, MPEG ,XML } from "#constant/constant";

const __dirname = dirname(fileURLToPath(import.meta.url));

export const UPLOAD_PATH = join(__dirname, '../', './uploads');

const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, UPLOAD_PATH);
    },
    filename(req, file, cb) {
        cb(
            null,
            `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
        );
    },
});

const multerUpload = multer({
    storage,
    fileFilter: function (req, file, cb) {
        checkImageType(req, file, cb)
    },
});


const multerAudioUpload = multer({
    storage,
    fileFilter: function (req, file, cb) {
        checkAudioType(req, file, cb)
    },
});

const multerAudioAndImageUpload = multer({
  storage,
  fileFilter: function (req, file, cb) {
    checkAudioAndImageType(req, file, cb)
  },
  
});



const checkImageType = (req, file, cb) => {
  if ([PNG, JPEG, JPG].includes(file.mimetype))
  {
   cb(null, true);
 } else {
   cb(
     {
       message: 'Upload file type should be png,jpeg and png',
     },
     false
   );
 }
};

const checkAudioAndImageType = (req, file, cb) => {
    if ([PNG, JPEG, JPG , MP3 , MPEG].includes(file.mimetype))
     {
      cb(null, true);
    } else {
      cb(
        {
          message: 'Unsupported format type',
        },
        false
      );
    }
  };


  

  const checkAudioType = (req, file, cb) => {
    if ([MP3, MPEG,XML].includes(file?.mimetype)) {
      cb(null, true);
    } else {
      cb(
        {
          message: 'Unsupported format type',
        },
        false
      );
    }
  };


export {multerUpload , multerAudioUpload,multerAudioAndImageUpload}
