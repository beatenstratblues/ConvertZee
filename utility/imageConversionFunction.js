const { default: axios } = require('axios');
const sharp = require('sharp');

async function convertImageFunction(imageUrl, targetFormat) {
    const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
    const bufferObject = Buffer.from(response.data);

    await sharp(bufferObject)
        .toFormat(targetFormat)
        .toFile(`converted_image.${targetFormat}`);
}
module.exports = { convertImageFunction };