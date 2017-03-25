import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";

import { WorldMapComponent } from "./worldmap.component";

@NgModule({
  declarations: [WorldMapComponent],
  exports: [WorldMapComponent],
  imports: [CommonModule]
})
export class WorldMapModule {};