filetype plugin indent on

set autoread
set backspace=indent,eol,start
set clipboard+=unnamed
set formatoptions+=j

set hlsearch
set ignorecase
set incsearch

set mouse=a
set ttimeoutlen=50
set smartcase

set number
set background=dark
set cursorline
set ruler

set title
set noshowmode
set showcmd
set hidden
set laststatus=2

set splitbelow
set splitright

set scrolloff=3
set sidescrolloff=5
set wrap

set autoindent
set copyindent
set tabstop=4
set shiftwidth=4
set noexpandtab

set undofile
set undolevels=1000
set undoreload=10000

syntax on

let  $NVIM_TUI_ENABLE_CURSOR_SHAPE=0

command! W :w
command! Q :q

let s:first_run = 0
" Load vim-plug
if empty(glob("~/.vim/autoload/plug.vim"))
  let s:first_run = 1
  execute '!curl -fLo ~/.vim/autoload/plug.vim https://raw.github.com/junegunn/vim-plug/master/plug.vim'
endif

call plug#begin('~/.vim/plugged')

  if !has('nvim')
    Plug 'roxma/vim-hug-neovim-rpc'
  endif

  Plug 'chriskempson/base16-vim'

  Plug 'airblade/vim-gitgutter'" Show git status in left gutter, before numbers

  " deoplete
  Plug 'shougo/deoplete.nvim', { 'do': ':UpdateRemotePlugins' } "the main autocomple engine
  Plug 'shougo/neco-vim'

  " deoplete addons
  Plug 'shougo/neoinclude.vim' "also check completion in includes
  Plug 'shougo/neco-syntax'
  Plug 'fszymanski/deoplete-emoji'
  Plug 'SevereOverfl0w/deoplete-github'
"  Plug 'autozimu/LanguageClient-neovim', {
"        \     'branch': 'next',
"        \     'do': 'bash install.sh',
"        \   }
  Plug 'neomake/neomake' "do full syntax checking for most languages
  Plug 'sebastianmarkow/deoplete-rust' "better rust support
  "Plug 'uplus/deoplete-solargraph'
  Plug 'zchee/deoplete-clang' "better clang support
  Plug 'zchee/deoplete-zsh'

  " styles
  Plug 'chiel92/vim-autoformat' " Code formatter
  Plug 'chrisbra/Colorizer' " Show hex code color
  Plug 'vim-airline/vim-airline'
  Plug 'vim-airline/vim-airline-themes'
  Plug 'luochen1990/rainbow' "rainbow highlight brackets

  " language support
  Plug 'dart-lang/dart-vim-plugin' " Dart support
  Plug 'vim-ruby/vim-ruby'
  Plug 'sheerun/vim-polyglot'
  Plug 'rhysd/vim-crystal'
  Plug 'scrooloose/syntastic'
  Plug 'slim-template/vim-slim'
  Plug 'vim-scripts/HTML-AutoCloseTag'
  Plug 'LnL7/vim-nix'

  " addons
  Plug 'scrooloose/nerdtree'
  Plug 'jistr/vim-nerdtree-tabs'
  Plug 'godlygeek/tabular'
  Plug 'jez/vim-superman'

  Plug 'tpope/vim-bundler'
  Plug 'tpope/vim-commentary'
  Plug 'tpope/vim-dispatch'
  Plug 'tpope/vim-fugitive'
  Plug 'tpope/vim-rails'
  Plug 'tpope/vim-rhubarb'
  Plug 'tpope/vim-sensible'
  Plug 'tpope/vim-sleuth'
  Plug 'tpope/vim-speeddating'

  " usability
  Plug 'justinmk/vim-sneak'
  Plug 'tpope/vim-surround'
  Plug 'raimondi/delimitMate'
  Plug 'xolox/vim-easytags'
  Plug 'mhinz/vim-startify'
  Plug 'moll/vim-bbye'

  Plug 'felikZ/ctrlp-py-matcher' "the normal one doesnt prioritize exact matches so we need the py addition
  Plug 'junegunn/fzf' "fuzzy jumping arround

  " misc
  Plug 'wellle/tmux-complete.vim'
  Plug 'xolox/vim-misc'
  "Plug 'isaacmorneau/vim-update-daily' "update vim plugins once a day
  Plug 'majutsushi/tagbar'
