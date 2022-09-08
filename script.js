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
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2020-07-12T10:51:36.790Z',
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

const accounts = [account1, account2];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

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

//FUNCTION-DISPLAY USER TRANSACTION DATA
const displayMovements = function (acc, sort = false) {
  //Empty the entire movements container
  /*NOTE:
   * textContents is all text contained by an element and all its children that are for formatting purposes only.
   * innerText returns all text contained by an element and all its child elements.
   * innerHtml returns all text, including html tags, that is contained by an element.
   */
  containerMovements.innerHTML = '';

  //DEPENDING ON SORT CLICKED, SORT BY TRANSACTION DATE VERSUS ASCENDING ORDER SWITCH
  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;
  // slice() to make a shallow copy as sort mutates the array
  // if sort =true slice().sort() else keep array as it appears by date of transaction

  //RENDER THE TRANSACTION LINES PER SORT TYPE
  movs.forEach(function (mov, index) {
    //Designate the type of transaction
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    //Render the transaction on the screen inside the class="movements" container element
    const htmlInsert = `
    <div class="movements__row">
      <div class="movements__type movements__type--${type}">${
      index + 1
    } ${type}</div>
      <div class="movements__date">3 days ago</div>
      <div class="movements__value">${mov.toFixed(2)}€</div>
    </div>
    `;
    containerMovements.insertAdjacentHTML('afterbegin', htmlInsert);
  });
};

//FUNCTION-CALCULATE AND RENDER THE ACCOUNT BALANCE
const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${acc.balance.toFixed(2)}€`;
};

//FUNCTION-CALCULATE TRANSACTIONS DISPLAY SUMMARY
const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes}€`;

  const expenses = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(expenses).toFixed(2)}€`;

  const interests = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => int >= 1) //exclude interests lesser than 1euro
    .reduce((acc, mov) => acc + mov, 0);
  labelSumInterest.textContent = `${interests.toFixed(2)}€`;
};

//FUNCTION-SAVE USER NAME INITIALS ON THE ACCOUNT OBJECTS
const createUserName = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};

//FUNCTION-UPDATE UI
const updateUI = function (acc) {
  //DISPLAY MOVEMENTS
  displayMovements(acc);
  //DISPLAY BALANCE
  calcDisplayBalance(acc);
  //DISPLAY SUMMARY
  calcDisplaySummary(acc);
};

//EVENTHANDLER--USER LOGIN

let currentAccount;
createUserName(accounts);

btnLogin.addEventListener('click', function (e) {
  //IMPORTANT: STOP BUTTON ELEMENT TO REFRESH WEB PAGE/PREVENT FORM FROM SUBMITTING ON ITSELF
  e.preventDefault();
  // console.log('LOGIN');
  //SUBTASK--CHECK IF THE USERNAME EXISTS
  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  // console.log(currentAccount);
  //SUBTASK--IF USERNAME IS AVAILABLE, DOES THE PIN MATCH TO WHAT IS IN THE DATA?
  if (currentAccount?.pin === +inputLoginPin.value) {
    // console.log('LOGIN SUCCESFULL');
    //SUBTASK--POST LOGIN PROCESSES
    //DISPLAY UI MESSAGE
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    //DISPLAY BANKING FUNCTIONS UI
    containerApp.style.opacity = 100;
    //CLEAR USERNAME/PASS INPUT FIELDS
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur(); //IMPORTANT: removes the focus from the element
    //TODO-SWITCH login btn with logout
    //UPDATE UI
    updateUI(currentAccount);
  }
});

//EVENTHANDLER--TRANSFER MONEY
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault(); //Prevent default button submit behaviour
  // console.log("TRANSFER")
  const amount = +inputTransferAmount.value; //Attain transfer amount from the input field
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  ); //Attain to whom send to from the input field by checking against the customer list
  // console.log(amount, receiverAcc);

  //CLEAR RECEIPIENT/AMOUNT INPUT FIELDS
  inputTransferTo.value = inputTransferAmount.value = '';

  if (
    amount > 0 && //check amount send,
    currentAccount.balance >= amount && // enough balance exists?,
    receiverAcc && // receiver acc typed?
    receiverAcc?.username !== currentAccount.username // sender/receiver are not same?
  ) {
    // console.log('Transfer valid');
    //TRANSFER MONEY
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);
    //UPDATE UI
    updateUI(currentAccount);
  }
});

//EVENTHANDLER--REQUEST LOAN
btnLoan.addEventListener('click', function (e) {
  e.preventDefault(); //Prevent default button submit behaviour
  // console.log('LOAN');
  const loanRequestAmount = Math.floor(inputLoanAmount.value);
  if (
    loanRequestAmount > 0 &&
    currentAccount.movements.some(mov => mov > loanRequestAmount * 0.1)
  ) {
    //ADD MOVEMENT
    currentAccount.movements.push(loanRequestAmount);
    //UPDATE UI
    updateUI(currentAccount);
  }
  //CLEAR LOAN INPUT VALUE
  inputLoanAmount.value = '';
});

//EVENTHANDLER--CLOSE ACCOUNT
btnClose.addEventListener('click', function (e) {
  e.preventDefault(); //Prevent default button submit behaviour
  // console.log("DELETE")

  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    // NOTE: findIndex() is used here instead of indexOf() since we are trying to solicit the object data inside one of the elements of the array not the array element itself.
    // console.log(index);
    //DELETE THE USER FROM THE ACCOUNTS DATA
    accounts.splice(index, 1);
    // console.log(accounts);
    //HIDE ACCOUNT UI
    containerApp.style.opacity = 0;
    //RESET LOGIN UI MESSAGE
    labelWelcome.textContent = 'Log in to get started';
  }
  //RESET CLOSE ACCOUNT INPUT FIELDS
  inputCloseUsername.value = inputClosePin.value = '';
});

//EVENTHANDLER--SORT
let sorted = false; // IMPORTANT: intermediary variable that lets us switch the states - INITIAL STATE
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  // console.log('SORT');
  // console.log(currentAccount);
  // displayMovements(currentAccount, true); //sort set to true as function argument
  displayMovements(currentAccount, !sorted); //sort set to true as function argument
  sorted = !sorted;
  // IMPORTANT: Negate the current sorted state to enable sowtching the next time. Without this, the state would have never been switching
});
