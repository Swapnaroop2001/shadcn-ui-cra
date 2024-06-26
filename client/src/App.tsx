import React, { useState } from 'react';
import { Button } from './components/ui/button'; // Adjust import based on actual library structure
import { Select } from './components/ui/select'; // Adjust import based on actual library structure
import { Input } from "./components/ui/input";
import { Label } from "./components/ui/label";
import {
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
} from './components/ui/select';

export function InputFile() {
  return (
    <div className="w-full max-w-sm items-center gap-1.5">
      <Input id="picture" type="file" />
    </div>
  );
}

function App() {
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [file, setFile] = useState(null);

  const handleTemplateChange = (e: { target: { value: React.SetStateAction<string>; }; }) => {
    setSelectedTemplate(e.target.value);
  };

  const handleFileChange = (e: { target: { files: React.SetStateAction<null>[]; }; }) => {
    setFile(e.target.files[0]);
  };

  const handleDownload = () => {
    // Handle file download logic
    console.log('Download file');
  };

  return (
    <div className='h-screen'>
      <div className="container  gap-10 flex flex-col flex-wrap items-center content-center py-8 container">


      <div className='flex flex-col text-start  border-b border-gray-200 w-2/3'>
        <Label><h1 className="text-3xl mb-2 ml-2 font-bold">Select</h1></Label>
          <p className='mb-6 ml-2'>Select the template you wish to use.</p>
      </div>
      
      <div className='flex flex-col gap-40 text-center items-center'>
        <Select>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select an option" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="apple">Proposal</SelectItem>
              <SelectItem value="banana">Quote</SelectItem>
              <SelectItem value="blueberry">Invoice</SelectItem>
              <SelectItem value="grapes">One-Off</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <Button onClick={handleDownload} className="mt-4">Download Final File</Button>
      </div>

      <div className="flex flex-col gap-2 mt-8 items-start text-start">
        <label htmlFor="file-upload" className="block text-lg font-small">
          BigTime PDF
        </label>
        <div className="border border-dashed border-gray-200 h-auto w-auto p-10">
        <InputFile />
        </div>
      </div>

    </div>
    </div>
  );
}

export default App;
