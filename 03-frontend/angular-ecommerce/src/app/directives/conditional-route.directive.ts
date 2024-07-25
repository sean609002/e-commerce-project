import { Directive, Input, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from '../services/member-services/storage.service';
import { take } from 'rxjs/operators';

@Directive({
  selector: '[appConditionalRoute]'
})
export class ConditionalRouteDirective {
  @Input('appConditionalRoute') targetRoute?: string;

  constructor(private router: Router, private storageService: StorageService) {}

  @HostListener('click', ['$event'])
  onClick(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this.storageService.loggedInStatus.pipe(
      take(1)
    )
    .subscribe(isLoggedIn => {
      if (isLoggedIn) {
        this.router.navigate([this.targetRoute]);
      } else {
        alert('請先登錄以繼續操作');
        this.router.navigate(['/login']);
      }
    });
    this.storageService.isLoggedIn();
  }
}