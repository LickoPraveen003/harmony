import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-powerbi',
  templateUrl: './powerbi.component.html',
  styleUrls: ['./powerbi.component.css']
})
export class PowerbiComponent implements OnInit {
  iframeSrc!: SafeResourceUrl;
  id: any;

  constructor(
    private sanitizer: DomSanitizer, 
    private router: Router,
    private userService: UserService,
    private toastr: ToastrService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.id = params['id'];
      this.loadMenuURL();
    });
  }

  loadMenuURL() {
    this.userService.getUsers().subscribe(users => {
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      const user = users.find(u => u.username === currentUser.username);
      if (user && user.menu) {
        const menu = user.menu.find(m => m.menuId === this.id);
        if (menu) {
          this.iframeSrc = this.sanitizer.bypassSecurityTrustResourceUrl(menu.menuURL);
        } else {
          this.toastr.error('Menu not found', 'Error');
        }
      } else {
        this.toastr.error('User not found', 'Error');
      }
    }, error => {
      this.toastr.error('Failed to load users', 'Error');
    });
  }

  goBack() {
    this.router.navigate(['/dashboard']);
  }
}
