function calc(a, b, c, d, e) {
  return x => 500 / (a + b * x + c * x * x + d * x * x * x + e * x * x * x * x);
}

export default function dots(gender = 'MALE', bodyWeight) {
  const weight = parseFloat(bodyWeight);
  if (!weight) {
    return null;
  }
  return gender === 'FEMALE' ? dotsFemale(weight) : dotsMale(weight);
}

export const dotsMale = calc(
  -307.75076,
  24.0900756,
  -0.1918759221,
  0.0007391293,
  -0.000001093
);
export const dotsFemale = calc(
  -57.96288,
  13.6175032,
  -0.1126655495,
  0.0005158568,
  -0.0000010706
);
