// Imports and setup
const express = require('express');
const app = express();
const cors = require('cors');
app.use(express.json());
app.use(cors());
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize Google Generative AI
const genAI = new GoogleGenerativeAI("AIzaSyBeTzQwjjoegxxBGk-47p9Wed2BV8eENfQ");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Function to classify PDF content and generate a summary
const classifyPdfContent = async (pdf_content) => {
    const prompt = `generate a summary for this and classify the content into easy, medium, and hard: ${pdf_content}`;
    try {
        const result = await model.generateContent(prompt);
        return result.response.text();
    } catch (error) {
        console.error('Error generating content:', error);
        return "Error in generating content";
    }
};

let summary = [];
let category = 'medium';  // Initialize category

// Route to receive PDF text and generate summary
app.post('/', async (req, res) => {
    const { text } = req.body; // Extract text from req.body
    console.log('Received text:', text);

    if (!Array.isArray(text)) {
        return res.status(400).send('Invalid format. Expected an object with a "text" array.');
    }

    try {
        // Process the text using classifyPdfContent function
        const resultText = await classifyPdfContent(text.join(" ")); // Join the text array into a single string
        summary = resultText; // Store the result in global variable 'summary'
        console.log('Generated Summary:', summary);
        res.send("The extracted text has been received and processed successfully.");
    } catch (error) {
        console.error('Error processing the text:', error);
        res.status(500).send('Error processing the text.');
    }
});
let mood = 0;
// Determine category based on mood
app.post('/mood', async (req, res) => {
    const { mood } = req.body; // Extract mood from req.body

    if (typeof mood !== 'number') {
        return res.status(400).send('Invalid format. Expected a number for mood.');
    }

    // Set category based on mood
    let category = mood > 0 ? 'medium' : 'hard';

    const prompt = `From the summary, generate ${category} questions: ${summary} `;
    try {
        const result = await model.generateContent(prompt);
        const suggestions = response.data.suggestions; // Get the generated suggestions
        console.log('Received Suggestions:', suggestions);
        res.json({ suggestions });
    } catch (error) {
        console.error('Error generating content:', error);
        res.status(500).send("Error in generating suggestions.");
    }
});


// Route to generate suggestions based on the summary and category
app.post('/suggestions', async (req, res) => {
    const prompt = `From the summary, generate ${category} questions: ${summary} `;
    try {
        const result = await model.generateContent(prompt);
        const suggestions = result.response.text(); // Get the generated suggestions
        console.log('Generated Suggestions:', suggestions);
        res.json({ suggestions });
    } catch (error) {
        console.error('Error generating content:', error);
        res.status(500).send("Error in generating suggestions.");
    }
});
app.post('/chat', async (req, res) => {
    const { prompt } = req.body; // Extract prompt from the request body
    console.log('Received prompt:', prompt);

    if (!prompt || typeof prompt !== 'string') {
        return res.status(400).send('Invalid format. Expected an object with a "prompt" string.');
    }

    try {
        // Generate content based on the user's prompt
        const result = await model.generateContent(prompt);
        const response = result.response.text(); // Get the generated response from Gemini
        console.log('Generated Response:', response);
        res.json({ response });
    } catch (error) {
        console.error('Error generating response from Gemini:', error);
        res.status(500).send("Error in generating response.");
    }
});

// Start the server
app.listen(3000, () => {
    console.log(`Gemini server is listening on port ${3000}`);
});
