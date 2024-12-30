'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-07-26T17:01:17.194Z',
    '2020-07-28T23:36:17.929Z',
    '2020-08-01T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};
const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2013-11-30T09:48:16.867Z',
    '2085-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2030-02-05T16:33:06.386Z',
  ],
  currency: 'USD',
  locale: 'en-US',
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

const switchAccountBtn = document.querySelector('.users__list--arrows');
const usersList = document.querySelector('.users__list');
const logoutUsername = document.querySelector('.logout-username');
const logoutBtn = document.querySelector('.logout-btn');
const windowModel = document.querySelector('.window-model');
const windowModelSwitchedName = document.querySelector(
  '.switched__account--name'
);
const windowModelOverLay = document.querySelector('.window-model__overlay');
const windowModelYesBtn = document.querySelector('.window-model__btn--yes');
const windowModelNoBtn = document.querySelector('.window-model__btn--no');

/////////////////////////////////////////////////
/////////////////////////////////////////////////

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////

// FORMATING THE DATE
const formatingDate = function (date, locale) {
  const calcDaysPassed = (date1, date2) =>
    Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));

  const dayPassed = calcDaysPassed(new Date(), date);

  if (dayPassed === 0) return 'Today';
  if (dayPassed === 1) return 'Yesterday';
  if (dayPassed <= 7) return `${dayPassed} days ago`;
  else {
    const day = `${date.getDate()}`.padStart(2, 0);
    const month = `${date.getMonth() + 1}`.padStart(2, 0);
    const year = date.getFullYear();
    return new Intl.DateTimeFormat(locale).format(date);
  }
};
// FORMATING THE CURRENCY
const formatingCurrency = function (value, locale, currency) {
  return new Intl.NumberFormat(currentAcc.locale, {
    style: 'currency',
    currency: currentAcc.currency,
  }).format(value);
};

