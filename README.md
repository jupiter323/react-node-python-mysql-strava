git clone

BACK_END RUNNING

1.	Run xampp as administrator

    [like this](https://www.dropbox.com/s/atv6m7mmiajm4ed/1.png)

2.	Run mysql as start button like below image
 
    [like this](https://www.dropbox.com/s/awzkrcdpz23xqjw/2.png)

3. Please create database on mysql

-   Run apache as start button like below image

    [like this](https://www.dropbox.com/s/g5pphjk4v7loemd/33.png)

-   run phpmyadmin on xampp

    [like this](https://www.dropbox.com/s/7yy95my46yr2jlk/4.png)

-   create database as "stravadb"

    [like this](https://www.dropbox.com/s/its5diglhc96raa/5.png)
    
-   database table create

    select "stravadb" and go to import tab and choose file(database.sql I sent you)

    [like this](https://www.dropbox.com/s/t4585zkzopvda83/6.png)

    then press "go" button

    [like this](https://www.dropbox.com/s/v606sa2x2gjiqn9/7.png)

4.	Go to backend folder. 

Please copy securedata.zip on root directory and extra here(storage folder and .env file should be in root directory)

-	Run “npm i” , then “nodemon server.js”  in new terminal (Linux or mac)

-	Run “npm i” , then run server.bat file(windows)

5.	Go to backend/stravapy folder. 

-	“python app.py” in new terminal(Linux or mac)

-	And run start_python.bat(windows)

So python flask succeed as like below.    
    [like this](https://www.dropbox.com/s/gvldky8ht3ctt3e/3.png)

FRONT_END RUNNING

6.	Go to client folder.

-	Run “yarn” in new terminal, then “yarn start” in new terminal (Linux or Mac)

-	Run “yarn” in new terminal, then run client.bat (windows)
