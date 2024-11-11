import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { ToastrService } from 'ngx-toastr';
import { passwordValidator } from '../services/password-validator';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  userForm: FormGroup;
  users: any[] = [];
  menuList: any[] = [];
  subMenuList: any[] = [];
  errMsg: string[] = [];
  editIndex: number | null = null;
  passwordFieldType: string = 'password';
  logoUrl:any;

  constructor(private fb: FormBuilder,
              private router: Router,
              private userService: UserService,
              private toastr: ToastrService) {
    this.userForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(4)]],
      password: ['', [Validators.required, Validators.minLength(6),passwordValidator]],
      confirmPassword: ['', [Validators.required, Validators.minLength(6),passwordValidator]],
      audit: [false, Validators.required],
      auditURL: [''],
      itDashboard: [false, Validators.required],
      itDashboardURL: [''],
      cardinal3PL: [false, Validators.required],
      cardinal3PLURL: [''],
      ics3PL: [false, Validators.required],
      ics3PLURL: ['']
    }, { validators: [this.passwordMatchValidator, this.toggleValidator] });
  }

  ngOnInit() {
    // this.getLogo();
    this.loadUsers();

    // Subscribe to value changes of the toggle controls
    this.userForm.get('audit')!.valueChanges.subscribe(value => {
      if (!value) {
        this.userForm.get('auditURL')!.setValue('');
      }
    });

    this.userForm.get('itDashboard')!.valueChanges.subscribe(value => {
      if (!value) {
        this.userForm.get('itDashboardURL')!.setValue('');
      }
    });

    this.userForm.get('cardinal3PL')!.valueChanges.subscribe(value => {
      if (!value) {
        this.userForm.get('cardinal3PLURL')!.setValue('');
      }
    });

    this.userForm.get('ics3PL')!.valueChanges.subscribe(value => {
      if (!value) {
        this.userForm.get('ics3PLURL')!.setValue('');
      }
    });
  }

  // getLogo() {
  //   this.userService.getLogo().subscribe((logo:any) => this.logoUrl = logo.imgUrl,
  //     error => this.toastr.error('Failed to load users', 'Error')
  //   );
  // }

  loadUsers() {
    this.userService.getUsers().subscribe(
      data => this.users = data,
      error => this.toastr.error('Failed to load users', 'Error')
    );
  }

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  toggleValidator(control: AbstractControl): ValidationErrors | null {
    const audit = control.get('audit')?.value;
    const auditURL = control.get('auditURL')?.value;
    const itDashboard = control.get('itDashboard')?.value;
    const itDashboardURL = control.get('itDashboardURL')?.value;
    const cardinal3PL = control.get('cardinal3PL')?.value;
    const cardinal3PLURL = control.get('cardinal3PLURL')?.value;
    const ics3PL = control.get('ics3PL')?.value;
    const ics3PLURL = control.get('ics3PLURL')?.value;

    const errors: ValidationErrors = {};

    if (audit && !auditURL) {
      errors['auditURL'] = 'Audit URL is required when Audit is enabled';
    }
    if (itDashboard && !itDashboardURL) {
      errors['itDashboardURL'] = 'IT Dashboard URL is required when IT Dashboard is enabled';
    }
    if (cardinal3PL && !cardinal3PLURL) {
      errors['cardinal3PLURL'] = 'Cardinal 3PL URL is required when Cardinal 3PL is enabled';
    }
    if (ics3PL && !ics3PLURL) {
      errors['ics3PLURL'] = 'ICS 3PL URL is required when ICS 3PL is enabled';
    }

    return Object.keys(errors).length ? errors : null;
  }

  onSubmit() {
    if (this.userForm.valid) {
      const newUser: any = {
        id: this.editIndex !== null ? this.users[this.editIndex].id : this.generateId(),
        username: this.userForm.get('username')!.value,
        password: this.userForm.get('password')!.value,
        menu: this.getMenuData()
      };

      if (this.editIndex !== null) {
        // Update existing user
        this.userService.editUser(newUser.id, newUser).subscribe(
          () => {
            this.loadUsers();
            this.resetForm();
            this.toastr.success('User updated successfully', 'Success');
          },
          error => this.toastr.error('Failed to update user', 'Error')
        );
      } else {
        // Add new user
        this.userService.addUser(newUser).subscribe(
          () => {
            this.loadUsers();
            this.resetForm();
            this.toastr.success('User added successfully', 'Success');
          },
          error => this.toastr.error('Failed to add user', 'Error')
        );
      }
    } else {
      this.errMsg.push('Form is invalid');
    }
  }

  generateId(): string {
    return Math.floor(Math.random() * 10000).toString();
  }

  getMenuData() {
    const menuData = [];
    if (this.userForm.get('audit')!.value) {
      menuData.push({
        menuId: '1',
        menuName: 'Audit',
        isactive: true,
        menuURL: this.userForm.get('auditURL')!.value
      });
    }
    if (this.userForm.get('itDashboard')!.value) {
      menuData.push({
        menuId: '2',
        menuName: 'IT Dashboard',
        isactive: true,
        menuURL: this.userForm.get('itDashboardURL')!.value
      });
    }
    if (this.userForm.get('cardinal3PL')!.value) {
      menuData.push({
        menuId: '3',
        menuName: 'Cardinal 3PL',
        isactive: true,
        menuURL: this.userForm.get('cardinal3PLURL')!.value
      });
    }
    if (this.userForm.get('ics3PL')!.value) {
      menuData.push({
        menuId: '4',
        menuName: 'ICS 3PL',
        isactive: true,
        menuURL: this.userForm.get('ics3PLURL')!.value
      });
    }
    return menuData;
  }

  editUser(index: number) {
    const user = this.users[index];
    if (user) {
      this.userForm.patchValue({
        username: user.username,
        password: user.password,
        confirmPassword: user.password,
        audit: user.menu.some((menu:any) => menu.menuId === '1'),
        auditURL: user.menu.find((menu:any) => menu.menuId === '1')?.menuURL || '',
        itDashboard: user.menu.some((menu:any) => menu.menuId === '2'),
        itDashboardURL: user.menu.find((menu:any) => menu.menuId === '2')?.menuURL || '',
        cardinal3PL: user.menu.some((menu:any) => menu.menuId === '3'),
        cardinal3PLURL: user.menu.find((menu:any) => menu.menuId === '3')?.menuURL || '',
        ics3PL: user.menu.some((menu:any) => menu.menuId === '4'),
        ics3PLURL: user.menu.find((menu:any) => menu.menuId === '4')?.menuURL || ''
      });
      this.editIndex = index;
    }
  }

  deleteUser(index: number) {
    const userId = this.users[index].id;
    this.userService.deleteUser(userId).subscribe(
      () => {
        this.loadUsers();
        this.toastr.success('User deleted successfully', 'Success');
      },
      error => this.toastr.error('Failed to delete user', 'Error')
    );
  }

  togglePasswordVisibility() {
    this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
  }

  resetForm() {
    this.userForm.reset();
    this.editIndex = null;
  }

  goBack() {
    this.router.navigate(['/dashboard']);
  }

  getMenuNames(user: any): string {
    return user.menu.map((menu: any) => menu.menuName).join(', ');
  }
}
