#!/bin/sh

# get key from file
export DISC_KEY=$(cat $HOME/.corki/disc_key)

echo "starting corki bot..."
# start bot
node index.js

echo "gg bot died :/"
