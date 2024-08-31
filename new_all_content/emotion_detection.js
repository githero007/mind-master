const video = document.getElementById('video');
const emotions = [];
const intervalDuration = 5000;  // Interval duration in milliseconds (5 seconds)
const averageCalculationDuration = 5000;  // 5 minutes in milliseconds (300 seconds)

// Access the user's webcam
navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => {
        video.srcObject = stream;
    })
    .catch(err => {
        console.error('Error accessing the camera: ', err);
    });

// Function to capture the image from the video feed
function captureImage() {
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL('image/jpeg');
}

// Function to send the captured image for emotion detection
function sendImageForEmotionDetection() {
    const dataURL = captureImage();

    fetch('http://127.0.0.1:6000/detect_emotion', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image: dataURL }),
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Network response was not ok. Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Success:', data);
            emotions.push(data.emotion);
        })
        .catch(error => {
            console.error('Error during detection:', error);
        });
}

// Function to calculate the average emotion every 5 minutes
function calculateAndSendAverageEmotion() {
    if (emotions.length === 0) {
        console.log('No emotions detected in the last 5 minutes.');
        return;
    }

    const emotionCounts = {};
    for (const emotion of emotions) {
        emotionCounts[emotion] = (emotionCounts[emotion] || 0) + 1;
    }

    const mostFrequentEmotion = Object.keys(emotionCounts).reduce((a, b) => emotionCounts[a] > emotionCounts[b] ? a : b);

    fetch('http://127.0.0.1:5000/detect_emotion', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image: captureImage() }),
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Network response was not ok. Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            document.getElementById('emotion').textContent = `Emotion: ${mostFrequentEmotion}`;
            document.getElementById('content').textContent = `Suggested Content: ${data.content}`;
            emotions.length = 0;  // Clear the emotions array after calculating the average
        })
        .catch(error => {
            console.error('Error during detection:', error);
        });
}

// Capture an image every 5 seconds
setInterval(sendImageForEmotionDetection, intervalDuration);

// Calculate and send the average emotion every 5 minutes
setInterval(calculateAndSendAverageEmotion, averageCalculationDuration);
