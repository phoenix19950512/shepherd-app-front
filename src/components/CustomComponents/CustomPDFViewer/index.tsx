import { NotePDFWrapper } from './style';
import { FC, ReactNode } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

export interface PDFViewerProps {
  url: string;
  page: number;
  useNoteWrapper?: boolean;
  children?: ReactNode;
}

const PDFViewer: FC<PDFViewerProps> = ({ url, page, useNoteWrapper }) => {
  const PDFWrapper = ({ children }) => {
    if (useNoteWrapper) {
      return <NotePDFWrapper>{children}</NotePDFWrapper>;
    } else {
      return <div>{children}</div>;
    }
  };

  return (
    <PDFWrapper>
      <Document file={url}>
        <Page pageNumber={page} />
      </Document>
    </PDFWrapper>
  );
};

export default PDFViewer;
