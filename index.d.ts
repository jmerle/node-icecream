interface IceCreamOptions {
  prefix?: string|(() => string);
  outputFunction?: ((output: string) => void);
}

interface ic {
  (): void;
  <T>(arg: T): T;
  (args: any[]): any[];
}

interface icWrapper {
  (options?: IceCreamOptions): ic;
}

declare const icWrapper: icWrapper;

export default icWrapper;
