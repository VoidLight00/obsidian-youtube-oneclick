export interface ParsedTimestamp {
  seconds: number;
  formatted: string;
}

const TIMESTAMP_LINK_PATTERN_HH_MM_SS = /\[(?:play|▶️|▶)\s*(\d{1,2}):(\d{2}):(\d{2})\]\(\)/i;
const TIMESTAMP_LINK_PATTERN_MM_SS = /\[(?:play|▶️|▶)\s*(\d{1,2}):(\d{2})\]\(\)/i;
const TIMESTAMP_LINK_PATTERN_SS = /\[(?:play|▶️|▶)\s*(\d+)\]\(\)/i;

const TIME_PATTERN_HH_MM_SS = /^(\d{1,2}):(\d{2}):(\d{2})$/;
const TIME_PATTERN_MM_SS = /^(\d{1,2}):(\d{2})$/;
const TIME_PATTERN_SS = /^(\d+)$/;

export function isTimestampLink(linkText: string | null): boolean {
  if (!linkText) return false;
  
  const trimmed = linkText.trim();
  
  return /^(?:play|▶️|▶)\s*\d{1,2}(?::\d{2}){1,2}$/i.test(trimmed) ||
         /^(?:play|▶️|▶)\s*\d+$/i.test(trimmed);
}

export function extractTimestamp(linkText: string): ParsedTimestamp | null {
  if (!linkText) return null;
  
  const trimmed = linkText.trim();
  const timeStr = trimmed.replace(/^(?:play|▶️|▶)\s*/i, '');
  
  return parseTimeString(timeStr);
}

export function parseTimeString(timeStr: string): ParsedTimestamp | null {
  if (!timeStr) return null;
  
  const trimmed = timeStr.trim();
  
  let match = trimmed.match(TIME_PATTERN_HH_MM_SS);
  if (match) {
    const hours = parseInt(match[1], 10);
    const minutes = parseInt(match[2], 10);
    const seconds = parseInt(match[3], 10);
    
    if (minutes >= 60 || seconds >= 60) return null;
    
    const totalSeconds = hours * 3600 + minutes * 60 + seconds;
    return {
      seconds: totalSeconds,
      formatted: `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
    };
  }
  
  match = trimmed.match(TIME_PATTERN_MM_SS);
  if (match) {
    const minutes = parseInt(match[1], 10);
    const seconds = parseInt(match[2], 10);
    
    if (seconds >= 60) return null;
    
    const totalSeconds = minutes * 60 + seconds;
    return {
      seconds: totalSeconds,
      formatted: `${minutes}:${String(seconds).padStart(2, '0')}`
    };
  }
  
  match = trimmed.match(TIME_PATTERN_SS);
  if (match) {
    const seconds = parseInt(match[1], 10);
    return {
      seconds: seconds,
      formatted: `0:${String(seconds).padStart(2, '0')}`
    };
  }
  
  return null;
}

export function formatSeconds(totalSeconds: number): string {
  if (totalSeconds < 0) return "0:00";
  
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor(totalSeconds % 60);
  
  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }
  
  return `${minutes}:${String(seconds).padStart(2, '0')}`;
}
