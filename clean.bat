CD setup
del /Q "*.exe"
del /Q "*.zip"
del /Q "*.deb"
rmdir ".\Some_Node_Portable\App\SomeNode\" /S /Q
CD ..
CD backend
del /Q "*.exe"
del /Q ".\log\*.*"
del /Q ".\public\dist\*.*"
del /Q ".\public\assets\*.*"
del /Q "some_node"
rmdir "node_modules" /S /Q
rmdir "dist" /S /Q
CD ..
CD frontend-react-typescript
rmdir "node_modules" /S /Q
CD ..
CD frontend-react-typescript-tailwind
rmdir "node_modules" /S /Q
CD ..
CD frontend-react-vanilla-js
rmdir "node_modules" /S /Q
CD ..
