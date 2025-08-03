import { request } from 'http'
import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting } from 'obsidian'

interface KenkuSettings {
  baseURL: string
}

const DEFAULT_SETTINGS: KenkuSettings = {
  baseURL: 'http://127.0.0.1:3333/v1'
}

interface KenkuParams {
  id: string
  label: string
  action: 'play' | 'stop'
  type: 'playlist' | 'soundboard' 
}

const validRow = (row: string) => row.length > 0 && !row.startsWith('#')

export default class Kenku extends Plugin {
  settings: KenkuSettings

  async onload() {
    await this.loadSettings()

    this.registerMarkdownCodeBlockProcessor('kenku', (source, el, ctx) => {
      const rows = source.split('\n').filter(validRow)
      const baseURL = new URL(this.settings.baseURL)

      rows.forEach((row) => {
        // rows are formatted like this:
        // action=play|stop, type=soundboard|playlist, id=1234, label=My Sound
        const params: KenkuParams = this.decodeParameters(row)
        console.debug('creating Kenku button with params:', params)
        this.createButton(el, params, baseURL)
      })
    })

    // This adds a settings tab so the user can configure various aspects of the plugin
    this.addSettingTab(new KenkuSettingTag(this.app, this));
  }

  private createButton(el: HTMLElement, params: KenkuParams, baseURL: URL) {
    let icon = params.type === 'soundboard' ? '♪' : '♫'
    if (params.action === 'stop') {
      icon = '⏹'
    }
    const button = el.createEl('button', {
      text: icon + ' ' + params.label,
      cls: 'kenku-button'
    })
    button.onclick = () => {
      console.log('Kenku Button Clicked:', params)
      this.doKenkuRequest(params, baseURL)
    }
  }

  private doKenkuRequest(params: KenkuParams, baseURL: URL) {
    const { id, action, type } = params
    let act:string = action
    if (type === 'playlist' && action === 'stop') {
      act = 'playback/pause'
    }
    const body = JSON.stringify({ id })
    const path = baseURL.pathname + `/${type}/${act}`
    const req = request({
      method: 'PUT',
      path,
      hostname: baseURL.hostname,
      port: baseURL.port,
      headers: {
        'Content-Type': 'application/json'
      }
    }, (res) => {
      if (res.statusCode === 404) {
        new Notice(`Kenku: ${path} not found`)
        return
      }
      if (res.statusCode !== 200 && res.statusCode !== 204) {
        new Notice(`Kenku: Error - ${res.statusCode}`)
        return
      }
      // Handle success
      if (action === 'play') {
        new Notice(`Kenku: Playing ${type} ${id}`)
      } else {
        new Notice(`Kenku: Stopped ${type} ${id}`)
      }
    })

    req.on('error', (err) => {
      console.error('Kenku Request Error:', err);
      new Notice(`Kenku: Request failed - ${err.message}`);
    })

    req.write(body)

    req.end()
  }

  private decodeParameters(row: string) {
    const params: KenkuParams = {
      action: 'play',
      type: 'playlist',
      id: '',
      label: 'Music'
    }
    const parts = row.split(',').map(part => part.trim())
    parts.forEach(part => {
      const [key, value] = part.split('=').map(p => p.trim())
      if (key && value) {
        switch (key) {
          case 'action':
            params.action = value as 'stop' | 'play'
            break
          case 'type':
            params.type = value as 'soundboard' | 'playlist'
            break
          case 'id':
          case 'label':
            params[key] = value
            break
        }
      }
    })
    return params
  }

  onunload() {

  }

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }
}

class KenkuSettingTag extends PluginSettingTab {
  plugin: Kenku;

  constructor(app: App, plugin: Kenku) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const { containerEl } = this;

    containerEl.empty();

    new Setting(containerEl)
      .setName('Kenku Setting')
      .setDesc('Set the base URL for the Kenku server')
      .addText(text => text
        .setPlaceholder('http://localhost:3333/v1')
        .setValue(this.plugin.settings.baseURL)
        .onChange(async (value) => {
          this.plugin.settings.baseURL = value;
          await this.plugin.saveSettings();
        }));
  }
}