"  Plug 'ntpeters/vim-better-whitespace'
  Plug 'vim-scripts/a.vim'
  Plug 'vim-scripts/c.vim'

  let s:has_discord = 0
  silent !which discord || which discord-canary
  if(!v:shell_error)
    let s:has_discord = 1
    Plug 'aurieh/discord.nvim', { 'do': ':UpdateRemotePlugins'}
  endif

  if has('nvim')
    Plug 'glacambre/firenvim', { 'do': function('firenvim#install') }
  endif

call plug#end()

if has('nvim')
  set termguicolors
  colorscheme base16-google-dark
  set background=dark
else
  colorscheme base16-google-dark
endif


"check if we need an upgrade or an update
command! PU PlugUpgrade | PlugUpdate | UpdateRemotePlugins

let s:need_install = keys(filter(copy(g:plugs), '!isdirectory(v:val.dir)'))
let s:need_clean = len(s:need_install) + len(globpath(g:plug_home, '*', 0, 1)) > len(filter(values(g:plugs), 'stridx(v:val.dir, g:plug_home) == 0'))
let s:need_install = join(s:need_install, ' ')

"when entering a terminal enter in insert mode
autocmd BufWinEnter,WinEnter term://* startinsert

"first install stuff
if s:first_run
  echom '==>Initial Setup<=='
  echom 'Several packages require the python3 neovim package. Please install this to have full functionality.'
  echom 'After neovim is installed restart nvim to complete the install.'
endif
if has('vim_starting')
  if s:need_clean
    autocmd VimEnter * PlugClean!
  endif
  if len(s:need_install)
    if s:first_run
      execute 'autocmd VimEnter * PlugInstall --sync' s:need_install '| source $MYVIMRC | only! | term'
    else
      execute 'autocmd VimEnter * PlugInstall --sync' s:need_install ' | source $MYVIMRC'
    endif
    finish
  endif
else
  if s:need_clean
    PlugClean!
  endif
  if len(s:need_install)
    if s:first_run
      execute 'PlugInstall --sync' s:need_install | source $MYVIMRC | only! | term
    else
      execute 'PlugInstall --sync' s:need_install | source $MYVIMRC
    endif
    finish
  endif
endif

"[update-daily]
"custom command to also update remote plugins for stuff like deoplete
let g:update_daily = 'PU'

"airline
let g:airline_powerline_fonts = 1
let g:airline#extensions#tabline#enabled = 1
let g:airline_detect_paste=1

"NERDTree
nmap <silent> <leader>t :NERDTreeTabsToggle<CR>
"let g:nerdtree_tabs_open_on_console_startup = 1

"Syntastic
let g:syntastic_error_symbol = 'E'
let g:syntastic_warning_symbol = "W"
augroup mySyntastic
  au!
  au FileType tex let b:syntastic_mode = "passive"
augroup END

" ----- xolox/vim-easytags settings -----
" Where to look for tags files
set tags=./tags;,~/.vimtags
" Sensible defaults
let g:easytags_events = ['BufReadPost', 'BufWritePost']
let g:easytags_async = 1
let g:easytags_dynamic_files = 2
let g:easytags_resolve_links = 1
let g:easytags_suppress_ctags_warning = 1

" ----- majutsushi/tagbar settings -----
" Open/close tagbar with \b
nmap <silent> <leader>b :TagbarToggle<CR>
" Uncomment to open tagbar automatically whenever possible
"autocmd BufEnter * nested :call tagbar#autoopen(0)

