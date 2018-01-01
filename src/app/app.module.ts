import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { HttpClientModule } from '@angular/common/http';
import { IonicStorageModule } from '@ionic/storage';

import { MyApp } from './app.component';

import { ProgressBarComponent } from '../directives/progress-bar/progress-bar';

import { AuthenticationPage } from '../pages/authentication/authentication';
import { ConfigPage } from '../pages/config/config';
import { NewzPage } from '../pages/newz/newz';
import { FavoritePage, NavigationDetailsFavoritePage } from '../pages/favorite/favorite';
import { SearchPage, NavigationDetailsSearchPage, NavigationDetailsNewzPage } from '../pages/search/search';
import { DownloadPage } from '../pages/download/download';

import { CommonService } from '../providers/common-service';
import { FreeboxService } from '../providers/freebox-service';
import { TorrentService } from '../providers/torrent-service';
import { NewzService } from '../providers/newz-service';
import { NzbService } from '../providers/nzb-service';
import { DatabaseService } from '../providers/database-service';

import { Toast } from '@ionic-native/toast';
import { SpinnerDialog } from '@ionic-native/spinner-dialog';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { File } from '@ionic-native/file';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { FileOpener } from '@ionic-native/file-opener';
import { NativeStorage } from '@ionic-native/native-storage';
import { SQLite } from '@ionic-native/sqlite';
import { ActionSheet, ActionSheetOptions } from '@ionic-native/action-sheet';

@NgModule({
    declarations: [
        MyApp,
        ProgressBarComponent,
        AuthenticationPage,
        ConfigPage,
        NewzPage,
        FavoritePage,
        NavigationDetailsFavoritePage,
        SearchPage,
        NavigationDetailsSearchPage,
        NavigationDetailsNewzPage,
        DownloadPage
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        IonicModule.forRoot(MyApp),
        IonicStorageModule.forRoot()
    ],
    bootstrap: [IonicApp],
    entryComponents: [
        MyApp,
        AuthenticationPage,
        ConfigPage,
        NewzPage,
        FavoritePage,
        NavigationDetailsFavoritePage,
        SearchPage,
        NavigationDetailsSearchPage,
        NavigationDetailsNewzPage,
        DownloadPage
    ],
    providers: [
        StatusBar,
        SplashScreen,
        Toast,
        SpinnerDialog,
        File,
        FileTransfer,
        FileTransferObject,
        LocalNotifications,
        FileOpener,
        NativeStorage,
        SQLite,
        ActionSheet,
        CommonService,
        FreeboxService,
        TorrentService,
        NewzService,
        NzbService,
        DatabaseService,
        {provide: ErrorHandler, useClass: IonicErrorHandler}
    ]
})
export class AppModule {}
