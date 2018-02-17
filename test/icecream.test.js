const icWrapper = require('../');

describe('icecream', () => {
  describe('prints', () => {
    test('the argument and the result when a single argument is given', () => {
      const prefix = '';
      const outputFunction = jest.fn();
      const ic = icWrapper({ prefix, outputFunction });

      ic('abc');

      expect(outputFunction.mock.calls[0][0]).toBe("'abc': 'abc'");
    });

    test('comma-separated argument-result pairs when multiple arguments are given', () => {
      const prefix = '';
      const outputFunction = jest.fn();
      const ic = icWrapper({ prefix, outputFunction });

      ic('abc', 'def', 789);

      expect(outputFunction.mock.calls[0][0]).toBe("'abc': 'abc', 'def': 'def', 789: 789");
    });

    test('the filename relative to the root of the project and the line number when no arguments are given', () => {
      const prefix = '';
      const outputFunction = jest.fn();
      const ic = icWrapper({ prefix, outputFunction });

      ic();

      const output = outputFunction.mock.calls[0][0];
      expect(output.replace(/\\/g, '/').startsWith('test/icecream.test.js')).toBeTruthy();
    });
  });

  describe('returns', () => {
    const originalLog = console.log;
    console.log = () => {};
    const ic = icWrapper();
    console.log = originalLog;

    test('undefined when called without arguments', () => {
      expect(ic()).toBe(undefined);
    });

    test('single value when called with one argument', () => {
      expect(ic(123)).toBe(123);
    });

    test('array when called with more than one arguments', () => {
      expect(ic(123, 456, '789')).toEqual([123, 456, '789']);
    });
  });

  describe('options', () => {
    describe('prefix', () => {
      test('defaults to text on Windows systems', () => {
        const originalPlatform = process.platform;
        Object.defineProperty(process, 'platform', { value: 'win32' });

        const outputFunction = jest.fn();
        const ic = icWrapper({ outputFunction });

        ic('abc');

        expect(outputFunction.mock.calls[0][0]).toBe("[ic] 'abc': 'abc'");

        Object.defineProperty(process, 'platform', { value: originalPlatform });
      });

      test('defaults to an icecream emoji on non-Windows systems', () => {
        const originalPlatform = process.platform;
        Object.defineProperty(process, 'platform', { value: 'darwin' });

        const outputFunction = jest.fn();
        const ic = icWrapper({ outputFunction });

        ic('abc');

        expect(outputFunction.mock.calls[0][0]).toBe("🍦 'abc': 'abc'");

        Object.defineProperty(process, 'platform', { value: originalPlatform });
      });

      test('can be a string', () => {
        const prefix = 'custom-prefix: ';
        const outputFunction = jest.fn();
        const ic = icWrapper({ prefix, outputFunction });

        ic('abc');

        expect(outputFunction.mock.calls[0][0]).toBe("custom-prefix: 'abc': 'abc'");
      });

      test('can be a function', () => {
        const prefix = () => 'custom-prefix: ';
        const outputFunction = jest.fn();
        const ic = icWrapper({ prefix, outputFunction });

        ic('abc');

        expect(outputFunction.mock.calls[0][0]).toBe("custom-prefix: 'abc': 'abc'");
      });
    });

    describe('outputFunction', () => {
      test('defaults to console.log', () => {
        const originalLog = console.log;
        const logMock = jest.fn();
        console.log = logMock;
        const ic = icWrapper({ prefix: '' });
        console.log = originalLog;

        ic('abc');

        expect(logMock.mock.calls[0][0]).toBe("'abc': 'abc'");
      });

      test('is called when printing', () => {
        const outputFunction = jest.fn();
        const ic = icWrapper({ outputFunction });

        ic();
        ic();
        ic();

        expect(outputFunction.mock.calls.length).toBe(3);
      });
    });
  });
});
