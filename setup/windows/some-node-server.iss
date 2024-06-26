#define SrcApp "..\..\backend\some_node.exe"
#define FileVerStr GetFileVersion(SrcApp)

[Files]
Source: "..\..\backend\public\*.*"; DestDir: "{app}\public"; Flags: ignoreversion  recursesubdirs
Source: "ReadMe-server.txt"; DestDir: "{app}"; Flags: ignoreversion
Source: "raas.ini"; DestDir: "{app}"; Flags: ignoreversion
Source: "server\.env"; DestDir: "{app}"; Flags: ignoreversion
Source: "raas.exe"; DestDir: "{app}"; Flags: ignoreversion sign uninsremovereadonly
Source: "..\..\backend\some_node.exe"; DestDir: "{app}"; Flags: ignoreversion sign

[Setup]
InternalCompressLevel=ultra
OutputBaseFilename=some_node_server_64
AppCopyright=Some Code Developer
AppName=Some Node Server (64 Bit)
AppVerName=Some Node Server {#FileVerStr}
DefaultDirName={commonpf}\Some Node\Server
LicenseFile=License-server.txt
InfoAfterFile=ReadMe-server.txt
InfoBeforeFile=ReadMeStart.txt
DefaultGroupName=Some-Node\Some Node Server
OutputDir=..
VersionInfoVersion={#FileVerStr}
VersionInfoCompany=Some Code Developer
VersionInfoDescription=Some Node Server Setup
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
AppPublisherURL=
AppSupportURL=
AppUpdatesURL=
AppContact=support@some-code.com
AppSupportPhone=
VersionInfoCopyright=Some Code Developer
VersionInfoProductName=Some Node Server 64 Bit
UninstallDisplayName=Some Node Server 64 Bit
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
Name: {app}\public; Permissions: everyone-full; 
Name: "{commonappdata}\some-node" ; Permissions: everyone-full; 
Name: "{commonappdata}\some-node\files" ; Permissions: everyone-full; 
Name: "{commonappdata}\some-node\log" ; Permissions: everyone-full; 

[Icons]
Name: "{group}\Uninstall Some Node Server"; Filename: "{uninstallexe}"

[InnoIDE_Settings]
LogFileOverwrite=false

[ThirdParty]
CompileLogMethod=append

[Run]
Filename: "services.msc"; WorkingDir: "{app}"; Flags: postinstall runmaximized nowait shellexec; Description: "Run Service Manager";
Filename: "{app}\raas.exe"; Parameters: "/INSTALL /SILENT USER={code:GetUser} PASSWORD={code:GetPassword}"; Flags: shellexec hidewizard runmaximized waituntilterminated dontlogparameters

[UninstallRun]
Filename: "{app}\raas.exe"; Parameters: "/STOP"; Flags: skipifdoesntexist waituntilterminated runhidden; RunOnceId: "StopService"
Filename: "{app}\raas.exe"; Parameters: "/UNINSTALL /SILENT"; Flags: skipifdoesntexist waituntilterminated runhidden; RunOnceId: "DelService"

[UninstallDelete]
Type: files; Name: "{commonappdata}\some-node\log\*.*"
Type: files; Name: "{commonappdata}\some-node\files\*.*"
Type: files; Name: "{app}\*.*"

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

const  
  LOGON32_LOGON_INTERACTIVE = 2;
  LOGON32_LOGON_NETWORK = 3;
  LOGON32_LOGON_BATCH = 4;
  LOGON32_LOGON_SERVICE = 5;
  LOGON32_LOGON_UNLOCK = 7;
  LOGON32_LOGON_NETWORK_CLEARTEXT = 8;
  LOGON32_LOGON_NEW_CREDENTIALS = 9;

  LOGON32_PROVIDER_DEFAULT = 0;
  LOGON32_PROVIDER_WINNT40 = 2;
  LOGON32_PROVIDER_WINNT50 = 3;

  ERROR_SUCCESS = 0;
  ERROR_LOGON_FAILURE = 1326;

function LogonUser(lpszUsername, lpszDomain, lpszPassword: string;
  dwLogonType, dwLogonProvider: DWORD; var phToken: THandle): BOOL;
  external 'LogonUser{#AW}@advapi32.dll stdcall';

procedure ExitProcess(uExitCode: UINT);
  external 'ExitProcess@kernel32.dll stdcall';
function ShellExecute(hwnd: HWND; lpOperation: string; lpFile: string;
  lpParameters: string; lpDirectory: string; nShowCmd: Integer): HINSTANCE;
  external 'ShellExecute{#AW}@shell32.dll stdcall';

var
  Elevated: Boolean;
  PagesSkipped: Boolean;
  ServiceDetailsPage: TInputQueryWizardPage;

function TryLogonUser(const Domain, UserName, Password: string; 
  var ErrorCode: Longint): Boolean;
var
  Token: THandle;
begin
  Result := LogonUser(UserName, Domain, Password, LOGON32_LOGON_INTERACTIVE,
    LOGON32_PROVIDER_DEFAULT, Token);
  ErrorCode := DLLGetLastError;
end;

function GetUser(Value: string): string;
begin
  Result := ServiceDetailsPage.Values[0];
end;

function GetPassword(Value: string): string;
begin
  Result := ServiceDetailsPage.Values[1];
end;

procedure ParseDomainUserName(const Value: string; var Domain,
  UserName: string);
var
  DelimPos: Integer;
begin
  DelimPos := Pos('\', Value);
  if DelimPos = 0 then
  begin
    Domain := '.';
    UserName := Value;
  end
  else
  begin
    Domain := Copy(Value, 1, DelimPos - 1);
    UserName := Copy(Value, DelimPos + 1, MaxInt);
  end;
end;

function ServerDetailsLogonUser: Boolean; 
var
  Domain: string;
  UserName: string;
  Password: string;
  ErrorCode: Longint;
begin
  ParseDomainUserName(ServiceDetailsPage.Values[0], Domain, UserName);
  Password := ServiceDetailsPage.Values[1];
  Result := TryLogonUser(Domain, UserName, Password, ErrorCode);

  case ErrorCode of
    ERROR_SUCCESS:
      exit;
    ERROR_LOGON_FAILURE:
      MsgBox('The user name or password is incorrect!', mbError, MB_OK);
  else
    MsgBox('Login failed!' + #13#10 + SysErrorMessage(DLLGetLastError),
      mbError, MB_OK);
  end;
end;

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
var
  UserName: string;
begin
  { initialize our helper variables }
  Elevated := CmdLineParamExists('/ELEVATE');
  PagesSkipped := False;

  {Services user}
  UserName := AddBackslash(GetEnv('USERDOMAIN')) + GetUserNameString;
  ServiceDetailsPage := CreateInputQueryPage(wpSelectTasks, 
    '', '', 'Please enter accout details for running services.');
  ServiceDetailsPage.Add('Domain Name\User Name', False);
  ServiceDetailsPage.Add('Password', True);
  ServiceDetailsPage.Values[0] := UserName; 
  //ServiceDetailsPage.OnShouldSkipPage := @SkipServiceDetailsPage;
 end;

function ShouldSkipPage(PageID: Integer): Boolean;
begin
   { if we've executed this instance as elevated, skip pages unless we're }
   { on the selection page }
     Result := not PagesSkipped and Elevated and (PageID <> ServiceDetailsPage.ID);
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
  if CurPageID = ServiceDetailsPage.ID then
     Result := ServerDetailsLogonUser;

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

