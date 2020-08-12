import {
  Component,
  OnInit,
  Input,
  ViewChild,
  ElementRef,
  AfterViewInit,
  OnDestroy,
} from '@angular/core';
import { PositionsService } from 'src/app/shared/services/positions.service';
import { Position } from 'src/app/shared/interfaces';
import {
  MaterialService,
  MaterialInstance,
} from 'src/app/shared/classes/material.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-positions-form',
  templateUrl: './positions-form.component.html',
  styleUrls: ['./positions-form.component.scss'],
})
export class PositionsFormComponent
  implements OnInit, AfterViewInit, OnDestroy {
  @Input('categoryId') categoryId: string;
  @ViewChild('modal') modalRef: ElementRef;
  positions: Position[] = [];
  loading = false;
  modal: MaterialInstance;
  form: FormGroup;
  positionId = null;
  constructor(private positionsService: PositionsService) {}

  ngOnInit() {
    this.form = new FormGroup({
      name: new FormControl(null, Validators.required),
      cost: new FormControl(1, [Validators.required, Validators.min(1)]),
    });

    this.loading = true;
    this.positionsService.fetch(this.categoryId).subscribe((positions) => {
      this.positions = positions;
      this.loading = false;
    });
  }
  ngAfterViewInit() {
    this.modal = MaterialService.initModal(this.modalRef);
  }
  ngOnDestroy() {
    this.modal.destroy();
  }
  onSelectPosition(position: Position) {
    this.positionId = position._id;
    this.form.patchValue({
      name: position.name,
      cost: position.cost,
    });
    this.modal.open();

    MaterialService.apdateTextInputs();
  }
  onAddPosition() {
    this.positionId = null;
    this.modal.open();

    this.form.reset({ name: null, cost: 1 });

    MaterialService.apdateTextInputs();
  }

  onCancel() {
    this.modal.close();
  }
  onDeletePosition(event: Event, position: Position) {
    event.stopPropagation();
    const decision = window.confirm(
      `Вы уверены что хотите удалить "${position.name}"`
    );
    if (decision) {
      this.positionsService.delete(position).subscribe(
        (responce) => {
          const idx = this.positions.findIndex(
            (p) => p._id === position.category
          );
          this.positions.splice(idx, 1);
          MaterialService.toast(responce.message);
        },
        (error) => MaterialService.toast(error.error.mesage)
      );
    }
  }

  onSubmit() {
    this.form.disable();
    const newPosition: Position = {
      name: this.form.value.name,
      cost: this.form.value.cost,
      category: this.categoryId,
    };

    const completed = () => {
      this.modal.close();
      this.form.reset({
        nama: '',
        cost: 1,
      });
      this.form.enable();
    };

    if (this.positionId) {
      newPosition._id = this.positionId;
      this.positionsService.update(newPosition).subscribe(
        (position) => {
          const idx = this.positions.findIndex((p) => p._id === position._id);
          this.positions[idx] = position;
          MaterialService.toast('Позиция созранена');
        },
        (error) => {
          this.form.enable();
          MaterialService.toast(error.error.message);
        },

        completed
      );
    } else {
      this.positionsService.create(newPosition).subscribe(
        (position) => {
          console.log('position', position);
          MaterialService.toast('Позиция создана');
          this.positions.push(position);
        },
        (error) => {
          this.form.enable();
          MaterialService.toast(error.error.message);
        },

        completed
      );
    }
  }
}
