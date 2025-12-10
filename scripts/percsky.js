const earth = document.getElementById("earth");
const output = document.getElementById("output");
const radiusSlider = document.getElementById("radius");
const rhoSlider = document.getElementById("rho0");
const HSlider = document.getElementById("H");
const radiusVal = document.getElementById("radius-val");
const rhoVal = document.getElementById("rho0-val");
const HVal = document.getElementById("H-val");

function integrateAtmosphere(R, rho0, H) {
  const h_max = 100 * H;
  const steps = 100000;
  const dh = h_max / steps;

  let M_atm = 0;
  let M_below = 0;

  for (let i = 0; i <= steps; i++) {
    let h = i * dh;
    let rho = rho0 * Math.exp(-h / H);
    let dM = 4 * Math.PI * Math.pow(R + h, 2) * rho;
    M_atm += dM;

    let r = R + h;
    let f_b = 0.5 * (1 + R / r);
    M_below += f_b * dM;
  }

  return {
    fraction_below: M_below / M_atm,
    fraction_above: 1 - M_below / M_atm
  };
}

function updateEarth() {
  let R = parseFloat(radiusSlider.value) * 1000; // meters
  let rho0 = parseFloat(rhoSlider.value);
  let H = parseFloat(HSlider.value) * 1000;

  radiusVal.innerText = radiusSlider.value;
  rhoVal.innerText = rhoSlider.value;
  HVal.innerText = HSlider.value;

  const scale = 0.0012;
  earth.style.width = `${(R * 2 * scale / 1000).toFixed(0)}vw`;
  earth.style.height = `${(R * 2 * scale / 1000).toFixed(0)}vw`;

  const blurPx = H * scale / 1.5;
  const spreadPx = H * scale / 1.5;
  const alpha = Math.min(rho0 / 5, 1);

  earth.style.boxShadow =
    `0 0 ${blurPx}px ${spreadPx}px rgba(255,255,255,${alpha})`;

  const result = integrateAtmosphere(R, rho0, H);
  output.innerHTML = `
    <strong>Atmosphere below horizon:</strong> ${(100 * result.fraction_below).toFixed(3)}%<br>
    <strong>Atmosphere above horizon:</strong> ${(100 * result.fraction_above).toFixed(3)}%
  `;
}

function applyAll() {
  updateEarth();
}

updateEarth();

document.querySelectorAll("#controls input").forEach(inp => {
  inp.addEventListener("pointerdown", e => e.stopPropagation());
  inp.addEventListener("mousedown", e => e.stopPropagation());
  inp.addEventListener("touchstart", e => e.stopPropagation());
  inp.addEventListener("dragstart", e => e.preventDefault());
});