" ----- airblade/vim-gitgutter settings -----
" Required after having changed the colorscheme
hi clear SignColumn
"In vim-airline, only display "hunks" if the diff is non-zero
let g:airline#extensions#hunks#non_zero_only = 1
"
"
" ----- Raimondi/delimitMate settings -----
let delimitMate_expand_cr = 1
augroup mydelimitMate
  au!
  au FileType markdown let b:delimitMate_nesting_quotes = ["`"]
  au FileType tex let b:delimitMate_quotes = ""
  au FileType tex let b:delimitMate_matchpairs = "(:),[:],{:},`:'"
  au FileType python let b:delimitMate_nesting_quotes = ['"', "'"]
augroup END"'"'"]"'"`

"set foldmethod=syntax
"set foldnestmax=2
"set foldcolumn=1
"let javaScript_fold=1		 " JavaScript
"let perl_fold=1			   " Perl
"let php_folding=1			 " PHP
"let r_syntax_folding=1		" R
"let ruby_fold=1			   " Ruby
"let sh_fold_enabled=1		 " sh
"let vimsyn_folding='af'	   " Vim script
"let xml_syntax_folding=1	  " XML

set guifont=Source\ Code\ Pro\ 15.5

" Tab navigation like Firefox.
nnoremap <C-S-tab> :bprevious<CR>
nnoremap <C-tab>   :bnext<CR>

"[NeoMake]
" When reading a buffer (after 1s), and when writing (no delay).
call neomake#configure#automake('rw', 1000)

"[Deoplete]
let g:deoplete#enable_at_startup = 1
"dont require the same file type
let g:deoplete#buffer#require_same_filetype = 0
"<TAB> completion.
inoremap <expr><TAB>  pumvisible() ? "\<C-n>" : "\<TAB>"
"dont litter your windows
autocmd CompleteDone * pclose
let g:deoplete#sources = {}
let g:deoplete#sources.gitcommit=['github']

let g:deoplete#keyword_patterns = {}
let g:deoplete#keyword_patterns.gitcommit = '.+'

"call deoplete#util#set_pattern(g:deoplete#omni#input_patterns, 'gitcommit', [g:deoplete#keyword_patterns.gitcommit])

"[ctrlp.vim]
let g:ctrlp_working_path_mode = 'ra'
"ignore whats in git ignore
let g:ctrlp_user_command = ['.git', 'cd %s && git ls-files -co --exclude-standard']
let g:ctrlp_path_sort = 1
"this is to prioritize matches sanely such as exact first
let g:ctrlp_match_func = { 'match': 'pymatcher#PyMatch' }

"[rainbow]
let g:rainbow_active = 1

"[fzf]
map <C-m> :FZF<CR>
set wildmode=list:longest,list:full
set wildignore+=*.o,*.obj,.git,*.rbc,*.pyc,__pycache__
let $FZF_DEFAULT_COMMAND =  "find * -path '*/\.*' -prune -o -path 'node_modules/**' -prune -o -path 'target/**' -prune -o -path 'dist/**' -prune -o  -type f -print -o -type l -print 2> /dev/null"

" The Silver Searcher
if executable('ag')
  let $FZF_DEFAULT_COMMAND = 'ag --hidden --ignore .git -g ""'
  set grepprg=ag\ --nogroup\ --nocolor
endif

" ripgrep
if executable('rg')
  let $FZF_DEFAULT_COMMAND = 'rg --files --hidden --follow --glob "!.git/*"'
  set grepprg=rg\ --vimgrep
  command! -bang -nargs=* Find call fzf#vim#grep('rg --column --line-number --no-heading --fixed-strings --ignore-case --hidden --follow --glob "!.git/*" --color "always" '.shellescape(<q-args>).'| tr -d "\017"', 1, <bang>0)
endif

" polyglot
let g:polyglot_disabled = [ "dart" ]
