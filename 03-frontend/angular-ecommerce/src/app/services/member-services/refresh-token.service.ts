import { Injectable } from '@angular/core';
import { BehaviorSubject, filter, map, Subscription } from 'rxjs';
import { EventData } from '../../common/event-data';

@Injectable({
  providedIn: 'root'
})
export class RefreshTokenService {
  private tokenExpire = new BehaviorSubject<EventData>(new EventData('firstEmit', 1));

  constructor() { }

  emit(event: EventData) {
    this.tokenExpire.next(event);
  }

  on(eventName: string, action: any): Subscription {
    return this.tokenExpire.pipe(
      filter((e: EventData) => e.name === eventName),
      map((e: EventData) => e["value"])).subscribe(action);
  }
}
