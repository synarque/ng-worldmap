import { BrowserModule } from "@angular/platform-browser";
import {
  NgModule,
  ApplicationRef
} from "@angular/core";
import {
  RouterModule,
  PreloadAllModules
} from "@angular/router";
import {
  WorldMapModule
} from "ng-worldmap";
/*
 * Platform and Environment providers/directives/pipes
 */
import { ENV_PROVIDERS } from "./environment";
import { ROUTES } from "./app.routes";
// App is our top level component
import { AppComponent } from "./app.component";
import { DemoComponent } from "./demo";

/**
 * `AppModule` is the main entry point into Angular2"s bootstraping process
 */
@NgModule({
  bootstrap: [AppComponent],
  declarations: [
    AppComponent,
    DemoComponent
  ],
  imports: [ // import Angular"s modules
    BrowserModule,
    RouterModule.forRoot(ROUTES, { useHash: true, preloadingStrategy: PreloadAllModules }),
    WorldMapModule
  ],
  providers: [ // expose our Services and Providers into Angular"s dependency injection
    ENV_PROVIDERS
  ]
})
export class AppModule {

  constructor() { }
}
