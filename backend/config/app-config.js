
const expressConfig = require('./express-config');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const passport = require('passport')

class AppConfig{
	
	constructor(app){
        this.app = app;        
	}

	includeConfig() {
        
        this.app.use(
            bodyParser.json()            
        );

        this.app.use(
            bodyParser.urlencoded({
                extended:false
            })
        );
        
        this.app.use(
        	cors()
        );

        this.app.use(
            passport.initialize()
        )
        
        this.app.use(
            morgan('dev')
        )
                
        this.app.use(
            passport.session()
        )

		new expressConfig(this.app);
	}

}

module.exports = AppConfig;

