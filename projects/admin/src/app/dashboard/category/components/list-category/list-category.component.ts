import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../../services/category.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import * as moment from 'moment';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { AddCategoryComponent } from '../add-category/add-category.component';

@Component({
  selector: 'app-list-category',
  templateUrl: './list-category.component.html',
  styleUrls: ['./list-category.component.scss'],
})
export class ListCategoryComponent implements OnInit {
  displayedColumns: string[] = ['position', 'name', 'description', 'actions'];
  dataSource: any = [];
  CategoriesFilter!: FormGroup;
  constructor(
    public dialog: MatDialog,
    private service: CategoryService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService
  ) {}

  page: any = 1;
  filteration: any = {
    page: this.page,
    limit: 10,
  };
  timeoutId: any;
  total: any;
  ngOnInit(): void {
    this.getAllCategories();
    this.createform();
  }

  createform() {
    this.CategoriesFilter = this.fb.group({
      title: [''],
      userId: [''],
      fromDate: [''],
      toDate: [''],
    });
  }

  changePage(event: any) {
    this.page = event;
    this.filteration['page'] = event;
    this.getAllCategories();
  }
  search(event: any) {
    this.filteration['keyboard'] = event.value;
    this.page = 1;
    this.filteration['page'] = 1;
    clearTimeout(this.timeoutId);
    this.timeoutId = setTimeout(() => {
      this.getAllCategories();
    }, 2000);
  }

  selectUser(event: any) {
    this.filteration['userId'] = event.value;
    this.page = event;
    this.filteration['page'] = event;
    this.getAllCategories();
  }

  selectStatus(event: any) {
    this.filteration['status'] = event.value.trim();
    this.page = event;
    this.filteration['page'] = event;
    this.getAllCategories();
  }

  getAllCategories() {
    this.spinner.show();
    this.service.getAllCategories().subscribe({
      next: (categories) => {
        this.dataSource = categories;
        this.dataSource = this.mappingCategories(categories);
        this.spinner.hide();
      },
      error: (response) => {
        this.toastr.error(response.error.message);
        this.spinner.hide();
      },
    });
  }

  mappingCategories(data: any[]) {
    let newCategories = data.map((item) => {
      return {
        title: item.name,
        description: item.description,
      };
    });
    return newCategories;
  }

  deleteCategory(id: any) {
    this.service.deleteCategory(id).subscribe(
      (res) => {
        this.toastr.success('deleted successfully', 'success');
        this.spinner.hide();
        this.getAllCategories();
      },
      (error) => {
        this.toastr.error(error.error.message);
        this.spinner.hide();
      }
    );
  }

  updateCategory(element: any) {
    const dialogRef = this.dialog.open(AddCategoryComponent, {
      width: '750px',
      data: element,
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.getAllCategories();
      }
    });
  }

  addCategory() {
    const dialogRef = this.dialog.open(AddCategoryComponent, {
      width: '750px',
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.getAllCategories();
      }
    });
  }
}
