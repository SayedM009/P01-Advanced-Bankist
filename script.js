'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const app = document.querySelector('.app');
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const loginSection = document.querySelector('.login__section');
const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const switchAccount = document.querySelector('.swithc-icon');
const logoutUsername = document.querySelector('.logout-username');
const logoutBtn = document.querySelector('.logout-btn');

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////

// ADDING MOVEMENTS OF THE USER
const addingMovements = function (movements, sort) {
  containerMovements.innerHTML = '';

  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

  movs.forEach((mov, i) => {
    // Check the movment type
    const movement_type = mov > 0 ? 'deposit' : 'withdrawal';
    // Check the amout of the initial number
    const num_before = i > 8 ? '' : '0';
    // <div class="movements__date">3 days ago</div>

    // Movement Row
    const html = `
  <div class="movements__row">
          <div class="movements__type movements__type--${movement_type}">${num_before}${
      i + 1
    } ${movement_type}</div>
          
          <div class="movements__value">${mov}€</div>
        </div>`;

    // Adding the movement to the movements container
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

// CREATEING USER NAMES OF THE ACCOUNTS
function createUserNames(accs) {
  accs.forEach(acc => {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(n => n[0])
      .join('');
  });
}

createUserNames(accounts);

// DISPLAY BALANCE
function calcDisplayBalance(acc) {
  acc.balance = acc.movements.reduce((acc, cur) => acc + cur, 0);
  labelBalance.textContent = `${acc.balance}€`;
}

// DISPLAY SUMMARY
function calcDisplaySummary(acc) {
  // INCOMES
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, cur) => acc + cur, 0);

  labelSumIn.textContent = `${incomes}€`;

  // OUTCOMES
  const outcomes = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, cur) => acc + cur, 0);

  labelSumOut.textContent = `${Math.abs(outcomes)}€`;

  // INTEREST
  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => deposit * 0.012)
    .filter(int => int >= 1)
    .reduce((acc, cur) => acc + cur, 0);

  labelSumInterest.textContent = `${interest}€`;
}

function dischargeUserDetails() {
  inputLoginUsername.value = '';
  inputLoginPin.value = '';
}

// LOGIN

let currentAcc;

btnLogin.addEventListener('click', function (e) {
  // Prevent the default behavior of submit button in HTML form
  e.preventDefault();
  // 1. Chech username & password of the user & remove the user details
  currentAcc = accounts.find(acc => acc.username === inputLoginUsername.value);

  if (!(currentAcc && Number(inputLoginPin.value) === currentAcc.pin)) return;

  // Emptying the login details
  dischargeUserDetails();

  // Set the owner name of the account info logout section
  logoutUsername.textContent = `${currentAcc.owner} `;

  // 2. Hide the login section and display the bank main section
  loginSection.style.display = 'none';
  app.style.display = 'grid';

  // 3. Update the UI
  updatedUI();
});

// LOGOUT
logoutBtn.addEventListener('click', function () {
  // 1. Display the login section and hide the bank main section
  loginSection.style.display = 'flex';
  app.style.display = 'none';
  // 2. Emptying the login details
  dischargeUserDetails();
});

// TRANSFER
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  let amount = +inputTransferAmount.value;
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );

  inputTransferTo.value = inputTransferAmount.value = '';

  if (
    amount > 0 &&
    receiverAcc &&
    receiverAcc.username != currentAcc.username &&
    currentAcc.balance >= amount
  ) {
    currentAcc.movements.push(-amount);
    receiverAcc.movements.push(amount);
    updatedUI();
  }
});

function updatedUI() {
  // 1. Display Movements
  addingMovements(currentAcc.movements);

  // 2. Display Balance
  calcDisplayBalance(currentAcc);

  // 3. Display Summary
  calcDisplaySummary(currentAcc);
}

// SORTING MOVEMENTS
let sorting = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  addingMovements(currentAcc.movements, !sorting);
  sorting = !sorting;
});

//////////////////////////////////////////////////////////////////////
// 1. Task 01

// function checkDogs(par1, par2) {
//   const par1_shallow_copy = par1.slice().slice(1, par1.at(-1) - 1);
//   const combined_parameters = [...par1_shallow_copy, ...par2];
//   combined_parameters.forEach((dog, i) => {
//     console.log(
//       dog >= 3
//         ? `Dog number ${i + 1} is an adult, and is ${dog} years old `
//         : `Dog number ${i + 1} is still a puppy 🐶 `
//     );
//   });
// }

// checkDogs([3, 5, 2, 12, 7], [4, 1, 15, 8, 3]);

// 2. Task 02

// function calcAverageHumanAge(arr) {
//   const humanAge = arr
//     .map(ele => (ele <= 2 ? ele * 2 : 16 + ele * 4))
//     .filter(ele => ele >= 18);

//   const humanAve =
//     humanAge.reduce((acc, ele) => acc + ele, 0) / humanAge.length;
//   console.log(humanAge);
//   console.log(humanAve);
// }

// calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]);

// 3. Task 03

const dogs = [
  { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
  { weight: 8, curFood: 200, owners: ['Matida'] },
  { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
  { weight: 32, curFood: 340, owners: ['Micheal'] },
];

// 1. ForEach
const recommandedDogFood = dogs.forEach(
  dog => (dog.recommendedFood = dog.weight ** 0.75 * 28)
);

// 2. Find Sarah's dog
const sarahsDog =
  dogs.find(dog => dog.owners.includes('Sarah')).curFood >
  dogs.find(dog => dog.owners.includes('Sarah'))?.recommendedFood
    ? "it's eating to much"
    : "it's eating to littel";

// 3. Arrays of owners
const { ownerEatTooMuch, ownerEatTooLittet } = dogs.reduce(
  (owners, cur) => {
    cur.curFood > cur.recommendedFood
      ? owners['ownerEatTooMuch'].push(...cur.owners)
      : owners['ownerEatTooLittet'].push(...cur.owners);
    return owners;
  },
  {
    ownerEatTooMuch: [],
    ownerEatTooLittet: [],
  }
);

// 4. Strings
console.log(ownerEatTooMuch.join(' and ') + "'s dog eat too much");
console.log(ownerEatTooLittet.join(' and ') + "'s dog ease to little");

// 8.

console.log(dogs.slice().sort((a, b) => a.recommendedFood - b.recommendedFood));
