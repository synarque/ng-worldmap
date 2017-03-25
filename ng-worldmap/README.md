# ng-worldmap
A component wrapping gardaud/worldmap-canvas in an Angular component.

# Using the API
## Installing
Install the npm package:
```bash
npm install --save ng-worldmap
```
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
Now in your template, just use the component:
```html
  <world-map [settings]="..."></world-map>
```