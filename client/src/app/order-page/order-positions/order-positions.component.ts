import { Component, OnInit } from '@angular/core';
import { PositionsService } from 'src/app/shared/services/positions.service';
import { Observable } from 'rxjs';
import { Position } from '../../shared/interfaces';
import { Route } from '@angular/compiler/src/core';
import { ActivatedRoute, Params } from '@angular/router';
import { switchMap, map } from 'rxjs/operators';
import { OrderService } from '../order.service';
@Component({
  selector: 'app-order-positions',
  templateUrl: './order-positions.component.html',
  styleUrls: ['./order-positions.component.scss'],
})
export class OrderPositionsComponent implements OnInit {
  positions$: Observable<Position[]>;

  constructor(
    private route: ActivatedRoute,
    private positionsService: PositionsService,
    private order: OrderService
  ) {}

  ngOnInit(): void {
    this.positions$ = this.route.params.pipe(
      switchMap((paramas: Params) => {
        return this.positionsService.fetch(paramas['id']);
      }),
      map((positions: Position[]) => {
        return positions.map((position) => {
          position.quantity = 1;
          return position;
        });
      })
    );
  }
  addToOrder(position: Position) {
    console.log('position', position);
    this.order.add(position);
  }
}
