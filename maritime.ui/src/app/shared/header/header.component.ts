import {Component, ViewChild} from '@angular/core';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatListModule} from '@angular/material/list';
import {MatSidenav, MatSidenavModule} from '@angular/material/sidenav';
import {RouterLink, RouterLinkActive} from '@angular/router';
import {MatButtonModule} from '@angular/material/button';

@Component({
  selector: 'app-header',
  imports: [
    MatToolbarModule,
    MatIconModule,
    MatListModule,
    MatSidenavModule,
    MatButtonModule,
    RouterLink,
    RouterLinkActive,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  isSidebarOpen = false;

  @ViewChild('sidenav') sidenav!: MatSidenav;

  toggleSidenav() {
  //  this.isSidebarOpen = !this.isSidebarOpen;
    this.sidenav.toggle().then(r =>  this.isSidebarOpen = !this.isSidebarOpen);
  }
}
