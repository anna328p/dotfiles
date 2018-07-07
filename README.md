# dotfiles
dkudriavtsev's dotfiles

contains configs for lots of things:
- tmux
- zsh (with prezto)
- vim
- i3-gaps
- polybar
- termite
- powerline
- lots of other things

prerequisite programs:
- ffmpeg
- git
- zsh
- i3lock
- other things

these dotfiles are meant to be installed with yadm. first install yadm, then
run `yadm clone git@github.com:dkudriavtsev/dotfiles` or the https equivalent.
then, configure them to your liking.

most of these dotfiles are customized for each of my machines. tera is a
fairly powerful desktop machine running arch linux. wat is my old laptop
which has a smaller screen and runs gentoo, arch, and void. watbook is my
current laptop, which has a 1600x900 screen and some minor quirks.

after you clone the set of files, the configs won't apply unless your hostname
is wat, watbook or tera. i don't recommend changing your hostname to use this.
choose the set of dotfiles that you want to use (my current and most updated
set is the one for watbook) and then copy each one to a file in the directory
named `[file]##[OS].[hostname]` where file is the name of the config, OS is the
operating system (Linux in most cases) and hostname is your hostname. use the
existing files as examples, they're named something like `config##Linux.wat`.

after this, run `yadm alt` to link all the files to their correct locations.

you will then need to customize the configs for your particular hardware setup.
if you have a first generation Thinkpad X1 Carbon then you will want to use the
set for watbook. otherwise, go through the config options and set the ones
you need.

i recommend setting:
- the username to your own, it's `dmitry` everywhere
- your primary screen, network interface name and hwmon path in polybar config
- screen resolution in lock.sh
- shell configuration
- if you see any issues, try to find the config for the relevant program
  and change values that look hardware-specific.

good luck and enjoy.
