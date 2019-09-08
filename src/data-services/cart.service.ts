import { Injectable } from '@angular/core';
import { BehaviorSubject, interval } from 'rxjs';

interface Item {
  id: string;
  quantity: number;
  price: number;
  restaurant: string;
}

@Injectable()
export class CartService {
  cartState = {
    items: [],
    quantity: 0
  };

  private readonly _items = new BehaviorSubject<Item[]>([]);
  // Expose the observable$ part of the _items subject (read only stream)
  readonly items$ = this._items.asObservable();

  private readonly _timer = new BehaviorSubject(new Date());
  readonly timer$ = this._timer.asObservable();

  constructor() {
    this.items$.subscribe(items => {
      let cartQuantity = 0;
      if (items.length > 0) {
        this.saveToLocalStorage(this.itemList);
        items.forEach(item => {
          cartQuantity = cartQuantity + item.quantity;
        });
      }
      // do not directly mutate the state
      // copy the state and modify
      this.cartState = {
        ...this.cartState,
        items: [...items],
        quantity: cartQuantity
      }
    });
  }

  // the getter will return the last value emitted in _items subject
  public get itemList(): Item[] {
    return this._items.getValue();
  }

  // assigning a value to this.items will push it onto the observable
  // and down to all of its subscribers (ex: this.items = [])
  private set items(val: Item[]) {
    this._items.next(val);
  }

  addItem(item: Item) {
    // console.log("ADD ITEM");
    // we assign a new copy of items by adding a new item to it
    // check if the item is already existed in itemList.
    // if the item is not existed in the list add the item
    let index = this.itemList.findIndex(i => i.id === item.id);

    if (index < 0) {
      this.items = [...this.itemList, item];
    }
  }

  updateQuantityOfItem(itemId, quantity) {
    let item = this.itemList.find(item => item.id === itemId);
    if (item) {
      // we need to make a new copy of items array, and the item as well
      // remember, our state must always remain immutable
      // otherwise, on push change detection won't work, and won't update its view
      const index = this.itemList.indexOf(item);
      console.log('[INDEX]', index);
      if (index >= 0) {
        this.itemList[index] = {
          ...item,
          quantity
        };
        this.items = [...this.itemList];
        console.log('ITEM LIST', this.itemList);
      }
    }
  }

  removeItem(itemId: string) {
    this.items = this.itemList.filter(item => item.id !== itemId);
    this.saveToLocalStorage(this.itemList);
  }

  clearCart() {
    this.items = [];
    localStorage.removeItem('items');
  }

  saveToLocalStorage(items) {
    // localStorage.removeItem('items');
    localStorage.setItem('items', JSON.stringify(items));
  }


  // progress: any = 0;
  // overallProgress: any = 0;
  // percent: number = 0;
  // timeToCount: number = 30; // time in minutes
  // // radius = 100;

  // // constructor() {
  // //   this.startTimer();
  // // }

  // startTimer() {



    // const interval = setInterval(() => {

    //   if(this.percent === this.radius) {
    //     clearInterval(interval);
    //   }

    //   this.percent = Math.floor((this.progress / totalSeconds) * 100);
    //   console.log('percent : ', this.percent);
    //   this.progress++;
    // }, 1000);


  // }
}
