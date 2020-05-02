import { parseInitialValue, isValidDate } from './datetimes';
import { UI } from '@inrupt/lit-generated-vocab-common';

describe('Parser should return the expected values', () => {
  const time = '19:00:34';
  const date = '2012-12-12';
  const dateTime = '2019-11-29T04:00:00.000Z';

  it('should parse times correctly', () => {
    const [hours, minutes, seconds] = time.split(':').map(i => parseInt(i, 10));
    const result = parseInitialValue(time, UI.TimeField.value);

    expect(result.getHours()).toBe(hours);
    expect(result.getMinutes()).toBe(minutes);
    expect(result.getSeconds()).toBe(seconds);
  });

  it('should parse dates correctly', () => {
    const [year, month, day] = date.split('-').map(i => parseInt(i, 10));
    const result = parseInitialValue(date, UI.DateField.value);

    expect(result.getFullYear()).toEqual(year);
    // Months start at 0
    expect(result.getMonth()).toEqual(month - 1);
    expect(result.getDate()).toEqual(day);
  });

  it('should parse datetimes correctly', () => {
    expect(parseInitialValue(dateTime, UI.DateTimeField.value)).toEqual(new Date(dateTime));
  });
});

describe('Datetime checker should validate values', () => {
  it('should validate now as a date', () => {
    expect(isValidDate(new Date())).toEqual(true);
  });

  it('should fail with anything not a date object', () => {
    expect(isValidDate('string')).toEqual(false);
    expect(isValidDate(123)).toEqual(false);
    expect(isValidDate({})).toEqual(false);
    expect(isValidDate([new Date()])).toEqual(false);
    expect(isValidDate({ date: new Date() })).toEqual(false);
  });

  it('should return false with a "Invalid date" Date object', () => {
    expect(isValidDate(new Date('not a date representation'))).toBe(false);
  });
});
