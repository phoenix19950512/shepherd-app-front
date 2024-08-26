import html2pdf from 'html2pdf.js';
import jsPDF from 'jspdf';
import { marked } from 'marked';

/**
 * Save a content as a PDF File
 *
 * @param fileName Name of the PDF file
 * @param content The content of the PDF file. Could be string or string arrays
 */
export const saveAsPDF = (
  fileName: string,
  content: string | string[],
  x = 10,
  y = 10
): boolean => {
  const doc = new jsPDF();
  doc.text(content, x, y);
  try {
    doc.save(fileName);
    return true;
  } catch (error: any) {
    // console.error(error)
    return false;
  }
};

export const saveHTMLAsPDF = async (
  fileName: string,
  content: string,
  x = 10,
  y = 10,
  useManual = false
): Promise<boolean> => {
  const doc = new jsPDF();
  const element = document.createElement('div');
  element.style.cssText += 'padding:32px;';
  element.innerHTML = content;

  try {
    // Set font size and line height for styling similar to a blocknote
    if (useManual) {
      const fontSize = 12;
      const lineHeight = 15;

      // Loop through each paragraph and add it to the PDF
      const paragraphs = element.getElementsByTagName('p');
      let offsetY = y;
      for (let i = 0; i < paragraphs.length; i++) {
        const paragraph = paragraphs[i];
        doc.text(paragraph.innerText, x, offsetY);
        offsetY += lineHeight;
      }
      // Save the PDF
      doc.save(fileName);
    } else {
      const styledHtml = `<div style="padding:32px 32px 50px">${content}</div>`;
      html2pdf().from(styledHtml, 'string').toPdf().save(fileName);
    }
    return true;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    return false;
  }
};

// export const saveMarkdownAsPDF = async (
//   fileName: string,
//   markdownContent: string,
//   x = 10,
//   y = 10
// ): Promise<boolean> => {
//   const doc = new jsPDF();
//   const element = document.createElement('div');
//   element.innerHTML = marked(markdownContent);

//   try {
//     // Convert the entire element to an image
//     const dataUrl= await htmlToImage.toPng(element);
//     console.log("image data URL: ", dataUrl);
//     // Add the image to the PDF
//     doc.addImage(dataUrl, 'PNG', x, y, 100, 100); // Adjust width and height as needed
//     // Save the PDF
//     doc.save(fileName);

//     return true;
//   } catch (error) {
//     console.error(error);
//     return false;
//   }
// };

export const saveMarkdownAsPDF = async (
  fileName: string,
  markdownContent: string,
  x = 10,
  y = 10
): Promise<boolean> => {
  const doc = new jsPDF();
  const element = document.createElement('div');
  element.innerHTML = marked(markdownContent);

  try {
    // Set font size and line height for styling
    const fontSize = 12;
    const lineHeight = 15;

    // Loop through each child element and add it to the PDF
    const childNodes = element.childNodes;
    let offsetY = y;
    for (let i = 0; i < childNodes.length; i++) {
      const childNode = childNodes[i];
      if (childNode.nodeType === Node.TEXT_NODE) {
        const nodeValue: string | string[] = childNode.nodeValue
          ? childNode.nodeValue
          : '';
        doc.text(nodeValue, x, offsetY);
        offsetY += lineHeight;
      } else if (childNode.nodeType === Node.ELEMENT_NODE) {
        const innerText = childNode.textContent || '';
        doc.text(innerText, x, offsetY);
        offsetY += lineHeight;
      }
    }
    // Save the PDF
    doc.save(fileName);
    return true;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    return false;
  }
};
