source "${ZDOTDIR:-$HOME}/.zprezto/init.zsh"

export MANPATH="/usr/local/man:$MANPATH"
export DEFAULT_USER=$(whoami)
export EDITOR=$(which nvim)
export VISUAL=$(which nvim)
export MAKEFLAGS="-j$(expr $(nproc) \+ 1)"
export CDPATH=.:$HOME:$CDPATH
export NIX_AUTO_RUN=1
export ZSH_AUTOSUGGEST_HIGHLIGHT_STYLE="fg=245"

zmodload -a zsh/zpty zpty

setopt GLOB_DOTS

eval `dircolors ~/.dircolors`
[ $DISPLAY ] && [[ -e ~/.Xresources ]] && xrdb ~/.Xresources

export PATH=$HOME/bin:$HOME/.local/bin:$PATH

hash -d w='/home/dmitry/work'

alias vim="$EDITOR"
alias open='xdg-open'
alias power='for i in $(upower -e); do echo $i &&upower -i $i; done'
alias :wq='exit'
alias :tabopen='tmux new-window'
alias :e='vim'
alias :w='sync'
alias :q='exit'

command -v podman >/dev/null && alias docker=podman

export GPG_TTY=$(tty)

function mkcd {
  mkdir -p $* && cd $*
}

function urlencode {
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

function join_by { local IFS="$1"; shift; echo "$*"; }

function shove {
  URLS=()

  for i in $*; do
    fn=$RANDOM-"$(basename "$i")"
    scp "$i" image-upload@WebServer.dk0.us:/var/www/files/uploads/"$fn"

    URL=$(printf "http://u.dk0.us/%s" $(urlencode "$fn"))
    echo $URL
    URLS+=$URL
  done

  join_by $'\n' "$URLS" | xclip -selection clipboard
}

function rain {
  curl -s https://isitraining.in/Sammamish | grep result | grep -oP '(?<=\>).+(?=\<)' --color=never
}

function scratch {
  mkdir -p "$HOME/Documents/scratch"
  if [ -z "$1" ]; then
    nvim "$HOME/Documents/scratch"
  else
    nvim "$HOME/Documents/scratch/$1.md"
  fi
}

function psgrep {
  ps aux | grep -v grep | grep $*

}

function try {
  until bash -c "$*"; do
    sleep 2
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
function chpwd {
  print -l $PWD ${(u)dirstack} >$DIRSTACKFILE
}

DIRSTACKSIZE=20

setopt AUTO_PUSHD PUSHD_SILENT PUSHD_TO_HOME

# Remove duplicate entries
#setopt PUSHD_IGNORE_DUPS

# This reverts the +/- operators.
#setopt PUSHD_MINUS

#-----------------------------------------------------------------------------#

function sudo-command-line {
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

which direnv && eval "$(direnv hook zsh)"

eval $(thefuck --alias)
