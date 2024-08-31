import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import axios, { isCancel, AxiosError } from 'axios';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';

// Set workerSrc for pdfjs
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url,
).toString();

export function PdfInput() {
    const [selectedFile, setSelectedFile] = useState(null);
    const [text, setText] = useState("");
    const [fileUrl, setFileUrl] = useState(null);
    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);

    const onDocumentLoadSuccess = ({ numPages }) => {
        setNumPages(numPages);
        setPageNumber(1); // Reset to first page when new document is loaded
    };
    const sendPdfML = async (file) => {
        console.log(file);
        if (!file) return;  // Ensure a file is selected
        const formData = new FormData();
        formData.append('pdf', file);

        try {
            const response = await axios.post('http://localhost:5000/extract_text', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            const extractedTextArray = response.data.text; // This should match the structure from the Express server response
            console.log('Extracted Text:', extractedTextArray); // Log the extracted text array

            // Send the extracted text to another endpoint on your server
            const processedResponse = await axios.post('http://localhost:3000/', {
                text: extractedTextArray  // Sending as { text: ["text1", "text2", ...] }
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

        } catch (error) {
            console.error("An error occurred while sending the PDF to the server:", error);
        }
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedFile(file);
            setFileUrl(URL.createObjectURL(file));
            console.log(selectedFile);
            sendPdfML(file);
            console.log("file is recieved for backend processing");
        }
    };

    const handlePreviousPage = () => {
        setPageNumber((prevPageNumber) => Math.max(prevPageNumber - 1, 1));
    };

    const handleNextPage = () => {
        setPageNumber((prevPageNumber) => Math.min(prevPageNumber + 1, numPages));
    };


    return (
        <div>
            {!fileUrl && (<div><label htmlFor="avatar">Drag and drop a file or select a PDF:</label>
                <input
                    type="file"
                    id="avatar"
                    name="avatar"
                    accept="application/pdf"
                    onChange={handleFileChange}
                />
            </div>)
            }

            {fileUrl && (
                <div>
                    <Document file={fileUrl} onLoadSuccess={onDocumentLoadSuccess}>
                        <Page pageNumber={pageNumber} />
                    </Document>
                    <p>
                        Page {pageNumber} of {numPages}
                    </p>

                    <button onClick={handlePreviousPage} disabled={pageNumber <= 1}>
                        Previous
                    </button>
                    <button onClick={handleNextPage} disabled={pageNumber >= numPages}>
                        Next
                    </button>
                    <br />
                    <label htmlFor="avatar">Done with this pdf read another one:</label>
                    <input
                        type="file"
                        id="avatar"
                        name="avatar"
                        accept="application/pdf"
                        onChange={handleFileChange}
                    />
                </div>
            )}
        </div>
    );
}
