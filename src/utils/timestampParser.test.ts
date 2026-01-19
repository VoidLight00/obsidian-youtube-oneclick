import { 
  isTimestampLink, 
  extractTimestamp, 
  parseTimeString, 
  formatSeconds 
} from './timestampParser';

describe('isTimestampLink', () => {
  test('returns true for valid play links', () => {
    expect(isTimestampLink('play 0:00')).toBe(true);
    expect(isTimestampLink('play 12:34')).toBe(true);
    expect(isTimestampLink('play 1:23:45')).toBe(true);
    expect(isTimestampLink('Play 5:30')).toBe(true);
  });

  test('returns true for emoji links', () => {
    expect(isTimestampLink('▶️ 0:00')).toBe(true);
    expect(isTimestampLink('▶ 12:34')).toBe(true);
  });

  test('returns false for invalid formats', () => {
    expect(isTimestampLink('click here')).toBe(false);
    expect(isTimestampLink('12:34')).toBe(false);
    expect(isTimestampLink('')).toBe(false);
    expect(isTimestampLink(null)).toBe(false);
  });
});

describe('extractTimestamp', () => {
  test('extracts MM:SS format', () => {
    const result = extractTimestamp('play 12:34');
    expect(result).not.toBeNull();
    expect(result?.seconds).toBe(754);
    expect(result?.formatted).toBe('12:34');
  });

  test('extracts HH:MM:SS format', () => {
    const result = extractTimestamp('play 1:23:45');
    expect(result).not.toBeNull();
    expect(result?.seconds).toBe(5025);
    expect(result?.formatted).toBe('1:23:45');
  });

  test('extracts SS only format', () => {
    const result = extractTimestamp('play 45');
    expect(result).not.toBeNull();
    expect(result?.seconds).toBe(45);
  });

  test('extracts from emoji prefix', () => {
    const result = extractTimestamp('▶️ 5:30');
    expect(result).not.toBeNull();
    expect(result?.seconds).toBe(330);
  });

  test('returns null for invalid input', () => {
    expect(extractTimestamp('')).toBeNull();
    expect(extractTimestamp('invalid')).toBeNull();
  });
});

describe('parseTimeString', () => {
  test('parses 0:00', () => {
    const result = parseTimeString('0:00');
    expect(result?.seconds).toBe(0);
  });

  test('parses MM:SS', () => {
    expect(parseTimeString('12:34')?.seconds).toBe(754);
    expect(parseTimeString('1:30')?.seconds).toBe(90);
    expect(parseTimeString('59:59')?.seconds).toBe(3599);
  });

  test('parses HH:MM:SS', () => {
    expect(parseTimeString('1:00:00')?.seconds).toBe(3600);
    expect(parseTimeString('2:30:15')?.seconds).toBe(9015);
  });

  test('returns null for invalid seconds', () => {
    expect(parseTimeString('0:60')).toBeNull();
    expect(parseTimeString('0:99')).toBeNull();
  });

  test('returns null for invalid minutes', () => {
    expect(parseTimeString('1:60:00')).toBeNull();
  });
});

describe('formatSeconds', () => {
  test('formats seconds only', () => {
    expect(formatSeconds(0)).toBe('0:00');
    expect(formatSeconds(30)).toBe('0:30');
    expect(formatSeconds(59)).toBe('0:59');
  });

  test('formats minutes and seconds', () => {
    expect(formatSeconds(60)).toBe('1:00');
    expect(formatSeconds(90)).toBe('1:30');
    expect(formatSeconds(754)).toBe('12:34');
  });

  test('formats hours, minutes, and seconds', () => {
    expect(formatSeconds(3600)).toBe('1:00:00');
    expect(formatSeconds(5025)).toBe('1:23:45');
    expect(formatSeconds(7325)).toBe('2:02:05');
  });

  test('handles negative numbers', () => {
    expect(formatSeconds(-10)).toBe('0:00');
  });
});
