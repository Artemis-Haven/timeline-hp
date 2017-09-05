import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';

import { ReferenceService } from '../services/reference.service';
import { ToastComponent } from '../shared/toast/toast.component';

@Component({
  selector: 'app-references',
  templateUrl: './reference.component.html',
  styleUrls: ['./reference.component.scss']
})
export class ReferenceComponent implements OnInit {

  reference = {};
  references = [];
  isLoading = true;
  isEditing = false;

  addReferenceForm: FormGroup;
  name = new FormControl('', Validators.required);
  displayedDate = new FormControl('', Validators.required);
  startDate = new FormControl('', Validators.required);
  endDate = new FormControl('', Validators.required);

  constructor(private referenceService: ReferenceService,
              private formBuilder: FormBuilder,
              private http: Http,
              public toast: ToastComponent) { }

  ngOnInit() {
    this.getReferences();
    this.addReferenceForm = this.formBuilder.group({
      name: this.name,
      displayedDate: this.displayedDate,
      startDate: this.startDate,
      endDate: this.endDate
    });
  }

  getReferences() {
    this.referenceService.getReferences().subscribe(
      data => this.references = data,
      error => console.log(error),
      () => this.isLoading = false
    );
  }

  addReference() {
    this.referenceService.addReference(this.addReferenceForm.value).subscribe(
      res => {
        const newReference = res.json();
        this.references.push(newReference);
        this.addReferenceForm.reset();
        this.toast.setMessage('item added successfully.', 'success');
      },
      error => console.log(error)
    );
  }

  enableEditing(reference) {
    this.isEditing = true;
    this.reference = reference;
  }

  cancelEditing() {
    this.isEditing = false;
    this.reference = {};
    this.toast.setMessage('item editing cancelled.', 'warning');
    // reload the references to reset the editing
    this.getReferences();
  }

  editReference(reference) {
    this.referenceService.editReference(reference).subscribe(
      res => {
        this.isEditing = false;
        this.reference = reference;
        this.toast.setMessage('item edited successfully.', 'success');
      },
      error => console.log(error)
    );
  }

  deleteReference(reference) {
    if (window.confirm('Are you sure you want to permanently delete this item?')) {
      this.referenceService.deleteReference(reference).subscribe(
        res => {
          const pos = this.references.map(elem => elem._id).indexOf(reference._id);
          this.references.splice(pos, 1);
          this.toast.setMessage('item deleted successfully.', 'success');
        },
        error => console.log(error)
      );
    }
  }

}
