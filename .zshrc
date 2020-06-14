source "${ZDOTDIR:-$HOME}/.zprezto/init.zsh"

export PATH=$HOME/bin:$HOME/.local/bin:$PATH
export CDPATH=.:$HOME:$CDPATH
hash -d w="$HOME/work"

export DEFAULT_USER=$(whoami)
export EDITOR=$(which nvim)
export VISUAL=$EDITOR
export NIX_AUTO_RUN=1
# export ZSH_AUTOSUGGEST_HIGHLIGHT_STYLE="fg=245"
export GPG_TTY=$(tty)

zmodload -a zsh/zpty zpty

setopt GLOB_DOTS

alias open='xdg-open'
alias :e='vim'
alias :w='sync'
alias :q='exit'
alias :wq='sync; exit'

for i in util autopushd escesc; do
  source $HOME/.zsh/snippets/$i.zsh
done

function verify { command -v $* >/dev/null }; 

verify podman    && alias docker=podman
verify direnv    && eval "$(direnv hook zsh)"
verify thefuck   && eval $(thefuck --alias)
verify dircolors && eval $(dircolors ~/.dircolors)

[ $DISPLAY ] && [[ -e ~/.Xresources ]] && xrdb ~/.Xresources
