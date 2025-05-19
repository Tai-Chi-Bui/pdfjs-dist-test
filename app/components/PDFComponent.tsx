// components/PDFComponent.tsx
'use client'
import { useState, useCallback } from 'react';
import dynamic from 'next/dynamic';

const PDFViewer = dynamic(() => import('./PDFViewer'), {
  ssr: false,
});

export default function PDFComponent() {
  const [pdfUrl, setPdfUrl] = useState<string>('/pdf/example.pdf');
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

      <style jsx>{`
        .pdf-component {
          height: 100vh;
          display: flex;
          flex-direction: column;
        }

        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 2rem;
          background: #fff;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        h1 {
          margin: 0;
          font-size: 1.5rem;
          color: #333;
        }

        .file-upload {
          display: flex;
          align-items: center;
        }

        .upload-button {
          padding: 0.5rem 1rem;
          background: #007bff;
          color: white;
          border-radius: 4px;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .upload-button:hover {
          background: #0056b3;
        }

        .loading {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100%;
          font-size: 1.2rem;
          color: #666;
        }
      `}</style>
    </div>
  );
}