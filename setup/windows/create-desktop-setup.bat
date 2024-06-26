cd "../../backend"

call build-desktop.bat
call set-version-desktop.bat

cd "../setup/windows"

"C:\Program files (x86)\Inno Setup 6\iscc.exe" "some-node-desktop.iss"  

cd..

"C:\Program Files\7-Zip\7z.exe" a -tzip "some_node_desktop_64.zip" "some_node_desktop_64.exe"  

del /Q some_node_desktop_64.exe

RD /S /Q "Some_Node_Portable/App/SomeNode"

MD "Some_Node_Portable/App/SomeNode"

Xcopy ..\backend\dist\win-unpacked Some_Node_Portable\App\SomeNode /E /H /C /I

xcopy windows\desktop-portable\.env Some_Node_Portable\App\SomeNode\ /Y
