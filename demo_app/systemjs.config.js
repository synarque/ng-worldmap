/**
 * System configuration for Angular samples
 * Adjust as necessary for your application needs.
 */
/* global System */
'use strict';
(function () {
  System.config({
    paths: {
      // paths serve as alias
      'npm:': 'node_modules/',
      'local:': 'local_modules/',
    },
    // map tells the System loader where to look for things
    map: {
      // our app is within the app folder
      app: 'local:demo_app',
      // angular bundles
      '@angular/core': 'npm:@angular/core/bundles/core.umd.js',
      '@angular/common': 'npm:@angular/common/bundles/common.umd.js',
      '@angular/compiler': 'npm:@angular/compiler/bundles/compiler.umd.js',
      '@angular/platform-browser': 'npm:@angular/platform-browser/bundles/platform-browser.umd.js',
      '@angular/platform-browser-dynamic': 'npm:@angular/platform-browser-dynamic/bundles/platform-browser-dynamic.umd.js',
      '@angular/router': 'npm:@angular/router/bundles/router.umd.js',
      '@angular/upgrade': 'npm:@angular/upgrade/bundles/upgrade.umd.js',
      // other libraries
      'angular-in-memory-web-api': 'npm:angular-in-memory-web-api/bundles/in-memory-web-api.umd.js',
      'rxjs': 'npm:rxjs',
      'ng-worldmap': 'local:ng-worldmap',
      'raphael': 'npm:raphael/raphael.min.js',
      'hammerjs': 'npm:hammerjs/hammer.min.js'
    },
    packages: {
      "rxjs": { defaultExtension: "js" },
      "app": { defaultExtension: "js", main: "index.js" },
      "ng-worldmap": { defaultExtension: "js", main: "index.js" }
    }
  });
})();
