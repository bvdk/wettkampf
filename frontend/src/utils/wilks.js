function calc (a, b, c, d, e, f) {
  return (x) => 500 / (a + b*x + c*x*x + d*x*x*x + e*x*x*x*x + f*x*x*x*x*x);
}

export default function wilks(gender = 'MALE', bodyWeight) {

  const weight = parseFloat(bodyWeight);
  if (!weight){
    return null;
  }
  return gender === 'FEMALE' ? wilksFemale(weight) : wilksMale(weight);
}

export const wilksMale = calc(-216.0475144, 16.2606339, -0.002388645, -0.00113732, 7.01863E-06, -1.291E-08);
export const wilksFemale = calc(594.31747775582, -27.23842536447, 0.82112226871, -0.00930733913, 0.00004731582, -0.00000009054);
