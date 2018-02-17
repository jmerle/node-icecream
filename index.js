const fs = require('fs');
const util = require('util');
const callsite = require('callsite');
const appRoot = require('app-root-path');
const acorn = require('acorn');
const walk = require('acorn/dist/walk');
const astring = require('astring');

function callOrReturn(thing) {
  if (thing instanceof Function) {
    return thing();
  }

  return thing;
}

function getDefaultPrefix() {
  if (process.platform === 'win32') {
    return '[ic] ';
  }

  return '🍦 ';
}

function getOriginalArguments(site) {
  const lineNr = site.getLineNumber();
  const colNr = site.getColumnNumber();

  const fileContent = fs.readFileSync(site.getFileName()).toString();
  const parsed = acorn.parse(fileContent, { locations: true });

  let original;

  // Walk the AST to find the function call
  walk.simple(parsed, {
    CallExpression(node) {
      if (node.loc.start.line === lineNr && node.loc.start.column === colNr - 1) {
        // Convert the arguments from the AST to a readable string
        original = node.arguments.map(arg => astring.generate(arg));
      }
    },
  });

  return original;
}

function icWithArguments(site, args) {
  const originalArguments = getOriginalArguments(site);

  const outputArr = args.map((arg, i) => {
    const original = originalArguments[i];
    const result = util.inspect(arg, { depth: null });

    return `${original}: ${result}`;
  });

  return outputArr.join(', ');
}

function icWithoutArguments(site) {
  const absolutePath = site.getFileName();

  // Get path relative to the project's root directory, minus the first directory separator
  const relativePath = absolutePath.split(appRoot.path)[1].substr(1);

  const lineNr = site.getLineNumber();

  return `${relativePath}:${lineNr}`;
}

function icWrapper({
  prefix = getDefaultPrefix,
  outputFunction = console.log,
} = {}) {
  return function ic(...args) {
    const site = callsite()[1];
    let output;

    if (args.length > 0) {
      output = icWithArguments(site, args);
    } else {
      output = icWithoutArguments(site);
    }

    outputFunction(`${callOrReturn(prefix)}${output}`);

    // Returns the argument when there is only one, or an array of arguments if there are more.
    if (args.length === 1) {
      return args[0];
    }

    if (args.length > 1) {
      return args;
    }

    return undefined;
  };
}

module.exports = icWrapper;

// Making default import syntax possible in TypeScript
module.exports.default = icWrapper;
