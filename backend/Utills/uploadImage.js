const cloudinary = require("../Config/cloudinary");

const uploadImage = async (buffer, folder) => {
  return new Promise((resolve, reject) => {

    const stream = cloudinary.uploader.upload_stream(
      {
        folder: folder,
        resource_type: "image",
      },
      (error, result) => {
        if (error) {
          console.log("CLOUDINARY ERROR:", error);
          return reject(error);
        }

        console.log("IMAGE UPLOADED:", result.secure_url);

        resolve(result);
      }
    );

    stream.end(buffer);
  });
};

module.exports = uploadImage;