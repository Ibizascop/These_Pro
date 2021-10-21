# -*- coding: utf-8 -*-
"""
Created on Thu Aug 12 09:23:14 2021

@author: ibiza
"""

import os
import cv2
import numpy as np
import pandas as pd
import tensorflow as tf
import Support as sp
from tqdm import tqdm
import matplotlib as plt


#Resize all images to 512 * 512
def resize_all_images(path) :
    liste_images = os.listdir(path)
    for img in tqdm(liste_images):
        image = cv2.imread.open("./Data/Images/"+img)
        image = sp.vignette(image)
        image.save('./Data/Vignettes/'+img)
resize_all_images("./Data/Images")

#Using a pretrained Resnet50 model
MyModel = tf.keras.models.Sequential()
MyModel.add(tf.keras.applications.ResNet50(
    include_top = False, weights='imagenet',    pooling='avg',
))
# freezing weights for 1st layer
MyModel.layers[0].trainable = False


### with this all done lets write the iterrrative loop
def get_features(path):
    #Create a data frame to save the results
    liste_images = os.listdir(path)
    liste_features = []
    for img in tqdm(liste_images):
        try :
            #image = cv2.imread("./Data/Images/"+img)
            image = cv2.imread(path+img)
            #Get features from model
            image =  np.expand_dims(image, 0)
            image = tf.keras.applications.resnet50.preprocess_input(image)
            extractedFeatures = MyModel.predict(image)
            extractedFeatures = np.array(extractedFeatures)
            liste_features.append(extractedFeatures.flatten())
        except:
            print(img)
    return liste_images, liste_features

### lets give the address of our Parent directory and start
path = "./Data/Vignettes/"
liste_images, liste_features = get_features(path)

#Créer dataframe with features
#Calcul distances
def CNN_distances(liste_images,liste_features):
    CNN_distances = pd.DataFrame(index = liste_images,columns = liste_images)
    for i in tqdm(range(0,len(CNN_distances))):
        for j in range(i,len(CNN_distances)) :
            if i == j :
                CNN_distances.iloc[i,j] = 0
            else :
                CNN_distances.iloc[i,j] = sp.chi2_distance(liste_features[i], liste_features[j])
                CNN_distances.iloc[j,i] = CNN_distances.iloc[i,j]
    #return CNN_distances
    CNN_distances.to_csv("./Data/CNN_distances.csv")

CNN_distances()

x = CNN_distances[list(CNN_distances.columns)[0]].sort_values(ascending=True)
y = x