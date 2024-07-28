import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { TasksService } from '../../services/tasks.service';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
import { ConfirmationComponent } from 'projects/admin/src/app/shared/components/confirmation/confirmation.component';
import { UsersService } from '../../../manage-users/services/users.service';
import { AuthService } from 'projects/admin/src/app/auth/services/auth.service';
import { MatTable } from '@angular/material/table';
import { CategoryService } from '../../../category/services/category.service';

const ELEMENT_DATA: any[] = [
  { question: 'Question 1', answer: 'Answer 1' },
  { question: 'Question 2', answer: 'Answer 2' },
  { question: 'Question 3', answer: 'Answer 3' },
  { question: 'Question 4', answer: 'Answer 4' },
  { question: 'Question 5', answer: 'Answer 5' },
  { question: 'Question 6', answer: 'Answer 6' },
  { question: 'Question 7', answer: 'Answer 7' },
  { question: 'Question 8', answer: 'Answer 8' },
  { question: 'Question 9', answer: 'Answer 9' },
];

@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.scss'],
})
export class AddTaskComponent implements OnInit {
  displayedColumns = ['question', 'answer', 'star'];
  dataSource = ELEMENT_DATA;
  @ViewChild(MatTable) table!: MatTable<any>;

  user: any = [];
  category: any = [];
  missionForm!: FormGroup;
  formValues: any;
  authToken: any;
  dragging = false;
  selectedFile: File | null = null;
  showIcon = false;

  addData(missionId: any = null) {
    this.service.loadContent(missionId).subscribe((data) => {
      this.dataSource.push(...data);
      this.table.renderRows();
    });
  }
  removeData() {
    this.dataSource.pop();
    this.table.renderRows();
  }
  onFileDropped(event: DragEvent) {
    this.selectedFile = event.dataTransfer?.files[0] || null;
    this.showIcon = false;
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
  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    this.showIcon = false;
    this.missionForm.get('attachmentUrl')!.setValue(this.selectedFile);
  }
  close() {
    let hasChanges = false;
    Object.keys(this.formValues).forEach((item) => {
      if (this.formValues[item] == this.missionForm.value[item]) {
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
    private service: TasksService,
    private coordinator: UsersService,
    private categoriess: CategoryService,
    private auth: AuthService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    this.createForm();
    this.getAllCoordinators();
    this.getAllCategories();
    this.authToken = this.auth.getAuthToken();
  }

  formatLabel(value: number): string {
    if (value >= 5) {
      return Math.round(value).toString();
    }
    return `${value}`;
  }

  createForm() {
    this.missionForm = this.fb.group({
      title: [this.data?.title || '', [Validators.required]],
      attachmentUrl: [this.data?.attachmentUrl || null],
      deadline: [
        this.data
          ? new Date(this.data?.deadline.split('-').reverse().join('-'))
              .toISOString
          : '',
        [Validators.required],
      ],
      suggestion: [this.data?.suggestion || '', [Validators.required]],
      satisfaction: [this.data?.satisfaction || '', [Validators.required]],
      categoryId: [this.data?.category.id || '', [Validators.required]],
      status: [this.data?.status || '', [Validators.required]],
      question: [this.data?.status || '', Validators.required],
      answer: [this.data?.status || '', Validators.required],
      schoolIds: [this.data?.school.id || null, [Validators.required]],
      coordinatorIds: [
        this.data?.coordinator.id || null,
        [Validators.required],
      ],
    });

    this.formValues = this.missionForm.value;
  }

  get contentIdsFormArray() {
    return this.missionForm.get('contentIds') as FormArray;
  }

  removeContentItem(index: number) {
    this.contentIdsFormArray.removeAt(index);
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
    });
  }
  getAllCategories() {
    this.spinner.show();
    this.categoriess.getAllCategories().subscribe({
      next: (categories) => {
        this.category = categories.map((item) => {
          return {
            id: item.id,
            name: item.name,
            description: item.description
          };
        });
        this.spinner.hide();
      },
    });
  }

  createTask() {
    if (this.missionForm.valid) {
      this.spinner.show();
      const formData = this.missionForm.value;

      // Set missionId for Content
      formData.content.missionId = formData.categoryId;

      this.service.createTask(formData).subscribe({
        next: (res) => {
          this.toastr.success('Mission Ceated successfully', 'success');
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

  updateTask() {
    this.spinner.show();
    let model = this.prepareFormData();
    this.service.updateTask(model, this.data._id).subscribe(
      (res) => {
        this.toastr.success('Mission Updated successfully', 'success');
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
    let newData = moment(this.missionForm.value['deadline']).format(
      'DD-MM-YYYY'
    );
    let formData = new FormData();
    Object.entries(this.missionForm.value).forEach(([key, value]: any) => {
      if (key == 'deadline') {
        formData.append(key, newData);
      } else {
        formData.append(key, newData);
      }
    });
    return formData;
  }
}
