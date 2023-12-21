import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { UsersService } from '../../services/users.service';
import { AddUserComponent } from '../add-user/add-user.component';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit {
  displayedColumns: string[] = [
    'position',
    'imageCoordinator',
    'coordinator',
    'email',
    'school',
    'mession',
    'deadLine',
    'status',
    'actions',
  ];
  dataSource: any = [];
  UsersFilter!: FormGroup;
  users: any = [
    { name: 'Moahmed', id: 1 },
    { name: 'Ali', id: 2 },
    { name: 'Ahmed', id: 3 },
    { name: 'Zain', id: 4 },
  ];

  status: any = [{ name: 'Complete' }, { name: 'In-Progress' }];
  constructor(
    public dialog: MatDialog,
    private service: UsersService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private translate: TranslateService
  ) {}

  page: any = 1;
  filteration: any = {
    page: this.page,
    limit: 10,
  };
  timeoutId: any;
  total: any;
  ngOnInit(): void {
    this.getAllCoordinators();
    this.createform();
  }

  createform() {
    this.UsersFilter = this.fb.group({
      title: [''],
      userId: [''],
      fromDate: [''],
      toDate: [''],
    });
  }

  changePage(event: any) {
    this.page = event;
    this.filteration['page'] = event;
    this.getAllCoordinators();
  }

  search(event: any) {
    this.filteration['keyboard'] = event.value;
    this.page = 1;
    this.filteration['page'] = 1;
    clearTimeout(this.timeoutId);
    this.timeoutId = setTimeout(() => {
      this.getAllCoordinators();
    }, 2000);
  }

  selectUser(event: any) {
    this.filteration['userId'] = event.value;
    this.page = event;
    this.filteration['page'] = event;
    this.getAllCoordinators();
  }

  selectStatus(event: any) {
    this.filteration['status'] = event.value.trim();
    this.page = event;
    this.filteration['page'] = event;
    this.getAllCoordinators();
  }

  selectDate(event: any, type: any) {
    this.filteration[type] = moment(event.value).format('DD-MM-YYYY');
    this.page = event;
    this.filteration['page'] = event;
    if (type == 'toDate' && this.filteration['toDate'] !== 'Invalid date') {
      this.getAllCoordinators();
    }
  }

  getAllCoordinators() {
    this.spinner.show();
    this.service.getAllCoordinators().subscribe({
      next: (users) => {
        this.dataSource = users;
        this.dataSource = this.mappingUsers(users);
        this.spinner.hide();
      },
      error: (response) => {
        this.toastr.error(response.error.message);
        this.spinner.hide();
      },
    });
  }

  mappingUsers(data: any[]) {
    let newUsers = data.map((item) => {
      return {
        // ...item,
        name: item.user.nameEn,
        address: item.address.cityName,
        image: item.user.imageUrl,
        gender: this.mapGender(item.user.gender),
        email: item.user.email,
        schools: item.schools,
        mission: item.missions,
      };
    });
    // console.log(newUsers);
    return newUsers;
  }

  private mapGender(gender: number): string {
    return gender === 1 ? 'Male' : gender === 2 ? 'Female' : 'Unknown';
  }

  mapstatus(status: number): string {
    return status === 1 ? this.translate.instant('tasks.inComplete'): status === 2 ? this.translate.instant('tasks.complete') : this.translate.instant('tasks.unknown');
  }

  deleteUser(id: any) {
    this.service.deleteCoordinator(id).subscribe(
      (res) => {
        this.toastr.success('deleted successfully', 'success');
        this.spinner.hide();
        this.getAllCoordinators();
      },
      (error) => {
        this.toastr.error(error.error.message);
        this.spinner.hide();
      }
    );
  }

  updateUser(element: any) {
    const dialogRef = this.dialog.open(AddUserComponent, {
      width: '750px',
      data: element,
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.getAllCoordinators();
      }
    });
  }

  addUser() {
    const dialogRef = this.dialog.open(AddUserComponent, {
      width: '750px',
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.getAllCoordinators();
      }
    });
  }
}
