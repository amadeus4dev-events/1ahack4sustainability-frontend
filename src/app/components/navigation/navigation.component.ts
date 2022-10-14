import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter, map, Observable, startWith } from 'rxjs';

/**
 * Side menu to navigate between the pages
 */
@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent {

  navigationItems = [
    {label: 'Home', icon: 'home', path: '/home'},
    {label: 'Inspire me', icon: 'emoji_objects', path: '/inspire'},
    {label: 'Find flights', icon: 'search', path: '/search'},
    {label: 'Find Trains', icon: 'search', path: '/TrainItineraries'}
  ];

  /**
   * Data stream that maps the navigation items to their active status
   *
   * @example If the user selected the home page, the stream should emit:
   * {'/home': true, '/inspire': false, '/search': false}
   */
  isSelected$: { [key: string]: Observable<boolean> } = {};

  constructor(private router: Router) {
    const currentUrl$ = router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      map((val) => val.urlAfterRedirects),
      startWith(this.router.url)
    );
    this.isSelected$ = Object.fromEntries(Object.entries(this.navigationItems).map(([key, value]) => {
      return [value.path, currentUrl$.pipe(map((url) => url.replace(/[;?].*/, '') === value.path))];
    }));
  }
}
