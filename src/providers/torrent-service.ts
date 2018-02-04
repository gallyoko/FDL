import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonService } from './common-service';
import { TorrentModel } from '../models/torrent.model';
import 'rxjs/add/operator/map';

@Injectable()
export class TorrentService {
    private routeApi: any;
    private categories: any = [];
    private tvShows: any = [];
    private dataToFormat: any = [];

    constructor(public http: HttpClient, public commonService: CommonService) {
        //this.routeApi = '/api_torrent';
        this.routeApi = 'http://www.torrent9.bz';
        this.categories = [
            "films", "series", "musique", "ebook", "logiciels", "jeux-pc", "jeux-console"
        ];
    }

    getCategories() {
        return new Promise(resolve => {
            resolve(this.categories);
        });
    }

    search(category, title, limit) {
        return new Promise(resolve => {
            this.tvShows = [];
            this.dataToFormat = [];
            const url: any = this.routeApi + '/search_torrent/' + category + '/'
                + title.replace(' ', '%20') + '.html';
            this.getUrlsSearch(url).then(urlsResult => {
                const urls: any = urlsResult;
                let dataSearch: any = [];
                for(let i = 0; i < urls.length; i++) {
                    this.getDataSearch(urls[i], category).then(data => {
                        const searchData: any = data;
                        Object.keys(searchData).forEach(function(key) {
                            if (category=='series') {
                                let findTitle: any = false;
                                for(let j = 0; j < dataSearch.length; j++) {
                                    if (dataSearch[j].title == key) {
                                        dataSearch[j].episodes = searchData[key];
                                        findTitle = true;
                                    }
                                }
                                if (!findTitle) {
                                    dataSearch.push({
                                        'title' : key,
                                        'episodes' : searchData[key]
                                    });
                                }
                            } else {
                                dataSearch.push(searchData[key]);
                            }
                        });
                        if ((i+1) == urls.length) {
                            resolve(dataSearch);
                        }
                    });
                }
            });
        });
    }

