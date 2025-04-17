import React from 'react';
import { Helmet } from 'react-helmet';

const FontLoader = () => {
  return (
    <Helmet>
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
        rel="stylesheet"
      />
      <link
        href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap"
        rel="stylesheet"
      />
      <link
        href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap"
        rel="stylesheet"
      />
      <link
        href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;500;600;700&display=swap"
        rel="stylesheet"
      />
      <style>
        {`
          @media print {
            body {
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
            
            @page {
              size: A4;
              margin: 20mm;
            }
            
            .resume-preview {
              width: 210mm;
              min-height: 297mm;
              padding: 20mm;
              margin: 0;
              box-shadow: none;
              border: none;
            }
          }
        `}
      </style>
    </Helmet>
  );
};

export default FontLoader;