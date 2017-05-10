import { Component, ViewChild, AfterViewInit } from "@angular/core";

import { WorldMapComponent, Country, CountryCustomization } from "ng-worldmap";

@Component({
  selector: "demo",
  template: `
    <div>
      <span>Current country: {{currentCountry}}</span>
      <span>Last click: {{lastClick}}</span>
      <span (click)="goGreen()">Go Green</span>
      <span (click)="goRed()">Go Red</span>
      <span (click)="goBlack()">Go Black</span>
    </div>
    <world-map
      #theMap
      (countryEnter)="onCountryEnter($event)"
      (countryLeave)="onCountryLeave($event)"
      (countryClick)="onCountryClick($event)">
    </world-map>`,
  styles: [`:host { display: flex; flex-direction: column }`]
})
export class DemoComponent implements AfterViewInit {
  @ViewChild("theMap") theMap: WorldMapComponent;
  private currentCountry: string;
  private lastClick: string;

  constructor() { }

  ngAfterViewInit() {
    this.theMap.setCustomization("fr", new CountryCustomization("blue", "red", "white", 5));
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

  goGreen() {
    this.theMap.setForegroundColor("green");
  }

  goRed() {
    this.theMap.setBackgroundColor("red");
  }

  goBlack() {
    this.theMap.setCustomization("us", new CountryCustomization("black", "gray", "black", 5));
  }
}