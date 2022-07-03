#!/bin/sh
# dotnet publish -r macos-arm64 --self-contained false
dotnet publish -r osx.12-arm64 -p:PublishReadyToRun=true -p:PublishTrimmed=true --self-contained false