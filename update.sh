#!/bin/sh

## this is used to update the bot to the newest version from github
## the goal here is to minimize downtime


echo "Corki is getting a buff... updating sources from GitHub"

# clone the newest version from github
printf "Fetching the newest version of Corki..."
git fetch --all
printf "Hard forcing changes to Corki's source..."
git reset --hard origin/master


# setup new bot
echo "Re-configuring Corki similar to old one..."
sh "setup.sh"

# restart bot
#echo "spawning new Corki..."
#forever index.js
