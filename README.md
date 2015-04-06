# grunt-netsuite-uploader
Grunt task to upload local scripts into netsuite

The first time you run this task, it will prompt you for your netsuite email address and password. These credentials will be stored locally and re-used for future launches. If you change your password, you'll need to delete the `netsuite_creds.js` file so the upload task will re-ask for your credentials.

Sample packages.config:
```json
{
    "name": "MyApp1",
    "version": "0.1.0",
    "description": "MyApp1",
    "repository": "",
    "devDependencies": {
        "grunt": "^0.4.5",
        "grunt-contrib-watch": "^0.6.1",
        "grunt-netsuite-uploader": "git://github.com/icsfl/grunt-netsuite-uploader"
    }
}
```
Sample GruntFile.js:
```javascript
module.exports = function(grunt) {
      
  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    watch: {
      restlets: {
        files: ['RESTlets/*.js'],
        tasks: ['upload'],
        options: { spawn: false }
      },
    },
    upload: {
      dev: {
        account: 'TSTDRV123456',
        role: '3',
        isflat: false,
        filecabinetpath: 'SuiteScripts/Awesomeness'
      },
      dev2: {
        account: 'TSTDRV654321',
        role: '3',
        isflat: true,
        filecabinetpath: 'SuiteBundles/Bundle 12345'
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-netsuite-uploader');

  // Default task(s).
  grunt.registerTask('default', ['watch']);
};
```  
The above watches the `RESTlets` folder for changes, and uploads any `*.js` file that changes to both of the accounts as defined in the upload config.
The `isflat` flag determines whether or not the target folder in the file cabinet mirrors the folder structure on the local file system. If `isflat` is true then the upload task will put any changed file directly into the target file cabinet folder. Otherwise it will try and find the appropriate folder to put into.
