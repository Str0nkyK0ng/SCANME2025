const header = document.getElementById('tripWire') as HTMLElement | null;
if (!header) throw new Error('Element #tripWire not found');

let springConst = 3;
let damping = 0.9;

let restPosition = 0;
let position = 0;
let velocity = 10;
let deltaTime = 1 / 10;

function animate() {
  let displacement = position - restPosition;
  let acceleration = -springConst * displacement * deltaTime;
  velocity += acceleration * deltaTime;
  velocity *= damping;
  position += velocity;
  if (header) header.style.transform = `translateY(${position}px)`;
  requestAnimationFrame(animate);
}
animate();

header.addEventListener('mouseover', (e) => {
  //if we are close to the center of the image
  let distanceFromCenter =
    e.clientY - (header.offsetTop + header.offsetHeight / 2);
  if (Math.abs(distanceFromCenter) > header.offsetHeight / 2) return;
  if (Math.abs(velocity) < 0.1 && Math.abs(position) < 0.2) velocity += 10;
});
