import mongoose, { Schema, Document } from 'mongoose';

// Define interface for Template document
interface Template extends Document {
  name: string;
  file: Buffer;
}

const TemplateSchema: Schema = new Schema({
  name: { type: String, required: true },
  file: { type: Buffer, required: true }
});


const PDFTemplate = mongoose.model<Template>('Template', TemplateSchema);

export default PDFTemplate;
