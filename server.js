import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import multer from 'multer';
import fs from 'fs';
import TemplateModel from './models/PDFTemplates';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGODBURL , {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB!");
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Middleware for file upload (Multer)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});
const upload = multer({ storage });

// POST endpoint for file upload
app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const { name } = req.body;

    // Check if req.file is defined
    if (!req.file) {
      return res.status(400).send('No file uploaded.');
    }

    const fileBuffer = fs.readFileSync(req.file.path);
    const template = new TemplateModel({
      name,
      file: fileBuffer
    });
    await template.save();

    // Optional: Remove the uploaded file from the filesystem after saving to database
    fs.unlinkSync(req.file.path);

    res.status(200).send('File uploaded successfully.');
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).send('Error uploading file.');
  }
});

// Start server
app.listen(PORT, () => {
  connect();
  console.log(`Server is running on http://localhost:${PORT}`);
});
