#!/bin/sh


## this script is used to run the bot
## in addition it helps to maintain privacy of our bot token


export DISCORD_TOKEN=token goes here

# gets run after Corki is killed
function cleanup {
	printf "Killing Corki... "
	kill $CORKI_PID
	printf "done\n"
}

# run cleanup before exiting
trap cleanup EXIT

# gets run before Corki is started
printf "Spawning Corki... "

# start Corki & mark his PID
node index.js &
CORKI_PID=$!

printf "done\n"

# wait for eternity... unless they kill me...
cat

# this should never get run
echo "Corki -> error -> cat abuse..."
