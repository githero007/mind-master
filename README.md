This project has been made for a hackathon
# 📚 Virtual Study Environment 🧠

Welcome to the **Virtual Study Environment**! This innovative platform allows users to upload PDF files, analyzes the content, scans the user's mood, and provides personalized study tips based on that mood. 

This project leverages **React**, **Node.js**, and **Flask** to create an intuitive and responsive study companion.

---

## ✨ Features

- **PDF Analysis**: Upload your PDF and receive a summarized version of the content.
- **Mood Detection**: The system scans your mood using a webcam or manual input.
- **Personalized Study Tips**: Based on your mood, receive customized study recommendations.
- **Interactive UI**: Smooth and responsive user interface built with React.

## 🛠 Tech Stack

- **Frontend**: React.js
- **Backend**: Node.js (for handling file uploads, user interaction) 
- **API**: Flask (for PDF analysis and mood detection)

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed:

- Node.js
- Python 3.x
- Flask

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/virtual-study-environment.git
   cd virtual-study-environment
Install dependencies for the frontend

bash
Copy code
cd client
npm install
Install dependencies for the backend

bash
Copy code
cd server
npm install
Install dependencies for Flask

bash
Copy code
cd flask-api
pip install -r requirements.txt
Running the Application
Start the Flask server

bash
Copy code
cd flask-api
flask run
Start the Node.js server

bash
Copy code
cd server
npm start
Start the React client

bash
Copy code
cd client
npm start
Environment Variables
Create a .env file in the root of each service and add the necessary environment variables:

Flask API: FLASK_ENV, MOOD_DETECTION_API_KEY
Node.js: PORT, DATABASE_URL
React: REACT_APP_API_URL
📈 How it Works
PDF Upload: Users can upload a PDF document to the system.
Content Summarization: The Flask API analyzes the content of the PDF and returns a concise summary.
Mood Detection: Using a webcam (or manually entering their mood), the system analyzes the user’s mood.
Study Tips: Based on the detected mood, the system provides personalized study recommendations to enhance productivity.
🤝 Contributing
Contributions are welcome! Feel free to submit a pull request or open an issue.
