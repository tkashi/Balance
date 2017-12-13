var exec = require('child_process').exec;

module.exports = function(express) {
    var scheduleRoute = express.Router();

    scheduleRoute.route('/create').get((req, res) => {
        var childProcess = exec('/usr/bin/java -jar ../java/build/balance.jar',
          function (error, stdout, stderr){
            console.log('stdout: ' + stdout);
            console.log('stderr: ' + stderr);
            if(error !== null){
              console.log('exec error: ' + error);
            }
        });
        childProcess.on('close', code => {
            res.json({
                code: code
            });
        });
    });
    
    return scheduleRoute;
};