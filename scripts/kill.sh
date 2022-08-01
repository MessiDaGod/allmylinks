#!/bin/sh
lsof -n -i4TCP:7199| grep LISTEN | awk '{ print $2 }' | xargs kill