# timestamp-stopwatch

## Usage

	# Add timestamp to default or named stopwatch
	ts push
	ts push coffee

	# List timestamps
	ts show
	ts show coffee

	# Reset
	ts reset
	ts reset coffee

`ts show` example output:

	Timestamp		Since prev	Since first
	2021-05-19 20:08:16		
	2021-05-19 20:10:00	00:01:44	00:01:44
	2021-05-19 20:10:20	00:00:20	00:02:04
	2021-05-19 20:18:39	00:08:19	00:10:23
	Now			00:00:15	00:10:38

	# List stopwatches
	ts list

## Installation

	git clone --depth 1 https://github.com/fredrik01/ts.git ~/.ts

Add this to your `.zshrc` or `.bashrc`

	PATH+=~/.ts

## Update

	cd ~/.ts && git pull
