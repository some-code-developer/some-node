#!/usr/bin/env bash
cd setup
rm *.exe
rm *.zip
rm *.deb
rm -r .\Some_Node_Portable\App\SomeNode\
cd ..
cd backend
rm *.exe
rm .\log\*.*
rm .\public\dist\*.*
rm .\public\assets\*.*
rm some_node
rm -r node_modules
rm -r dist
cd ..
cd frontend-react-typescript
rm -r node_modules
cd ..
cd frontend-react-typescript-tailwind
rm -r node_modules
cd ..
cd frontend-react-vanilla-js
rm -r node_modules
cd ..
