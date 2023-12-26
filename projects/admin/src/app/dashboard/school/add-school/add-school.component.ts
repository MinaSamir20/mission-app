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
import { AddressService } from '../services/address.service';
import { AuthService } from '../../../auth/services/auth.service';

@Component({
  selector: 'app-add-school',
  templateUrl: './add-school.component.html',
  styleUrls: ['./add-school.component.scss'],
})
export class AddSchoolComponent implements OnInit {
  user: any = [];
  government: any = [];
  filename = '';
  newSchoolForm!: FormGroup;
  newAddressForm!: FormGroup;
  formValues: any;
  authToken: any;
  imageSrc: any = null;
  dragging = false;
  fileInput: any;

  onFileDropped(e: any) {
    this.setImage(e.dataTransfer?.files);
    this.dragging = false;
  }

  onDragOver(e: DragEvent) {
    e.preventDefault();
    this.dragging = true;
  }

  onDragLeave(e: DragEvent) {
    e.preventDefault();
    this.dragging = false;
  }
  onImageSelected(e: any) {
    this.setImage(e.target.files);
  }

  setImage(files: FileList) {
    if (files && files.length > 0) {
      const selectedImage = files[0];
      const reader = new FileReader();
      reader.readAsDataURL(selectedImage);
      reader.onload = () => {
        this.imageSrc = reader.result;
        this.newSchoolForm.get('imageUrl')!.setValue(selectedImage);
      };
    }
    console.log('Form value updated');
  }
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
    private addressService: AddressService,
    private coordinator: UsersService,
    private auth: AuthService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    this.createForm();
    this.getAllCoordinators();
    this.getAllGoverments();
    this.authToken = this.auth.getAuthToken();
  }

  getAllCoordinators() {
    this.spinner.show();
    this.coordinator.getAllCoordinators().subscribe({
      next: (users) => {
        this.user = users.map((item) => {
          return {
            id: item.id,
            coordinatorEn: item.user.nameEn,
            coordinatorAr: item.user.nameAr,
          };
        });
        this.spinner.hide();
      },
      error: (response) => {
        this.toastr.error(response.error.message);
        this.spinner.hide();
      },
    });
  }

  getAllGoverments() {
    const auth = this.auth.getAuthToken();
    this.addressService.getAllGovernment(auth!).subscribe({
      next: (government) => {
        this.government = government;
      },
    });
  }

  createForm() {
    this.newSchoolForm = this.fb.group({
      schoolName: [this.data?.schoolName || '', [Validators.required]],
      imageUrl: [this.data?.imageUrl || null, [Validators.required]],
      coordinatorId: [this.data?.coordinatorId || null, [Validators.required]],
      addressId: [this.data?.addressId || null, [Validators.required]],
    });
    this.newAddressForm = this.fb.group({
      cityName: [this.data?.address.cityName || '', [Validators.required]],
      street: [this.data?.address.street || '', [Validators.required]],
      govermentId: [
        this.data?.address.govermentId || '',
        [Validators.required],
      ],
    });
    this.formValues = this.newSchoolForm.value;
  }

  createSchool() {
    const auth = this.auth.getAuthToken();
    this.spinner.show();
    this.addressService
      .createAddress(this.newAddressForm.value, auth!)
      .subscribe({
        next: (res: any) => {
          if (res && res !== undefined) {
            this.newSchoolForm.patchValue({ addressId: res });
            // console.log(this.newSchoolForm.value);
            let formData = new FormData();
            formData.append(
              'schoolName',
              this.newSchoolForm.get('schoolName')?.value
            );
            formData.append(
              'imageUrl',
              this.newSchoolForm.get('imageUrl')?.value
            );
            formData.append(
              'coordinatorId',
              this.newSchoolForm.get('coordinatorId')?.value
            );
            formData.append(
              'addressId',
              this.newSchoolForm.get('addressId')?.value
            );
            this.service.createShool(formData, auth!).subscribe({
              next: (res) => {
                this.toastr.success('School Ceated successfully', 'success');
                this.spinner.hide();
                this.dialog.close(true);
              },
              error: (error) => {
                this.spinner.hide();
                this.toastr.error(error.error.message);
                console.log(error.error.message);
              },
            });
          }
        },
        error: (error) => {
          this.spinner.hide();
          this.toastr.error(error.error.message);
        },
      });
  }

  updateSchool() {
    let formData = new FormData();
    Object.keys(this.newSchoolForm.value).forEach((key) => {
      formData.append(key, this.newSchoolForm.value[key]);
    });
    // formData.append('schoolName', this.newSchoolForm.get('schoolName')?.value);
    // formData.append('imageUrl', this.newSchoolForm.get('imageUrl')?.value);
    // formData.append('addressId', this.newSchoolForm.get('addressId')?.value);
    // formData.append(
    //   'coordinatorId',
    //   this.newSchoolForm.get('coordinatorId')?.value
    // );
    this.spinner.show();
    this.service.updateSchool(formData, this.data.id).subscribe({
      next: (res) => {
        this.toastr.success('School Updated successfully', 'success');
        this.spinner.hide();
        this.dialog.close(true);
      },
      error: (error) => {
        this.spinner.hide();
        this.toastr.error(error.error.message);
      },
    });
  }
}
