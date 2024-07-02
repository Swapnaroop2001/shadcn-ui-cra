import express from 'express';
import multer from 'multer';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const uploadPath = path.join(__dirname, './uploads');
dotenv.config();
const app = express();
app.use(cors());
const PORT = process.env.PORT || 5000;
const MONGODB_URL = process.env.MONGODBURL;

// Connect to MongoDB
mongoose.connect(process.env.MONGODBURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Connected to MongoDB');
})
.catch((error) => {
  console.error('MongoDB connection error:', error);
  process.exit(1); // Exit process with failure
});

const PDFTemplateSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  contentType: { type: String },
  file: { type: Buffer, required: true },
}, {
  timestamps: true // Automatically adds createdAt and updatedAt fields
});
const PDFTemplate = mongoose.model('NewCollection', PDFTemplateSchema);

// Multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadPath); // Set destination to uploadPath
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Use original file name
  }
});
const upload = multer({ storage: storage });

// Route to handle file upload
app.post('/api/upload', upload.single('pdfFile'), (req, res) => {
  res.status(200).send('File uploaded successfully');
});

// POST endpoint to handle PDF file upload
app.post('/api/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send('No file uploaded.');
    }
    const newPDFTemplate = new PDFTemplate({
      filename: req.file.originalname,
      contentType: req.file.mimetype,
      file: req.file.buffer,
    });
    await newPDFTemplate.save();
    res.status(201).json({ message: 'File uploaded successfully.' });
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).send('Server error while uploading file.');
  }
});

app.get('/api/upload/:filename', async (req, res) => {
  try {
    const filename = req.params.filename;
    const template = await PDFTemplate.findOne({ filename: filename });
    if (!template) {
      return res.status(404).json({ message: 'File not found.' });
    }
    res.set('Content-Type', template.contentType);
    res.send(template.file);
  } catch (error) {
    console.error('Error retrieving file:', error);
    res.status(500).send('Server error while retrieving file.');
  }
});

app.get('/api/upload', async (req, res) => {
  try {
    // Query MongoDB to find all documents
    const templates = await PDFTemplate.find();

    // Map templates to include metadata and file content
    const files = templates.map(template => ({
      filename: template.filename,
      contentType: template.contentType,
      file: template.file.toString('base64') // Convert Buffer to base64 string
    }));

    res.json(files);

  } catch (error) {
    console.error('Error retrieving files:', error);
    res.status(500).send('Server error while retrieving files.');
  }
});




// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
