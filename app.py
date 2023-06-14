import openai
from flask import jsonify
from flask import Flask, render_template, request
from openai import api_key, Completion
from dotenv import dotenv_values
import json

config = dotenv_values('.env')
openai.api_key = config['OPENAI_API_KEY']

app = Flask(__name__, template_folder='./templates',
            static_url_path="",
            static_folder="static")


def get_colors(text):
    messages = [
        {"role": "system", "content": "You are an assistant that generates color palettes based on text. You should generate a palette that fits the the theme, mood, or instructions in the text. The palette should be between 2 and 8 colors. Desired format: a JSON array with the colors in hexadecimal value, without your comments. remove the word colors in the output. (Format: JSON)"},
        {"role": "user", "content": f"{text}"}
    ]

    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=messages,
        max_tokens=100,
    )

    model_reply = response['choices'][0]['message']['content']
    model_reply = model_reply.replace("Desired format:", "")
    colors = json.loads(model_reply)
    print(colors)
    return {"colors": colors}


#FLASK ROUTES
@app.route('/')
def index():
    return render_template('index.html')


@app.route('/palette', methods=["POST"])
def prompt_palette():
    app.logger.info("Inside /palette route")
    query = request.form.get("query")
    colors = get_colors(query)
    return jsonify(colors)
   # return colors



if __name__ == "__main__":
    app.run(debug=True, port=5000, host='192.168.0.11')
