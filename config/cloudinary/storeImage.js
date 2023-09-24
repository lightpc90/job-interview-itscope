const response = require("../aws-env")
const secret = response.SecretString

const cloudinary = require("cloudinary")

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME || secret.cloudinary_name,
  api_key: process.env.CLOUDINARY_API_KEY || secret.cloudinary_api_key,
  api_secret: process.env.CLOUDINARY_API_SECRET || secret.cloudinary_api_secret,
});

module.exports = cloudinary