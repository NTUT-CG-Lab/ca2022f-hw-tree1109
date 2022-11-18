/**
 * cubism parameter binding helper
 */
import { OneEuroFilter } from './OneEuroFilter.js';

let av1 = null;
let lb = [0],
  rb = [0];
let avg = (p, c) => p + c;

const pre = document.getElementById('parameters2');

// 將標示點做one euro filter
const filterX = new OneEuroFilter(30, 0.0094, 0.005, 1);
const filterY = new OneEuroFilter(30, 0.0094, 0.005, 1);
const filterZ = new OneEuroFilter(30, 0.0094, 0.005, 1);
const filterLB = new OneEuroFilter(30, 0.0094, 0.0005, 1);
const filterRB = new OneEuroFilter(30, 0.0094, 0.0005, 1);
const filterLEye = new OneEuroFilter(30, 0.0015, 0.0000007, 0.5);

window.setCutoff = mc => {
  filterX.setMinCutoff(mc);
  filterY.setMinCutoff(mc);
  filterZ.setMinCutoff(mc);
};

window.filterSetBeta = beta => {
  filterX.setBeta(beta);
  filterY.setBeta(beta);
  filterZ.setBeta(beta);
};

//載入cubism model => 使用敘豪學長版本
async function loading() {
  try {
    av1 = await loadModel('src/resource/oppo/oppo.model3.json');
    let step = () => {
      if (window.faceXRotation) {
        lb.push(window.EyeOpenL * 3);
        lb.shift();
        rb.push(window.EyeOpenR * 3);
        rb.shift();
        let x =
          (window.faceXRotation - window.faceXOffset) * (180 / Math.PI) || 0;
        let y =
          (window.faceYRotation - window.faceYOffset) * (180 / Math.PI) || 0;
        let z =
          (window.faceZRotation - window.faceZOffset) * (180 / Math.PI) || 0;
        if (y > 180) y -= 360;
        if (x > 180) x -= 360;
        if (z > 180) z -= 360;
        x = filterX.filter(x, Date.now());
        y = filterY.filter(y, Date.now());
        z = filterZ.filter(z, Date.now());
        let f_lb = filterLB.filter(lb[0], Date.now());
        let f_rb = filterRB.filter(rb[0], Date.now());
        av1.character.setMotion(
          y,
          -x * 2,
          -z * 2,
          1,
          window.faceMouthOpen * 10
        );
        av1.character.setEyes(y * 0.1, -x * 0.2, f_lb, f_rb);
        pre.innerHTML = `X: ${x}\nY: ${y}\nZ: ${z}\nBL: ${f_lb} \nBR: ${f_rb}`;
      }
      requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  } catch (err) {
    console.error(err);
    // await loading();
  }
}

window.onload = () => {
  window.initFramework();
  loading();
};

let calibrate = document.getElementById('calibrate');
calibrate.onclick = () => {
  window.faceXOffset = window.faceXRotation;
  window.faceYOffset = window.faceYRotation;
  window.faceZOffset = window.faceZRotation;
  leftEyeVectorOffset = leftEyeVector;
  rightEyeVectorOffset = rightEyeVector;
};
