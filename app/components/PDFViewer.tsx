// components/PDFViewer.tsx
'use client'
import { useEffect, useRef, useState, useCallback } from 'react';
import * as pdfjsLib from 'pdfjs-dist';

// Set the worker source (client-side only)
if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';
}

interface PDFViewerProps {
  pdfUrl: string;
}

const PDFViewer: React.FC<PDFViewerProps> = ({ pdfUrl }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const renderTaskRef = useRef<any>(null);
  const pdfRef = useRef<any>(null);
  
  const [pageNum, setPageNum] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [scale, setScale] = useState(1.0);
  const [rotation, setRotation] = useState(0);
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [currentSearchIndex, setCurrentSearchIndex] = useState(-1);
  const [showThumbnails, setShowThumbnails] = useState(false);
  const [thumbnails, setThumbnails] = useState<{ pageNum: number; url: string }[]>([]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const renderPage = async (pdf: any, pageNumber: number) => {
    try {
      setLoading(true);
      const page = await pdf.getPage(pageNumber);
      const viewport = page.getViewport({ scale, rotation });

      const canvas = canvasRef.current;
      if (!canvas) return;

      const context = canvas.getContext('2d');
      if (!context) return;

      canvas.height = viewport.height;
      canvas.width = viewport.width;

      if (renderTaskRef.current) {
        renderTaskRef.current.cancel();
      }

      const renderContext = {
        canvasContext: context,
        viewport,
      };

      renderTaskRef.current = page.render(renderContext);
      await renderTaskRef.current.promise;
      setLoading(false);
    } catch (error) {
      if (error instanceof Error && error.name === 'RenderingCancelledException') {
        return;
      }
      console.error('Error rendering PDF:', error);
      setError('Error rendering PDF page');
      setLoading(false);
    }
  };

  const generateThumbnails = async (pdf: any) => {
    const thumbnails = [];
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const viewport = page.getViewport({ scale: 0.2 });
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      await page.render({
        canvasContext: context!,
        viewport,
      }).promise;

      thumbnails.push({
        pageNum: i,
        url: canvas.toDataURL(),
      });
    }
    setThumbnails(thumbnails);
  };

  const searchPDF = async () => {
    if (!searchText || !pdfRef.current) return;

    const results: any[] = [];
    for (let i = 1; i <= totalPages; i++) {
      const page = await pdfRef.current.getPage(i);
      const textContent = await page.getTextContent();
      const text = textContent.items.map((item: any) => item.str).join(' ');
      
      if (text.toLowerCase().includes(searchText.toLowerCase())) {
        results.push({ page: i });
      }
    }
    setSearchResults(results);
    setCurrentSearchIndex(-1);
  };

  const handleSearchResultClick = (pageNum: number) => {
    setPageNum(pageNum);
    setCurrentSearchIndex(searchResults.findIndex(r => r.page === pageNum));
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleZoom = (newScale: number) => {
    setScale(Math.max(0.5, Math.min(3, newScale)));
  };

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const loadPDF = async () => {
      try {
        setLoading(true);
        const pdf = await pdfjsLib.getDocument(pdfUrl).promise;
        pdfRef.current = pdf;
        setTotalPages(pdf.numPages);
        await renderPage(pdf, pageNum);
        await generateThumbnails(pdf);
        setLoading(false);
      } catch (error) {
        console.error('Error loading PDF:', error);
        setError('Error loading PDF');
        setLoading(false);
      }
    };

    loadPDF();

    return () => {
      if (renderTaskRef.current) {
        renderTaskRef.current.cancel();
      }
    };
  }, [pdfUrl]);

  useEffect(() => {
    if (pdfRef.current) {
      renderPage(pdfRef.current, pageNum);
    }
  }, [pageNum, scale, rotation]);

  const handlePrevPage = () => {
    setPageNum((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setPageNum((prev) => Math.min(prev + 1, totalPages));
  };

  return (
    <div ref={containerRef} className="pdf-viewer-container">
      <div className="toolbar">
        <div className="navigation-controls">
          <button onClick={handlePrevPage} disabled={pageNum <= 1}>
            Previous
          </button>
          <span>
            Page {pageNum} of {totalPages}
          </span>
          <button onClick={handleNextPage} disabled={pageNum >= totalPages}>
            Next
          </button>
        </div>

        <div className="zoom-controls">
          <button onClick={() => handleZoom(scale - 0.1)}>-</button>
          <span>{Math.round(scale * 100)}%</span>
          <button onClick={() => handleZoom(scale + 0.1)}>+</button>
        </div>

        <div className="rotation-controls">
          <button onClick={handleRotate}>Rotate</button>
        </div>

        <div className="search-controls">
          <input
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Search in PDF..."
          />
          <button onClick={searchPDF}>Search</button>
        </div>

        <div className="view-controls">
          <button onClick={() => setShowThumbnails(!showThumbnails)}>
            {showThumbnails ? 'Hide Thumbnails' : 'Show Thumbnails'}
          </button>
          <button onClick={toggleFullscreen}>
            {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          </button>
        </div>
      </div>

      <div className="pdf-content">
        {showThumbnails && (
          <div className="thumbnails-sidebar">
            {thumbnails.map((thumb) => (
              <div
                key={thumb.pageNum}
                className={`thumbnail ${thumb.pageNum === pageNum ? 'active' : ''}`}
                onClick={() => setPageNum(thumb.pageNum)}
              >
                <img src={thumb.url} alt={`Page ${thumb.pageNum}`} />
                <span>Page {thumb.pageNum}</span>
              </div>
            ))}
          </div>
        )}

        <div className="pdf-page">
          {loading && <div className="loading">Loading...</div>}
          {error && <div className="error">{error}</div>}
          <canvas ref={canvasRef} />
        </div>

        {searchResults.length > 0 && (
          <div className="search-results">
            <h3>Search Results</h3>
            {searchResults.map((result, index) => (
              <div
                key={index}
                className={`search-result ${index === currentSearchIndex ? 'active' : ''}`}
                onClick={() => handleSearchResultClick(result.page)}
              >
                Page {result.page}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PDFViewer;