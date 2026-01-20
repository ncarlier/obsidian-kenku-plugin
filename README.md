# Kenku Buttons for Obsidian

**Kenku Buttons** is an Obsidian plugin that lets you create interactive buttons in your notes to control [KenkuFM](https://www.kenku.fm/) via its API. With a single click, you can play playlists or soundboards directly from your vault.

## Features

* Add interactive buttons to your notes using a simple Markdown-like syntax
* Play a **playlist** or **soundboard** on KenkuFM by referencing their UUIDs
* Create multiple buttons in a single block
* Customize button labels and actions
* Configure the base URL of your KenkuFM server

## Button Syntax

Use a code block with the language kenku to define one or more buttons. Each line creates a new button.

````markdown
```kenku
id=<UUID>,label=My Playlist,action=play,type=playlist
id=<UUID>,label=Funny Sounds,action=play,type=soundboard
```
````

### Example

````markdown
```kenku
id=123e4567-e89b-12d3-a456-426614174000,label=Epic Music,action=play,type=playlist
id=abcdefab-cdef-abcd-efab-cdefabcdefab,label=Laugh Track,action=play,type=soundboard
```
````

This block will render two buttons: "Epic Music" and "Laugh Track", each triggering the corresponding item in KenkuFM.

## Settings

In the plugin settings, you can configure the **base URL** of your KenkuFM server (e.g., `http://localhost:3333`).

## Supported Parameters

| Parameter | Required           | Description                                            |
| --------- | ------------------ | ------------------------------------------------------ |
| `id`      | ✅                | UUID of the playlist or soundboard to control          |
| `label`   | (default=Music)    | Text shown on the button                               |
| `action`  | (default=play)     | Action to perform (`play` or `stop`)                   |
| `type`    | (defqult=playlist) | Type of item (`playlist` or `soundboard`)              |

## Manually installing the plugin

Copy over `main.js`, `styles.css`, `manifest.json` to your vault `VaultFolder/.obsidian/plugins/obsidian-kenku-plugin/`.

## Development

### Getting started

- Clone this repo.
- Make sure your NodeJS is at least v16 (`node --version`).
- `npm i` or `yarn` to install dependencies.
- `npm run dev` to start compilation in watch mode.

### Building the plugin

```bash
npm run build
```

### Releasing a new version

This plugin uses an automated GitHub workflow to create releases. To release a new version:

1. **Update the version** using npm (this updates `package.json`, `manifest.json`, and `versions.json`):
   ```bash
   npm version patch  # for bug fixes (1.0.0 -> 1.0.1)
   npm version minor  # for new features (1.0.0 -> 1.1.0)
   npm version major  # for breaking changes (1.0.0 -> 2.0.0)
   ```

2. **Commit the version changes**:
   ```bash
   git commit -m "Release version X.Y.Z"
   ```

3. **Push the commit and tags**:
   ```bash
   git push && git push --tags
   ```

4. **GitHub Actions will automatically**:
   - Build the plugin
   - Verify the version matches the tag
   - Create a GitHub release
   - Upload `main.js`, `manifest.json`, and `styles.css` as release assets
   - Generate release notes from commit history

You can then download the release assets and install them manually.

## License

The MIT License (MIT)

See [LICENSE](./LICENSE) to see the full text.
