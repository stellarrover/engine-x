import moment from 'moment-timezone';

export class GlobalExtension {
  static init() {
    GlobalExtension.stringInit();
    GlobalExtension.numberInit();
    GlobalExtension.dateInit();
    GlobalExtension.objectInit();
    GlobalExtension.arrayInit();
    GlobalExtension.functionInit();
  }

  private static stringInit() {
    String.prototype.format = function (
      ...args: (string | { [key: string]: any })[]
    ): string {
      let self = this as string;
      if (args.length > 0) {
        if (args.length === 1 && typeof args[0] === 'object') {
          for (const key in args[0]) {
            const propVal = args[0][key];
            if (propVal || propVal == '') {
              const reg = new RegExp('({' + key + '})', 'g');
              self = self.replace(reg, propVal);
            }
          }
        } else {
          for (let i = 0; i < args.length; i++) {
            const paramVal = <string>args[i];
            if (paramVal) {
              const reg = new RegExp('({)' + i + '(})', 'g');
              self = self.replace(reg, paramVal);
            }
          }
        }
      }
      return self.toString();
    };
  }

  private static numberInit() {
    Number.prototype.abs = function (this: number) {
      return Math.abs(this);
    };
    Number.prototype.isPrime = function (this: number) {
      if (this < 2) return false;

      const sqrt = Math.sqrt(this);
      for (let i = 2; i <= sqrt; i++) {
        if (this % i === 0) return false;
      }

      return true;
    };
    Number.prototype.sqrt = function (this: number) {
      if (this < 0) throw new Error('Negative number cannot call sqrt()');

      return Math.sqrt(this);
    };
  }

  private static dateInit() {
    Date.prototype.addSeconds = function (seconds: number) {
      return moment(this).add(seconds, 's').toDate();
    };
    Date.prototype.addMinutes = function (minute: number) {
      return moment(this).add(minute, 'm').toDate();
    };
    Date.prototype.addHours = function (hour: number) {
      return moment(this).add(hour, 'h').toDate();
    };
    Date.prototype.addDays = function (day: number) {
      return moment(this).add(day, 'd').toDate();
    };
    Date.prototype.addMonths = function (month: number) {
      return moment(this).add(month, 'M').toDate();
    };
    Date.prototype.addYears = function (year: number) {
      return moment(this).add(year, 'y').toDate();
    };
  }

  private static objectInit() {}

  private static arrayInit() {
    Array.prototype.max = function () {
      // 添加类型守卫，确保数组中的元素都是 number 类型
      if (this.every((element: any) => typeof element === 'number')) {
        return Math.max(...this);
      } else {
        throw new Error('Only number arrays can call max()'); // 非 number 类型的数组抛出错误
      }
    };
    Array.prototype.min = function () {
      // 添加类型守卫，确保数组中的元素都是 number 类型
      if (this.every((element: any) => typeof element === 'number')) {
        return Math.min(...this);
      } else {
        throw new Error('Only number arrays can call min()'); // 非 number 类型的数组抛出错误
      }
    };
    Array.prototype.mean = function () {
      // 添加类型守卫，确保数组中的元素都是 number 类型
      if (this.every((element: any) => typeof element === 'number')) {
        return this.reduce((acc: any, cur: any) => acc + cur, 0) / this.length;
      } else {
        throw new Error('Only number arrays can call mean()'); // 非 number 类型的数组抛出错误
      }
    };
  }

  private static functionInit() {}
}
