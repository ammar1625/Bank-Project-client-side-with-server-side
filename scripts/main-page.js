"use strict";

let currentUser = JSON.parse(localStorage.getItem("User")) || {};

//dom elements
let headerUserNameEl = document.querySelector(".user");
let balanceEl = document.querySelector(".ammount");

//navigation side bad elements
let depoAndWithdrawEl = document.querySelector(".depo-withd");
let transactionsEl = document.querySelector(".transactions");
let personalInfosEl = document.querySelector(".personal-infos");
let closeAccoutEl = document.querySelector(".close-acc");
let logoutEl = document.querySelector(".log-out");

let tabs = document.querySelectorAll(".side-btn");

/*tabs sections dom elements*/

let depositWithdrawSectionEl = document.querySelector(
  ".deposits-withdraws-ctr"
);
let transactionsSectionsEl = document.querySelector(".transactions-ctr");
let personalInfosSectionEl = document.querySelector(".personal-infos-ctr");
let closeAccountSectionEl = document.querySelector(".close-account-ctr");

/*dep and with dom elements*/

let depositsAndWithdrawsHistoryContainerEl =
  document.querySelector(".dep-history-ctr");
let depWithHistoryRecordEl = document.querySelector(".dep-history-el");
let depMovementTypeEl = document.querySelector(".movement-type");
let depMovementDateEl = document.querySelector(".movement-date");
let depMovementAmmountEl = document.querySelector(".movement-ammount");

let depositInputEl = document.querySelector(".deposits-ammount-input");
let withdrawInputEl = document.querySelector(".withdraws-ammount-input");
let depositBtnEl = document.querySelector(".deposit-btn");
let withdrawBtnEl = document.querySelector(".withdraw-btn");
let depoWithErrorMsgEl = document.querySelector(".dep-with-error-msg");

let messageBoxEl = document.querySelector(".comfirm-msg");
let yesBtnEl = document.querySelector(".yes");
let noBtnEl = document.querySelector(".no");
let messageBoxMsgEl = document.querySelector(".message");
let overlayEl = document.querySelector(".overlay");


/*transactions dom elements*/

let TransactionsHistoryCtrEl = document.querySelector(".tran-history-ctr");


let timeOutId;
let hasShow = false;

class clsTransaction {
  TransactionId;
  FromAccountId;
  ToAccountId;
  TransactionAmmount;
  TransactionDate;
  constructor(
    TransactionId,
    FromAccountId,
    ToAccountId,
    TransactionAmmount,
    TransactionDate
  ) {
    this.TransactionId = TransactionId;
    this.FromAccountId = FromAccountId;
    this.ToAccountId = ToAccountId;
    this.TransactionAmmount = TransactionAmmount;
    this.TransactionDate = TransactionDate;
  }
}

function performVisualEffect() {
  setTimeout(() => {
    hideElement(overlayEl);
  }, 2000);
}

function renderDepositsAndWithdrawsRecords() {
  let html = "";
  getDepositsAndWithdrawsList(currentAccount.accountId).then(function (movRes) {
    for (let mov of movRes) {
      let action = mov.transactionAmmount < 0 ? "withdraw" : "deposit";

      let html = `
                     <div class="dep-history-el history-el">
                                    <p class="movement-type">${action}</p>
                                    <p class="movement-date">${formatDate(
                                      mov.transactionDate
                                    )}</p>
                                    <p class="movement-ammount">${formatMoney(
                                      mov.transactionAmmount
                                    )} $</p>
                                </div>
                `;

      depositsAndWithdrawsHistoryContainerEl.insertAdjacentHTML(
        "afterbegin",
        html
      );
    }
  });
}

async function getAccountByUserId(userId) {
  try {
    let accResponse = await fetch(
      `http://localhost:5104/api/Accounts/UserId?UserId=${userId}`
    );

    if (!accResponse.ok) {
      throw new Error(`${accResponse.statusText}`);
    }

    let accData = await accResponse.json();
    return accData;
  } catch (err) {}

  return null;
}

async function getBalanceByAccountId(accountId) {
  try {
    let balanceResponse = await fetch(
      `http://localhost:5104/api/Transactions/GetBalance?AccountId=${accountId}`
    );

    if (!balanceResponse.ok) {
      throw new Error(`${balanceResponse.statusText}`);
    }

    let balanceData = await balanceResponse.json();
    return balanceData;
  } catch (err) {}

  return null;
}

let currentAccount = await getAccountByUserId(currentUser.userId);

