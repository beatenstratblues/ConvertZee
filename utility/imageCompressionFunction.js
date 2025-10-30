const axios = require("axios");
const sharp = require("sharp");
const cloudinary = require("../Configs/Cloudinary");

async function compressImageFunction(imageUrl, options = {}) {
  const { quality = 80 } = options; 

  try {
    const response = await axios.get(imageUrl, { responseType: "arraybuffer" });
    const bufferObject = Buffer.from(response.data);

    const metadata = await sharp(bufferObject).metadata();
    const inputFormat = metadata.format;

    let outputFormat = inputFormat;
    let sharpInstance = sharp(bufferObject);

    switch (outputFormat) {
      case "jpeg":
      case "jpg":
        sharpInstance = sharpInstance.jpeg({
          quality,
          mozjpeg: true, 
        });
        break;

      case "png":
        outputFormat = "png";
        sharpInstance = sharpInstance.png({
          quality,
        });
        break;

      case "webp":
        sharpInstance = sharpInstance.webp({
          quality,
        });
        break;

      case "avif":
        sharpInstance = sharpInstance.avif({
          quality,
        });
        break;

      default:
        outputFormat = "jpeg";
        sharpInstance = sharpInstance.jpeg({
          quality,
          mozjpeg: true,
        });
    }

    const compressedBuffer = await sharpInstance.toBuffer();

    const uploadPromise = new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "compressed",
          resource_type: "image",
          format: outputFormat,
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      stream.end(compressedBuffer);
    });

    const uploadResult = await uploadPromise;

    return {
      message: `Image (${inputFormat}) compressed successfully [${quality}% quality]!`,
      originalFormat: inputFormat,
      compressedFormat: outputFormat,
      optimizedUrl: uploadResult.secure_url,
      compressionRatio: `${(
        (1 - compressedBuffer.length / bufferObject.length) *
        100
      ).toFixed(2)}%`,
      status: 200,
    };
  } catch (error) {
    return {
      message: `Image compression or upload failed!`,
      optimizedUrl: null,
      compressionRatio: null,
      status: 500,
    };
  }
}

module.exports = { compressImageFunction };
