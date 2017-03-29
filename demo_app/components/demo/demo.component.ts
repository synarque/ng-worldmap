import { Component } from "@angular/core";

import { WorldMapSettings, Metrics, Country } from "ng-worldmap";

@Component({
  selector: "demo",
  template: `
    <div>
      <span>Avg fps: {{metrics.averageFps}}</span>
      <span>Avg Draw: {{metrics.averageDrawTime}}</span>
    </div>
    <div>
      <span>Current country: {{currentCountry}}</span>
      <span>Last click: {{lastClick}}</span>
    </div>
    <world-map
      [settings]="setting"
      (metrics)="onMetrics($event)"
      (countryEnter)="onCountryEnter($event)"
      (countryLeave)="onCountryLeave($event)"
      (countryClick)="onCountryClick($event)">
    </world-map>`,
  styles: [`:host { display: flex; flex-direction: column }`]
})
export class DemoComponent {
  private settings: WorldMapSettings;
  private metrics: Metrics = new Metrics(0, 0);
  private currentCountry: string;
  private lastClick: string;

  constructor() {
    this.settings = new WorldMapSettings();
  }

  onMetrics(metrics: Metrics) {
    this.metrics = metrics;
  }

  onCountryEnter(country: Country) {
    this.currentCountry = country.name;
  }

  onCountryLeave(country: Country) {
    this.currentCountry = "";
  }

  onCountryClick(country: Country) {
    this.lastClick = country.name;
  }
}