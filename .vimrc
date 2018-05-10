set nocompatible

"execute pathogen#infect('~/.vim/bundle/{}')
syntax on
filetype plugin indent on
syntax on
set tabstop=4
"set smarttab
set ignorecase
set smartcase
set wrap
set copyindent
set backspace=indent,eol,start
set title
set undofile
set undolevels=1000
set undoreload=10000
set autoread
set hidden
set scrolloff=3
set sidescrolloff=5
filetype plugin on
set clipboard+=unnamed
set noshowmode
set formatoptions+=j
set shiftwidth=4
set autoindent
"set expandtab
set number
set background=dark
set mouse=a
set laststatus=2
set ttimeoutlen=50
set backspace=indent,eol,start
set ruler
set showcmd
set incsearch
set hlsearch
set cursorline

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
Plug 'airblade/vim-gitgutter'" Show git status in left gutter, before numbers
Plug 'altercation/vim-colors-solarized' " Solarized colorscheme
Plug 'chiel92/vim-autoformat' " Code formatter
Plug 'chrisbra/Colorizer' " Show hex code color
Plug 'ctrlpvim/ctrlp.vim' " Incremental search
Plug 'felikZ/ctrlp-py-matcher' "the normal one doesnt prioritize exact matches so we need the py addition
Plug 'godlygeek/tabular'
Plug 'isaacmorneau/vim-update-daily' "update vim plugins once a day
Plug 'isaacmorneau/vim-update-daily' "update vim plugins once a day
Plug 'jez/vim-superman'
Plug 'jistr/vim-nerdtree-tabs'
Plug 'luochen1990/rainbow' "rainbow highlight brackets
Plug 'majutsushi/tagbar'
Plug 'mhinz/vim-startify'
Plug 'neomake/neomake' "do full syntax checking for most languages
Plug 'ntpeters/vim-better-whitespace'
Plug 'raimondi/delimitMate'
Plug 'scrooloose/nerdtree'
Plug 'scrooloose/syntastic'
Plug 'sebastianmarkow/deoplete-rust' "better rust support
Plug 'sheerun/vim-polyglot'
Plug 'shougo/deoplete.nvim', { 'do': ':UpdateRemotePlugins' } "the main autocomple engine
Plug 'shougo/neoinclude.vim' "also check completion in includes
Plug 'slim-template/vim-slim'
Plug 'tpope/vim-bundler'
Plug 'tpope/vim-dispatch'
Plug 'tpope/vim-fugitive'
Plug 'tpope/vim-rails'
Plug 'tpope/vim-sensible'
Plug 'tpope/vim-sleuth'
Plug 'tpope/vim-surround'
Plug 'vim-airline/vim-airline'
Plug 'vim-airline/vim-airline-themes'
Plug 'vim-ruby/vim-ruby'
Plug 'vim-scripts/HTML-AutoCloseTag'
Plug 'vim-scripts/a.vim'
Plug 'xolox/vim-easytags'
Plug 'xolox/vim-misc'
Plug 'zchee/deoplete-clang' "better clang support
"dont add discord if its not installed(like on servers)
let s:has_discord = 0
silent !which discord || which discord-canary
if(!v:shell_error)
  Plug 'aurieh/discord.nvim', { 'do': ':UpdateRemotePlugins'}
endif
call plug#end()

colorscheme solarized

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

let g:airline_powerline_fonts = 1
let g:airline#extensions#tabline#enabled = 1
let g:airline_detect_paste=1
nmap <silent> <leader>t :NERDTreeTabsToggle<CR>
" let g:nerdtree_tabs_open_on_console_startup = 1
let g:syntastic_error_symbol = '✘'
let g:syntastic_warning_symbol = "▲"
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

filetype plugin on
set guifont=Source\ Code\ Pro\ 10

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

"[ctrlp.vim]
let g:ctrlp_working_path_mode = 'ra'
"ignore whats in git ignore
let g:ctrlp_user_command = ['.git', 'cd %s && git ls-files -co --exclude-standard']
let g:ctrlp_path_sort = 1
"this is to prioritize matches sanely such as exact first
let g:ctrlp_match_func = { 'match': 'pymatcher#PyMatch' }

"[rainbow]
let g:rainbow_active = 1
let g:rainbow_conf = {
            \   'guifgs': ['royalblue3', 'darkorange3', 'seagreen3', 'firebrick'],
            \   'ctermfgs': ['lightblue', 'lightyellow', 'lightcyan', 'lightmagenta'],
            \   'operators': '_,_',
            \   'parentheses': ['start=/(/ end=/)/ fold', 'start=/\[/ end=/\]/ fold', 'start=/{/ end=/}/ fold'],
            \   'separately': {
            \       '*': {},
            \       'tex': {
            \           'parentheses': ['start=/(/ end=/)/', 'start=/\[/ end=/\]/'],
            \       },
            \       'lisp': {
            \           'guifgs': ['royalblue3', 'darkorange3', 'seagreen3', 'firebrick', 'darkorchid3'],
            \       },
            \       'vim': {
            \           'parentheses': ['start=/(/ end=/)/', 'start=/\[/ end=/\]/', 'start=/{/ end=/}/ fold', 'start=/(/ end=/)/ containedin=vimFuncBody', 'start=/\[/ end=/\]/ containedin=vimFuncBody', 'start=/{/ end=/}/ fold containedin=vimFuncBody'],
            \       },
            \       'html': {
            \           'parentheses': ['start=/\v\<((area|base|br|col|embed|hr|img|input|keygen|link|menuitem|meta|param|source|track|wbr)[ >])@!\z([-_:a-zA-Z0-9]+)(\s+[-_:a-zA-Z0-9]+(\=("[^"]*"|'."'".'[^'."'".']*'."'".'|[^ '."'".'"><=`]*))?)*\>/ end=#</\z1># fold'],
            \       },
            \       'css': 0,
            \   }
	    \}
