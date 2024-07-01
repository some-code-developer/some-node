#!/usr/bin/env bash

npm install --production --frozen-lockfile
pkg -t node20-linux-x64 . --compress brotli 
npm install