    getDataSearch(url, category) {
        return new Promise(resolve => {
            let self: any = this;
            let tvShows: any = this.tvShows;
            let dataToFormat: any = this.dataToFormat;
            let blob: any = null;
            let request: XMLHttpRequest = new XMLHttpRequest();
            request.responseType = "blob";
            request.onload = function()
            {
                blob = request.response;
                let reader = new FileReader();
                reader.readAsText(blob);
                reader.onload = () => {
                    let partSearchBegin: any = '';
                    if (category=='films') {
                        partSearchBegin = '<td><i class="fa fa-video-camera" style="color:#404040"></i> <a title="Télécharger';
                    } else if (category=='series') {
                        partSearchBegin = '<td><i class="fa fa-desktop" style="color:#404040"></i> <a title="Télécharger';
                    } else if (category=='musique') {
                        partSearchBegin = '<td><i class="fa fa-music" style="color:#404040"></i> <a title="Télécharger';
                    } else if (category=='ebook') {
                        partSearchBegin = '<td><i class="fa fa-book" style="color:#404040"></i> <a title="Télécharger';
                    } else if (category=='logiciels') {
                        partSearchBegin = '<td><i class="fa fa-laptop" style="color:#404040"></i> <a title="Télécharger';
                    } else if (category=='jeux-pc' || category=='jeux-console') {
                        partSearchBegin = '<td><i class="fa fa-gamepad" style="color:#404040"></i> <a title="Télécharger';
                    }
                    let partSearchEnd: any = '</a></td>';
                    let part1: any = reader.result.split(partSearchBegin);
                    for(let i = 1; i < part1.length; i++) {
                        let part2: any = part1[i].split(partSearchEnd);
                        let titleTmp: any = part2[0].split(' en Torrent" href="');
                        let title: any = titleTmp[0].trim();
                        let serie: any = '';
                        if (category=='series') {
                            if ((title.indexOf(' S0') > -1)
                                || (title.indexOf(' S1') > -1) || (title.indexOf(' S2') > -1) ) {
                                if ((title.indexOf(' S0') > -1)) {
                                    serie = title.substr(0, title.indexOf(' S0'));
                                } else if ((title.indexOf(' S1') > -1)) {
                                    serie = title.substr(0, title.indexOf(' S1'));
                                } else {
                                    serie = title.substr(0, title.indexOf(' S2'));
                                }
                            } else if ((title.indexOf(' 0') > -1)
                                || (title.indexOf(' 1') > -1) || (title.indexOf(' 2') > -1) ) {
                                if ((title.indexOf(' 0') > -1)) {
                                    serie = title.substr(0, title.indexOf(' 0'));
                                } else if ((title.indexOf(' 1') > -1)) {
                                    serie = title.substr(0, title.indexOf(' 1'));
                                } else {
                                    serie = title.substr(0, title.indexOf(' 2'));
                                }
                            } else {
                                serie = title;
                            }
                            if ((tvShows.indexOf(serie) < 0)) {
                                tvShows.push(serie);
                                dataToFormat[serie] = [];
                            }
                        } else {
                            if ((tvShows.indexOf(title) < 0)) {
                                tvShows.push(title);
                            }
                        }
                        let urlTmp1: any = part2[0].split('href="');
                        let urlTmp2: any = urlTmp1[1].split('" style="color:#000;');
                        let urlTorrent: any = self.routeApi + urlTmp2[0].trim();
                        let sizeTmp1: any = part2[1].split('</td>');
                        let sizeTmp2: any = sizeTmp1[0].replace('<td style="font-size:12px">', '');
                        let size: any = sizeTmp2.replace("\n", '');
                        let seedTmp1: any = part2[1].split('<span class="seed_ok">');
                        let seedTmp2: any = seedTmp1[1].split('<img class="hidden-md" src="/up.png">');
                        let seed: any = seedTmp2[0].trim();
                        let torrent: TorrentModel = new TorrentModel(title, size, urlTorrent, seed);
                        if (category=='series') {
                            dataToFormat[serie].push(torrent);
                        } else {
                            dataToFormat.push(torrent);
                        }
                    }
                    self.tvShows = tvShows;
                    self.dataToFormat = dataToFormat;
                    resolve(dataToFormat);
                }
            }
            request.open("GET", url);
            request.send();
        });
    }

    getUrlsSearch(url) {
        return new Promise(resolve => {
            let urlsPagination: any = [url];
            let blob: any = null;
            let request: XMLHttpRequest = new XMLHttpRequest();
            request.responseType = "blob";
            request.onload = function () {
                blob = request.response;
                let reader = new FileReader();
                reader.readAsText(blob);
                reader.onload = () => {
                    if (reader.result.indexOf('<div id="pagination-mian"><ul class="pagination">') > -1) {
                        let paginationTemp: any = reader.result.split('<div id="pagination-mian"><ul class="pagination">');
                        let blockPaginationTemp: any = paginationTemp[1].split('<strong>Suiv</strong></a></li>');
                        let urlPaginationTemp: any = blockPaginationTemp[0].split('<li><a href="');
                        for(let i = 1; i < urlPaginationTemp.length; i++) {
                            let urlTemp: any = urlPaginationTemp[i].split('">');
                            if (urlsPagination.indexOf(urlTemp[0]) < 0 ) {
                                urlsPagination.push(urlTemp[0]);
                            }
                        }
                    }
                    resolve(urlsPagination);
                }
            }
            request.open("GET", url);
            request.send();
        });
    }

    getUrlTorrent(url) {
        return new Promise(resolve => {
            let self: any = this;
            let blob: any = null;
            let request: XMLHttpRequest = new XMLHttpRequest();
            request.responseType = "blob";
            request.onload = function () {
                blob = request.response;
                let reader = new FileReader();
                reader.readAsText(blob);
                reader.onload = () => {
                    let urlTemp1: any = reader.result.split('href="/get_torrent/');
                    let urlTemp2: any = urlTemp1[1].split('.torrent');
                    let urlTorrent: any = self.routeApi + '/get_torrent/' + urlTemp2[0].trim()+'.torrent';
                    resolve(urlTorrent);
                }
            }
            request.open("GET", url);
            request.send();
        });
    }

}

