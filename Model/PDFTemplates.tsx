// models/PDFTemplate.js

import mongoose, { Schema, Document } from 'mongoose';

// Define interface for Template document
export interface Template extends Document {
  name: string;
  file: Buffer;
}

const TemplateSchema: Schema = new Schema({
  name: { type: String, required: true },
  file: { type: Buffer, required: true },
});

const PDFTemplate = mongoose.model<Template>('pdfDetails', TemplateSchema);

export default PDFTemplate;
