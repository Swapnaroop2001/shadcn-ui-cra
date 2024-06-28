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
import { Value } from '@radix-ui/react-select';

interface Template {
  name: string;
  file: File | null;
}

export function InputFile() {
  return (
    <div className="w-full max-w-sm items-center gap-1.5">
      <Input id="picture" type="file" />
    </div>
  );
}

function App() {
  const [templates, setTemplates] = useState<Template[]>([
    { name: 'Proposal', file: null },
    { name: 'Quote', file: null },
    { name: 'Invoice', file: null },
    { name: 'One-off', file: null },
  ]);
  const [title, setTitle] = useState('');
  const[size,setSize]=useState(0);
  const [file, setFile] = useState<File | null>(null);

  const submitDoc = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      console.error('No file selected.');
      return;
    }
    const formdata = new FormData();
    formdata.append("title", title);
    formdata.append("file", file);
    console.log(title, file)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setTitle(selectedFile.name);
      setSize(selectedFile.size) 
      setFile(selectedFile);
    }
  };

  const handleTemplateSelect = (value: string) => {
    
  };

  const handleDownload = () => {
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
                <SelectItem value="Proposal">Proposal</SelectItem>
                <SelectItem value="Quote">Quote</SelectItem>
                <SelectItem value="Invoice">Invoice</SelectItem>
                <SelectItem value="One-off">One-Off</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <Button onClick={submitDoc} className="mt-4">Download Final File</Button>
        </div>

        <div className="flex flex-col gap-2 mt-8 items-start text-start">
          <label htmlFor="file-upload" className="block text-lg font-small">
            BigTime PDF
          </label>
          <div className="border border-dashed border-gray-200 h-auto w-auto p-10">
            <Input id="Template" type="file" onChange={handleFileChange} accept='application/pdf' required />
          </div>
        </div>

      </div>
    </div>
  );
}

export default App;
