#NoEnv
#SingleInstance Force
DetectHiddenWindows On

scriptTitle := "Natro Macro (Zyn UI Mode - Background)"
hwnd := WinExist(scriptTitle " ahk_class AutoHotkey")

if (hwnd)
{
    PostMessage 0x5550, 1, 0, , "ahk_id " hwnd
    ExitApp
}
else
{
    ExitApp 1
}
