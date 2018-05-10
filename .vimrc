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

" Load vim-plug
if empty(glob("~/.vim/autoload/plug.vim"))
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
call plug#end()

colorscheme solarized

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
