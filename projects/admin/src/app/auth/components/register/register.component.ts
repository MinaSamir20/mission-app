import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  dragging = false;
  imageSrc: string | ArrayBuffer | null = null;
  registerUserForm!: FormGroup;
  registerCoorinatorForm!: FormGroup;
  hide = true;
  gender: any[] = [];

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

  onDragOver(e: DragEvent){
    e.preventDefault();
  }

  onFileDropped(e: DragEvent) {
    e.preventDefault();
    const files = e.dataTransfer?.files;
    if (files && files.length > 0) {
      this.setImage(files[0]);
    }
  }

  onFileSelected(e: Event) {
    const input = e.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.setImage(input.files[0]);
    }
  }

  onDragLeave(e: DragEvent){
    e.preventDefault();
    this.dragging = false;
  }

  setImage(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      this.imageSrc = reader.result;
      this.registerUserForm.patchValue({ imageUrl: file.name });
      console.log('Form value updated');
    };
    reader.readAsDataURL(file);
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
      console.log(this.registerUserForm.value);
      // this.spinner.show();
      // this.service.register(this.registerForm.value).subscribe({
      //   next: (user) => {
      //     const isAuthenticated = true;
      //     this.toastr.success('Success', 'Login Success');
      //     this.router.navigate(['/']);
      //     this.spinner.hide();

      //   },
      //   error: (error) => {
      //     this.toastr.error("something wrong");
      //     this.spinner.hide();
      //   },
      // });
    }
  }
}
