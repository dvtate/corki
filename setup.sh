#!/bin/sh

## This script automatically sets everything up for you
## to be run upon cloning the repo

## make everything runable
printf "marking scripts as runable..."
chmod +x setup.sh corki.sh
printf " done\n"

# if token wasn't exported by update.sh or steve.sh
# then we need to prompt the user for it
if [ -z "$DISCORD_TOKEN" ]; then
	# get bot token
	printf "Enter your Discord Bot API token: "
	read DISCORD_TOKEN
fi

# put token into steve.sh
printf "inserting token into corki.sh... "
sed -i "s/^export DISCORD_TOKEN=.*/export DISCORD_TOKEN=${DISCORD_TOKEN}/" corki.sh
printf "done\n"

# install dependencies
echo "installing dependencies..."
npm install --save discord.js
echo "installed dependencies"
