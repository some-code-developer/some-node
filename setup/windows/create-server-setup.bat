cd "../../backend"

call build-server.bat
call set-version-server.bat

cd "../setup/windows"

"C:\Program files (x86)\Inno Setup 6\iscc.exe" "some-node-server.iss"  

cd..

"C:\Program Files\7-Zip\7z.exe" a -tzip "some_node_server_64.zip" "some_node_server_64.exe"  

del /Q some_node_server_64.exe

cd "../backend"

del /Q some_node.exe
