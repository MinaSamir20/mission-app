import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { AddTaskComponent } from '../add-task/add-task.component';
import { TasksService } from '../../services/tasks.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from 'projects/admin/src/app/auth/services/auth.service';

@Component({
  selector: 'app-list-tasks',
  templateUrl: './list-tasks.component.html',
  styleUrls: ['./list-tasks.component.scss'],
})
export class ListTasksComponent implements OnInit {
  displayedColumns: string[] = [
    'position',
    'mession',
    'category',
    'coordinator',
    'school',
    'actions',
  ];
  dataSource: any = [];
  tasksFilter!: FormGroup;
  users: any = [
    { name: 'Moahmed', id: 1 },
    { name: 'Ali', id: 2 },
    { name: 'Ahmed', id: 3 },
    { name: 'Zain', id: 4 },
  ];
  constructor(
    public dialog: MatDialog,
    private service: TasksService,
    private authService: AuthService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private translate: TranslateService
  ) {}

  canActivate(): boolean {
    if (!this.authService.getAuthToken()) {
      return false;
    }
    this.authService.getAuthToken()
    return true;
  }

  page: any = 1;
  filteration: any = {
    page: this.page,
    limit: 10,
  };
  timeoutId: any;
  total: any;
  ngOnInit(): void {
    this.getAllTasks();
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
    this.service.getAllTasks(null).subscribe({
      next: (mession) => {
        this.dataSource = mession;
        this.dataSource = this.mappingTasks(mession);
        this.spinner.hide();
      },
      error: (response) => {
        this.toastr.error(response.error.message);
        this.spinner.hide();
      }
    });
  }

  mappingTasks(data: any[]) {
    let newTasks = data.map((item) => {
      return {
        // ...item,
        title: item.title,
        content: item.content,
        category: item.categories,
        schools: item.schools,
        coordinator: item.coordinators
      };
    });
    console.log(newTasks);
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

  updateTask(element: any) {
    const dialogRef = this.dialog.open(AddTaskComponent, {
      width: '46.875rem',
      data: element,
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.getAllTasks();
      }
    });
  }

  addTask() {
    const dialogRef = this.dialog.open(AddTaskComponent, {
      width: '46.875rem',
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.getAllTasks();
      }
    });
  }
}
