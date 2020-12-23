import { ExtendAjax } from "./index";
let stack: ExtendAjax[] = [];
let preHref = '';
function handleAutoAbort(ajax: ExtendAjax) {
  const href = window.location.href;
  if (preHref && href !== preHref && stack.length) {
    stack.forEach((item) => {
      item.abort();
    });
    stack = [];
  }
  stack.push(ajax);
  preHref = href;
  const index = stack.length - 1;
  ajax.on('end', () => {
    stack.splice(index, 1);
  });
}
export default handleAutoAbort;
