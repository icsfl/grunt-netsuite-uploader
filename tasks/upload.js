module.exports = function(grunt) {
	var netsuiteUploader = require('netsuite-uploader-util');
	var creds = netsuiteUploader.Credentials,
		SuiteTalk = netsuiteUploader.SuiteTalk,
		path = require('path');

	grunt.event.on('watch', function(action, filepath) {
		grunt.config.set('filepath', filepath);
	});

	grunt.registerMultiTask('upload', 'Upload files.', function() {

		var filepath = path.resolve(grunt.config.get('filepath')),
			filecabinetpath = this.data.filecabinetpath,
			isflat = this.data.isflat;
		
		var client = new SuiteTalk();
		client.init(creds.email, creds.password, this.data.account, this.data.role).then(function(){
			var pathparts = filepath.split(/\\|\//);
			
			// Possible to change the name at this point?
			var filename = pathparts[pathparts.length-1];
			
			if(!isflat){
				var cabinetpathparts = filecabinetpath.split(/\\|\//);
				
				var root_cabinet_folder = cabinetpathparts[cabinetpathparts.length-1];
				
				var rest_of_path = pathparts.slice(pathparts.indexOf(root_cabinet_folder)+1);
				
				filecabinetpath = cabinetpathparts.concat(rest_of_path).join('/');
			} else {
				filecabinetpath = [filecabinetpath, filename].join('/');
			}

			client.upload(filepath, filecabinetpath);
		});
	});
};
