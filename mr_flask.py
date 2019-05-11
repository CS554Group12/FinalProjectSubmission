import numpy as np
import pandas as pd
import tensorflow as tf
from flask import Flask, jsonify, request
from keras.models import Model, load_model

app = Flask(__name__)

def input_conversion(data):
    
    ratings = np.zeros(3952)
    for id in data:
        ratings[id] = 1
    ratings = ratings.reshape(1, -1)
    return ratings

@app.route('/', methods=['GET', 'POST'])
def hello_world():
    inputs = request.json['favorites']
        
    return jsonify({'recommendations' : inputs})

if __name__ == '__main__':
    g = tf.Graph()
    with g.as_default():
        print("Loading model")
        autoencoder = load_model('autoencoder.h5')
        print("Autoencoder Neural Network Loaded")
    app.run()