# ng-worldmap

A component wrapping gardaud/worldmap-canvas in an Angular component.

## Using the API

### TL-DR

[Plunker Link](https://embed.plnkr.co/7rIrzJNmGFJBXshvOXpp/)

### Installing

Install the npm package:

```bash
npm install --save ng-worldmap
```

### Bootstraping

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

### Usage

Now in your template, just use the component:

```html
  <world-map [settings]="..."></world-map>
```