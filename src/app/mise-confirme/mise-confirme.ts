import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-mise-confirme',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mise-confirme.html',
  styleUrls: ['./mise-confirme.css']
})
export class MiseConfirme {
  @Input() isOpen = false;
  @Input() montantMise = 0;
  @Output() close = new EventEmitter<void>();

  onClose() {
    this.close.emit();
  }
}
