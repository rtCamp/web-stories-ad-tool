import { foo } from './indexFile'
console.log('in bar.js', { foo });
export default foo + 1;
