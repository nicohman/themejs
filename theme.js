var exec = require('child_process').exec;
var fs = require('fs');
if(process.argv[2]){
  var themename = process.argv[2]
} else {
    var themename = fs.readFileSync(process.env['HOME']+"/.config/themename");
}
var theme_dir = process.env['HOME']+'/themes/'+themename
var central = fs.readFileSync(process.env['HOME']+"/.central");
var exist = fs.existsSync(theme_dir);
if(exist){
  console.log("Theme exists")
  process.chdir(theme_dir);
  var theme = require(theme_dir+'/theme.json')
  if(theme.name){
    fs.open("/tmp/vimcolor", "w+", function(err, fd){
      if(!err){
        fs.write(fd, theme.vim_color, function(err){
          if(err){
            console.error(err.code);
          }
          console.log("Wrote Vim Color")
          var i3 = central + fs.readFileSync(theme_dir+"/"+theme.i3)
          console.log("Read i3 Config")
          exec("pkill conky");
          if(theme.conky){
            exec("conky -c "+theme.conky.location + " -d")
          }
          fs.open(process.env['HOME']+"/.config/i3/config", "w+", function(err, fd){
            if(!err){
              fs.write(fd, i3, function(err){
                console.log("Wrote i3 Config")
                if(err){
                  console.error(err.code);
                }
                exec("xrdb -merge "+process.env['HOME']+'/.colors/'+theme.color, function(){
                  console.log("Changed colorscheme")
                  exec("pkill -SIGHUP urxvt", function(){
                    console.log("Reloaded urxvt")
                    exec("i3-msg 'reload'");
                    console.log("Reloaded i3")
                    exec("pkill polybar", function(){
                      theme.bar.bars.forEach(function(bar){
                        exec("polybar -c "+theme.bar.location+" "+bar + " &");
                        console.log("Started polybar "+bar)
                      });
                      fs.open(process.env['HOME']+"/.config/themename", "w+", function(err, fd){
                        fs.write(fd, themename, function(err){
                          console.log("Wrote themename")
                          exec("xrdb -merge " + theme.rofi, function(){
                            console.log("Reloaded rofi config")
                            setTimeout(function(){
                              exec("~/scripts/set "+theme_dir+"/"+theme.wall);
                              console.log("Changed wallpaper to "+theme_dir+"/"+theme.wall)
                            }, 800)

                            //process.exit();
                          });
                        })
                      })
                    });
                  });

                });

              })
            }
          })
        });
      }
    })
  }
} else {
  console.log("Theme does not exist")
}
