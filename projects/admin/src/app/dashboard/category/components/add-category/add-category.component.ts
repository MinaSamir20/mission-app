import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import * as moment from 'moment';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ConfirmationComponent } from 'projects/admin/src/app/shared/components/confirmation/confirmation.component';
import { CategoryService } from '../../services/category.service';

@Component({
  selector: 'app-add-category',
  templateUrl: './add-category.component.html',
  styleUrls: ['./add-category.component.scss']
})
export class AddCategoryComponent implements OnInit{
  close() {
    let hasChanges = false;
    Object.keys(this.formValues).forEach((item) => {
      if (this.formValues[item] == this.newCategoryForm.value[item]) {
        hasChanges = true;
      }
    });
    if (hasChanges) {
      const dialogRef = this.matDialog.open(ConfirmationComponent, {
        width: '750px',
      });

      dialogRef.afterClosed().subscribe((result: any) => {
        if (result) {
        }
      });
    } else {
      this.dialog.close();
    }
  }
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    public dialog: MatDialogRef<AddCategoryComponent>,
    public matDialog: MatDialog,
    private service: CategoryService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService
  ) {}
  users: any = [
    { name: 'Moahmed', id: 1 },
    { name: 'Ali', id: 2 },
    { name: 'Ahmed', id: 3 },
    { name: 'Zain', id: 4 },
  ];
  filename = '';
  newCategoryForm!: FormGroup;
  formValues: any;

  ngOnInit(): void {
    this.createForm();
  }
  createForm() {
    this.newCategoryForm = this.fb.group({
      title: [
        this.data?.title || '',
        [Validators.required, Validators.minLength(5)],
      ],
      userId: [this.data?.user._id || '', [Validators.required]],
      image: [this.data?.image || '', [Validators.required]],
      description: [this.data?.description || '', [Validators.required]],
      deadline: [
        this.data
          ? new Date(this.data?.deadline.split('-').reverse().join('-'))
              .toISOString
          : '',
        [Validators.required],
      ],
    });

    this.formValues = this.newCategoryForm.value;
  }

  selectImage(event: any) {
    this.filename = event.target.value;
    this.newCategoryForm.get('image')?.setValue(event.target.files[0]);
  }

  createCategory() {
    this.spinner.show();
    let model = this.prepareFormData();
    this.service.createCategory(model).subscribe(
      (res) => {
        this.toastr.success('Category Ceated successfully', 'success');
        this.spinner.hide();
        this.dialog.close(true);
      },
      (error) => {
        this.spinner.hide();
        this.toastr.error(error.error.message);
      }
    );
  }

  updateCategory() {
    this.spinner.show();
    let model = this.prepareFormData();
    this.service.updateCategory(model, this.data._id).subscribe(
      (res) => {
        this.toastr.success('Category Updated successfully', 'success');
        this.spinner.hide();
        this.dialog.close(true);
      },
      (error) => {
        this.spinner.hide();
        this.toastr.error(error.error.message);
      }
    );
  }

  prepareFormData() {
    let newData = moment(this.newCategoryForm.value['deadline']).format(
      'DD-MM-YYYY'
    );
    let formData = new FormData();
    Object.entries(this.newCategoryForm.value).forEach(([key, value]: any) => {
      if (key == 'deadline') {
        formData.append(key, newData);
      } else {
        formData.append(key, newData);
      }
    });
    return formData;
  }
}
