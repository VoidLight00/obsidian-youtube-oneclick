# YouTube OneClick Timestamp

An Obsidian plugin that lets you **click timestamp links** to instantly jump to that point in embedded YouTube videos. No context menu required - just click and go.

## Features

- **One-click navigation**: Click `[play 12:34]()` to jump to 12:34 in the video
- **Multiple formats**: Supports `play`, `▶️`, and `▶` prefixes
- **Auto-play option**: Automatically starts playing after seeking
- **Works everywhere**: Reading View and Live Preview modes
- **Keyboard shortcuts**: Control video playback with hotkeys

## Installation

### BRAT (Recommended)

1. Install [BRAT](https://github.com/TfTHacker/obsidian42-brat) plugin
2. Open Settings → BRAT → Add Beta Plugin
3. Enter: `voidlight/obsidian-youtube-oneclick`
4. Enable the plugin

### Manual Installation

1. Download `main.js`, `manifest.json` from [Releases](https://github.com/voidlight/obsidian-youtube-oneclick/releases)
2. Create folder: `<vault>/.obsidian/plugins/obsidian-youtube-oneclick/`
3. Copy downloaded files into the folder
4. Enable plugin in Settings → Community Plugins

## Usage

### Timestamp Format

Use these formats in your notes:

```markdown
[play 0:00]()
[play 12:34]()
[play 1:23:45]()
[▶️ 5:30]()
[▶ 10:00]()
```

### Example Note

```markdown
# Video Notes

<iframe src="https://www.youtube.com/embed/dQw4w9WgXcQ?enablejsapi=1" width="560" height="315"></iframe>

## Timestamps
- [play 0:00]() - Intro
- [play 0:30]() - First verse
- [play 1:00]() - Chorus
- [play 2:15]() - Bridge
```

### Important: enablejsapi

For the plugin to control the iframe, the URL must include `enablejsapi=1`:

```
https://www.youtube.com/embed/VIDEO_ID?enablejsapi=1
```

The plugin will automatically add this parameter if missing.

## Settings

| Setting | Description | Default |
|---------|-------------|---------|
| Show success notice | Display notification after jumping | Off |
| Auto-play after seek | Start playing after jumping to timestamp | On |

## Keyboard Shortcuts

Configure these in Settings → Hotkeys:

| Command | Description |
|---------|-------------|
| Toggle play/pause | Play or pause the video |
| Seek back 5 seconds | Rewind 5 seconds |
| Seek forward 5 seconds | Fast forward 5 seconds |

## Troubleshooting

### Video doesn't respond to clicks

1. Check that iframe URL includes `enablejsapi=1`
2. Ensure the video has finished loading
3. Try refreshing the note (Cmd+E twice)

### "No YouTube video found"

The plugin looks for YouTube iframes in the current note. Make sure:
- The iframe is embedded, not just a link
- The src contains `youtube.com` or `youtube-nocookie.com`

### Timestamp not recognized

Ensure format is exactly:
- `[play MM:SS]()`
- `[▶️ MM:SS]()`
- `[▶ MM:SS]()`

With empty parentheses `()` at the end.

## Development

```bash
# Clone repository
git clone https://github.com/voidlight/obsidian-youtube-oneclick.git
cd obsidian-youtube-oneclick

# Install dependencies
npm install

# Build for production
npm run build

# Development mode (watch)
npm run dev
```

## License

MIT License - see [LICENSE](LICENSE)

---

# YouTube OneClick Timestamp (한국어)

옵시디언에서 타임스탬프 링크를 **클릭만 하면** 임베드된 YouTube 영상의 해당 시간으로 바로 이동하는 플러그인입니다.

## 기능

- **원클릭 네비게이션**: `[play 12:34]()`를 클릭하면 12:34로 이동
- **다양한 포맷**: `play`, `▶️`, `▶` 접두사 지원
- **자동 재생**: 이동 후 자동으로 재생 시작 (설정 가능)
- **어디서나 동작**: Reading View와 Live Preview 모드 모두 지원

## 사용법

노트에 다음과 같이 작성:

```markdown
# 영상 노트

<iframe src="https://www.youtube.com/embed/VIDEO_ID?enablejsapi=1" width="560" height="315"></iframe>

## 타임스탬프
- [play 0:00]() - 인트로
- [play 5:30]() - 핵심 내용
- [play 10:15]() - 결론
```

타임스탬프 링크를 클릭하면 해당 시간으로 즉시 이동합니다.

## 설치

1. BRAT 플러그인 설치
2. Settings → BRAT → Add Beta Plugin
3. `voidlight/obsidian-youtube-oneclick` 입력
4. 플러그인 활성화
