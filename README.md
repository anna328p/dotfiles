# dotfiles

contains my configs for various programs:
- tmux
- zsh (with prezto)
- vim
- i3-gaps (outdated)
- polybar (outdated)
- termite
- powerline
- lots of other things

prerequisite programs:
- yadm
- git
- zsh
- other things

these dotfiles are meant to be installed with yadm. first install yadm, then
run `yadm clone git@github.com:anna328p/dotfiles` or equivalent.

most of these dotfiles are customized for each of my machines. theseus is a
fairly powerful desktop machine running NixOS. hermes is my old laptop
which has a smaller screen and also runs NixOS. watbook is my
old laptop, which is now defunct.

you will then need to customize the configs for your particular hardware setup.
if you have a first generation Thinkpad X1 Carbon then you will want to use the
set for watbook. otherwise, go through the config options and set the ones
you need.

i recommend setting:
- shell configuration
- if you see any issues, try to find the config for the relevant program
  and change values that look hardware-specific.
