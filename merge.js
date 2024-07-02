import PDFMerger from 'pdf-merger-js';

var merger = new PDFMerger();

(async () => {
  await merger.add('Invoice.pdf');  //merge all pages. parameter is the path to file and filename.
  await merger.add('Proposal.pdf'); // merge only page 2
  await merger.save('./uploads/abc.pdf'); //save under given name and reset the internal document
  
  // Export the merged PDF as a nodejs Buffer
  // const mergedPdfBuffer = await merger.saveAsBuffer();
  // fs.writeSync('merged.pdf', mergedPdfBuffer);
})();