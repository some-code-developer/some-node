#!/usr/bin/env bash

echo 'Some Node Server'
SECONDS=0

cd ../../frontend-react-vanilla-js/
yarn
yarn run prd
cd ../backend

yarn install --production --frozen-lockfile
pkg -t node20-linux-x64 . --compress brotli 
cp some_node ../setup/linux/some-node-server-amd64/opt/some-code.com/some-node
cp -r public ../setup/linux/some-node-server-amd64/opt/some-code.com/some-node

cd ../setup/linux
cp .env ./some-node-server-amd64/opt/some-code.com/some-node

dpkg-deb --build some-node-server-amd64

rm ../some-node-server-amd64.deb
cp some-node-server-amd64.deb ../

# Clean Up

rm ./some-node-server-amd64.deb
rm -r ./some-node-server-amd64/opt/some-code.com/some-node/public
rm ./some-node-server-amd64/opt/some-code.com/some-node/.env
rm ./some-node-server-amd64/opt/some-code.com/some-node/*.*  
rm ./some-node-server-amd64/opt/some-code.com/some-node/some_node
cd ../../backend
rm ./some_node

duration=$SECONDS
echo "$(($duration / 60)) minutes and $(($duration % 60)) seconds elapsed."


# INSTALLATION
# sudo apt install ./some-node-server-amd64.deb
# sudo systemctl enable some-node-server
# sudo systemctl start  some-node-server
# sudo systemctl stop   some-node-server

# CLEAN UP 
# sudo apt remove some-node-server
