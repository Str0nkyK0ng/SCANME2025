const artistLinks: { name: string; url: string | null }[] = [
  { name: 'Camille MacRae', url: null },
  { name: 'Chris Johst', url: null },
  { name: 'David Kelley', url: 'https://www.instagram.com/kelley_atelier/' },
  { name: 'Devin Wilson', url: 'https://www.instagram.com/devinwilsonstudio/' },
  { name: "Emily D'Achiardi", url: 'www.sneakyfelix.com' },
  {
    name: 'Emily Greenberg',
    url: 'https://www.instagram.com/emilygreenberg6/',
  },
  { name: 'Evan Apodaca', url: 'https://www.instagram.com/secretcity.socal/' },
  { name: 'Johnnie Chatman', url: null },
  { name: 'Jonathan Godinez', url: null },
  { name: 'Kevin Clancy', url: null },
  { name: 'Lily Kennard', url: 'https://www.instagram.com/Lily_kennard/' },
  { name: 'MICHAEL OVERTON Brown', url: 'https://michaelovertonbrown.com/' },
];

//get the artistGrid div
const artistGrid = document.getElementById('artistGrid') as HTMLElement | null;
if (!artistGrid) throw new Error('Element #artistGrid not found');

//randomize the order
artistLinks.sort(() => Math.random() - 0.5);

//loop and add
artistLinks.forEach((artist) => {
  // <h3><a href="https://aidanstrong.info" target="_blank" rel="noopener noreferrer">Aidan Strong</a></h3>
  const h3 = document.createElement('h3');
  if (artist.url) {
    const a = document.createElement('a');
    a.href = artist.url;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.textContent = artist.name;
    h3.appendChild(a);
  } else {
    h3.textContent = artist.name;
  }
  artistGrid.appendChild(h3);
});

//randomize the h1s that are children of namesGrid
const namesGrid = document.getElementById('namesGrid') as HTMLElement | null;
if (!namesGrid) throw new Error('Element #namesGrid not found');
const nameElements = Array.from(namesGrid.children);
nameElements.sort(() => Math.random() - 0.5);
namesGrid.innerHTML = '';
nameElements.forEach((el) => {
  namesGrid.appendChild(el);
});
