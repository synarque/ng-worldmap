import { Component } from "@angular/core";

import { WorldMapSettings } from "worldmap-canvas";

@Component({
  selector: "demo",
  template: "<world-map [settings]='setting'></world-map>",
  styles: [`:host { display: flex; }`]
})
export class DemoComponent {
  private settings: WorldMapSettings;

  constructor() {
    this.settings = new WorldMapSettings();
  }
}