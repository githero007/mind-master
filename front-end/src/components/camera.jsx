import React, { useState, useEffect, useRef } from "react";
import Webcam from "react-webcam";
import axios from "axios";
import { useRecoilState } from 'recoil';
import { messagesAtom } from '../atoms/atom';

export const WebcamComponent = () => {
    const [camera, setCamera] = useState(false);
    const [emotion, setEmotion] = useState("");
    const [total, setTotal] = useState(0);
    const webcamRef = useRef(null);
    const [moodResponse, setMoodResponse] = useState(null);
    const [messages, setMessages] = useRecoilState(messagesAtom);

    useEffect(() => {
        let captureIntervalId;
        let moodIntervalId;

        // Function to capture and send image
        const captureAndSendImage = () => {
            if (webcamRef.current) {
                const imageSrc = webcamRef.current.getScreenshot();
                sendImageForEmotionDetection(imageSrc);
            }
        };

        // Function to send total to /mood endpoint
        const sendTotalToMood = () => {
            axios
                .post("http://127.0.0.1:3000/mood", { mood: total }) // Adjust the URL if needed
                .then((response) => {
                    console.log('total data:content', response.data.suggestions);
                    setMoodResponse(response.data.suggestions
                    );
                    setMessages((oldMessages) => [
                        ...oldMessages,
                        { text: response.data.suggestions, isUser: false },
                    ]);
                })
                .catch((error) => {
                    console.error("Error sending total:", error);
                });
        };

        if (camera) {
            captureIntervalId = setInterval(captureAndSendImage, 5 * 1000); // Capture every 5 seconds
            moodIntervalId = setInterval(sendTotalToMood, 5 * 1000); // Send total every 5 minutes

            // Clear intervals if the camera is closed
            return () => {
                clearInterval(captureIntervalId);
                clearInterval(moodIntervalId);
            };
        } else {
            // Clear intervals if the camera is turned off
            clearInterval(captureIntervalId);
            clearInterval(moodIntervalId);
        }

        // Cleanup intervals on component unmount
        return () => {
            clearInterval(captureIntervalId);
            clearInterval(moodIntervalId);
        };
    }, [camera, total]); // Depend on camera and total

    useEffect(() => {
        // Log the updated total whenever it changes
        console.log("Updated total:", total);
    }, [total]);

    const sendImageForEmotionDetection = (imageSrc) => {
        axios
            .post("http://127.0.0.1:8000/detect_emotion", {
                image: imageSrc,
            })
            .then((response) => {
                console.log("Success:", response.data);
                setEmotion(response.data.emotion); // Save the detected emotion in state

                // Update total based on detected emotion
                setTotal(prevTotal => {
                    if (
                        response.data.emotion === "Happy" ||
                        response.data.emotion === "Surprise" ||
                        response.data.emotion === "Neutral"
                    ) {
                        return prevTotal + 1;
                    } else if (response.data.emotion === "No face detected") {
                        // Handle the case where no face is detected
                        return prevTotal; // or decide on how to handle this case
                    } else {
                        return prevTotal - 1;
                    }
                });
            })
            .catch((error) => {
                console.error("Error during detection:", error);
            });
    };

    const handleCameraStatus = () => {
        setCamera(!camera);
    };

    return (
        <div className="camera-container">
            <button onClick={handleCameraStatus}>
                {camera ? "Close Camera" : "Open Camera"}
            </button>
            {camera && <Webcam ref={webcamRef} screenshotFormat="image/jpeg" />}
            {emotion && <p>Detected Emotion: {emotion}</p>}
        </div>
    );
};