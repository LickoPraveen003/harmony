import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../services/user.service';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  menuList: any = [];
  user: any;
  isAdmin: boolean = false;
  logoUrl: any;

  constructor(
    private router: Router,
    private toastr: ToastrService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('user') || '{}');
    if (this.user?.username === 'suriya') {
      this.isAdmin = true;
    }
    this.loadUserMenus();
    // this.getLogo();
  }

  // getLogo() {
  //   this.userService.getLogo().subscribe((logo:any) => this.logoUrl = logo.imgUrl,
  //     error => this.toastr.error('Failed to load users', 'Error')
  //   );
  // }

  loadUserMenus(): void {
    if (this.user) {
      this.userService.getUsers().subscribe(
        users => {
          const currentUser = users.find(u => u.username === this.user?.username);
          if (currentUser) {
            this.userService.getMenus().subscribe(
              menus => {
                this.menuList = menus.filter(menu => currentUser.menu.some(userMenu => userMenu.menuId === menu.menuId));
              },
              error => {
                this.toastr.error('Failed to load menus', 'Error');
              }
            );
          }
        },
        error => {
          this.toastr.error('Failed to load users', 'Error');
        }
      );
    }
  }
  

  createUser(): void {
    this.router.navigate(['/user']);
  }

  logout(): void {
    localStorage.removeItem('user');
    this.toastr.success('Logout successful!', 'Success');
    this.router.navigate(['/login']);
  }

  showUrlPage(id: number): void {
    this.router.navigate(['/powerbi', id]);
  }
}