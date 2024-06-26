REM Updates Software version from the file
REM https://www.angusj.com/resourcehacker/

SET OUTPUT_EXE=dist\win-unpacked\somenode.exe

"C:\Program Files (x86)\Resource Hacker\ResourceHacker.exe" -open VersionInfo.rc -save VersionInfo.res ^
 -action compile -log CONSOLE

"C:\Program Files (x86)\Resource Hacker\ResourceHacker.exe" -open %OUTPUT_EXE% -save %OUTPUT_EXE% ^
 -resource VersionInfo.res ^
 -action addoverwrite ^
 -mask VersionInf ^
 -log CONSOLE

REM "C:\Program Files (x86)\Resource Hacker\ResourceHacker.exe" -open %OUTPUT_EXE% -save %OUTPUT_EXE% ^
REM  -resource etl.ico ^
REM  -action addoverwrite ^
REM  -mask ICONGROUP,1,1033 ^
REM  -log CONSOLE

 