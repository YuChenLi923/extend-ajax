
import extendAjax from 'extend-ajax';
describe('Test', () => {
  it('should succeed', (done) => {
    console.log(extendAjax);
    setTimeout(done, 1000);
  });
  it('should fail', () => {
    setTimeout(() => {
      throw new Error('Failed');
    }, 1000);
  });
});
