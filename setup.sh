#!/bin/sh

## This script automatically sets everything up for you
## to be run upon cloning the repo

# make everything runable
printf "marking scripts as runable..."
chmod +x *.sh
printf " done\n"


printf "making ~/.corki..."
mkdir "$HOME/.corki"
mkdir "$HOME/.corki/reddit"
touch "$HOME/.corki/reddit/clist"
echo "done"


# if token wasn't exported by update.sh or steve.sh
# then we need to prompt the user for it
if [ ! -f $HOME/.corki/disc_key ]; then
	# get bot token
	printf "Enter your Discord token: "
	read DISCORD_TOKEN

    # put token into config dir
    printf "inserting token into ur ~/.corki/disc_key... "
    echo $DISCORD_TOKEN > $HOME/.corki/disc_key

    echo "done"
fi


# install dependencies
echo "installing dependencies..."
npm install --save discord.js node-datetime open-exchange-rates money time lunicode-creepify lunicode-tiny lunicode-flip lunicode-mirror rss-parser
echo "installed dependencies"
