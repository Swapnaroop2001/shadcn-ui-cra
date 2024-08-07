import React, { useState } from 'react';
import axios from 'axios';
import PDFMerger from 'pdf-merger-js';
import { Button } from './components/ui/button';
import { Select, SelectValue, SelectTrigger, SelectContent, SelectGroup, SelectItem } from './components/ui/select';
import { Input } from "./components/ui/input";
import { Label } from "./components/ui/label";

function App() {
  const [file, setFile] = useState<File | null>(null);
  const [file2, setFile2] = useState<File | null>(null); // State to store fetched PDF as a File object

  // Function to handle user file input change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };
  console.log(file)

  // Function to handle template selection change
  const handleSelectChange = (option: string) => {
    fetchPdfByName(option);
  };

  // Function to fetch PDF from MongoDB based on template name
  const fetchPdfByName = async (templateName: string) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/upload/${templateName}.pdf`, {
        responseType: 'blob'
      });
      
      const blob = new Blob([response.data], { type: 'application/pdf' });
      
      // Create a File object from the Blob and set it in state
      const pdfFile = new File([blob], `${templateName}.pdf`, { type: 'application/pdf' });
      setFile2(pdfFile);

      const pdfUrl = URL.createObjectURL(blob);
    } catch (error) {
      console.error('Error fetching PDF:', error);
    }
  };
  console.log(file2)

  

  // Function to handle form submission (uploading initial PDF)
  const submitDoc = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      console.error('No file selected.');
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post("http://localhost:5000/api/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });
      // console.log('File uploaded successfully:', response.data);
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };


  // Function to merge PDFs
  const mergePDFs = async () => {
    try {
      if (file && file2) {
        const merger = new PDFMerger();
        merger.add(file);
        merger.add(file2); 

        await merger.save('merged.pdf');

        // console.log('Merged PDF created successfully.');
      } else {
        console.error('PDFs are missing.');
      }
    } catch (error) {
      console.error('Error merging PDFs:', error);
    }
  };

  return (
    <div className='h-screen'>
      <div className="container gap-10 flex flex-col flex-wrap items-center content-center py-8 container">

        <div className='flex flex-col text-start border-b border-gray-200 w-2/3'>
          <Label><h1 className="text-3xl mb-2 ml-2 font-bold">Select</h1></Label>
          <p className='mb-6 ml-2'>Select the template you wish to use.</p>
        </div>

        <div className='flex flex-col gap-40 text-center items-center'>
          <Select onValueChange={handleSelectChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select an option" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="Proposal" >Proposal</SelectItem>
                <SelectItem value="Quote" >Quote</SelectItem>
                <SelectItem value="Invoice">Invoice</SelectItem>
                <SelectItem value="One-off">One-Off</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <Button onClick={submitDoc} className="mt-4">Submit</Button>
          <Button onClick={mergePDFs} className="mt-4">Merge</Button>
        </div>

        <div className="flex flex-col gap-2 mt-8 items-start text-start">
          <label htmlFor="file-upload" className="block text-lg font-small">
            BigTime PDF
          </label>
          <div className="border border-dashed border-gray-200 h-auto w-auto p-10">
            <Input id="Template" type="file" onChange={handleFileChange} accept='.pdf' multiple required />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
