#!/bin/sh

## this is used to update the bot to the newest version from github
## the goal here is to minimize downtime

echo "Corki is getting a buff... updating sources from GitHub"

# clone the newest version of steve from github
printf "Fetching the newest version of Corki..."
git fetch --all
printf "Hard forcing changes to Corki's source..."
git reset --hard origin/master


# setup new Steve
echo "Re-configuring Corki similar to old one..."
sh "setup.sh"

# kill and revive steve
printf "spawning new Corki..."
./steve.sh
