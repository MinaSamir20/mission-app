import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
import * as moment from 'moment';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ConfirmationComponent } from 'projects/admin/src/app/shared/components/confirmation/confirmation.component';
import { UsersService } from '../../services/users.service';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent {
  close() {
    let hasChanges = false;
    Object.keys(this.formValues).forEach((item) => {
      if (this.formValues[item] == this.newUserForm.value[item]) {
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
    public dialog: MatDialogRef<AddUserComponent>,
    public matDialog: MatDialog,
    private service: UsersService,
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
  newUserForm!: FormGroup;
  formValues: any;

  ngOnInit(): void {
    this.createForm();
  }
  createForm() {
    this.newUserForm = this.fb.group({
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

    this.formValues = this.newUserForm.value;
  }

  selectImage(event: any) {
    this.filename = event.target.value;
    this.newUserForm.get('image')?.setValue(event.target.files[0]);
  }

  createUser() {
    this.spinner.show();
    let model = this.prepareFormData();
    this.service.createCoordinator(model).subscribe(
      (res) => {
        this.toastr.success('Task Ceated successfully', 'success');
        this.spinner.hide();
        this.dialog.close(true);
      },
      (error) => {
        this.spinner.hide();
        this.toastr.error(error.error.message);
      }
    );
  }

  updateUser() {
    this.spinner.show();
    let model = this.prepareFormData();
    this.service.updateCoordinator(model, this.data._id).subscribe(
      (res) => {
        this.toastr.success('Task Updated successfully', 'success');
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
    let newData = moment(this.newUserForm.value['deadline']).format(
      'DD-MM-YYYY'
    );
    let formData = new FormData();
    Object.entries(this.newUserForm.value).forEach(([key, value]: any) => {
      if (key == 'deadline') {
        formData.append(key, newData);
      } else {
        formData.append(key, newData);
      }
    });
    return formData;
  }
}
