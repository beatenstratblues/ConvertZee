const { default: axios } = require("axios");
const sharp = require("sharp");
const cloudinary = require("../Configs/Cloudinary");

async function convertImageFunction(imageUrl, targetFormat) {
  try {
    const response = await axios.get(imageUrl, { responseType: "arraybuffer" });
    const bufferObject = Buffer.from(response.data);

    const convertedBuffer = await sharp(bufferObject)
      .toFormat(targetFormat)
      .toBuffer();

    const uploadPromise = new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "converted",
          resource_type: "image",
          format: targetFormat,
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );

      stream.end(convertedBuffer);
    });

    const uploadResult = await uploadPromise;
    return uploadResult.secure_url;
  } catch (error) {
    console.error("Error during image conversion or upload:", error);
    throw error;
  }
}
module.exports = { convertImageFunction };
