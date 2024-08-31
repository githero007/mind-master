from flask import Flask, request, jsonify
from flask_cors import CORS
from keras.models import load_model
from keras.preprocessing.image import img_to_array
import cv2
import numpy as np
import base64
from io import BytesIO
from PIL import Image

# Load pre-trained face detection model and emotion classifier
face_classifier = cv2.CascadeClassifier('new_all_content\haarcascade_frontalface_default.xml')
classifier = load_model('new_all_content\model.h5')

emotion_labels = ['Angry', 'Disgust', 'Fear', 'Happy', 'Neutral', 'Sad', 'Surprise']

from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Allow all origins


def decode_image(image_data):
    try:
        image_data = image_data.split(",")[1]
        image = Image.open(BytesIO(base64.b64decode(image_data)))
        return np.array(image)
    except Exception as e:
        print("Error decoding image:", e)
        return None

@app.route('/detect_emotion', methods=['POST'])

def detect_emotion():
    try:
        image_data = request.json.get('image')
        if not image_data:
            print("No image data received.")
            return jsonify({'emotion': 'Error', 'content': 'No image data received.'})

        image = decode_image(image_data)
        if image is None:
            print("Image decoding failed.")
            return jsonify({'emotion': 'Error', 'content': 'Image decoding failed.'})

        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        faces = face_classifier.detectMultiScale(gray, scaleFactor=1.3, minNeighbors=5)

        if len(faces) == 0:
            print("No face detected.")
            return jsonify({'emotion': 'No face detected', 'content': 'Please try again!'})

        (x, y, w, h) = faces[0]
        roi_gray = gray[y:y+h, x:x+w]
        roi_gray = cv2.resize(roi_gray, (48, 48), interpolation=cv2.INTER_AREA)

        roi = roi_gray.astype('float32') / 255.0
        roi = img_to_array(roi)
        roi = np.expand_dims(roi, axis=0)

        prediction = classifier.predict(roi)[0]
        label = emotion_labels[prediction.argmax()]

        content = related_content(label)
        
        return jsonify({'emotion': label, 'content': content})

    except Exception as e:
        print("Error during detection:", e)
        return jsonify({'emotion': 'Error', 'content': 'An error occurred.'})

def related_content(emotion):
    content_map = {
        'Happy': 'Watch this comedy movie!',
        'Sad': 'Here are some uplifting songs.',
        'Angry': 'Check out these calming techniques.',
        'Surprise': 'Read about these fascinating facts!',
        'Neutral': 'How about a relaxing meditation session?',
        'Fear': 'Explore ways to build confidence!',
        'Disgust': 'Check out these fun activities to distract yourself!',
    }
    return content_map.get(emotion, 'Explore our latest articles!')

if __name__ == '__main__':
    app.run(debug=True, port=8000)

