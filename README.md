# PasswordPrison

PasswordPrison is a cross-platform desktop password manager built with Tauri, React, TypeScript, and Rust. It stores vault items locally and encrypts saved passwords before writing them to disk.

## Features

- Create, edit, favourite, and delete password items
- Organise items by category
- Search items by name, username, or URL
- Generate usernames, passwords, and PINs
- Move items to trash and remove them permanently
- Encrypt vault passwords with AES-GCM
- Derive encryption keys from the master key using Argon2
- Build native desktop bundles for macOS, Windows, and Linux

## Technology

- **Frontend:** React, TypeScript, Vite
- **Desktop runtime:** Tauri 2
- **Backend:** Rust
- **Cryptography:** AES-GCM and Argon2
- **Storage:** Local JSON vault file managed by the Rust backend

## Prerequisites

Install the following before developing locally:

- [Node.js](https://nodejs.org/) 22 or later
- npm
- [Rust](https://www.rust-lang.org/tools/install) with Cargo
- The [Tauri prerequisites](https://v2.tauri.app/start/prerequisites/) for your operating system

On macOS, install Xcode Command Line Tools. Windows and Linux require additional Tauri system dependencies; see the Tauri prerequisites guide for the current list.

> **Note:** These prerequisites are only required for development. Users installing a released PasswordPrison application do not need Node.js, Rust, npm, Cargo, or the Tauri CLI installed.

## Installation

Download the latest release for your operating system from the project's [GitHub Releases](https://github.com/johnathantam/PasswordPrison/releases) page.

- **macOS:** `.dmg`
- **Windows:** `.msi` or `.exe`
- **Linux:** platform-specific packages

### macOS

macOS releases are provided as `.dmg` files.

1. Download the latest `.dmg` file.
2. Open the `.dmg`.
3. Drag **PasswordPrison** into the **Applications** folder.
4. Open the **Applications** folder and launch PasswordPrison.

PasswordPrison is currently distributed without Apple Developer ID signing and notarization, so macOS may display a security warning.

#### If macOS says the developer cannot be verified

1. Try opening PasswordPrison once.
2. Close the security warning.
3. Open **System Settings > Privacy & Security**.
4. Scroll to the **Security** section.
5. Click **Open Anyway** next to the PasswordPrison message.
6. Confirm that you want to open the application.

You can also Control-click PasswordPrison in the Applications folder, select **Open**, and then confirm the warning.

#### If macOS says the application is damaged

On some systems, macOS may display:

> "PasswordPrison is damaged and can't be opened."

If you downloaded PasswordPrison from a source you trust, you can remove the macOS quarantine attribute using Terminal:

```bash
xattr -d com.apple.quarantine /Applications/Password\ Prison.app
```

### Windows

Windows releases are provided as `.msi` and `.exe` (NSIS) installers.

1. Download the latest `.msi` or `.exe` file.
2. Double-click the installer to launch it.
3. Follow the setup wizard, accepting the default options unless you need a custom install location.
4. Launch PasswordPrison from the Start Menu or desktop shortcut once installation finishes.

PasswordPrison is currently distributed without a Windows code-signing certificate, so Windows may display a SmartScreen warning during installation.

#### If Windows says "Windows protected your PC" (SmartScreen)

1. On the SmartScreen prompt, click **More info**.
2. Click **Run anyway**.
3. Continue through the installer as normal.

#### If your antivirus flags the installer

Unsigned applications are sometimes flagged by antivirus software as a precaution rather than due to detected malicious behavior. If you downloaded PasswordPrison from the official [GitHub Releases](https://github.com/johnathantam/PasswordPrison/releases) page and trust the source, you can allow the file through your antivirus or add an exclusion for it. Consult your antivirus software's documentation for how to do this.

### Linux

Linux releases are provided as `.AppImage`, `.deb`, and `.rpm` packages, depending on what is published for a given release. Check the Releases page for the exact set of formats available.

#### AppImage

1. Download the `.AppImage` file.
2. Make it executable:

   ```bash
   chmod +x PasswordPrison_*.AppImage
   ```

3. Run it directly:

   ```bash
   ./PasswordPrison_*.AppImage
   ```

#### Debian / Ubuntu (.deb)

1. Download the `.deb` file.
2. Install it with `apt`:

   ```bash
   sudo apt install ./PasswordPrison_*.deb
   ```

3. Launch PasswordPrison from your application menu, or run `passwordprison` from a terminal.

#### Fedora / RHEL (.rpm)

1. Download the `.rpm` file.
2. Install it with `dnf`:

   ```bash
   sudo dnf install ./PasswordPrison-*.rpm
   ```

3. Launch PasswordPrison from your application menu, or run `passwordprison` from a terminal.

#### If the AppImage won't run

Some distributions need FUSE installed to run AppImages directly:

```bash
sudo apt install libfuse2
```

If FUSE isn't available or you'd rather not install it, extract and run the AppImage instead:

```bash
./PasswordPrison_*.AppImage --appimage-extract
./squashfs-root/AppRun
```