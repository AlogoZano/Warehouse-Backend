// services/positioningService.js
const math = require('mathjs');

const anchors = {
  R1: [0.0, 0.0],
  R2: [1.5, 0.0],
  R3: [1.5, 4.1],
  R4: [0.0, 4.1]
};

A1 = -46.0
A2 = -50.0
A3 = -48.0
A4 = -52.0

n1 = 2.0
n2 = 1.8
n3 = 1.8
n4 = 1.3

function rssiToDistance(rssi, A, n) {
  return Math.pow(10, (A - rssi - 1.0) / (10 * n));
}

function estimatePosition([ rssi1, rssi2, rssi3, rssi4 ]) {
  const d1 = rssiToDistance(rssi1, A1, n1);
  const d2 = rssiToDistance(rssi2, A2, n2);
  const d3 = rssiToDistance(rssi3, A3, n3);
  const d4 = rssiToDistance(rssi4, A4, n4);

  console.log('d1: ', d1)
  console.log('d2: ', d2)
  console.log('d3: ', d3)
  console.log('d4: ', d4)

  const { R1, R2, R3, R4 } = anchors;

  const A_matrix = math.matrix([
    [2 * (R1[0] - R4[0]), 2 * (R1[1] - R4[1])],
    [2 * (R2[0] - R4[0]), 2 * (R2[1] - R4[1])],
    [2 * (R3[0] - R4[0]), 2 * (R3[1] - R4[1])]
  ]);

  const B_vector = math.matrix([
    R1[0]**2 + R1[1]**2 - R4[0]**2 - R4[1]**2 - d1**2 + d4**2,
    R2[0]**2 + R2[1]**2 - R4[0]**2 - R4[1]**2 - d2**2 + d4**2,
    R3[0]**2 + R3[1]**2 - R4[0]**2 - R4[1]**2 - d3**2 + d4**2
  ]);

  const At = math.transpose(A_matrix);
  const AtA = math.multiply(At, A_matrix);
  const AtA_inv = math.inv(AtA);
  const AtB = math.multiply(At, B_vector);

  const position = math.multiply(AtA_inv, AtB);

  return position.toArray(); // [x, y]
}

module.exports = {
  estimatePosition
};