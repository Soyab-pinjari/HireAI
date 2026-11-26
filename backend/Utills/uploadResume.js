const cloudinary = require("../Config/cloudinary");

const uploadResume = async (buffer, folder, originalName) => {

    return new Promise((resolve, reject) => {

        const stream = cloudinary.uploader.upload_stream(
            {
                folder,
                resource_type: "image",
                format: "pdf",
                public_id: `${Date.now()}-${originalName
                    .replace(/\.pdf$/i, "")
                    .replace(/[^a-zA-Z0-9_-]/g, "_")}`
            },
            (error, result) => {

                if (error) return reject(error);

                resolve(result);
            }
        );

        stream.end(buffer);
    });
};

module.exports = uploadResume;