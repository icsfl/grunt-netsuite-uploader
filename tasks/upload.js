module.exports = function(grunt) {
	var http = require('http');
	var path = require('path');
	var creds = loadCreds();

	grunt.event.on('watch', function(action, filepath) {
		grunt.config.set('filepath', filepath);
	});

	grunt.registerMultiTask('upload', 'Upload files.', function() {
		var options = this.options({
			hostname: 'localhost',
			port: 9100,
			path: '/api/v2/upload',
			method: 'POST',
			headers: { 'Content-Type': 'application/json' }
		});

		var req = http.request(options);

		var cmd = {
			config: {
				email: creds.email,
				password: creds.password,
				account: this.data.account,
				role: this.data.role,
				isflat: this.data.isflat,
				filecabinetpath: this.data.filecabinetpath
			},
			filepath: path.resolve(grunt.config.get('filepath'))
		};

		req.write(JSON.stringify(cmd));
		req.end();
	});

	function loadCreds(){
		var path = require('path');
		var creds_file_name = 'netsuite_creds';

		var creds;

		try
		{
			// try to load them from current directory
			creds = require('./'+creds_file_name);
			console.log('Using credentials found in ' + path.resolve(creds_file_name+'.js'));
		} catch(e) {
			try {
				// try user's home directory
				creds = require(path.join(getUserHome(),creds_file_name));
				console.log('Using credentials found in ' + path.join(getUserHome(),creds_file_name+'.js'));
			} catch(e){
				var readline = require('readline-sync'),
				fs = require('fs');

				console.log('Provide your NetSuite Credentials');

				creds = {
					email: readline.question('Email: ', {}),
					password: readline.question('Password: ', { noEchoBack: true })
				};

				var file_name = path.join(getUserHome(), creds_file_name+ '.js');

				fs.writeFile(file_name, 'module.exports = ' + JSON.stringify(creds), function(){
					console.log('NetSuite credentials have been stored in ' + file_name);
				});
			}
		}

		return creds;

		function getUserHome() {
			return process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];
		}
	}
};
