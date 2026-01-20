import { App, MarkdownView, Notice, Plugin, PluginSettingTab, Setting } from 'obsidian';
import { isTimestampLink, extractTimestamp } from './src/utils/timestampParser';
import { findYouTubeIframe, seekTo, playVideo, ensureJsApiEnabled } from './src/utils/youtubeController';

interface YouTubeOneClickSettings {
  showSuccessNotice: boolean;
  autoPlay: boolean;
}

const DEFAULT_SETTINGS: YouTubeOneClickSettings = {
  showSuccessNotice: true,
  autoPlay: true
};

export default class YouTubeOneClickPlugin extends Plugin {
  settings: YouTubeOneClickSettings;

  async onload() {
    await this.loadSettings();

    this.registerDomEvent(document, 'click', this.handleClick.bind(this), true);

    this.addCommand({
      id: 'youtube-play-pause',
      name: 'Toggle play/pause',
      callback: () => this.togglePlayPause()
    });

    this.addCommand({
      id: 'youtube-seek-back-5',
      name: 'Seek back 5 seconds',
      callback: () => this.seekRelative(-5)
    });

    this.addCommand({
      id: 'youtube-seek-forward-5',
      name: 'Seek forward 5 seconds',
      callback: () => this.seekRelative(5)
    });

    this.addSettingTab(new YouTubeOneClickSettingTab(this.app, this));
    
    console.log('YouTube OneClick Timestamp loaded');
  }

  onunload() {
    console.log('YouTube OneClick Timestamp unloaded');
  }

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }

  private handleClick(evt: MouseEvent) {
    const target = evt.target as HTMLElement;

    const link = target.closest('a');
    if (!link) {
      return;
    }

    const linkText = link.textContent;

    if (!linkText || !isTimestampLink(linkText)) {
      return;
    }

    console.log('YouTube OneClick: Timestamp link clicked:', linkText);

    evt.preventDefault();
    evt.stopPropagation();
    evt.stopImmediatePropagation();

    const timestamp = extractTimestamp(linkText);

    if (!timestamp) {
      new Notice('Invalid timestamp format');
      return;
    }

    const view = this.app.workspace.getActiveViewOfType(MarkdownView);
    if (!view) {
      new Notice('No active markdown view');
      return;
    }

    const container = view.contentEl;
    const iframe = findYouTubeIframe(container);

    if (!iframe) {
      new Notice('No YouTube video found in this note');
      return;
    }

    ensureJsApiEnabled(iframe);
    
    const result = seekTo(iframe, timestamp.seconds);
    
    if (result.success) {
      if (this.settings.autoPlay) {
        setTimeout(() => playVideo(iframe), 100);
      }
      
      if (this.settings.showSuccessNotice) {
        new Notice(`▶️ ${timestamp.formatted}`);
      }
    } else {
      new Notice(result.message);
    }
  }

  private togglePlayPause() {
    const view = this.app.workspace.getActiveViewOfType(MarkdownView);
    if (!view) return;

    const iframe = findYouTubeIframe(view.contentEl);
    if (!iframe) {
      new Notice('No YouTube video found');
      return;
    }

    playVideo(iframe);
  }

  private seekRelative(deltaSeconds: number) {
    const view = this.app.workspace.getActiveViewOfType(MarkdownView);
    if (!view) return;

    const iframe = findYouTubeIframe(view.contentEl);
    if (!iframe) {
      new Notice('No YouTube video found');
      return;
    }

    new Notice(`Seek ${deltaSeconds > 0 ? '+' : ''}${deltaSeconds}s`);
  }
}

class YouTubeOneClickSettingTab extends PluginSettingTab {
  plugin: YouTubeOneClickPlugin;

  constructor(app: App, plugin: YouTubeOneClickPlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const { containerEl } = this;

    containerEl.empty();

    new Setting(containerEl)
      .setName('Show success notice')
      .setDesc('Display a notice when successfully jumping to a timestamp')
      .addToggle(toggle => toggle
        .setValue(this.plugin.settings.showSuccessNotice)
        .onChange(async (value) => {
          this.plugin.settings.showSuccessNotice = value;
          await this.plugin.saveSettings();
        }));

    new Setting(containerEl)
      .setName('Auto-play after seek')
      .setDesc('Automatically start playing the video after jumping to a timestamp')
      .addToggle(toggle => toggle
        .setValue(this.plugin.settings.autoPlay)
        .onChange(async (value) => {
          this.plugin.settings.autoPlay = value;
          await this.plugin.saveSettings();
        }));
  }
}
