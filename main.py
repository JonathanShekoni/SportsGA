from flask import Flask, redirect, url_for
app = Flask(__name__) # Flask constructor

#Decorator used to tell the application which URL is associated with the function
@app.route('/')

def home():
    return "Sports Analytics API Running"


if __name__ == "__main__":
    app.run(debug=True)

