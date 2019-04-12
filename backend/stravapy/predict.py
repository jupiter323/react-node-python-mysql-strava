# coding: utf-8

# #### Author - Joram Kolf

import os
import json
import datetime

import numpy as np
from os import path

import pandas as pd

pd.set_option('display.max_rows', 500)
pd.set_option('display.max_columns', 500)
pd.set_option('display.width', 1000)

import seaborn as sns
import matplotlib.pyplot as plt

import _pickle as cPickle
from sklearn.preprocessing import MinMaxScaler, StandardScaler, Normalizer
import glob
from itertools import combinations
from imblearn.over_sampling import RandomOverSampler
from imblearn.under_sampling import RandomUnderSampler

import pickle
from sklearn.naive_bayes import MultinomialNB
from sklearn.model_selection import train_test_split, GridSearchCV, validation_curve
from sklearn import metrics
from sklearn.ensemble import AdaBoostClassifier, ExtraTreesClassifier
from xgboost import XGBClassifier
from sklearn.model_selection import RandomizedSearchCV
from sklearn.metrics import (accuracy_score, roc_auc_score, confusion_matrix, roc_curve, auc,
                             mean_squared_error, log_loss, precision_recall_curve, classification_report,
                             precision_recall_fscore_support)
from sklearn.model_selection import GridSearchCV, cross_val_score, StratifiedKFold, learning_curve
from sklearn.linear_model import LogisticRegression
from sklearn.naive_bayes import GaussianNB
from sklearn.svm import SVC, LinearSVC
from sklearn.tree import DecisionTreeClassifier, export_graphviz
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier, VotingClassifier
from xgboost.sklearn import XGBClassifier
import scikitplot as skplt
import lime
import lime.lime_tabular
from sklearn.externals.six import StringIO
from IPython.display import Image
import pydotplus
import lightgbm as lgb

import warnings

warnings.filterwarnings("ignore")

from IPython.core.debugger import set_trace

