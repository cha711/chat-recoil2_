import { atom } from 'recoil';

class Counter {
  private _count: number = 0;

  get count() {
    this._count = this._count + 1;
    return String(this._count);
  }
}

const counter = new Counter();

const state = {
  uid: atom({
    key: counter.count,
    default: '',
  }),
  uname: atom({
    key: counter.count,
    default: '名無し',
  }),
  loading: atom({
    key: counter.count,
    default: true,
  }),
  list: atom({
    key: counter.count,
    default: [] as {
      uid: string;
      uname?: string;
      message: string;
      createdAt: number;
    }[],
  }),
  message: atom({
    key: counter.count,
    default: '',
  }),
  su: atom({
    key: counter.count,
    default: 0,
  }),
  snsLogin: atom({
    key: counter.count,
    default: false,
  }),
};

export default state;
