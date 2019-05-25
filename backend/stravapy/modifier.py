# coding: utf-8

# #### Author - Joram Kolf
import numpy as np

import pandas as pd

pd.set_option('display.max_rows', 500)
pd.set_option('display.max_columns', 500)
pd.set_option('display.width', 1000)

import _pickle as cPickle
import glob, os
from itertools import combinations
from imblearn.over_sampling import RandomOverSampler

from sklearn.model_selection import train_test_split
from sklearn.ensemble import AdaBoostClassifier
from sklearn.metrics import accuracy_score
from sklearn.model_selection import StratifiedKFold
from sklearn.ensemble import RandomForestClassifier
import warnings
warnings.filterwarnings("ignore")



def getFileName(name):
    temp = name.split('/')[-1]
    return temp.split('.')[0].replace('\\','')

def creatDir(name):
    try:
        os.mkdir(name)        
    except FileExistsError:
        pass


def Process(user='Test'):
    """ set config data """
    main_path = "../storage/gpx/output-files/" + user
    # user = 'User 2 - 100 meter - added variables - traintest - new/User 2'
    train_data_path = "/train data/"
    test_data_path = "/test data/"

    # create directories
    creatDir(main_path+'/user_combinations_models')
    path = main_path+'/user_combinations_models' 
    creatDir(path)

    creatDir(main_path+'/user_combinations_predictions')
    saving_path = main_path+'/user_combinations_predictions/' 
    creatDir(saving_path)
    creatDir(saving_path + 'best_predictions')
    ##########################################################################################################
    #### get all file names of train dir
    all_files = glob.glob(main_path + train_data_path + "*.csv")
    all_files = [file.replace("\\", '/') for file in all_files]
    print(all_files)

    ##########################################################################################################
    #### get all training files and show
    all_training_files = glob.glob(main_path + train_data_path + "*.csv")
    all_training_files = [file.replace("\\", '/') for file in all_training_files]
    all_training_files = [
        s.replace( main_path + "/train data/", "") for s in
        all_training_files]
    print('Training Files : \n', all_training_files)

    #### get testing files and show
    # all_testing_files = glob.glob(main_path + user + test_data_path + "*.csv")
    # all_testing_files = [
    #     s.replace("final_data/" + user + "/User/Test data\\", "") for s in
    #     all_testing_files]
    # print('Testing Files : \n', all_testing_files)

    #### get testing files and get observation list
    # testing_files = glob.glob(main_path + user + test_data_path + "*.csv")
    # num_observation = []
    # for file in testing_files:
    #     dat = pd.read_csv(file, sep=';')
    #     num_observation.append(dat.shape[0])
    # print('Number of Observations in Test Files', num_observation)

    ###########################################################################################################
    #### Start process
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
            # try:
            df = pd.read_table(file, sep=';')#.drop("Unnamed: 57", axis=1)
            list_.append(df)
            # except:
            #     print("error" + file)
            #     raise Exception
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
        model = AdaBoostClassifier(base_estimator=RFC,
                                   algorithm='SAMME.R',
                                   learning_rate=0.5,
                                   n_estimators=1000)

        model.fit(X, y)

        names_list = []
        for j in combined_inp_list[i]:
            # temp_name = j.split('/')[-1][:-4]
            names_list.append(getFileName(j))

        with open( path + '/' + '-'.join(names_list) + '_final_tuned_model.pkl',
                  'wb') as fid:
            cPickle.dump(model, fid)

    best_model_ = []
    best_model__ = []

    all_accuracy_ = []
    rows_in = []
    for file__ in glob.glob( path + '/' + "*final_tuned_model.pkl"):
        file__ = file__.replace('\\', '/')
        with open(file__, 'rb') as fid:
            _model = cPickle.load(fid)
        model = _model

        for file in glob.glob(main_path + test_data_path + "*.csv"):
            file = file.replace('\\', '/')

            csvfilepath = saving_path + str(file__).split('/')[-1].split('.')[0] + file[-4:]
            print(csvfilepath)

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

            best_model_.append(csvfilepath)
            best_model__.append(csvfilepath)

            testDF_copy.to_csv(csvfilepath, index=False)
            # testDF_copy.to_csv(saving_path + 'FILE' + file[-20:-4] + 'MODEL' + str(file__)[32:-4] + file[-4:],index=False)

    acc_df = pd.DataFrame({'Model': best_model_, "Accuracy": all_accuracy_, "Num Rows": rows_in})
    print(acc_df.Model.str.replace('user_combinations_predictions/' + user + '/', ''))
    acc_df['Filename'] = acc_df.Model.str.replace('user_combinations_predictions/' + user + '/', '').str[4:16]
    train_files_df = pd.DataFrame()
    for file in all_training_files:
        acc_df[getFileName(file)] = getFileName(file)
        train_files_df[getFileName(file)] = getFileName(file)
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
        pd.read_csv(model_).to_csv(saving_path + 'best_predictions/output.csv', index=False)
        # pd.read_csv(model_).to_csv(saving_path + 'best_predictions/' + str(model_)[37:], index=False)

    return True