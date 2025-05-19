// components/PDFComponent.tsx
'use client'
import { useState, useCallback } from 'react';
import dynamic from 'next/dynamic';

const PDFViewer = dynamic(() => import('./PDFViewer'), {
  ssr: false,
});

export default function PDFComponent() {
  const [pdfUrl, setPdfUrl] = useState<string>('/example.pdf');
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const result = e.target?.result;
      if (typeof result === 'string') {
        setPdfUrl(result);
      }
      setIsUploading(false);
    };

    reader.onerror = () => {
      console.error('Error reading file');
      setIsUploading(false);
    };

    reader.readAsDataURL(file);
  }, []);

  return (
    <div className="pdf-component">
      <div className="header">
        <h1>PDF Viewer</h1>
        <div className="file-upload">
          <label htmlFor="pdf-upload" className="upload-button">
            Upload PDF
          </label>
          <input
            id="pdf-upload"
            type="file"
            accept=".pdf"
            onChange={handleFileUpload}
            style={{ display: 'none' }}
          />
        </div>
      </div>

      {isUploading ? (
        <div className="loading">Loading PDF...</div>
      ) : (
        <PDFViewer pdfUrl={pdfUrl} />
      )}
    </div>
  );
}