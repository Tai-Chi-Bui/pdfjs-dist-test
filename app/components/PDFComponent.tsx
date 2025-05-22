// components/PDFComponent.tsx
'use client'
import { useState } from 'react';
import dynamic from 'next/dynamic';

const PDFViewer = dynamic(() => import('./PDFViewer'), {
  ssr: false,
});

export default function PDFComponent() {
  const [pdfUrl, setPdfUrl] = useState('/pdf/Sample-pdf.pdf');
  const [fileName, setFileName] = useState('No file selected');
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleFile = (file: File) => {
    const objectUrl = URL.createObjectURL(file);
    setPdfUrl(objectUrl);
    setFileName(file.name);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file?.type === 'application/pdf') {
      handleFile(file);
    }
  };

  return (
    <div className="min-h-screen bg-black py-8 flex justify-center">
      <div className="w-[80%] flex flex-col gap-5">
        <div className="mb-8 bg-white rounded-xl shadow-sm border border-gray-100 p-10">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center gap-3 mb-2">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h1 className="text-2xl font-bold text-gray-900">PDF Viewer</h1>
            </div>
            <p className="text-gray-500 mb-6">Upload your PDF file to view and interact with it</p>
            
            <div 
              className={`file-upload-area ${isDragging ? 'bg-blue-50' : 'bg-gray-50'} 
              border-2 border-dashed ${isDragging ? 'border-blue-400' : 'border-gray-300'} 
              rounded-lg p-6 transition-all duration-200 ease-in-out`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className="flex flex-col items-center justify-center gap-3">
                <svg 
                  className={`w-10 h-10 ${isDragging ? 'text-blue-500' : 'text-gray-400'} transition-colors duration-200`}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth="2" 
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                  />
                </svg>
                
                <div className="text-center">
                  <input
                    type="file"
                    id="pdf-upload"
                    accept=".pdf"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <label 
                    htmlFor="pdf-upload" 
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 cursor-pointer mb-2"
                  >
                    Choose PDF File
                  </label>
                  <p className="text-sm text-gray-500">or drag and drop your file here</p>
                </div>
                
                <div className={`file-info transition-all duration-200 ${fileName === 'No file selected' ? 'opacity-0' : 'opacity-100'}`}>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span className="font-medium">{fileName}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="pdf-viewer-container bg-white rounded-xl shadow-sm border border-gray-100 w-full overflow-hidden">
          <PDFViewer pdfUrl={pdfUrl} />
        </div>
      </div>
    </div>
  )
}