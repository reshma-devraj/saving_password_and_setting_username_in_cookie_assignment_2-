const MIN = 100;
const MAX = 999;
const pinInput = document.getElementById('pin');
const sha256HashView = document.getElementById('sha256-hash');
const resultView = document.getElementById('result');

// Store data in local storage
function store(key, value) {
  localStorage.setItem(key, value);
}

// Retrieve data from local storage
function retrieve(key) {
  return localStorage.getItem(key);
}

// Generate a random 3-digit number
function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Clear local storage
function clearStorage() {
  localStorage.clear();
}

// Generate SHA256 hash
async function sha256(message) {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

// Get the hash (and ensure we store the original number too)
async function getSHA256Hash() {
  let storedNumber = retrieve('originalNumber');
  let storedHash = retrieve('sha256');

  if (storedNumber && storedHash) {
    return storedHash;
  }

  // Generate a new random number and hash it
  storedNumber = getRandomNumber(MIN, MAX);
  storedHash = await sha256(storedNumber.toString());

  // Store both values
  store('originalNumber', storedNumber);
  store('sha256', storedHash);

  return storedHash;
}

async function main() {
  sha256HashView.innerHTML = 'Calculating...';
  const hash = await getSHA256Hash();
  sha256HashView.innerHTML = hash;
}

async function checkUserInput() {
  const pin = pinInput.value;

  if (pin.length !== 3) {
    resultView.innerHTML = '💡 Please enter a 3-digit number!';
    resultView.classList.remove('hidden');
    return;
  }

  const originalNumber = retrieve('originalNumber');

  if (pin === originalNumber) {
    resultView.innerHTML = '🎉 Correct! You found the number!';
    resultView.classList.add('success');
  } else {
    resultView.innerHTML = '❌ Incorrect! Try again!';
  }

  resultView.classList.remove('hidden');
}

// Ensure input only allows numbers and max 3 digits
pinInput.addEventListener('input', (e) => {
  pinInput.value = e.target.value.replace(/\D/g, '').slice(0, 3);
});

// Attach event listener
document.getElementById('check').addEventListener('click', checkUserInput);

// Start the script
main();
