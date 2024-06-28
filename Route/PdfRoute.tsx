import express, { Request, Response } from 'express';
import multer from 'multer';
import fs from 'fs';
import TemplateModel from '../Model/PDFTemplates';

const router = express.Router();

// Multer middleware setup for file upload
const upload = multer({ dest: 'uploads/' });

// POST endpoint for file upload
router.post('/upload', upload.single('file'), async (req: Request, res: Response) => {
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

// GET endpoint for file download
router.get('/download/:name', async (req: Request, res: Response) => {
  try {
    const template = await TemplateModel.findOne({ name: req.params.name });
    if (!template) {
      return res.status(404).send('File not found.');
    }
    res.set('Content-Type', 'application/pdf');
    res.status(200).send(template.file);
  } catch (error) {
    console.error('Error downloading file:', error);
    res.status(500).send('Error downloading file.');
  }
});

module.exports = router;
