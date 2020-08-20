import { Injectable } from '@angular/core';
import { OrderPosition } from '../shared/interfaces';
import { Position } from '../shared/interfaces';
@Injectable()
export class OrderService {
  public list: OrderPosition[] = [];
  public price = 0;
  add(position: Position) {
    const orderPosition: OrderPosition = Object.assign(
      {},
      {
        name: position.name,
        cost: position.cost,
        quantity: position.quantity,
        _id: position._id,
      }
    );
    const condidate = this.list.find((p) => p._id === orderPosition._id);

    if (condidate) {
      condidate.quantity += orderPosition.quantity;
    } else {
      this.list.push(orderPosition);
    }
    this.computedPrice();
  }
  remove(orderPosition: OrderPosition) {
    const idx = this.list.findIndex((p) => p._id === orderPosition._id);
    this.list.splice(idx, 1);
    this.computedPrice();
  }
  private computedPrice() {
    this.price = this.list.reduce((total, item) => {
      return (total += item.cost * item.quantity);
    }, 0);
  }
  clear() {
    this.list = [];
    this.price = 0;
  }
}
