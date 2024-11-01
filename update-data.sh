#!/bin/sh
# Set Node version
# export NVM_DIR=$HOME/.nvm;
# source $NVM_DIR/nvm.sh;
# nvm use --lts # Use latest Node.js version

# Data pipeline updates
node inputs/fec/fetch.js
node inputs/coverage/fetch.js

node process/legislative-candidates.js
node process/main.js
node process/make-candidate-list.js