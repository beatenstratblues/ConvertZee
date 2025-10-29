require("dotenv").config();

const express = require("express");
const { convertImageFunction } = require("./utility/imageConversionFunction");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ status: "ok", message: "ConvertZee API" });
});

app.get("/health", (req, res) => {
  res.json({ status: 200, message: "Health check passed" });
});

app.get("/api/convert/image", async (req, res) => {
  const { imageUrl, targetFormat } = req.body;
  const respo = await convertImageFunction(imageUrl, targetFormat);

  res.json({
    status: 200,
    message: `Image Converted to ${targetFormat} Sucessfully!`,
    convertedImageUrl: respo,
  });
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
