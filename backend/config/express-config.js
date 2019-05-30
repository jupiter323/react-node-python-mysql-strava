class ExpressConfig{
	
	constructor(app){
		// Setting .html as the default template extension
		app.set('view engine', 'html');

		//Files 
		app.use(require('express').static(require('path').join('../client/build')));
		app.use(/^((?!(api)).)*/, (req, res) => {
			res.sendFile(require('path').join(__dirname, '../../client/build', '/index.html'));
		});
	}
}
module.exports = ExpressConfig;
