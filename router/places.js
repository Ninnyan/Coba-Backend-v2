const express = require("express");
const addDataDestinationController = require("../controller/addDataDestinationController");
const { checkRole } = require("../middleware/authVerify");
const dotenv = require("dotenv");
dotenv.config();
const multer = require('multer');
const AWS = require('aws-sdk')
const multerS3 = require('multer-s3')
const routePlaces = express.Router()
const path = require('path');

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: 'us-east-1'
})

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'photokalimantanexplore',
    acl: 'public-read',
    contentType: multerS3.AUTO_CONTENT_TYPE,
    metadata: function (req,file,cb) {
      cb(null, {fieldname: file.fieldname})
    },
    key: function (req,file,cb) {
      const date = Date.now();
      cb(null, `${date}-${file.originalname}`);
    }
  })
});


routePlaces.post('/add-destinasi',(req,res,next) => checkRole(req,res,next, 'Admin'),upload.array('photos', 3),addDataDestinationController.wisata)
routePlaces.put('/edit-destinasi',(req,res,next) => checkRole(req,res,next, 'Admin'),upload.array('photos', 3),addDataDestinationController.editWisata)
routePlaces.delete('/delete-destinasi',(req,res,next) => checkRole(req,res,next, 'Admin'),addDataDestinationController.delete)



module.exports = routePlaces
