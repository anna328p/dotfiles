#!/bin/bash
#
# Author: paul.wratt@gmail.com (Paul Wratt)
# Original: benley@gmail.com (Benjamin Staffin)
# Set your fbterm's color palette to match the Solarized color scheme by
# using escape sequences. fbterm uses decimal values not hex values.
#

#set -o nounset

base03="0;43;54"
base02="7;54;66"
base01="88;110;117"
base00="101;123;131"
base0="131;148;150"
base1="147;161;161"
base2="238;232;213"
base3="253;246;227"
yellow="181;137;0"
orange="203;75;22"
red="220;50;47"
magenta="211;54;130"
violet="108;113;196"
blue="38;139;210"
cyan="42;161;152"
green="133;153;0"

printf "\033[3;234;$base03}\033[3;235;$base02}\033[3;240;$base01}\033[3;241;$base00}\033[3;244;$base0}\033[3;245;$base1}\033[3;254;$base2}\033[3;230;$base3}\033[3;136;$yellow}\033[3;166;$orange}\033[3;160;$red}\033[3;125;$magenta}\033[3;61;$violet}\033[3;33;$blue}\033[3;37;$cyan}\033[3;64;$green}"

function cset() {
  ANSI=$1
  RGB=$2
  printf "\033[3;%d;%s}" $ANSI "$RGB"
}

#black
cset 0 $base02
cset 8 $base03

#red
cset 1 $red
cset 9 $orange

#green
cset 2 $green
cset 10 $base01

#yellow
cset 3 $yellow
cset 11 $base00

#blue
cset 4 $blue
cset 12 $base0

#magenta
cset 5 $magenta
cset 13 $violet

#cyan
cset 6 $cyan
cset 14 $base1

#white
cset 7 $base2
cset 15 $base3

