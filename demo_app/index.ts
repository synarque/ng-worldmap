/*
 * Angular bootstraping
 */
import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";
import { decorateModuleRef } from "./components/environment";
/*
 * App Module
 * our top level module that holds all of our components
 */
import { AppModule } from "./components";

/*
 * Bootstrap our Angular app with a top level NgModule
 */
platformBrowserDynamic()
    .bootstrapModule(AppModule)
    .then(decorateModuleRef)
    .catch((err) => console.error(err));
