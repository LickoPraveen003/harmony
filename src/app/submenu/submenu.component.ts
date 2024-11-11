import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../services/user.service';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-submenu',
  templateUrl: './submenu.component.html',
  styleUrls: ['./submenu.component.css']
})
export class SubmenuComponent {
  subMenuList: any[] = [];
  user: any;
  filteredSubMenuList: any[] = [];
  userDetails: any = [];
  logoUrl: any;

  constructor(private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('user') || '{}').username;
    this.route.params.subscribe(params => {
      const menuId = params['id'];
      this.loadUserDetails();
      // this.loadSubMenus(menuId);
      // this.getLogo();
    });
  }

  // getLogo() {
  //   this.userService.getLogo().subscribe((logo:any) => this.logoUrl = logo.imgUrl,
  //     error => this.toastr.error('Failed to load users', 'Error')
  //   );
  // }

  loadUserDetails() {
    this.userService.getUsers().subscribe(users => {
      this.userDetails = users.find(u => u.username === this.user);
      // console.log("userDetails",this.userDetails);
    });
    // this.cards = [
    //   { id:3, name: 'Audit', image: '../../assets/images/tech.png', description: 'Description 1' },
    //   { id:2, name: 'Finance', image: '../../assets/images/finance.png', description: 'Description 2' },
    //   { id:1, name: 'IT Dashboard', image: '../../assets/images/IT.png', description: 'Description 3' },
    //   { id:4, name: 'Cardinal', image: '../../assets/images/tech.png', description: 'Description 4' },
    //   { id:5, name: 'ICS 3PL', image: '../../assets/images/tech.png', description: 'Description 1' },
    //   { id:3, name: 'Audit', image: '../../assets/images/tech.png', description: 'Description 1' },
    //   { id:2, name: 'Finance', image: '../../assets/images/finance.png', description: 'Description 2' },
    //   { id:1, name: 'IT Dashboard', image: '../../assets/images/IT.png', description: 'Description 3' },
    // ];
  }
  // loadSubMenus(menuId: any) {
  //   this.subMenuList = [];
  //   this.userService.getSubMenus().subscribe(data => {
  //     this.subMenuList = data.filter((key: any) =>
  //       key.menuId == menuId && this.userDetails.submenu.some((s: any) => key.submenuId == s)
  //     );
  //     console.log("subMenuList", this.subMenuList);
  //   });
  // }
  

  goBack() {
    this.router.navigate(['/dashboard']);
  }

  showSite(data: any) {
    this.router.navigate(['/powerbi', data.menuId]);
  }

}
