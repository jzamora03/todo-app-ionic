import { Injectable } from '@angular/core';
import { RemoteConfig } from '@angular/fire/remote-config';
import { fetchAndActivate, getValue } from '@angular/fire/remote-config';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class RemoteConfigService {
  private showStatisticsSubject = new BehaviorSubject<boolean>(false);
  showStatistics$ = this.showStatisticsSubject.asObservable();

  constructor(private remoteConfig: RemoteConfig) {
    this.remoteConfig.settings.minimumFetchIntervalMillis = 10000;
    this.remoteConfig.defaultConfig = {
      show_statistics: false
    };
    this.init();
  }

  async init() {
    try {
      await fetchAndActivate(this.remoteConfig);
      const value = getValue(this.remoteConfig, 'show_statistics').asBoolean();
      this.showStatisticsSubject.next(value);
      console.log('show_statistics:', value);
    } catch (error) {
      console.error('Remote Config error:', error);
    }
  }
}

