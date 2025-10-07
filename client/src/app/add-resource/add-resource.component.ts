import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpService } from '../../services/http.service';

@Component({
  selector: 'app-add-resource',
  templateUrl: './add-resource.component.html',
  styleUrls: ['./add-resource.component.scss']
})
export class AddResourceComponent implements OnInit {
  itemForm: FormGroup;
  resourceList: any[] = [];
  paginatedResources: any[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalPages: number = 1;
  showError: boolean = false;
  errorMessage: string = '';
  showSuccess: boolean = false;
  successMessage: string = '';
  searchQuery: string = '';
  displayedColumns: string[] = ['id', 'name', 'type', 'status', 'actions'];

  constructor(
    private formBuilder: FormBuilder,
    private httpService: HttpService,
    private router: Router
  ) {
    this.itemForm = this.formBuilder.group({
      name: ['', Validators.required],
      type: ['', Validators.required],
      availability: [true, Validators.required]
    });
  }

  ngOnInit(): void {
    this.getResources();
  }

  onSubmit() {
    if (this.itemForm.valid) {
      this.httpService.addResource(this.itemForm.value).subscribe(
        (data) => {
          console.log('Resource added:', data);
          this.showSuccessMessage('Resource added successfully!');
          this.itemForm.reset({ availability: true });
          this.getResources();
        },
        (error) => {
          this.showErrorMessage('Failed to add resource: ' + error.message);
        }
      );
    } else {
      this.markFormGroupTouched(this.itemForm);
      this.showErrorMessage('Please fill in all required fields.');
    }
  }

  getResources() {
    this.httpService.GetAllResources().subscribe(
      (data) => {
        this.resourceList = data;
        this.totalPages = Math.ceil(this.resourceList.length / this.itemsPerPage);
        this.setPaginatedResources();
      },
      (error) => {
        this.showErrorMessage('Failed to load resources: ' + error.message);
      }
    );
  }

  setPaginatedResources() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedResources = this.resourceList.slice(startIndex, endIndex);
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.setPaginatedResources();
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.setPaginatedResources();
    }
  }

  onSearch() {
    if (this.searchQuery.trim() === '') {
      this.setPaginatedResources();
      return;
    }

    const query = this.searchQuery.toLowerCase().trim();
    this.paginatedResources = this.resourceList.filter(resource => 
      resource.resourceID.toString().includes(query) || 
      resource.name.toLowerCase().includes(query)
    );
    
    this.currentPage = 1;
    this.totalPages = Math.ceil(this.paginatedResources.length / this.itemsPerPage);
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  private showSuccessMessage(message: string) {
    this.showSuccess = true;
    this.successMessage = message;
    setTimeout(() => {
      this.showSuccess = false;
      this.successMessage = '';
    }, 3000); // Message disappears after 3 seconds
  }

  private showErrorMessage(message: string) {
    this.showError = true;
    this.errorMessage = message;
    setTimeout(() => {
      this.showError = false;
      this.errorMessage = '';
    }, 5000);
  }

  getAvailableCount(): number {
    return this.resourceList.filter(r => r.availability).length;
  }

  getUnavailableCount(): number {
    return this.resourceList.filter(r => !r.availability).length;
  }

  navigateToAllocations = () => {
    this.router.navigate(['/resource-allocate']);
  }

  editResource(resource: any): void {
    // Populate form with resource data for editing
    this.itemForm.patchValue({
      name: resource.name,
      type: resource.type,
      availability: resource.availability
    });
    // Scroll to form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  deleteResource(id: number): void {
    if (confirm('Are you sure you want to delete this resource?')) {
      // For now, just show a message since delete endpoint may not exist
      this.showSuccessMessage('Resource deletion feature coming soon!');
      // Uncomment when backend endpoint is ready:
      // this.httpService.deleteResource(id).subscribe(
      //   () => {
      //     this.showSuccessMessage('Resource deleted successfully!');
      //     this.getResources();
      //   },
      //   (error: any) => {
      //     this.showErrorMessage('Failed to delete resource: ' + error.message);
      //   }
      // );
    }
  }
}