// ekf_mathjs.js
const math = require('mathjs');

class ExtendedKalmanFilter {
  /**
   * @param {Array} initialState   length-4 array [x, y, vx, vy]
   * @param {Array[]} initialP     4×4 covariance matrix
   * @param {number} dt
   * @param {number} accelStd
   * @param {number} rssiNoiseVar
   */
  constructor(initialState, initialP, dt = 0.2, accelStd = 0.1, rssiNoiseVar = 2.0) {
    // State vector and covariance
    this.x = math.matrix(initialState);          // 4×1
    this.P = math.matrix(initialP);             // 4×4
    this.dt = dt;

    // State transition
    this.F = math.matrix([
      [1, 0, dt, 0],
      [0, 1, 0, dt],
      [0, 0, 1,  0],
      [0, 0, 0,  1]
    ]);

    // Process noise Q
    const a2   = accelStd * accelStd;
    const dt2  = dt * dt / 2;
    const dt3  = dt * dt * dt / 3;
    this.Q = math.multiply(a2, math.matrix([
      [ dt3,   0, dt2,   0],
      [   0, dt3,   0, dt2],
      [ dt2,   0,  dt,   0],
      [   0, dt2,   0,  dt]
    ]));

    // Measurement noise R
    this.R = math.diag([rssiNoiseVar, rssiNoiseVar, rssiNoiseVar, rssiNoiseVar]);

    // Path-loss model
    this.d0    = 1.0;
    this.P0    = -48.0;
    this.alpha = 1.8;

    // Anchor positions
    this.anchors = [
      [0.0, 0.0],
      [1.5, 0.0],
      [0.0, 6.3],
      [1.5, 6.3]
    ];
  }

  predict() {
    // x = F * x
    this.x = math.multiply(this.F, this.x);
    // P = F * P * F^T + Q
    this.P = math.add(
      math.multiply(this.F, this.P, math.transpose(this.F)),
      this.Q
    );
  }

  /**
   * @param {number[]} zRssi  length-4 array of RSSI readings
   */
  update(zRssi) {
    const z = math.matrix(zRssi); // 4×1

    // 1) h(x): predicted RSSI
    const [xPos, yPos] = this.x.toArray();
    const hx = [];
    for (let i = 0; i < 4; i++) {
      const [ax, ay] = this.anchors[i];
      let dx = xPos - ax, dy = yPos - ay;
      let dist = Math.hypot(dx, dy);
      if (dist < 1e-6) dist = 1e-6;
      hx.push(this.P0 - 10*this.alpha * Math.log10(dist/this.d0));
    }
    const hxm = math.matrix(hx);

    // Innovation y = z – h(x)
    const y = math.subtract(z, hxm);

    // 2) Jacobian H (4×4)
    const H = math.zeros(4,4).toArray();
    for (let i = 0; i < 4; i++) {
      const [ax, ay] = this.anchors[i];
      let dx = xPos - ax, dy = yPos - ay;
      let dist = Math.hypot(dx, dy);
      if (dist < 1e-6) dist = 1e-6;
      const f = -10 * this.alpha / (Math.log(10) * dist*dist);
      H[i][0] = f * dx;
      H[i][1] = f * dy;
      // H[i][2], H[i][3] remain zero
    }
    const Hm = math.matrix(H);

    // 3) S = H P H^T + R
    const S = math.add(
      math.multiply(Hm, this.P, math.transpose(Hm)),
      this.R
    );

    // 4) K = P H^T S^-1
    const K = math.multiply(
      this.P,
      math.transpose(Hm),
      math.inv(S)
    );

    // 5) x = x + K y
    this.x = math.add(this.x, math.multiply(K, y));

    // 6) P = (I – K H) P
    const I  = math.identity(4);
    const KH = math.multiply(K, Hm);
    let Pnew = math.multiply(math.subtract(I, KH), this.P);

    // Force symmetry: (Pnew + Pnew^T)/2
    this.P = math.multiply(
      0.5,
      math.add(Pnew, math.transpose(Pnew))
    );
  }
}

module.exports = ExtendedKalmanFilter;