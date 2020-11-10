
import ajax from 'extend-ajax';
describe('Test', () => {
  it('should succeed', (done) => {
    ajax('/test123', 'get').send().then((res) => {
      console.log(res);
      done();
    });
  });
  it('should fail', () => {
    setTimeout(() => {
      throw new Error('Failed');
    }, 1000);
  });
});