def convert():
    main_path = "final_data/"

    user = 'User 2 - 100 meter - added variables - traintest - new/User 2'
    train_data_path = "/Train data/"
    test_data_path = "/Test data/"
    all_files = glob.glob(main_path + user + train_data_path + "*.csv")

    input = all_files
    all_files_combinations = sum([list(map(list, combinations(input, i))) for i in range(len(input) + 1)], [])
    combined_inp_list = list(all_files_combinations[1:])

    all_training_files = glob.glob(main_path + user + train_data_path + "*.csv")
    all_training_files = [
        s.replace("final_data/User 2 - 100 meter - added variables - traintest - new/User 2/Train data\\", "") for s in
        all_training_files]
    print('Training Files : \n', all_training_files)
    all_testing_files = glob.glob(main_path + user + test_data_path + "*.csv")
    all_testing_files = [
        s.replace("final_data/User 2 - 100 meter - added variables - traintest - new/User 2/Test data\\", "") for s in
        all_testing_files]
    print('Testing Files : \n', all_testing_files)

    testing_files = glob.glob(main_path + user + test_data_path + "*.csv")
    num_observation = []
    for file in testing_files:
        dat = pd.read_csv(file, sep=';')
        num_observation.append(dat.shape[0])
    print('Number of Observations in Test Files', num_observation)



    main_path = "final_data/"
    user = 'User 2 - 100 meter - added variables - traintest - new/User 2'
    train_data_path = "/Train data/"
    test_data_path = "/Test data/"
    all_files = glob.glob(main_path + user + train_data_path + "*.csv")

    list_ = []
    print('------------------------')
    print('Processing User :', user)
    print('------------------------')

    input = all_files
    all_files_combinations = sum([list(map(list, combinations(input, i))) for i in range(len(input) + 1)], [])
    print("Total different combinations of training files : ", len(all_files_combinations))
    combined_inp_list = list(all_files_combinations[1:])

    rows_in = []
    for i in range(len(combined_inp_list)):
        files = combined_inp_list[i]
        list_ = []
        for file in files:
            df = pd.read_table(file, sep=';').drop("Unnamed: 57", axis=1)
            list_.append(df)
        trainDF = pd.concat(list_, axis=0, ignore_index=True)

        total = trainDF.isnull().sum().sort_values(ascending=False)
        percent = (trainDF.isnull().sum() / trainDF.isnull().count() * 100).sort_values(ascending=False)
        missing_train_df = pd.concat([total, percent], axis=1, keys=['Total', 'Percent'])

        trainDF.drop(['index', 'time', 'lat', 'lon', 'error'], inplace=True, axis=1)

        trainDF.drop(['beats', 'beatcount', 'time1', 'gpxtimestamp'], inplace=True, axis=1)

        trainDF.loc[trainDF['hrCategory'] > 9, 'hrCategory'] = 9
        trainDF.loc[trainDF['hrCategory'] == 2, 'hrCategory'] = 1
        trainDF.loc[trainDF['hrCategory'] == 4, 'hrCategory'] = 3
        trainDF.loc[trainDF['hrCategory'] == 6, 'hrCategory'] = 5
        X = trainDF.drop(['hrCategory', 'hrCategory1', 'shape', 'activity_id', 'm_v', 'intensityscore',
                          'ftpreal20min', 'ftpreal10min', 'ftpreal5min', 'weight', 'user_id', 'length', 'dist', 'age'],
                         axis=1)
        y = trainDF['hrCategory']

        kfold = StratifiedKFold(n_splits=5)
        X.fillna(X.mean(), inplace=True)
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.9, random_state=1000)
        ros = RandomOverSampler(random_state=0)

        model = RandomForestClassifier()
        model.fit(X_train, y_train)

        importances = model.feature_importances_
        std = np.std([tree.feature_importances_ for tree in model.estimators_],
                     axis=0)
        indices = np.argsort(importances)

        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.9, random_state=1000)
        RFC = RandomForestClassifier(random_state=123)
        model = AdaBoostClassifier(base_estimator=RFC, algorithm='SAMME.R',
                                   learning_rate=0.5, n_estimators=1000)

        model.fit(X, y)

        names_list = []
        for j in combined_inp_list[i]:
            names_list.append(j[84:100])

        with open('user_combinations_models/' + user[55:] + '/' + '-'.join(names_list) + '_final_tuned_model.pkl',
                  'wb') as fid:
            cPickle.dump(model, fid)

    main_path = "final_data/"
    user = 'User 2 - 100 meter - added variables - traintest - new/User 2'
    train_data_path = "/Train data/"
    test_data_path = "/Test data/"

    path = 'user_combinations_models/' + user[55:]

    all_model_ = os.listdir(path)
    saving_path = 'user_combinations_predictions/' + user[55:] + '/'

    best_model_ = []
    best_model__ = []

    all_accuracy_ = []
    rows_in = []
    for file__ in glob.glob('user_combinations_models/' + user[55:] + '/' + "*final_tuned_model.pkl"):
        with open(file__, 'rb') as fid:
            _model = cPickle.load(fid)
        model = _model

        for file in glob.glob(main_path + user + test_data_path + "*.csv"):
            try:
                testDF = pd.read_table(file, sep=';').drop("Unnamed: 57", axis=1)
            except KeyError:
                testDF = pd.read_table(file, sep=';', skiprows=list(range(1, 34)))

            testDF = pd.read_csv(file, sep=',', header='infer') if testDF.shape[1] == 1 else testDF

            testDF_copy = testDF.copy()
            rows_in.append(testDF.shape[0])

            testDF.drop(['index', 'time', 'lat', 'lon', 'error', 'beats', 'beatcount', 'time1', 'gpxtimestamp'],
                        inplace=True, axis=1)
            testDF.loc[testDF['hrCategory'] == 2, 'hrCategory'] = 1
            testDF.loc[testDF['hrCategory'] == 4, 'hrCategory'] = 3
            testDF.loc[testDF['hrCategory'] == 6, 'hrCategory'] = 5

            testDF.loc[testDF['hrCategory'] > 9, 'hrCategory'] = 9
            Xtest = testDF.drop(['hrCategory', 'hrCategory1', 'shape', 'activity_id', 'm_v', 'intensityscore',
                                 'ftpreal20min', 'ftpreal10min', 'ftpreal5min', 'weight', 'user_id', 'length', 'dist',
                                 'age'], axis=1)

            ytest = testDF['hrCategory']

            Xtest.fillna(Xtest.mean(), inplace=True)

            preds = model.predict(Xtest)

            test_acc = accuracy_score(ytest, preds)
            all_accuracy_.append(test_acc)

            testDF_copy['hrCategory'] = preds

            best_model_.append(str(saving_path + 'FILE' + file[-20:-4] + 'MODEL' + str(file__)[32:-4] + file[-4:]))
            best_model__.append(str(saving_path + 'FILE' + file[-20:-4] + 'MODEL' + str(file__)[32:-4] + file[-4:]))

            testDF_copy.to_csv(saving_path + 'FILE' + file[-20:-4] + 'MODEL' + str(file__)[32:-4] + file[-4:], index=False)

    acc_df = pd.DataFrame({'Model': best_model_, "Accuracy": all_accuracy_, "Num Rows": rows_in})

    acc_df['Filename'] = acc_df.Model.str.replace('user_combinations_predictions/User 2/', '').str[4:16]

    train_files_df = pd.DataFrame()
    for file in all_training_files:
        acc_df[str(file)[:-4]] = str(file)[:-4]
        train_files_df[str(file)[:-4]] = str(file)[:-4]
    acc_df['Model'] = acc_df.Model.str[21:-25]
    for file in train_files_df.columns:
        acc_df[file] = acc_df.apply(lambda x: x[file] in x['Model'], axis=1)
    a = acc_df[['Num Rows', 'Filename', 'Accuracy']]
    b = acc_df.iloc[:, 4:]
    acc_df = pd.concat([a, b], axis=1)
    acc_df.columns.values[1] = "Test File"
    acc_df.Accuracy = acc_df.Accuracy * 100
    acc_df.to_csv('summary.csv', index=False)

    acc_df['Id'] = best_model_
    acc_df_best_testpreds = acc_df.groupby(['Test File'], sort=False)['Accuracy', 'Id'].max()

    for model_ in list(acc_df_best_testpreds.Id):
        print(model_)
        pd.read_csv(model_).to_csv(saving_path + 'best_predictions/' + str(model_)[37:], index=False)

