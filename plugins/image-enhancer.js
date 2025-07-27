
import enhancePlugin from './enhancePlugin';

export default (context, inject) => {
  inject('enhance', enhancePlugin);
};
