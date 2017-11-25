#Now deprecated
This is now deprecated and [raven](https:://github.com/nicohman/raven) should be used instead.
# themejs
Linux i3-based theme switcher and initalizer. Features support for polybar, conky, wallpaper, rofi, i3, vim and terminal colorschemes, plus a rofi-based menu.

##Installation
You'll want [rofi](https://github.com/DaveDavenport/rofi), [node](https://nodejs.org/en/), [polybar](https://github.com/jaagr/polybar), [conky](https://github.com/brndnmtthws/conky), [termite](https://github.com/thestinger/termite/), [i3](https://github.com/i3/i3), and [feh](https://github.com/derf/feh). Conky, polybar and rofi are not required, though they are highly reccomended. To install, run:

`git clone https://github.com/nicohman/themejs.git && cd themejs`

`node theme.js [theme]`

I reccomend binding thememenu to a keyboard shortcut like $mod+Shift+t
##Usage

Just run node theme.js to reset to the last used theme, with node theme.js [theme name] to switch to a theme.

##Configuration

Colorschemes should be stored in ~/.colors, while themes should be stored in ~/themes.
Each theme should contain a 'theme.json' similar to the example.json provided. i3 will be appended to a file named ~/.central, which should be your universal i3 configs like keyboard shortcuts. Vimcolor will be written to /tmp/vimcolor, and should be used as you see fit to set your vim colorscheme.
