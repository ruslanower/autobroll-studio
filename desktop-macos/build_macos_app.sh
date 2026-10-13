#!/bin/bash
set -e

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$DIR"

echo "🎨 [1/4] Generating native Retina AppIcon..."
swift generate_icon.swift
iconutil -c icns AppIcon.iconset -o AppIcon.icns
rm -rf AppIcon.iconset

echo "⚡ [2/4] Compiling native Swift binary..."
swiftc -O -target arm64-apple-macos12.0 main.swift -o "AutoB-Roll Studio"

echo "📦 [3/4] Assembling AutoB-Roll Studio.app bundle..."
APP_NAME="AutoB-Roll Studio.app"
rm -rf "$APP_NAME"
mkdir -p "$APP_NAME/Contents/MacOS"
mkdir -p "$APP_NAME/Contents/Resources"

cp "AutoB-Roll Studio" "$APP_NAME/Contents/MacOS/"
cp "Info.plist" "$APP_NAME/Contents/"
cp "AppIcon.icns" "$APP_NAME/Contents/Resources/"

chmod +x "$APP_NAME/Contents/MacOS/AutoB-Roll Studio"

echo "🚀 [4/4] Installing to ~/Applications & /Applications..."
mkdir -p "$HOME/Applications"
rm -rf "$HOME/Applications/$APP_NAME"
cp -R "$APP_NAME" "$HOME/Applications/"

# Also try to copy to /Applications if writable
if [ -w "/Applications" ]; then
    rm -rf "/Applications/$APP_NAME"
    cp -R "$APP_NAME" "/Applications/"
    echo "✓ Installed to /Applications/$APP_NAME"
else
    echo "✓ Installed to $HOME/Applications/$APP_NAME"
fi

echo "✨ Done! Application ready at:"
echo "   $HOME/Applications/$APP_NAME"
