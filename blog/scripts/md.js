var spawn = require('child_process').exec;

hexo.on('new', function (data) {
    spawn('start  "markdownpath.exe" ' + data.path);
});