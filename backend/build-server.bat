cd ..
cd frontend-react-vanilla-js
call build-frontend.bat
cd ..
cd backend
call yarn install --production --frozen-lockfile
call pkg -t node20-win-x64 . --compress brotli
call yarn install 
