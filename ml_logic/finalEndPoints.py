from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from pypdf import PdfReader
# import camelot
import os

app = Flask(__name__)
CORS(app)
# Directory to save extracted images
IMAGE_SAVE_DIRECTORY = 'extracted_images'
if not os.path.exists(IMAGE_SAVE_DIRECTORY):
    os.makedirs(IMAGE_SAVE_DIRECTORY)

# Helper function to extract all text from a PDF
def extract_all_text(pdf_file):
    pdf_reader = PdfReader(pdf_file)
    all_text = []

    for page_num in range(len(pdf_reader.pages)):
        page = pdf_reader.pages[page_num]
        text = page.extract_text()
        all_text.append(text)

    return   all_text

# Helper function to extract all links from a PDF
def extract_all_links(pdf_file):
    pdf_reader = PdfReader(pdf_file)
    links = []

    for page_num in range(len(pdf_reader.pages)):
        page = pdf_reader.pages[page_num]
        if '/Annots' in page:
            annots = page['/Annots']
            for annot in annots:
                annot_obj = annot.get_object()
                if '/A' in annot_obj and '/URI' in annot_obj['/A']:
                    links.append(annot_obj['/A']['/URI'])

    return links

# Helper function to extract all images from a PDF
def extract_all_images(pdf_file):
    pdf_reader = PdfReader(pdf_file)
    image_files = []

    for page_num in range(len(pdf_reader.pages)):
        page = pdf_reader.pages[page_num]
        if "/XObject" in page["/Resources"]:
            xObject = page["/Resources"]["/XObject"].get_object()
            for obj in xObject:
                if xObject[obj]["/Subtype"] == "/Image":
                    img_data = xObject[obj].get_data()
                    if xObject[obj]["/Filter"] == "/DCTDecode":
                        img_format = "jpg"
                    else:
                        img_format = "png"  # You can handle other formats as needed
                    img_name = f"image_{page_num}_{obj[1:]}.{img_format}"
                    img_path = os.path.join(IMAGE_SAVE_DIRECTORY, img_name)

                    with open(img_path, "wb") as img_file:
                        img_file.write(img_data)
                    image_files.append(img_name)

    return image_files

# Helper function to extract all tables from a PDF
# Helper function to extract all tables from a PDF
# def extract_all_tables(pdf_file):
#     # Save the file temporarily
#     temp_file_path = "temp_pdf_file.pdf"
#     pdf_file.save(temp_file_path)

#     # Extract tables using camelot
#     tables = camelot.read_pdf(temp_file_path, pages='all', flavor='stream')
#     table_data = [table.df.to_json() for table in tables]

#     # Remove the temporary file
#     os.remove(temp_file_path)

#     return table_data

# Endpoint to get all text
@app.route('/extract_text', methods=['POST'])
def get_all_text():
    if 'pdf' not in request.files:
        return jsonify({"error": "No PDF file provided"}), 400

    pdf_file = request.files['pdf']

    try:
        all_text = extract_all_text(pdf_file)
        return jsonify({"text": all_text}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Endpoint to get all links
@app.route('/extract_links', methods=['POST'])
def get_all_links():
    if 'pdf' not in request.files:
        return jsonify({"error": "No PDF file provided"}), 400

    pdf_file = request.files['pdf']

    try:
        links = extract_all_links(pdf_file)
        return jsonify({"links": links}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Endpoint to get the number of pages
@app.route('/get_num_pages', methods=['POST'])
def get_num_pages():
    if 'pdf' not in request.files:
        return jsonify({"error": "No PDF file provided"}), 400

    pdf_file = request.files['pdf']

    try:
        pdf_reader = PdfReader(pdf_file)
        num_pages = len(pdf_reader.pages)
        return jsonify({"num_pages": num_pages}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Endpoint to get all images
@app.route('/extract_images', methods=['POST'])
def get_all_images():
    if 'pdf' not in request.files:
        return jsonify({"error": "No PDF file provided"}), 400

    pdf_file = request.files['pdf']

    try:
        images = extract_all_images(pdf_file)
        return jsonify({"images": images}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Endpoint to serve an image
@app.route('/get_image/<image_name>', methods=['GET'])
def get_image(image_name):
    try:
        return send_from_directory(IMAGE_SAVE_DIRECTORY, image_name)
    except FileNotFoundError:
        return jsonify({"error": "Image not found"}), 404

# Endpoint to get all tables
# @app.route('/extract_tables', methods=['POST'])
# def get_all_tables():
#     if 'pdf' not in request.files:
#         return jsonify({"error": "No PDF file provided"}), 400

#     pdf_file = request.files['pdf']

#     try:
#         tables = extract_all_tables(pdf_file)
#         return jsonify({"tables": tables}), 200

#     except Exception as e:
#         return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
