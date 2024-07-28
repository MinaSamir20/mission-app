import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AddSchoolComponent } from '../add-school/add-school.component';
import * as moment from 'moment';
import { SchoolService } from '../services/school.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-list-school',
  templateUrl: './list-school.component.html',
  styleUrls: ['./list-school.component.scss'],
})
export class ListSchoolComponent implements OnInit {
  displayedColumns: string[] = [
    'position',
    'image',
    'school',
    'address',
    'coordinator',
    'status',
    'actions',
  ];
  dataSource: any = [];
  addresSchool: any;
  SchoolsFilter!: FormGroup;
  users: any = [];
  status: any = [{ name: 'Complete' }, { name: 'In-Progress' }];
  address: any;
  @ViewChild('myTdElement') myTdElement!: ElementRef;
  constructor(
    public dialog: MatDialog,
    private service: SchoolService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService
  ) {
  }

  page: any = 1;
  filteration: any = {
    page: this.page,
    limit: 10,
  };
  timeoutId: any;
  total: any;
  ngOnInit(): void {
    this.getAllSchools();
    this.createform();
  }

  createform() {
    this.SchoolsFilter = this.fb.group({
      title: [''],
      userId: [''],
      fromDate: [''],
      toDate: [''],
    });
  }

  changePage(event: any) {
    this.page = event;
    this.filteration['page'] = event;
    this.getAllSchools();
  }
  search(event: any) {
    this.filteration['keyboard'] = event.value;
    this.page = 1;
    this.filteration['page'] = 1;
    clearTimeout(this.timeoutId);
    this.timeoutId = setTimeout(() => {
      this.getAllSchools();
    }, 2000);
  }

  selectUser(event: any) {
    this.filteration['userId'] = event.value;
    this.page = event;
    this.filteration['page'] = event;
    this.getAllSchools();
  }

  selectStatus(event: any) {
    this.filteration['status'] = event.value.trim();
    this.page = event;
    this.filteration['page'] = event;
    this.getAllSchools();
  }

  selectDate(event: any, type: any) {
    this.filteration[type] = moment(event.value).format('DD-MM-YYYY');
    this.page = event;
    this.filteration['page'] = event;
    if (type == 'toDate' && this.filteration['toDate'] !== 'Invalid date') {
      this.getAllSchools();
    }
  }

  getAllSchools() {
    this.spinner.show();
    this.service.getAllSchools(null).subscribe({
      next: (schools) => {
        this.dataSource = schools;
        this.dataSource = this.mappingSchools(schools);
        this.total = schools;
        this.spinner.hide();
      },
      error: (response) => {
        this.toastr.error(response.error.message);
        this.spinner.hide();
      },
    });
  }

  mappingSchools(data: any[]) {
    let newSchools = data.map((item) => {
      return {
        ...data,
        id: item.id,
        name: item.schoolName,
        image: item.imageUrl,
        // coordinator: item.user,
        address: item.address.cityName,
        status: item.status
      };
    });
    console.log(newSchools);
    return newSchools;
  }

  deleteSchool(id: any) {
    this.service.deleteSchool(id).subscribe(
      {
        next: (res) => {
          this.toastr.success('deleted successfully', 'success');
          this.spinner.hide();
          this.getAllSchools();
        },
        error: (error) => {
          this.toastr.error(error.error.message);
          this.spinner.hide();
        }
      }
    );
  }

  updateSchool(element: any) {
    const dialogRef = this.dialog.open(AddSchoolComponent, {
      width: '750px',
      data: element,
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.getAllSchools();
      }
    });
  }

  addSchool() {
    const dialogRef = this.dialog.open(AddSchoolComponent, {
      width: '750px',
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.getAllSchools();
      }
    });
  }
}
