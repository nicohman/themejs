var exec = require('child_process').exec;
var fs = require('fs');
if (process.argv[2]) {
    var themename = process.argv[2]
} else {
    var themename = fs.readFileSync(process.env['HOME'] + "/.config/themename");
}
var theme_dir = process.env['HOME'] + '/themes/' + themename
var central = fs.readFileSync(process.env['HOME'] + "/.central");
var exist = fs.existsSync(theme_dir);
var central_termite = fs.readFileSync(process.env['HOME'] + "/.central_termite");
if (exist) {
    console.log("Theme exists")
    process.chdir(theme_dir);
    var theme = require(theme_dir + '/theme.json')
    if (theme.name) {
        fs.open("/tmp/vimcolor", "w+", function(err, fd) {
            if (!err) {
                fs.write(fd, theme.vim_color, function(err) {
                    if (err) {
                        console.error(err.code);
                    }
                    console.log("Wrote Vim Color")
                    var i3 = central + fs.readFileSync(theme_dir + "/" + theme.i3)
                    console.log("Read i3 Config")
                    var termite = central_termite + fs.readFileSync(process.env['HOME'] + '/.colors/' + theme.color);
                    exec("pkill conky");
                    if (theme.conky) {
                        exec("conky -c " + theme.conky.location + " -d")
                    }
                    fs.open(process.env['HOME'] + "/.config/termite/config", "w+", function(err, fd) {
                        if (!err) {
                            fs.write(fd, termite, function(err) {
                                if (err) {
                                    console.error(err.code)
                                }
                                exec("pkill -SIGUSR1 termite", function() {
                                    fs.open(process.env['HOME'] + "/.config/i3/config", "w+", function(err, fd) {
                                        if (!err) {
                                            fs.write(fd, i3, function(err) {
                                                console.log("Wrote i3 Config")
                                                if (err) {
                                                    console.error(err.code);
                                                }
                                                exec("i3-msg 'reload'");
                                                console.log("Reloaded i3")
                                                exec("pkill polybar", function() {
                                                    theme.bar.bars.forEach(function(bar) {
                                                        exec("polybar -c " + theme.bar.location + " " + bar + " &");
                                                        console.log("Started polybar " + bar)
                                                    });
                                                    fs.open(process.env['HOME'] + "/.config/themename", "w+", function(err, fd) {
                                                        fs.write(fd, themename, function(err) {
                                                            console.log("Wrote themename")
                                                            exec("xrdb -merge " + theme.rofi, function() {
                                                                console.log("Reloaded rofi config")
                                                                setTimeout(function() {
                                                                    exec("~/scripts/set " + theme_dir + "/" + theme.wall);
                                                                    console.log("Changed wallpaper to " + theme_dir + "/" + theme.wall)
                                                                }, 800)
                                                            });
                                                        })
                                                    })
                                                });


                                            })
                                        }
                                    })
                                })
                            })

                        }

                    });
                })

            }
        })
    }
} else {
    console.log("Theme does not exist")
}