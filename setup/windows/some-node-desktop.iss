#define SrcApp "..\..\backend\dist\win-unpacked\somenode.exe"
#define FileVerStr GetFileVersion(SrcApp)

[Files]
Source: "..\..\backend\dist\win-unpacked\*.*"; DestDir: "{app}\"; Flags: ignoreversion  recursesubdirs
Source: "ReadMe-desktop.txt"; DestDir: "{app}"; Flags: ignoreversion
Source: "desktop\.env"; DestDir: "{app}"; Flags: ignoreversion
[Setup]
InternalCompressLevel=ultra
OutputBaseFilename=some_node_desktop_64
AppCopyright=Some Code Developer
AppName=Some Node Desktop (64 Bit)
AppVerName=Some Node Desktop {#FileVerStr}
DefaultDirName={commonpf}\Some Node\Desktop
LicenseFile=License-desktop.txt
InfoAfterFile=ReadMe-desktop.txt
InfoBeforeFile=ReadMeStart.txt
DefaultGroupName=Some-Node\Some Node Desktop
OutputDir=.. 
VersionInfoVersion={#FileVerStr}
VersionInfoCompany=Some Code Developer
VersionInfoDescription=Some Node Desktop Setup
Compression=lzma/ultra
AlwaysShowDirOnReadyPage=true
AlwaysShowGroupOnReadyPage=true
ShowLanguageDialog=yes
WizardImageFile=some-node.bmp
WizardSmallImageFile=icon.bmp
AppVersion={#FileVerStr}
SolidCompression=true
VersionInfoTextVersion={#FileVerStr}
SetupLogging=True
UninstallDisplayIcon={app}\somenode.exe
AppPublisher=Some Code Developer
AppPublisherURL=https://www.some-code.com/
AppSupportURL=https://community.some-code.com/
AppUpdatesURL=
AppContact=support@some-code.com
AppSupportPhone=+44 843 886 6102 
VersionInfoCopyright=Some Code Developer
VersionInfoProductName=Some Node Desktop 64 Bit
UninstallDisplayName=Some Node Desktop 64 Bit
ArchitecturesAllowed=x64
ArchitecturesInstallIn64BitMode=x64
PrivilegesRequired=lowest
DisableWelcomePage=no
EnableDirDoesntExistWarning=True
DirExistsWarning=no
ChangesEnvironment=True
DisableDirPage=no
WizardStyle=modern
SignTool=sign
UsedUserAreasWarning=no 

[Dirs]
Name: {app}; Permissions: everyone-full; 

Name: "{commonappdata}\some-node" ; Permissions: everyone-full; 
Name: "{commonappdata}\some-node\files" ; Permissions: everyone-full; 
Name: "{commonappdata}\some-node\log" ; Permissions: everyone-full; 

[Icons]
Name: "{group}\Some Node Desktop"; Filename: "{app}\somenode.exe"; WorkingDir: "{app}"; IconFilename: "{app}\somenode.exe"; IconIndex: 0;

[InnoIDE_Settings]
LogFileOverwrite=false

[ThirdParty]
CompileLogMethod=append

[Run]
Filename: "{app}\somenode.exe"; Flags: postinstall runmaximized nowait shellexec; Description: "Run Some Node";

[UninstallRun]

[UninstallDelete]
Type: files; Name: "{app}\*.txt"
Type: files; Name: "{commonappdata}\some-node\log\*.*"
Type: files; Name: "{commonappdata}\some-node\files\*.*"

[Code]
// Called just before Setup terminates. Note that this function is called even if the user exits Setup before anything is installed.
procedure DeinitializeSetup();
var
  logfilepathname, logfilename, newfilepathname: string;
begin
  logfilepathname := ExpandConstant('{log}');
  logfilename := ExtractFileName(logfilepathname);
  // Set the new target path as the directory where the installer is being run from
  try
   newfilepathname := ExpandConstant('{app}\') + logfilename;
   FileCopy(logfilepathname, newfilepathname, false);
  except
  end;
end;

#ifdef UNICODE
  #define AW "W"
#else
  #define AW "A"
#endif
type
  HINSTANCE = THandle;

procedure ExitProcess(uExitCode: UINT);
  external 'ExitProcess@kernel32.dll stdcall';
function ShellExecute(hwnd: HWND; lpOperation: string; lpFile: string;
  lpParameters: string; lpDirectory: string; nShowCmd: Integer): HINSTANCE;
  external 'ShellExecute{#AW}@shell32.dll stdcall';

var
  Elevated: Boolean;
  PagesSkipped: Boolean;

function CmdLineParamExists(const Value: string): Boolean;
var
  I: Integer;  
begin
  Result := False;
  for I := 1 to ParamCount do
    if CompareText(ParamStr(I), Value) = 0 then
    begin
      Result := True;
      Exit;
    end;
end;

function SkipServiceDetailsPage (Sender: TWizardPage): Boolean;
begin
  Result := true;
end; 

procedure InitializeWizard;
begin
  { initialize our helper variables }
  Elevated := CmdLineParamExists('/ELEVATE');
  PagesSkipped := False;
 end;

function ShouldSkipPage(PageID: Integer): Boolean;
begin
   { if we've executed this instance as elevated, skip pages unless we're }
   { on the selection page }
     Result := not PagesSkipped and Elevated;
       { if we've reached the directory selection page, set our flag variable }
  if not Result then
    PagesSkipped := True;
end;

function NextButtonClick(CurPageID: Integer): Boolean;
var
  Params: string;
  RetVal: HINSTANCE;
begin
  Result := True;

  { if we are on the selection page and we are not running the }
  { instance we've manually elevated, then... }
  if not Elevated and (CurPageID = wpSelectDir) then
  begin
    { pass the already selected directory to the executing parameters and }
    { include our own custom /ELEVATE parameter which is used to tell the }
    { setup to skip all the pages and get to the directory selection page }
    Params := ExpandConstant('/DIR="{app}" /ELEVATE');
    { because executing of the setup loader is not possible with ShellExec }
    { function, we need to use a WinAPI workaround }
    RetVal := ShellExecute(WizardForm.Handle, 'runas',
      ExpandConstant('{srcexe}'), Params, '', SW_SHOW);
    { if elevated executing of this setup succeeded, then... }
    if RetVal > 32 then
    begin
      { exit this non-elevated setup instance }
      ExitProcess(0);
    end
    else
    { executing of this setup failed for some reason; one common reason may }
    { be simply closing the UAC dialog }
    begin
      { handling of this situation is upon you, this line forces the wizard }
      { stay on the current page }
      Result := False;
      { and possibly show some error message to the user }
      MsgBox(Format('Elevating of this setup failed. Code: %d', [RetVal]),
        mbError, MB_OK);
    end;
  end;
end;
