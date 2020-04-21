// Will not work even if switched order, true cycle
export { default as foo } from './foo';
export { default as bar } from './bar';

// Wrong order - not working, we want to detect that case
export { default as fizz } from './fizz';
export { default as buzz } from './buzz';

// Switching order - it works now
// export { default as buzz } from './buzz';
// export { default as fizz } from './fizz';
