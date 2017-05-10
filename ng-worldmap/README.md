# ng-worldmap

A component wrapping gardaud/worldmap-canvas in an Angular component.

## TL-DR

[Plunker Link](https://embed.plnkr.co/7rIrzJNmGFJBXshvOXpp/)

## Installing

Install the npm package:

```bash
npm install --save ng-worldmap
```

## Bootstraping

In your module declaration file, import the module:

```typescript
import { WorldMapModule } from "ng-worldmap";
@NgModule({
  imports: [
    ...,
    WorldMapModule
  ]
})
```

## Usage

Now in your template, just use the component:

```html
  <world-map></world-map>
```

## Customization

There are two ways of customizing your world map:

### Global

The settings property of WorldMapComponent allows you to customize your world map:

#### Definition

```typescript
// Class used to customize specific countries' rendering
class CountryCustomization {
  public color: string;          // Foreground color
  public highlightColor: string; // Highlight color
  public borderColor: string;    // Border color
  public borderWidth: number;    // Border width
}

class WorldMapComponent {
  // Sets the component's background color. Also configurable via CSS.
  // Default: #c2c2c2
  public setBackgroundColor(color: string);
  // Sets the countries default foreground color.
  // Default: #e2e2e2
  public setForegroundColor(color: string);
  // Sets the countries default highlight color.
  // Default: #f93
  public setHighlightColor(color: string);
  // Sets the default border color.
  // Default: #a0a0a0
  public setBorderColor(color: string);
  // Sets the default border width.
  public setBorderWidth(width: number);
  // Sets the rendering customization for a specific country.
  public setCustomization(countryCode: string, customization: CountryCustomization);
  // Clears the rendering customziation for a specific country.
  public resetCustomization(countryCode: string);
  // Sets the countries' rendering customization to an existing map.
  public setCustomizations(customizations: Map<string, CountryCustomization>);
  // Clears the countries' rendering customizations.
  public clearCustomizations();
}
```

#### Usage

```typescript
import { Component, ViewChild } from "@angular/core";

@Component({
  selector: "demo",
  template: `<world-map #theMap></world-map>`
})
class DemoComponent {
  @ViewChild("theMap") theMap: WorldMapComponent;

  constructor() {}

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
```