function formatMoney(ammount) {
  return ammount.toFixed(2);
}

function formatDate(date) {
  return date.replace("T", " / ").slice(0, -3).padEnd(21, "0");
}

function updateBalance() {
  getBalanceByAccountId(currentAccount.accountId).then(function (res) {
    balanceEl.textContent = formatMoney(res);
  });
}

function updateUserFirstName() {
  headerUserNameEl.textContent = currentUser.firstName;
}

function loadHeadersData() {
  updateBalance();
  updateUserFirstName();
}

function markTabSelected() {
  tabs.forEach(function (tab) {
    tab.addEventListener("click", function (e) {
      tabs.forEach((t) => {
        t.classList.remove("selected");
      });

      e.target.classList.add("selected");
    });
  });
}

function displayElement(section) {
  section.classList.remove("hidden");
}

function hideElement(section) {
  section.classList.add("hidden");
}

function navigateThroughSections() {
  depoAndWithdrawEl.addEventListener("click", () => {
    displayElement(depositWithdrawSectionEl);

    hideElement(transactionsSectionsEl);
    hideElement(personalInfosSectionEl);
    hideElement(closeAccountSectionEl);
  });

  transactionsEl.addEventListener("click", () => {
    displayElement(transactionsSectionsEl);

    hideElement(depositWithdrawSectionEl);
    hideElement(personalInfosSectionEl);
    hideElement(closeAccountSectionEl);
  });

  personalInfosEl.addEventListener("click", () => {
    displayElement(personalInfosSectionEl);

    hideElement(transactionsSectionsEl);
    hideElement(depositWithdrawSectionEl);
    hideElement(closeAccountSectionEl);
  });

  closeAccoutEl.addEventListener("click", () => {
    displayElement(closeAccountSectionEl);

    hideElement(transactionsSectionsEl);
    hideElement(personalInfosSectionEl);
    hideElement(depositWithdrawSectionEl);
  });
}

async function getDepositsAndWithdrawsList(accountId) {
  try {
    let depWithResponse = await fetch(
      `http://localhost:5104/api/Transactions/GetDepositsAndWithdraws?AccountId=${accountId}`
    );

    if (!depWithResponse.ok) {
      throw new Error(`${depWithResponse.statusText}`);
    }
    let data = depWithResponse.json();

    return data;
  } catch (err) {}

  return null;
}

async function AddNewTransaction(transfer) {
  try {
    let transResponse = await fetch(`http://localhost:5104/api/Transactions`, {
      method: "post",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(transfer),
    });

    if (!transResponse.ok) {
      throw new Error(`${transResponse.statusText}`);
    }

    let data = await transResponse.json();

    return data;
  } catch (err) {}
  return null;
}

function setError(errorMsg, message) {
  errorMsg.classList.remove("invisible");
  errorMsg.textContent = message;
}

function hideErrorMessage(errorMsg) {
  if (hasShow) {
    clearTimeout(timeOutId);
    hasShow = false;
  }
  timeOutId = setTimeout(function () {
    errorMsg.classList.add("invisible");
    hasShow = true;
  }, 3000);
}

function clearInput(input) {
  input.value = "";
}

function performDeposit() {
    depositBtnEl.addEventListener("click", () => {
        if (!depositInputEl.value) 
            {
                 return;
            }
        if (depositInputEl.value <= 0)
             {
                //displayElement(depoWithErrorMsgEl);
                setError(depoWithErrorMsgEl, "Ammount should be greater than 0 $");
                hideErrorMessage(depoWithErrorMsgEl);
                clearInput(depositInputEl);
            } 
            else 
            {
                displayElement(overlayEl);
                displayElement(messageBoxEl);
        }

        messageBoxMsgEl.textContent = "do you want to perform this action?";
        // clearInput(depositInputEl);
    });
}

function comfirmdeposit()
{
   yesBtnEl.addEventListener("click", () => {
                   AddNewTransaction(
                   new clsTransaction(
                       0,
                       null,
                       currentAccount.accountId,
                       Number.parseFloat(depositInputEl.value),
                       new Date("2020-01-01")
                   )
                   ).then(function (res) {
                       console.log(res);
                   
                   });
           messageBoxMsgEl.textContent = `${depositInputEl.value} $ has been deposited successfully to your account`;

           setTimeout(() => {
           hideElement(overlayEl);
           hideElement(messageBoxEl);
           renderDepositsAndWithdrawsRecords();
           updateBalance();
           clearInput(depositInputEl);
           }, 3000);
       });

       noBtnEl.addEventListener("click", () => {
           hideElement(overlayEl);
           hideElement(messageBoxEl);
           clearInput(depositInputEl);
       });
}

