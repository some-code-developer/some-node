#!/usr/bin/env bash

yarn install --production --frozen-lockfile
pkg -t node20-linux-x64 . --compress brotli 
yarn
