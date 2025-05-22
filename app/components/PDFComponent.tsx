// components/PDFComponent.tsx
'use client'
import { useState, useCallback } from 'react';
import dynamic from 'next/dynamic';

const PDFViewer = dynamic(() => import('./PDFViewer'), {
  ssr: false,
});

export default function PDFComponent() {
  const [pdfUrl, setPdfUrl] = useState<string>('/pdf/Sample-pdf.pdf');

  return (
    <div className="pdf-component">
      <div className="header">
        <h1>PDF Viewer</h1>
      </div>
      <PDFViewer pdfUrl={pdfUrl} />
    </div>
  )
}