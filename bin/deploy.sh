#!/bin/sh

set -e

# This is run during predeploy
# See firebase.json and
# @url https://firebase.google.com/docs/cli#hooks
# yarn --cwd ./functions/ install --ignore-engines

# echo "Connecting to Firebase..."
firebase use $APP --token $FIREBASE_TOKEN

# echo "Deploying..."
firebase deploy --token $FIREBASE_TOKEN --project $PROJECT --only "hosting" --message "From: $GITHUB_REF"
