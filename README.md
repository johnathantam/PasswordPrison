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

## Getting Started

Clone the repository and install the JavaScript dependencies:

```bash
git clone https://github.com/johnathantam/PasswordPrison.git
cd PasswordPrison
npm ci
```

Start the desktop application in development mode:

```bash
npm run tauri dev
```

The frontend can also be run by itself with:

```bash
npm run dev
```

## Available Commands

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite development server |
| `npm run build` | Type-check and build the frontend |
| `npm run preview` | Preview the production frontend build |
| `npm run tauri dev` | Start the Tauri desktop app in development mode |
| `npm run tauri build` | Build native installers for the current operating system |

## Project Structure

```text
src/
	components/       React pages and reusable UI components
	enums/            Shared frontend enums
	types/            Shared frontend data types
src-tauri/
	commands/         Tauri commands exposed to the frontend
	crypto/           Encryption, decryption, key derivation, salts, and nonces
	models/           Rust vault models
	storage/          Local vault directory and file handling
```

The frontend communicates with Rust through Tauri commands. Vault file access and cryptographic operations are kept in the Rust backend rather than performed directly in the browser UI.

## Local Vault Storage

PasswordPrison creates its application data directory through Tauri's `app_data_dir()` and stores the vault in a file named `vault.dat`. The exact directory depends on the operating system.

Deleting the installed application does not necessarily delete this application data directory. A future uninstall or account-removal flow should explicitly explain whether it also deletes the vault, and should require confirmation before doing so.

## Releases With GitHub Actions

The release workflow in `.github/workflows/release.yml` runs when a version tag beginning with `v` is pushed. It builds native bundles on Linux, macOS, and Windows, then publishes the installers to a GitHub Release.

Create and push a tag after updating the version in `package.json` and `src-tauri/tauri.conf.json`:

```bash
git tag v0.1.0
git push origin v0.1.0
```

The workflow requires the repository's standard `GITHUB_TOKEN`, which GitHub Actions provides automatically. The generated release assets vary by platform and bundle target, such as `.dmg`, `.msi` or `.exe`, and Linux packages.

## Security Notes

PasswordPrison is under active development. Review the implementation and back up your vault before relying on it for important credentials.

- The vault is stored locally on the device; there is no sync service yet.
- Losing the master key may make encrypted passwords unrecoverable.
- Uninstalling the application and deleting vault data are separate operations on most operating systems.
- Deleting a file does not guarantee that every copy is removed from backups or storage media.

## Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/)
- [Tauri VS Code extension](https://marketplace.visualstudio.com/items?itemName=tauri-apps.tauri-vscode)
- [rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer)
