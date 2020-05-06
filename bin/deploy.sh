#!/bin/sh

set -e

echo $NODE_ENV
# This is run during predeploy
# See firebase.json and
# @url https://firebase.google.com/docs/cli#hooks
# yarn --cwd ./functions/ install --ignore-engines

# echo "Connecting to Firebase..."
firebase use $PROJECT --token $FIREBASE_TOKEN

# echo "Deploying..."
firebase deploy --token $FIREBASE_TOKEN  --only hosting:$TARGET,rules:$TARGET --message "From: $GITHUB_REF" --debug
