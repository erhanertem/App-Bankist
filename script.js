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
const displayMovements = function (acc) {
  //Empty the entire movements container
  /*NOTE:
   * textContents is all text contained by an element and all its children that are for formatting purposes only.
   * innerText returns all text contained by an element and all its child elements.
   * innerHtml returns all text, including html tags, that is contained by an element.
   */
  containerMovements.innerHTML = '';

  acc.movements.forEach(function (mov, index) {
    //Designate the type of transaction
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    //Render the transaction on the screen inside the class="movements" container element
    const htmlInsert = `
    <div class="movements__row">
      <div class="movements__type movements__type--${type}">${
      index + 1
    } ${type}</div>
      <div class="movements__date">3 days ago</div>
      <div class="movements__value">${mov}€</div>
    </div>
    `;
    containerMovements.insertAdjacentHTML('afterbegin', htmlInsert);
  });
};

//FUNCTION-CALCULATE AND RENDER THE ACCOUNT BALANCE
const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${acc.balance}€`;
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
  labelSumOut.textContent = `${Math.abs(expenses)}€`;

  const interests = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => int >= 1) //exclude interests lesser than 1euro
    .reduce((acc, mov) => acc + mov, 0);
  labelSumInterest.textContent = `${interests}€`;
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

//MAINTASK--USER LOGIN

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
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    console.log('LOGIN SUCCESFULL');
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

    updateUI(currentAccount);
  }
});

//MAINTASK--TRANSFER MONEY
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault(); //Prevent default button submit behaviour
  const amount = Number(inputTransferAmount.value); //Attain transfer amount from the input field
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  ); //Attain to whom send to from the input field by macthing the customer list
  // console.log(amount, receiverAcc);

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
    //CLEAR RECEIPIENT/AMOUNT INPUT FIELDS
    inputTransferTo.value = inputTransferAmount.value = '';
  }
});
