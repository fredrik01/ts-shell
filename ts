#!/bin/bash

set -eo pipefail

# https://stackoverflow.com/a/3466183
function _os {
  unameOut="$(uname -s)"
  case "${unameOut}" in
    Linux*)     machine=Linux;;
    Darwin*)    machine=Mac;;
    CYGWIN*)    machine=Cygwin;;
    MINGW*)     machine=MinGw;;
    *)          machine="UNKNOWN:${unameOut}"
  esac
  echo "${machine}"
}

function _formatDate {
  if [ "$(_os)" == 'Mac' ]; then
    # Mac
    date -r "$1" -u +"$2"
  else
    # Linux
    date -d@"$1" -u +"$2"
  fi
}

# --------------------------------------------------------------

logFile="$HOME/.ts/.timestamps"

function push {
	date +%s >> "$logFile"
}

function list {
  if [ ! -f "$logFile" ]; then
    echo "No timer started"
    exit 0
  fi

  echo -e "Timestamp\t\tSince prev\tSince first"

  first=''
  prev=''
  while read timestamp; do

    # dateAndTime=$(date -d@"$timestamp" +'%Y-%m-%d %H:%M:%S')
    dateAndTime=$(_formatDate "$timestamp" '%Y-%m-%d %H:%M:%S')
    diffSinceFirst=''
    diffSincePrev=''

    if [ "$first" == '' ]; then
      first=$timestamp
    else
      diffSinceFirst=$(_formatDate $((timestamp - first)) "%H:%M:%S")
    fi

    if [ "$prev" != '' ]; then
      diffSincePrev=$(_formatDate $((timestamp - prev)) "%H:%M:%S")
    fi 

    echo -e "$dateAndTime\t$diffSincePrev\t$diffSinceFirst"

    prev=$timestamp

  done <"$logFile"

  now="$(date +%s)"
  sinceLastPush=$(_formatDate $((now-prev)) "%H:%M:%S")
  sinceFirstPush=$(_formatDate $((now-first)) "%H:%M:%S")
  echo -e "Now\t\t\t$sinceLastPush\t$sinceFirstPush"
}

function reset {
  read -p "Reset timer? " -n 1 -r
  echo # Move to a new line
  if [[ $REPLY =~ ^[Yy]$ ]]; then
    if [ -f "$logFile" ] ; then
      rm "$logFile"
    fi
    echo "Reset successful"
  else
    echo "Aborted"
  fi
}

function _help {
  printf "%s <task> [args]\n\nCommands:\n" "${0}"
  compgen -A function | grep -v "^_" | cat -n
}

 "${@:-_help}"
