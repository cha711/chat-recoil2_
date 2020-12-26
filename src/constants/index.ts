export default class Constant {
  constructor() {
    throw new Error('new禁止');
  }

  static get title(): string {
    return 'リアルタイムチャット';
  }

  static get pushNotification() {
    return {
      url: 'https://yuzuru-line.netlify.app/.netlify/functions/api/v1/push',
      authorization: 'Bearer abc',
    };
  }

  static get table() {
    return {
      boards: 'boards',
      connections: 'connections',
    };
  }
}