// ADDING MOVEMENTS OF THE USER
const addingMovements = function (acc, sort) {
  containerMovements.innerHTML = '';

  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  movs.forEach((mov, i) => {
    // Check the movment type
    const movement_type = mov > 0 ? 'deposit' : 'withdrawal';
    // Check the amout of the initial number
    const num_before = i > 8 ? '' : '0';

    const date = new Date(acc.movementsDates[i]);
    const formatedDate = formatingDate(date, currentAcc.locale);

    // Movement Row
    const html = `
  <div class="movements__row">
          <div class="movements__type movements__type--${movement_type}">${num_before}${
      i + 1
    } ${movement_type}</div>
          <div class="movements__date">${formatedDate}</div>
          <div class="movements__value">${formatingCurrency(mov)}</div>
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
  labelBalance.textContent = formatingCurrency(acc.balance);
}

// DISPLAY SUMMARY
function calcDisplaySummary(acc) {
  // INCOMES
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, cur) => acc + cur, 0);

  labelSumIn.textContent = formatingCurrency(incomes);

  // OUTCOMES
  const outcomes = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, cur) => acc + cur, 0);

  labelSumOut.textContent = formatingCurrency(Math.abs(outcomes));

  // INTEREST
  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => deposit * 0.012)
    .filter(int => int >= 1)
    .reduce((acc, cur) => acc + cur, 0);

  labelSumInterest.textContent = formatingCurrency(interest);
}

// DISCHARGE USER DETAILS
function dischargeUserDetails() {
  inputLoginUsername.value = '';
  inputLoginPin.value = '';
}

let currentAcc, timer;

// START LOGOUT TIMER FUNCTION
function startLogoutTimer() {
  let time = 300;

  function tick() {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(Math.trunc(time % 60)).padStart(2, 0);
    labelTimer.textContent = `${min}:${sec}`;
    if (time === 0) hideUI();
    time -= 1;
  }

  tick();
  timer = setInterval(tick, 1000);
}

// STOP LOGOUT TIMER FUNCTION
const stopTimer = () => clearInterval(timer);

// LOGIN
function login(e) {
  // 1. Prevent the default behavior of submit button in HTML form
  e.preventDefault();
  // 2. Check username & password of the user & remove the user details
  currentAcc = accounts.find(
    acc => acc.username === inputLoginUsername.value.toLowerCase().trim()
  );
  // 3. Check if the account exsit and password is correct
  if (!(currentAcc && Number(inputLoginPin.value) === currentAcc.pin)) return;

  // 4. Emptying the login details
  dischargeUserDetails();

  // 5. Set the current date and time of the active account.
  const now = new Date();
  const options = {
    hour: 'numeric',
    minute: 'numeric',
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
    hour12: true,
  };
  labelDate.textContent = new Intl.DateTimeFormat(
    currentAcc.locale,
    options
  ).format(now);

  // 6. Run the logout timer
  startLogoutTimer();

  // 7. Set the owner name of the account info logout section
  logoutUsername.innerHTML = `Welcome Back, ${currentAcc.owner}`;

  // 8. Hide the login section and display the bank main section
  loginSection.style.display = 'none';
  app.style.display = 'grid';

  // 9. Update the UI
  updatedUI();

  // 10. Create the user names for the switch list
  createUsersNamesforSwitchList()

  // 11. Hide the window model
  hideWindowModel();
}


// LOGIN WITH MOUSE CLICK
btnLogin.addEventListener('click', login);

// LOGIN WITH ENTER BUTTON
loginSection.addEventListener('keydown', e =>
  e.key === 'Enter' ? login(e) : null
);

// LOGOUT
function hideUI() {
  // 1. Display the login section and hide the bank main section
  loginSection.style.display = 'flex';
  app.style.display = 'none';
  // 2. Emptying the login details
  dischargeUserDetails();
  // 3. Stopping the logout timer
  stopTimer();
}
logoutBtn.addEventListener('click', hideUI);

// TRANSFER
btnTransfer.addEventListener('click', function (e) {
  // 1. Prevent the default behavior of the button of form
  e.preventDefault();
  // 2. Store the amount that will be transferd and corvert it's type to Number
  let amount = +inputTransferAmount.value;
  // 3. Find the right receiver account
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  // 4. Empty the input transfer to and amount
  inputTransferTo.value = inputTransferAmount.value = '';
  // 5. Check if all condition are correct to continue the process
  if (
    amount > 0 &&
    receiverAcc &&
    receiverAcc.username != currentAcc.username &&
    currentAcc.balance >= amount
  ) {
    // 6. Update the balance of the sender and receiver account
    currentAcc.movements.push(-amount);
    receiverAcc.movements.push(amount);

    // 7. Update the movements dates
    currentAcc.movementsDates.push(new Date().toISOString());
    receiverAcc.movementsDates.push(new Date().toISOString());

    // 8. Re-run the logout timer
    stopTimer();

    // 9. Run logout timer
    startLogoutTimer();

    // 10. Update the UI to display the right numbers
    updatedUI();
  }
});

// UPDATE UI
function updatedUI() {
  // 1. Display Movements
  addingMovements(currentAcc);

  // 2. Display Balance
  calcDisplayBalance(currentAcc);

  // 3. Display Summary
  calcDisplaySummary(currentAcc);
}

// SORTING MOVEMENTS
let sorting = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  addingMovements(currentAcc, !sorting);
  sorting = !sorting;
});

// REQUEST LOAN
btnLoan.addEventListener('click', function (e) {
  // 1. Prevent the default behavior of the button of form
  e.preventDefault();
  // 2. Store the amount that will be loaned and convert it's type to Number
  let amount = +inputLoanAmount.value;
  // 3. Check if all condition are correct to continue the process
  if (amount > 0 && currentAcc.movements.some(mov => mov >= amount * 0.1)) {
    // 4. Add the loan to the movements of the current account
    currentAcc.movements.push(amount);
    // 5. Add the loan date to the movements dates of the current account
    currentAcc.movementsDates.push(new Date().toISOString());
    // 6. Update the balance of the current account
    updatedUI();
    // 7. Re-run the logout timer
    stopTimer();
    // 8. Run logout timer
    startLogoutTimer();
  }

  // 6. Empty the load input
  inputLoanAmount.value = '';
});

// CLOSE ACCOUNT
btnClose.addEventListener('click', function () {
  // 1. Find the account to be closed
  const closedUserIndex = accounts.findIndex(
    acc => acc.username === inputCloseUsername.value
  );
  // 2. Check if the account exists and the pin is correct
  if (closedUserIndex >= 0 && currentAcc.pin !== Number(inputClosePin.value))
    return;
  // 3. Delete the account
  accounts.splice(closedUserIndex, 1);
  // 4. Hide the UI & Display the login section
  hideUI();
  // 5. empty the input close user name & pin
  inputCloseUsername.value = inputClosePin.value = '';
});

// SWITCH ACCOUNT
switchAccountBtn.addEventListener('click', function (e) {
  usersList.classList.toggle('display');
});

// CREATE USERS NAMES FOR THE SWITCH LIST
function createUsersNamesforSwitchList() {
  // 1. Empty the users list
  usersList.innerHTML = ""
  // 2. Create the user names for the switch list
  const  userNamesFromAccounts = accounts.map(account => account.username);
  // 3. Add the user names to the switch list
  userNamesFromAccounts.forEach(userName => {
    // 4. Check if the user name is the same as the current account user name
    if (userName === currentAcc.username) return
      // 5. Create the user name list item
      const li = document.createElement(`li`);
      // 6. Add the user name to the list item
      li.classList.add('users__item');
      // 7. Add the user name to the list item
      li.innerHTML = userName
      // 8. Add the list item to the users list 
      usersList.prepend(li);
  });}


// SWITCH ACCOUNT
let swichedUser;
usersList.addEventListener('click', function (e) {
  
  // 1. Check if the user clicked on a user name
  e.target.addEventListener('click', function (e) {
    // 2. Check if the user clicked on a user name
    if (!(e.target.classList.contains('users__item')) && !(e.target.innerHTML !== currentAcc.username)) return
    // 3. Get the user name of the clicked user
      swichedUser = e.target.innerHTML;
      // 4. Display the switch account name in the window model
      windowModelSwitchedName.textContent = swichedUser;
      // 5. Display the window model
      windowModel.classList.add('display__window--model');
  });
});

// SWITCH ACCOUNT YES BUTTON
windowModelYesBtn.addEventListener('click', function () {
  // 1. Hide the UI
  hideUI();
  // 2. Hide the users list
  usersList.classList.remove('display');
  // 3. Pass the switched user to the login input
  inputLoginUsername.value = swichedUser;
  // 4. Focus on the pin input
  inputLoginPin.focus();
});

// HIDE WINDOW MODEL FROM OVERLAY
windowModelOverLay.addEventListener('click', hideWindowModel);

// HIDE WINDOW MODEL NO BUTTON
windowModelNoBtn.addEventListener('click', hideWindowModel);

// HIDE WINDOW MODEL FUNCTION
function hideWindowModel() {
  // 1. Hide the window model
  windowModel.classList.remove('display__window--model');
  // 2. Hide the users list
  usersList.classList.remove('display');
}
//////////////////////////////////////////////////////////////////////
