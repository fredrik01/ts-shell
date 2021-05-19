# timestamp-stopwatch

## Usage

	# Add entry
	ts push

	# List timestamps
	ts list

	# Reset
	ts reset

`ts list` example output:

	Timestamp		Since prev	Since first
	2021-05-19 20:08:16		
	2021-05-19 20:10:00	00:01:44	00:01:44
	2021-05-19 20:10:20	00:00:20	00:02:04
	Now			00:00:10	00:02:14

## Installation

	git clone https://github.com/fredrik01/ts.git ~/.ts

Add this to your .zshrc or .bashrc

	path+=~/.ts

## Update

	cd ~/.ts && git pull
