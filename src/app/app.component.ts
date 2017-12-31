import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { ConfigPage } from '../pages/config/config';
import { FavoritePage } from '../pages/favorite/favorite';
import { SearchPage } from '../pages/search/search';
import { DownloadPage } from '../pages/download/download';
import { NewzPage } from '../pages/newz/newz';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = DownloadPage;

  pages: Array<{title: string, component: any, icon: any}>;

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
        { title: 'Téléchargement', component: DownloadPage, icon: 'cloud-download' },
        { title: 'Favoris', component: FavoritePage, icon: 'bookmarks' },
        { title: 'Recherche', component: SearchPage, icon: 'search' },
        { title: 'Configuration', component: ConfigPage, icon: 'ios-construct' },
        { title: 'Newz update', component: NewzPage, icon: 'ios-thunderstorm-outline' }
    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
}
