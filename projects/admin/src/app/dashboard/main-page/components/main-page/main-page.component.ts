import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import * as moment from 'moment';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { TasksService } from '../../../tasks-admin/services/tasks.service';
import { TranslateService } from '@ngx-translate/core';

export interface PeriodicElement {
  coordinator: string;
  school: string;
  deadLine: string;
  status: string;
  mession: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {
    status: 'InComplete',
    coordinator: 'Mohamed',
    school: 'School 1',
    mession: 'Task 1',
    deadLine: '10-11-2022',
  },
  {
    status: 'InComplete',
    coordinator: 'Alaa',
    school: 'School 3',
    mession: 'Task 3',
    deadLine: '10-11-2022',
  },
  {
    status: 'InComplete',
    coordinator: 'Mostafa',
    school: 'School 4',
    mession: 'Task 4',
    deadLine: '10-11-2022',
  },
  {
    status: 'InComplete',
    coordinator: 'Bakr',
    school: 'School 5',
    mession: 'Task 5',
    deadLine: '10-11-2022',
  },
  {
    status: 'InComplete',
    coordinator: 'Hassan',
    school: 'School 6',
    mession: 'Task 6',
    deadLine: '10-11-2022',
  },
];
@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss'],
})
export class MainPageComponent implements OnInit {
  displayedColumns: string[] = [
    'position',
    'mession',
    'coordinator',
    'school',
    'deadLine',
    'status',
  ];
  // dataSource: any = [];

  dataSource: any = ELEMENT_DATA;
  tasksFilter!: FormGroup;
  details: any = [
    { icon: 'fal fa-users', number: '30', title: 'Coordinators' },
    { icon: 'fal fa-school', number: '10', title: 'Schools' },
    { icon: 'fal fa-list-ul', number: '50', title: 'Missions' },
    { icon: 'fa fa-exclamation-circle', number: '10', title: 'InComplete' },
  ];
  status: any = [
    { name: this.translate.instant('tasks.complete') },
    { name: this.translate.instant('tasks.inComplete') },
  ];
  constructor(
    public dialog: MatDialog,
    private service: TasksService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private translate: TranslateService
  ) {}

  page: any = 1;
  filteration: any = {
    page: this.page,
    limit: 5,
  };
  timeoutId: any;
  total: any;
  ngOnInit(): void {
    this.createform();
  }

  createform() {
    this.tasksFilter = this.fb.group({
      title: [''],
      userId: [''],
      fromDate: [''],
      toDate: [''],
    });
  }

  changePage(event: any) {
    this.page = event;
    this.filteration['page'] = event;
    this.getAllTasks();
  }
  search(event: any) {
    this.filteration['keyboard'] = event.value;
    this.page = 1;
    this.filteration['page'] = 1;
    clearTimeout(this.timeoutId);
    this.timeoutId = setTimeout(() => {
      this.getAllTasks();
    }, 2000);
  }

  selectUser(event: any) {
    this.filteration['userId'] = event.value;
    this.page = event;
    this.filteration['page'] = event;
    this.getAllTasks();
  }

  selectStatus(event: any) {
    this.filteration['status'] = event.value.trim();
    this.page = event;
    this.filteration['page'] = event;
    this.getAllTasks();
  }

  selectDate(event: any, type: any) {
    this.filteration[type] = moment(event.value).format('DD-MM-YYYY');
    this.page = event;
    this.filteration['page'] = event;
    if (type == 'toDate' && this.filteration['toDate'] !== 'Invalid date') {
      this.getAllTasks();
    }
  }

  getAllTasks() {
    this.spinner.show();
    this.service.getAllTasks(null).subscribe(
      (res: any) => {
        this.dataSource = this.mappingTasks(res.tasks);
        this.total = res.totalitems;
        this.spinner.hide();
      },
      (error) => {
        this.toastr.error(error.error.message);
        this.spinner.hide();
      }
    );
  }

  mappingTasks(data: any[]) {
    let newTasks = data.map((item) => {
      return {
        title: item.title,
        deadline: item.deadline,
        status: item.status,
        user: item.user.username,
      };
    });
    return newTasks;
  }

  deleteTask(id: any) {
    this.service.deleteTask(id).subscribe(
      (res) => {
        this.toastr.success('deleted successfully', 'success');
        this.spinner.hide();
        this.getAllTasks();
      },
      (error) => {
        this.toastr.error(error.error.message);
        this.spinner.hide();
      }
    );
  }
}
