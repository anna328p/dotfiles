#!/usr/bin/bash

echo 2 > /sys/module/hid_apple/parameters/fnmode
echo 1 > /sys/module/hid_apple/parameters/swap_opt_cmd
