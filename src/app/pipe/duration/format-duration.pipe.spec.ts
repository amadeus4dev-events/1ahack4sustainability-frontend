import { FormatDurationPipe } from './format-duration.pipe';

describe('DurationPipe', () => {
  it('create an instance', () => {
    const pipe = new FormatDurationPipe();
    expect(pipe).toBeTruthy();
  });
});
