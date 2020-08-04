import { ElementRef } from '@angular/core';

declare var M;

export class MaterialService {
  static toast(massage) {
    M.toast({ html: massage });
  }

  static initializeFloatingButton(ref: ElementRef) {
    M.FloatingActionButton.init(ref.nativeElement);
  }
}
