#!/bin/sh

## This script automatically sets everything up for you
## to be run upon cloning the repo

# make everything runable
echo "marking scripts as runable..."
chmod +x *.sh


echo "setting up configuration directory..."
mkdir "$HOME/.corki"				# bot config directory
mkdir "$HOME/.corki/users"			# user directories
mkdir "$HOME/.corki/servers"		# server directories


# discord key
if [ ! -f $HOME/.corki/disc_key ]; then
	# get bot token
	printf "Enter your Discord token: "
	read DISCORD_TOKEN

    # put token into config dir
    printf "inserting token into ur ~/.corki/disc_key... "
    echo $DISCORD_TOKEN > $HOME/.corki/disc_key
    echo "done"
fi

# riot api key
if [ ! -f $HOME/.corki/riot_key ]; then
	# get token
	printf "Enter Riot API token: "
	read RIOT_TOKEN

	# put in file
	printf "inserting token into ~/.corki/riot_key... "
	echo $RIOT_TOKEN > $HOME/.corki/riot_key
	echo "done"
fi

# champion.gg api key
if [ ! -f $HOME/.corki/champgg_key ]; then
	# get token
	printf "Enter champion.gg API token: "
	read CHAMPGG_TOKEN

	# put in file
	printf "inserting token into ~/.corki/champgg_key... "
	echo $CHAMPGG_TOKEN > $HOME/.corki/champgg_key
	echo "done"
fi

# discord oauth2 client id
if [ ! -f $HOME/.corki/client_id ]; then
	# get token
	printf "Enter client id: "
	read CLIENT_ID

	# put in file
	printf "inserting client id into ~/.corki/client_id... "
	echo $CLIENT_ID > $HOME/.corki/client_id
	echo "done"
fi

# discord oauth2 client secret
if [ ! -f $HOME/.corki/client_secret ]; then
	# get token
	printf "Enter client secret: "
	read CLIENT_SECRET

	# put in file
	printf "inserting client id into ~/.corki/client_secret... "
	echo $CLIENT_SECRET > $HOME/.corki/client_secret
	echo "done"
fi

# note: reddit oauth2 id is hard-coded in ./web/pages/user.js
# reddit oauth2 secret
if [ ! -f $HOME/.corki/reddit_secret ]; then
	# get token
	printf "Enter reddit secret: "
	read REDDIT_SECRET

	# put in file
	printf "inserting client id into ~/.corki/reddit_secret... "
	echo $REDDIT_SECRET > $HOME/.corki/reddit_secret
	echo "done"
fi

# discord bots list api key
if [ ! -f $HOME/.corki/dbl_api_key ]; then
	printf "Enter Discord Bots List API key: "
	read DBL_API_KEY

	printf "inserting key into ~/.corki/dbl_api_key... "
	echo $DBL_API_KEY > $HOME/.corki/dbl_api_key
	echo "done"
fi


# required commands
if ! [ -x "$(command -v convert)" ]; then
	echo "Error: imagemagick not installed"
	exit 1
fi

if ! [ -x "$(command -v forever)" ]; then
	echo "Error: forever not installed"
	echo "run \"sudo npm install -g forever\""
	exit 1
fi


# compile lol mastery log tool
printf "Compiling native components... "
# g++ lol/mastery_log_native/*.cpp -O3 -g -Wall -Wextra -o "$HOME/.corki/lol_mastery_log_tool"
echo "done"

# Initialize mastery cache
if [ ! -f $HOME/.corki/lol_mastery_cache.json ]; then
	printf "creating mastery cache..."
	echo "{}" > $HOME/.corki/lol_mastery_cache.json
	echo "done"
fi

# install dependencies
echo "installing dependencies... "
npm install
