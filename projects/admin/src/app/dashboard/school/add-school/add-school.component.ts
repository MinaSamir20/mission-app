import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialog,
} from '@angular/material/dialog';
import * as moment from 'moment';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ConfirmationComponent } from '../../../shared/components/confirmation/confirmation.component';
import { AddTaskComponent } from '../../tasks-admin/components/add-task/add-task.component';
import { SchoolService } from '../services/school.service';
import { UsersService } from '../../manage-users/services/users.service';

@Component({
  selector: 'app-add-school',
  templateUrl: './add-school.component.html',
  styleUrls: ['./add-school.component.scss'],
})
export class AddSchoolComponent implements OnInit {
  close() {
    let hasChanges = false;
    Object.keys(this.formValues).forEach((item) => {
      if (this.formValues[item] == this.newSchoolForm.value[item]) {
        hasChanges = true;
      }
    });
    if (hasChanges) {
      const dialogRef = this.matDialog.open(ConfirmationComponent, {
        width: '750px',
      });

      dialogRef.afterClosed().subscribe((result) => {
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
    public dialog: MatDialogRef<AddTaskComponent>,
    public matDialog: MatDialog,
    private service: SchoolService,
    private coordinator: UsersService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService
  ) {}
  user: any = [];
  filename = '';
  newSchoolForm!: FormGroup;
  formValues: any;

  ngOnInit(): void {
    this.createForm();
  }

  getAllCoordinators() {
    this.spinner.show();
    this.coordinator.getAllCoordinators().subscribe({
      next: (users) => {
        this.user = users;
        console.log(this.user);
        this.user = this.mappingUsers(users);
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
        ...item,
        coordinator: item.user,
      };
    });
    console.log(newUsers);
    return newUsers;
  }

  createForm() {
    this.newSchoolForm = this.fb.group({
      user: [this.data?.name || '', [Validators.required]],
      image: [this.data?.image || '', [Validators.required]],
      coordinator: [this.data?.coordinator || '', [Validators.required]],
      address: [this.data?.address || '', [Validators.required]],
    });

    this.formValues = this.newSchoolForm.value;
  }

  selectImage(event: any) {
    this.filename = event.target.value;
    this.newSchoolForm.get('image')?.setValue(event.target.files[0]);
  }

  createSchool() {
    this.spinner.show();
    let model = this.prepareFormData();
    this.service.createShool(model).subscribe({
      next: (res) => {
        this.toastr.success('Task Ceated successfully', 'success');
        this.spinner.hide();
        this.dialog.close(true);
      },
      error: (error) => {
        this.spinner.hide();
        this.toastr.error(error.error.message);
      },
    });
  }

  updateSchool() {
    this.spinner.show();
    let model = this.prepareFormData();
    this.service.updateSchool(model, this.data.id).subscribe(
      {next: (res) => {
        this.toastr.success('Task Updated successfully', 'success');
        this.spinner.hide();
        this.dialog.close(true);
      },
      error: (error) => {
        this.spinner.hide();
        this.toastr.error(error.error.message);
      }}
    );
  }

  prepareFormData() {
    let newData = moment(this.newSchoolForm.value['deadline']).format(
      'DD-MM-YYYY'
    );
    let formData = new FormData();
    Object.entries(this.newSchoolForm.value).forEach(([key, value]: any) => {
      if (key == 'deadline') {
        formData.append(key, newData);
      } else {
        formData.append(key, newData);
      }
    });
    return formData;
  }
}