function performWithdraw() {
  withdrawBtnEl.addEventListener("click", () => {
    //if not value inputed
    if (!withdrawInputEl.value) {
      return;
    }
    //if less or equal 0 value is inputed
    else if (Number.parseFloat(withdrawInputEl.value) <= 0) {
      //displayElement(depoWithErrorMsgEl);
      setError(depoWithErrorMsgEl, "Ammount should be greater than 0 $");
      hideErrorMessage(depoWithErrorMsgEl);
      clearInput(withdrawInputEl);
    }
    //if you try to withdraw ammount which is greater than the actual balance
    else if (
      Number.parseFloat(balanceEl.textContent) <
      Number.parseFloat(withdrawInputEl.value)
    ) {
      //displayElement(depoWithErrorMsgEl);
      setError(
        depoWithErrorMsgEl,
        "the requested Ammount is greater than your actual balance!"
      );
      hideErrorMessage(depoWithErrorMsgEl);
      clearInput(withdrawInputEl);
    }
    //else you can procede to continue the process
    else {
      displayElement(overlayEl);
      displayElement(messageBoxEl);
    }

    messageBoxMsgEl.textContent = "do you want to perform this action?";
    //clearInput(withdrawInputEl);
  });
}

function comfirmWithdraw()
{
  yesBtnEl.addEventListener("click", () => {
    AddNewTransaction(
      new clsTransaction(
        0,
        currentAccount.accountId,
        null,
        Number.parseFloat(withdrawInputEl.value),
        new Date("2020-01-01")
      )
    ).then(function (res) {
      console.log(res);
    });
    messageBoxMsgEl.textContent = `${withdrawInputEl.value} $ has been withdrew successfully from your account`;

    setTimeout(() => {
      hideElement(overlayEl);
      hideElement(messageBoxEl);
      renderDepositsAndWithdrawsRecords();
      updateBalance();
      clearInput(withdrawInputEl);
    }, 3000);
  });

  noBtnEl.addEventListener("click", () => {
    hideElement(overlayEl);
    hideElement(messageBoxEl);
    clearInput(withdrawInputEl);
  });
}

async function GetUserByUserName(userName) {
  try {
    let userResponse = await fetch(
      `http://localhost:5104/api/Users/userName?userName=${userName}`
    );

    if (!userResponse.ok) {
      throw new Error(`${userResponse.statusText}`);
    }

    let userData = await userResponse.json();
    return userData;
  } catch (err) {}

  return null;
}

async function getTransfersByAccountId(accountId)
{
    try
    {
        let transfersResponse = await fetch(`http://localhost:5104/api/Transactions/GetTransfers?AccountId=${accountId}`);
        if(!transfersResponse.ok)
            {
                throw new Error(`${transfersResponse.statusText}`);
            }

        let transfersData = await transfersResponse.json();

        return transfersData;
    }
    catch(err)
    {

    }

    return null;
}

function renderTransfersList()
{
    let html = "";
    let action="";
    let user="";
    getTransfersByAccountId(currentAccount.accountId).then(function(transfersList){
        
        for(let trans of transfersList)
            {
                 action =  trans.transactionAmmount >0? "Recieved" : "Sent";
                 
                 user = trans.transactionAmmount > 0 ? `from ${trans.senderUserInfo.userName}`:`to ${trans.recieverUserInfo.userName}`;
                 
                html = 
                `
                    <div class="tran-history-el history-el">
                                    <p class="movement-type">${action}</p>
                                     <p class="movement-ammount">${trans.transactionAmmount}$</p>
                                     <p class="source"> <span class="user">${user}</span> </p>
                                    <p class="movement-date">${formatDate(trans.transactionDate)}</p> 
                                </div>
                `;

                TransactionsHistoryCtrEl.insertAdjacentHTML("afterbegin",html);
            }

    });
}

performVisualEffect();
loadHeadersData();
markTabSelected();
navigateThroughSections();
renderDepositsAndWithdrawsRecords();
renderTransfersList();
performDeposit();
performWithdraw();
comfirmdeposit();
comfirmWithdraw();

 //AddNewTransaction(new clsTransaction(0,100,null,140,new Date("2020-01-01"))).then((res)=>console.log(res)); 


 
