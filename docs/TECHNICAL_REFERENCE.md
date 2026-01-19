# Technical Reference - YouTube Iframe Control

## Core Concept: postMessage API

YouTube iframes can be controlled via the HTML5 `postMessage` API.
No external library needed - direct browser API communication.

### Essential postMessage Format

```javascript
// Send command to YouTube iframe
iframe.contentWindow.postMessage(JSON.stringify({
  event: 'command',
  func: 'seekTo',
  args: [seconds, true]  // [time, allowSeekAhead]
}), '*');

// Other commands
// Play: func: 'playVideo', args: []
// Pause: func: 'pauseVideo', args: []
// Stop: func: 'stopVideo', args: []
```

### iframe Requirements

For postMessage to work, iframe src must include:
- `enablejsapi=1` parameter

Example valid src:
```
https://www.youtube.com/embed/VIDEO_ID?enablejsapi=1
```

### seekTo Method Details

```javascript
seekTo(seconds: number, allowSeekAhead: boolean)

// seconds: Target time position (supports decimals)
// allowSeekAhead: 
//   - true: Fetch new content if beyond buffer
//   - false: Only seek within buffered content (use during dragging)
```

### Player States

```javascript
-1: unstarted
0: ended
1: playing
2: paused
3: buffering
5: video cued
```

## Obsidian-Specific Considerations

### Link Click Interception

In Obsidian, internal links like `[text]()` trigger navigation.
Must intercept before default behavior:

```typescript
this.registerDomEvent(document, 'click', (evt: MouseEvent) => {
  const target = evt.target as HTMLElement;
  
  // Check if it's an internal link
  if (target.matches('a.internal-link')) {
    const linkText = target.textContent;
    
    if (isTimestampLink(linkText)) {
      evt.preventDefault();
      evt.stopPropagation();
      // Handle timestamp
    }
  }
});
```

### Finding iframes in Markdown View

```typescript
const view = this.app.workspace.getActiveViewOfType(MarkdownView);
if (view) {
  const container = view.contentEl;
  const iframes = container.querySelectorAll('iframe');
  
  // Find YouTube iframe
  for (const iframe of iframes) {
    if (iframe.src.includes('youtube.com') || 
        iframe.src.includes('youtube-nocookie.com')) {
      return iframe;
    }
  }
}
```

### Ensuring enablejsapi

If iframe doesn't have enablejsapi=1, we need to add it:

```typescript
function ensureJsApi(iframe: HTMLIFrameElement): void {
  const url = new URL(iframe.src);
  if (!url.searchParams.has('enablejsapi')) {
    url.searchParams.set('enablejsapi', '1');
    iframe.src = url.toString();
  }
}
```

## Timestamp Parsing

### Supported Formats

| Format | Regex | Example | Seconds |
|--------|-------|---------|---------|
| MM:SS | `(\d{1,2}):(\d{2})` | 12:34 | 754 |
| HH:MM:SS | `(\d{1,2}):(\d{2}):(\d{2})` | 1:23:45 | 5025 |
| SS | `(\d+)` | 45 | 45 |

### Parser Implementation

```typescript
function parseTimestamp(timeStr: string): number | null {
  // HH:MM:SS
  let match = timeStr.match(/^(\d{1,2}):(\d{2}):(\d{2})$/);
  if (match) {
    return parseInt(match[1]) * 3600 + 
           parseInt(match[2]) * 60 + 
           parseInt(match[3]);
  }
  
  // MM:SS
  match = timeStr.match(/^(\d{1,2}):(\d{2})$/);
  if (match) {
    return parseInt(match[1]) * 60 + parseInt(match[2]);
  }
  
  // SS only
  match = timeStr.match(/^(\d+)$/);
  if (match) {
    return parseInt(match[1]);
  }
  
  return null;
}
```

## Limitations & Gotchas

1. **iframe must be loaded**: postMessage fails if iframe not ready
2. **enablejsapi required**: Without it, commands are ignored
3. **Cross-origin**: Can only use postMessage, not direct iframe.contentDocument access
4. **Buffering state**: seekTo may not work during buffering
5. **Player size**: Minimum 200x200 pixels

## npm Package Alternative: youtube-player

If postMessage becomes unreliable, consider:

```bash
npm install youtube-player
```

Benefits:
- Promise-based API
- Automatic command queuing until ready
- TypeScript types included
- Event emitter pattern

```typescript
import YouTubePlayer from 'youtube-player';

const player = YouTubePlayer(iframeElement);
await player.seekTo(seconds);
```
