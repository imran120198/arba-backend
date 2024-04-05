const express = require("express");
const cors = require("cors");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;

const { connection } = require("./Connection/Connection");
const { UserRouter } = require("./Routes/User.route");
const { CategoryRouter } = require("./Routes/Category.route");
const { ProductRouter } = require("./Routes/Products.route");

const app = express();
app.use(express.json());

app.use(cors());

app.get("/", (req, res) => {
  res.send("Welcome to Arba Development Studio Server");
});

// Routes
app.use("/user", UserRouter);
app.use("/category", CategoryRouter);
app.use("/product", ProductRouter);

// File Upload
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const storage = multer.memoryStorage();
const upload = multer({ storage });
app.post("/upload/profile", upload.single("profile"), async (req, res) => {
  try {
    console.log(req.file.buffer);
    const fileBuffer = req.file.buffer;
    const timestamp = new Date().getTime();
    const uniqueId = Math.floor(Math.random() * 100000);
    const publicId = `image_${timestamp}_${uniqueId}`;

    cloudinary.uploader
      .upload_stream(
        {
          public_id: publicId,
          folder: "imageuploadtesting",
        },
        (err, result) => {
          if (err) throw err;
          console.log(result);
          return res
            .status(201)
            .send({ message: "File uploaded successfully", url: result.url });
        }
      )
      .end(fileBuffer);
  } catch (error) {
    res.json({ message: "Error: " + error.message });
  }
});

app.listen(process.env.port || 8080, async () => {
  try {
    await connection;
    console.log("Connected to Database");
  } catch (err) {
    console.log("Error in connecting to Database");
    console.log(err);
  }
  console.log(`Listing on PORT ${process.env.port || 8080}`);
});
