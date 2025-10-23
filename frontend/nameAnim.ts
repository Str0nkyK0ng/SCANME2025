// get the nameHeader element
const nameHeader = document.getElementById('nameHeader') as HTMLElement;

const beginningHeader = 'SOUTHERN CALIFORNIA NEW MEDIA EXHBITION';
const endingHeader = 'SCANME';
const totalAnimationDuration = 2000; // total duration in milliseconds
// function to animate the nameHeader text
function animateNameHeader() {
  console.log('Animating name header');
  if (!nameHeader) return;
  const current = beginningHeader.split('');
  const target = endingHeader.split('');
  const maxLen = Math.max(current.length, target.length);
  const diffIndices: number[] = [];
  for (let i = 0; i < maxLen; i++) {
    const cur = current[i] ?? '';
    const tar = target[i] ?? '';
    if (cur !== tar) diffIndices.push(i);
  }
  if (diffIndices.length === 0) {
    nameHeader.textContent = endingHeader;
    return;
  }
  const interval = Math.max(
    1,
    Math.floor(totalAnimationDuration / diffIndices.length)
  );
  let step = 0;
  const timer = setInterval(() => {
    const idx = diffIndices[step++];
    current[idx] = target[idx] ?? '';
    nameHeader.textContent = current.join('');
    if (step >= diffIndices.length) {
      clearInterval(timer);
      nameHeader.textContent = endingHeader;
    }
  }, interval);
}

// call the function to start the animation
animateNameHeader();
