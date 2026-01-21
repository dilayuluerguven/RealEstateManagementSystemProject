import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-image-uploader',
  templateUrl: './image-uploader.component.html',
  styleUrls: ['./image-uploader.component.css']
})
export class ImageUploaderComponent {

  @Input() currentImageUrl: string | null = null; 
  @Output() fileSelected = new EventEmitter<File | null>(); 
  @Output() deleteExistingImage = new EventEmitter<void>(); 

  previewUrl: string | ArrayBuffer | null = null;
  selectedFile: File | null = null;

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    this.selectedFile = file;

    const reader = new FileReader();
    reader.onload = e => (this.previewUrl = e.target?.result || null);
    reader.readAsDataURL(file);

    this.fileSelected.emit(file);
    this.currentImageUrl = null;
  }

  onRemoveImage() {
    if (this.previewUrl) {
      this.previewUrl = null;
      this.selectedFile = null;
      this.fileSelected.emit(null);
      return;
    }

    this.deleteExistingImage.emit();
  }
}
