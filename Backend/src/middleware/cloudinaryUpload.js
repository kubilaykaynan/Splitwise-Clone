const cloudinary = require("cloudinary");
var fs = require("fs");
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET_KEY,
});

const base64Encoding = (imagePath) => {
  console.log(imagePath);
  const base64 = fs.readFileSync(imagePath, "base64");

  const buffer = Buffer.from(base64, "base64");

  const newImage = fs.writeFileSync("new-path.jpg", buffer);

  console.log("new image with base64 to image", newImage);
};

const uploadFileCloudinary = async (file, folder = "split_wise") => {
  // if provided string to file
  if (typeof file === "string") {
    return new Promise((resolve, reject) => {
      cloudinary.v2.uploader.upload(file, (error, result) => {
        if (error) {
          reject(error.message);
        }
        resolve(result);
      });
    });
  }
  // else provided file
  const {
    file: { createReadStream },
  } = file;
  const res = await new Promise((resolve, reject) => {
    createReadStream().pipe(
      cloudinary.v2.uploader.upload_stream({ folder, unique_filename: true }, (error, result) => {
        if (error) {
          reject(error.message);
        }

        resolve(result);
      })
    );
  });

  return res;
};

module.exports = {
  uploadFileCloudinary,
  base64Encoding,
};
