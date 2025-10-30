require("dotenv").config();

const express = require("express");
const { convertImageFunction } = require("./utility/imageConversionFunction");
const { compressImageFunction } = require("./utility/imageCompressionFunction");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ status: "ok", message: "Welcome to ConvertZee API Server!" });
});

app.get("/health", (req, res) => {
  res.json({ status: 200, message: "Health check passed" });
});

app.get("/api/convert/image", async (req, res) => {
  const { imageUrl, targetFormat } = req.body;
  const respo = await convertImageFunction(imageUrl, targetFormat);

  res.json({
    status: respo.status,
    message: respo.message,
    convertedImageUrl: respo.downloadUrl,
  });
});

app.get("/api/compress/image", async (req, res) => {
  const { imageUrl, options } = req.body;
  const respo = await compressImageFunction(imageUrl, options);

  res.json({
    message: respo.message,
    compressedImageUrl: respo.optimizedUrl,
    compressionRatio: respo.compressionRatio,
  });
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
