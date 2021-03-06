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

function _fromTimestamp {
  if [ "$(_os)" == 'Mac' ]; then
    date -r "$1" -u +"$2"
  else
    date -d@"$1" -u +"$2"
  fi
}

function _toTimestamp {
  if [ "$(_os)" == 'Mac' ]; then
    date -j -f "$2" "$1" "+%s"
  else
    date -d "$1" +%s
  fi
}

function _timestampFile {
  suffix=${1:-default}
  if [ "$suffix" != '' ]; then
    suffix="-$suffix"
  fi
  echo "$HOME/.ts/.timestamps$suffix"
}

function _timestampFiles {
  for n in "$HOME"/.ts/.timestamps-*; do
    path=$(printf '%s\n' "$n")
    # Get part after ".timestamps-"
    sed -e 's#.*timestamps-\(\)#\1#' <<< "$path"
  done
}

# --------------------------------------------------------------

# Save timestamp
function save {
  time=$(date +"%Y-%m-%d %H:%M:%S")
  echo "$time" >> "$(_timestampFile "$1")"
  echo "Timestamp saved"
  echo "$time"
}

# Show timestamps for a stopwatch
function show {
  logFile="$(_timestampFile "$1")"
  if [ ! -f "$logFile" ]; then
    echo "No timestamps found"
    exit 0
  fi

  echo -e "Timestamp\t\tSince prev\tSince first"

  first=''
  prev=''
  while read dateAndTime; do
    timestamp=$(_toTimestamp "$dateAndTime" '%Y-%m-%d %H:%M:%S')
    diffSinceFirst=''
    diffSincePrev=''

    if [ "$first" == '' ]; then
      first=$timestamp
    else
      diffSinceFirst=$(_fromTimestamp $((timestamp - first)) "%H:%M:%S")
    fi

    if [ "$prev" != '' ]; then
      diffSincePrev=$(_fromTimestamp $((timestamp - prev)) "%H:%M:%S")
    fi 

    echo -e "$dateAndTime\t$diffSincePrev\t$diffSinceFirst"

    prev=$timestamp

  done <"$logFile"

  # now=$(date +%s)
  nowDateTime=$(date +"%Y-%m-%d %H:%M:%S")
  now=$(_toTimestamp "$nowDateTime" "%Y-%m-%d %H:%M:%S")

  sinceLastSave=$(_fromTimestamp $((now-prev)) "%H:%M:%S")
  sinceFirstSave=$(_fromTimestamp $((now-first)) "%H:%M:%S")
  echo -e "Now\t\t\t$sinceLastSave\t$sinceFirstSave"
}

# Delete timestamp file
function reset {
  logFile="$(_timestampFile "$1")"
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

# List stopwatches
function list {
  # Filter out * that _timestampFiles returns when there are no timestamp files
  _timestampFiles | grep -vw "*"
}

# Just cat the log file
function raw {
  cat "$(_timestampFile "$1")"
}

function _help {
  printf "ts [command]\n\nCommands:\n" "${0}"
  compgen -A function | grep -v "^_" | cat -n
}

 "${@:-_help}"
