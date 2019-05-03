git clone

MYSQL server install

    Please install mysql server accroding this guid

    [like this](https://tecadmin.net/install-mysql-server-on-debian9-stretch/)


Remote connection Setting

    that is different on the Ubuntu setting and Debian
-   Debian is below 

    [like this](https://www.internalpointers.com/post/enable-remote-mysql-access-debian)

-   Ubuntu is below
    "sudo nano /etc/mysql/mysql.conf.d/mysqld.cnf"
    and edit something as follow

    [mysqld]
    . . .
    bind-address = 0.0.0.0

    then, please do "sudo systemctl restart mysql"
    "sudo netstat -plunt | grep mysqld"
    "sudo ufw allow mysql"

install Sequel pro on os x

    download sequel_pro.dmg file and install.

connect with ssh

-   please connect with ssh as follow

    [like this](https://www.dropbox.com/s/yqp4op6ixqheyx2/1.png)

-   add "stravadb" database as follow 

    [like this](https://www.dropbox.com/s/qt9pvl0d3hs7px9/2.png)
    [like this](https://www.dropbox.com/s/prtd100nfpu2dvy/3.png)

-   run our database query.
    open database.sql with any editor such as "sublime text 3"
    and copy all query on that.
    [like this](https://www.dropbox.com/s/peurhuxd1a4agih/4.png)
    and past on the SequelPro query panel, then select all and press run button
    [like this](https://www.dropbox.com/s/oubapp15m630m5r/5.png)
    Then will be created our tables in the "stravadb"
    [like this](https://www.dropbox.com/s/qmc9ax34fhotlyy/6.png)

BACK_END RUNNING

    
    "cd backend"
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
