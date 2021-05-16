import { EventEmitter } from '@angular/core';
export class NavService {
  navchange: EventEmitter<any> = new EventEmitter();
  constructor() {}
  emitNavChangeEvent(eventFire) {
    this.navchange.emit(eventFire);
  }
  getNavChangeEmitter() {
    return this.navchange;
  }
}
