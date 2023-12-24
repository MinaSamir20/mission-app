import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { HttpClient, HttpEventType, HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  dragging = false;
  imageSrc: any = null;
  registerUserForm!: FormGroup;
  registerCoorinatorForm!: FormGroup;
  hide = true;
  gender: any[] = [];
  userId: string | undefined;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private service: AuthService,
    private toastr: ToastrService,
    private router: Router,
    private spinner: NgxSpinnerService
  ) {
    this.createUserForm();
  }
  ngOnInit(): void {
    this.createUserForm();
  }

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

  onFileSelected(e: any) {
    this.setImage(e.target.files);
  }

  setImage(files: FileList) {
    if (files && files.length > 0) {
      const selectedImage = files[0];
      const reader = new FileReader();
      reader.readAsDataURL(selectedImage);
      reader.onload = () => {
        this.imageSrc = reader.result;
        this.registerUserForm.get('imageUrl')!.setValue(selectedImage);
      };
    }
    console.log('Form value updated');
  }

  createUserForm() {
    this.registerUserForm = this.fb.group({
      nameEn: ['', [Validators.required]],
      nameAr: ['', [Validators.required]],
      phoneNumber: [
        '',
        [
          Validators.required,
          Validators.pattern(/^\d{11}$/),
          Validators.minLength(11),
          Validators.maxLength(11),
        ],
      ],
      gender: ['', [Validators.required]],
      imageUrl: [null, [Validators.required]],
      username: [
        '',
        [
          Validators.required,
          Validators.pattern(/^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]+$/),
        ],
      ],
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(20),
        ],
      ],
    });
  }
  createCoordinatorForm() {
    this.registerUserForm = this.fb.group({
      nameEn: ['', [Validators.required]],
      nameAr: ['', [Validators.required]],
      phoneNumber: [
        '',
        [
          Validators.required,
          Validators.pattern(/^\d{11}$/),
          Validators.minLength(11),
          Validators.maxLength(11),
        ],
      ],
      gender: ['', [Validators.required]],
      imageUrl: ['', [Validators.required]],
      username: [
        '',
        [
          Validators.required,
          Validators.pattern(/^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]+$/),
        ],
      ],
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(20),
        ],
      ],
      role: ['coordinator'],
    });
  }

  register() {
    if (this.registerUserForm.valid) {
      const formData = new FormData();
      formData.append('nameAr', this.registerUserForm.get('nameAr')?.value);
      formData.append('nameEn', this.registerUserForm.get('nameEn')?.value);
      formData.append('imageUrl', this.registerUserForm.get('imageUrl')?.value);
      formData.append('password', this.registerUserForm.get('password')?.value);
      formData.append('email', this.registerUserForm.get('email')?.value);
      formData.append('username', this.registerUserForm.get('username')?.value);
      formData.append('gender', this.registerUserForm.get('gender')?.value);
      formData.append(
        'phoneNumber',
        this.registerUserForm.get('phoneNumber')?.value
      );
      this.spinner.show();
      this.service.register(formData).subscribe({
        next: (user) => {
          this.toastr.success('Success', 'Login Success');
          this.spinner.hide();
          this.router.navigate(['/']);
        },
        error: (error) => {
          this.toastr.error('something wrong');
          console.log(error.message);
          this.spinner.hide();
        },
      });
    }
  }

  //................OnlyNumbersAllowed................//
  OnlyNumbersAllowed($event: any): boolean {
    const charCode = $event.which ? $event.which : $event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }
  //.................................................//
}
