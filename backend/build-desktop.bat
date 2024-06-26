cd ..
cd frontend-react-vanilla-js
call build-frontend.bat
cd ..
cd backend
call yarn install
call yarn run electron-pack 