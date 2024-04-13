declare global {}

interface String {
  /**
   * 为string 实现format功能 "My name is {name} and I am {age} years old.".format({name:"jingfeng",age:23})
   * @param args
   */
  format(...args: (string | { [key: string]: any })[]): string;
}

interface Number {
  /**
   * 获取数字的绝对值
   */
  abs(): number;

  /**
   * 判断数字是否为素数
   */
  isPrime(): boolean;

  /**
   * 获取数字的平方根（牛顿迭代法）
   */
  sqrt(): number;
}

interface Date {
  addSeconds(second: number): Date;
  addMinutes(minute: number): Date;
  addHours(hour: number): Date;
  addDays(day: number): Date;
  addMonths(month: number): Date;
  addYears(year: number): Date;
}

interface Array {
  /**
   * 获取数组中的最大值, 仅限于 number 类型的数组, 否则抛出错误, 该方法不会改变原数组, 目前只支持一维数组。
   */
  max(): number;
  /**
   * 获取数组中的最小值, 仅限于 number 类型的数组, 否则抛出错误, 该方法不会改变原数组, 目前只支持一维数组。
   */
  min(): number;
  /**
   * 获取数组中的平均值, 仅限于 number 类型的数组, 否则抛出错误, 该方法不会改变原数组, 目前只支持一维数组。
   */
  mean(): number;
}
