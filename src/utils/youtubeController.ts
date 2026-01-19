export interface YouTubeControlResult {
  success: boolean;
  message: string;
}

export function isYouTubeUrl(src: string): boolean {
  if (!src) return false;
  return src.includes('youtube.com') || src.includes('youtube-nocookie.com');
}

export function extractVideoId(src: string): string | null {
  if (!src) return null;
  
  const embedMatch = src.match(/\/embed\/([a-zA-Z0-9_-]{11})/);
  if (embedMatch) return embedMatch[1];
  
  const vMatch = src.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
  if (vMatch) return vMatch[1];
  
  return null;
}

export function findYouTubeIframe(
  container: HTMLElement,
  videoId?: string
): HTMLIFrameElement | null {
  const iframes = container.querySelectorAll('iframe');
  
  for (const iframe of Array.from(iframes)) {
    const src = iframe.src || iframe.getAttribute('src') || '';
    
    if (isYouTubeUrl(src)) {
      if (videoId) {
        const iframeVideoId = extractVideoId(src);
        if (iframeVideoId === videoId) {
          return iframe as HTMLIFrameElement;
        }
      } else {
        return iframe as HTMLIFrameElement;
      }
    }
  }
  
  return null;
}

export function ensureJsApiEnabled(iframe: HTMLIFrameElement): boolean {
  const src = iframe.src;
  if (!src) return false;
  
  try {
    const url = new URL(src);
    
    if (url.searchParams.get('enablejsapi') === '1') {
      return true;
    }
    
    url.searchParams.set('enablejsapi', '1');
    iframe.src = url.toString();
    
    return true;
  } catch (e) {
    console.error('Failed to parse iframe URL:', e);
    return false;
  }
}

export function sendYouTubeCommand(
  iframe: HTMLIFrameElement,
  func: string,
  args: (string | number | boolean)[] = []
): void {
  if (!iframe.contentWindow) {
    console.error('Iframe has no contentWindow');
    return;
  }
  
  const message = JSON.stringify({
    event: 'command',
    func: func,
    args: args
  });
  
  iframe.contentWindow.postMessage(message, '*');
}

export function seekTo(
  iframe: HTMLIFrameElement,
  seconds: number,
  allowSeekAhead: boolean = true
): YouTubeControlResult {
  if (!iframe) {
    return { success: false, message: 'No iframe provided' };
  }
  
  if (seconds < 0) {
    seconds = 0;
  }
  
  ensureJsApiEnabled(iframe);
  sendYouTubeCommand(iframe, 'seekTo', [seconds, allowSeekAhead]);
  
  return { success: true, message: `Seeking to ${seconds} seconds` };
}

export function playVideo(iframe: HTMLIFrameElement): YouTubeControlResult {
  if (!iframe) {
    return { success: false, message: 'No iframe provided' };
  }
  
  sendYouTubeCommand(iframe, 'playVideo');
  return { success: true, message: 'Playing video' };
}

export function pauseVideo(iframe: HTMLIFrameElement): YouTubeControlResult {
  if (!iframe) {
    return { success: false, message: 'No iframe provided' };
  }
  
  sendYouTubeCommand(iframe, 'pauseVideo');
  return { success: true, message: 'Pausing video' };
}

export class YouTubeController {
  private iframe: HTMLIFrameElement | null = null;
  
  constructor(container?: HTMLElement) {
    if (container) {
      this.iframe = findYouTubeIframe(container);
    }
  }
  
  setIframe(iframe: HTMLIFrameElement | null): void {
    this.iframe = iframe;
  }
  
  findInContainer(container: HTMLElement, videoId?: string): boolean {
    this.iframe = findYouTubeIframe(container, videoId);
    return this.iframe !== null;
  }
  
  hasIframe(): boolean {
    return this.iframe !== null;
  }
  
  seekTo(seconds: number, allowSeekAhead: boolean = true): YouTubeControlResult {
    if (!this.iframe) {
      return { success: false, message: 'No YouTube iframe found' };
    }
    return seekTo(this.iframe, seconds, allowSeekAhead);
  }
  
  play(): YouTubeControlResult {
    if (!this.iframe) {
      return { success: false, message: 'No YouTube iframe found' };
    }
    return playVideo(this.iframe);
  }
  
  pause(): YouTubeControlResult {
    if (!this.iframe) {
      return { success: false, message: 'No YouTube iframe found' };
    }
    return pauseVideo(this.iframe);
  }
}
