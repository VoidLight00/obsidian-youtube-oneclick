# Obsidian YouTube OneClick Timestamp Plugin - Development Prompts Guide

This document contains structured prompts for each development phase.
Execute prompts sequentially using Claude/AI assistant.

---

## Phase 1: Project Initialization

### Prompt 1-1: Requirements & Project Structure

```
Create an Obsidian plugin with the following specifications:

**Goal**:
- When clicking [play 0:00]() or [play MM:SS]() formatted markdown links
- Automatically seek to that timestamp in embedded YouTube iframe in the same note
- Direct click activation (no context menu needed)

**Requirements**:
1. Project structure using obsidian-sample-plugin template
2. TypeScript-based development
3. Support for both Reading View and Live Preview mode
4. Compatible with Obsidian API v1.x

**Deliverables**:
- Complete folder structure
- package.json with all dependencies
- tsconfig.json configuration
- manifest.json for Obsidian
- Basic main.ts skeleton
```

### Prompt 1-2: Development Environment Setup

```
Set up the development environment:

1. Initialize npm project in /Users/voidlight/dev/obsidian-youtube-oneclick
2. Install dependencies:
   - obsidian (types only)
   - typescript
   - esbuild
   - @types/node
3. Create build scripts in package.json
4. Create symbolic link to vault plugins directory:
   /Users/voidlight/Documents/암흑물질/.obsidian/plugins/obsidian-youtube-oneclick
5. Set up hot reload configuration
```

---

## Phase 2: Core Implementation

### Prompt 2-1: Timestamp Parser Module

```
Create src/utils/timestampParser.ts with:

**Function**: parseTimestampLink(linkText: string): number | null

**Supported formats**:
- [play 0:00]() -> 0 seconds
- [play 12:34]() -> 754 seconds  
- [play 1:23:45]() -> 5025 seconds
- [play HH:MM:SS]() format

**Features**:
- Regex pattern matching for timestamp detection
- Error handling for invalid formats
- TypeScript types for all inputs/outputs
- Unit test examples

**Regex pattern**: /\[(?:play|▶️)\s*(\d{1,2}):(\d{2})(?::(\d{2}))?\]\(\)/
```

### Prompt 2-2: YouTube Controller Module

```
Create src/utils/youtubeController.ts with:

**Class**: YouTubeController

**Methods**:
- findYouTubeIframe(container: HTMLElement): HTMLIFrameElement | null
- seekTo(iframe: HTMLIFrameElement, seconds: number): void
- isYouTubeUrl(src: string): boolean

**Implementation details**:
- Use postMessage API for iframe communication
- Handle YouTube IFrame API protocol
- Support both youtube.com and youtube-nocookie.com
- Include error handling for missing iframes

**YouTube postMessage format**:
{
  event: 'command',
  func: 'seekTo',
  args: [seconds, true]
}
```

### Prompt 2-3: Click Event Interceptor

```
Implement click event handling in main.ts:

**Requirements**:
1. Register DOM event listener on markdown view
2. Detect clicks on timestamp-formatted links
3. Prevent default link behavior for timestamp links
4. Extract timestamp from link text
5. Find YouTube iframe in current note
6. Execute seekTo command

**Event handling**:
- Use this.registerDomEvent() for proper cleanup
- Target: 'click' event on document.body
- Filter: Only process internal links matching timestamp pattern

**Edge cases**:
- No iframe found: Show Notice with error
- Invalid timestamp: Show Notice with error  
- Multiple iframes: Use first one (or implement video ID matching)
```

---

## Phase 3: Integration

### Prompt 3-1: Full Plugin Integration

```
Integrate all modules into complete plugin:

**File structure**:
obsidian-youtube-oneclick/
├── src/
│   ├── main.ts
│   └── utils/
│       ├── timestampParser.ts
│       └── youtubeController.ts
├── manifest.json
├── package.json
├── tsconfig.json
├── esbuild.config.mjs
└── styles.css

**main.ts requirements**:
- Import and use utility modules
- Plugin settings interface (optional features)
- Proper onload/onunload lifecycle
- Command registration for keyboard shortcuts (optional)

**Build output**:
- Single main.js file via esbuild bundling
```

### Prompt 3-2: Error Handling & User Feedback

```
Add robust error handling:

**Error cases**:
1. No YouTube iframe in note
2. Timestamp parse failure
3. postMessage communication failure
4. iframe not yet loaded

**User feedback**:
- Success: Optional Notice "Jumped to MM:SS"
- Failure: Notice with specific error message

**Settings (optional)**:
- Enable/disable success notifications
- Custom timestamp format support
```

---

## Phase 4: Testing & Optimization

### Prompt 4-1: Test Cases

```
Create test file and scenarios:

**Unit tests for timestampParser**:
- Valid inputs: "0:00", "12:34", "1:23:45"
- Invalid inputs: "abc", "-1:00", "99:99:99"
- Edge cases: empty string, null

**Integration test scenarios**:
1. Note with iframe + valid timestamp link -> Jump works
2. Note with iframe + invalid timestamp -> Error notice
3. Note without iframe + timestamp -> "No video found" notice
4. Note with multiple iframes -> First iframe targeted
```

### Prompt 4-2: Performance Optimization

```
Optimize plugin performance:

**Optimizations**:
1. Cache iframe reference per note
2. Debounce rapid clicks
3. Lazy load YouTube postMessage handler
4. Clean up event listeners on note change

**Metrics to verify**:
- Click-to-seek latency < 200ms
- No memory leaks on note switching
- Minimal CPU usage when idle
```

---

## Phase 5: Documentation & Release

### Prompt 5-1: README Documentation

```
Create comprehensive README.md:

**Sections**:
1. Plugin description and features
2. Installation (BRAT, manual)
3. Usage with screenshots/examples
4. Timestamp format specification
5. Troubleshooting FAQ
6. Development/contribution guide
7. License (MIT)

**Languages**: English and Korean versions
```

### Prompt 5-2: Release Preparation

```
Prepare for Obsidian Community Plugins:

**Files to create**:
1. versions.json
2. .github/workflows/release.yml (auto-build on tag)

**Checklist**:
- manifest.json validation
- Minimum Obsidian version compatibility
- README badges
- GitHub release process
- Community plugin submission steps
```

---

## Bonus Features

### Prompt B-1: Multi-Video Support

```
Support multiple YouTube videos per note:

**Implementation**:
- Timestamp format: [play 0:00](#video-VIDEO_ID)
- Parse video ID from link fragment
- Match iframe by video ID in src

**Example**:
[play 0:00](#video-dQw4w9WgXcQ)
-> Seeks iframe with src containing "dQw4w9WgXcQ"
```

### Prompt B-2: Keyboard Shortcuts

```
Add keyboard control commands:

**Commands**:
- Toggle play/pause: Cmd+Shift+Space
- Seek back 5s: Cmd+Shift+Left
- Seek forward 5s: Cmd+Shift+Right

**Implementation**:
- Use this.addCommand() API
- Define hotkeys in settings
```

---

## Development Notes

- Always test in both Reading View and Live Preview
- Check mobile compatibility if isDesktopOnly: false
- Follow Obsidian plugin best practices
- Use TypeScript strict mode
- Bundle with esbuild for production
