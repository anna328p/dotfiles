source "${ZDOTDIR:-$HOME}/.zprezto/init.zsh"

# export ARCHFLAGS="-arch x86_64"
export MANPATH="/usr/local/man:$MANPATH"
export DEFAULT_USER=$(whoami)
export EDITOR=$(which vim)
export MAKEFLAGS="-j$(expr $(nproc) \+ 1)"
export CDPATH=.:$HOME:$CDPATH
export ZSH_AUTOSUGGEST_HIGHLIGHT_STYLE='fg=11'

zmodload -a zsh/zpty zpty

eval `dircolors ~/.dircolors`
[ $DISPLAY ] && xrdb ~/.Xresources

export PATH=$HOME/bin:$HOME/.local/bin:/usr/local/bin:/home/dmitry/.gem/ruby/2.5.0/bin:$PATH

hash -d w='/home/dmitry/work'

[ -e /etc/pacman.conf ] && alias pacman='pacaur'
[ -d /etc/portage ] && alias pacman='sudo pacman'
alias vim='nvim'
alias open='xdg-open'
alias syu='pacman -Syu'
alias install='pacman -S'
[ $(cat /etc/hostname) = wat ] && alias ls='/opt/coreutils/bin/ls'
alias power='for i in $(upower -e); do echo $i &&upower -i $i; done'
alias kexec-reboot='sudo kexec -l /boot/vmlinuz-linux-zen --initrd=/boot/initramfs-linux-zen.img --reuse-cmdline; sudo systemctl kexec'
alias :wq='exit'
alias :tabopen='tmux new-window'
alias :e='vim'
alias :w='sync'
alias :q='exit'

export GPG_TTY=$(tty)

mkcd () {
  mkdir -p $*
  cd $*
}

urlencode() {
  local string="${1}"
  local strlen=${#string}
  local encoded=""
  local pos c o

  for (( pos=0 ; pos<strlen ; pos++ )); do
     c=${string:$pos:1}
     case "$c" in
        [-_.~a-zA-Z0-9] ) o="${c}" ;;
        * )               printf -v o '%%%02x' "'$c"
     esac
     encoded+="${o}"
  done
  echo -n "${encoded}"
}

shove () {
  scp $* image-upload@dk0.us:/var/www/files/uploads
  for i in $*; do
    echo "http://u.dk0.us/"$(urlencode "$(basename $i)")
  done
}

#-----------------------------------------------------------------------------#

DIRSTACKFILE="$HOME/.cache/zsh/dirs"

[ ! -d $(dirname $DIRSTACKFILE) ] || mkdir -p $(dirname $DIRSTACKFILE)

if [[ -f $DIRSTACKFILE ]] && [[ $#dirstack -eq 0 ]]; then
  dirstack=( ${(f)"$(< $DIRSTACKFILE)"} )
  [[ -d $dirstack[1] ]] && cd $dirstack[1]
fi
setopt clobber
chpwd() {
	  print -l $PWD ${(u)dirstack} >$DIRSTACKFILE
}
chromemem() {
  echo -n "Chrome memory usage (GB): "
  ps -e -o command,%mem | grep chrom | cut -d ' ' -f 3 | awk '{s+=$1} END {print s/100*16}'
}

DIRSTACKSIZE=20

setopt AUTO_PUSHD PUSHD_SILENT PUSHD_TO_HOME

# Remove duplicate entries
#setopt PUSHD_IGNORE_DUPS

# This reverts the +/- operators.
#setopt PUSHD_MINUS

#-----------------------------------------------------------------------------#

PATH="/home/dmitry/perl5/bin${PATH:+:${PATH}}"; export PATH;
PERL5LIB="/home/dmitry/perl5/lib/perl5${PERL5LIB:+:${PERL5LIB}}"; export PERL5LIB;
PERL_LOCAL_LIB_ROOT="/home/dmitry/perl5${PERL_LOCAL_LIB_ROOT:+:${PERL_LOCAL_LIB_ROOT}}"; export PERL_LOCAL_LIB_ROOT;
PERL_MB_OPT="--install_base \"/home/dmitry/perl5\""; export PERL_MB_OPT;
PERL_MM_OPT="INSTALL_BASE=/home/dmitry/perl5"; export PERL_MM_OPT;

#-----------------------------------------------------------------------------#

sudo-command-line() {
    [[ -z $BUFFER ]] && zle up-history
    if [[ $BUFFER == sudo\ * ]]; then
        LBUFFER="${LBUFFER#sudo }"
    elif [[ $BUFFER == $EDITOR\ * ]]; then
        LBUFFER="${LBUFFER#$EDITOR }"
        LBUFFER="sudoedit $LBUFFER"
    elif [[ $BUFFER == sudoedit\ * ]]; then
        LBUFFER="${LBUFFER#sudoedit }"
        LBUFFER="$EDITOR $LBUFFER"
    else
        LBUFFER="sudo $LBUFFER"
    fi
}
zle -N sudo-command-line
# Defined shortcut keys: [Esc] [Esc]
bindkey "\e\e" sudo-command-line

[ -f /usr/share/doc/pkgfile/command-not-found.zsh ] && source /usr/share/doc/pkgfile/command-not-found.zsh
source ~/.local/share/icons-in-terminal/icons_bash.sh
#source /storage/opt/intel/system_studio_2018/compilers_and_libraries_2018.2.199/linux/bin/iccvars.sh intel64
#
#powerline-daemon -q
#[ -e /usr/lib/python3.6/site-packages/powerline/bindings/zsh/powerline.zsh ] && . /usr/lib/python3.6/site-packages/powerline/bindings/zsh/powerline.zsh
#[ -e ~/.local/lib64/python3.5/site-packages/powerline/bindings/zsh/powerline.zsh ] && . ~/.local/lib64/python3.5/site-packages/powerline/bindings/zsh/powerline.zsh
