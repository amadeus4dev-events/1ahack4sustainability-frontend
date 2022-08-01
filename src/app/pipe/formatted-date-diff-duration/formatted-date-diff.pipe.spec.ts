import { FormattedDateDiffPipe } from './formatted-date-diff.pipe';

describe('DateDiffPipe', () => {
  it('create an instance', () => {
    const pipe = new FormattedDateDiffPipe();
    expect(pipe).toBeTruthy();
  });
});
