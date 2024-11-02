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

//let depoYesBtnEl = document.querySelector(".d-yes");
let withdYesBtnEl = document.querySelector(".w-yes");
//let depoNoBtnEl = document.querySelector(".d-no");
let withdNoBtnEl = document.querySelector(".w-no");
let tranYesBtnEl = document.querySelector(".t-yes");
let tranNoBtnEl = document.querySelector(".t-no"); 
let withdrawMessageBoxEl = document.querySelector(".withd-comfirm-msg");
let withdrawMessageBoxMsgEl = document.querySelector(".w-message");

let transferMessageBoxEl = document.querySelector(".trans-comfirm-msg");
let transMessageBoxMsgEl = document.querySelector('.t-message');
let transferErrorMsgEl = document.querySelector(".transfer-error-msg");


let messageBoxMsgEl = document.querySelector(".message");
let overlayEl = document.querySelector(".overlay");


/*transactions dom elements*/

let TransactionsHistoryCtrEl = document.querySelector(".tran-history-ctr");
let destinationUserInptEl = document.querySelector(".destination-input");
let transferAmmountInputEl = document.querySelector(".ammount-input");
let sendBtnEl = document.querySelector(".send-btn");

/*personal infos dom*/
let firstNameLblEl = document.querySelector(".f-name");
let lastNameLblEl = document.querySelector(".l-name");
let userNameLblEl = document.querySelector(".user-name");
let emailLblEl = document.querySelector(".e-mail");
let dateOfBirthLblEl = document.querySelector(".b-date");
let phoneLblEl = document.querySelector(".phone");
let updateBtnEl = document.querySelector(".update-btn");
let changePassWordBtnEl = document.querySelector(".change-password-btn");

let updateInfosFormEl = document.querySelector(".update-infos-model");
let updateInfosCloseBtn = document.querySelector(".update-close-btn");
let changePassWordCloseBtn = document.querySelector(".change-password-close-btn");
let changePassWordFormEl = document.querySelector(".change-password-model");

let updateFirstNameInputEl = document.querySelector(".update-fname");
let updateLastNameInputEl = document.querySelector(".update-lname");
let updateEmailInputEl = document.querySelector(".update-e-mail");
let updatePhoneInputEl = document.querySelector(".update-phone");
let updateBirthDateInputEl = document.querySelector(".update-b-date");
let updateUserNameInputEl = document.querySelector(".update-user-name");
let updateSubmitBtnEl = document.querySelector(".submit");

let currentPassWordInputEl = document.querySelector(".current-password");
let newPassWordInputEl = document.querySelector(".new-password");
let comfirmPassWordInputEl = document.querySelector(".change-password-comfirm-password");
let changePasswordSubmitBtnEl = document.querySelector(".change-password-submit-btn");

let updateFields = document.querySelectorAll(".update-input");


let updateInfosErrorMsgEl  =document.querySelector(".update-infos-error-msg");
let changePasswordErrorMsgEl = document.querySelector(".change-password-error-msg");

let updateUserMessageBoxEl = document.querySelector(".update-comfirm-msg");
let updateUserMessageBoxMsgEl = document.querySelector(".u-message");
let updateUserYesBtnEl = document.querySelector(".u-yes");
let updateUserNoBtnEl = document.querySelector(".u-no");

/* console.log(updateFirstNameInputEl);*/
/* console.log(updateUnserMessageBoxEl);
console.log(updateUnserMessageBoxMsgEl);
console.log(updateUnserYesBtnEl);
console.log(updateUnserNoBtnEl); */




let timeOutId;
let hasShow = false;
let destinationAccountId = 0;

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

class clsUser
{
     UserId 
     FirstName 
     LastName 
     UserName 
     PassWord
     Email 
     Phone 
     BirthDate 

   constructor( UserId,  FirstName,  LastName,  UserName, PassWord ,  Email,
         Phone,  BirthDate)
    {
        this.UserId = UserId;
        this.FirstName = FirstName;
        this.LastName = LastName;
        this.UserName = UserName;
        this.PassWord = PassWord;
        this.Email = Email;
        this.Phone = Phone;
        this.BirthDate = BirthDate;
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
      displayElement(withdrawMessageBoxEl);
    }

    messageBoxMsgEl.textContent = "do you want to perform this action?";
    //clearInput(withdrawInputEl);
  });
}

function comfirmWithdraw()
{

  withdYesBtnEl.addEventListener("click", () => {
    
    AddNewTransaction(
      new clsTransaction(
        0,
        currentAccount.accountId,
        null,
        Number.parseFloat(withdrawInputEl.value),
        new Date("2020-01-01")
      )
    ).then(function (res) {
     
    });
    withdrawMessageBoxMsgEl.textContent = `${withdrawInputEl.value} $ has been withdrew successfully from your account`;

    setTimeout(() => {
      hideElement(overlayEl);
      hideElement(withdrawMessageBoxEl);
      renderDepositsAndWithdrawsRecords();
      updateBalance();
      clearInput(withdrawInputEl);
    }, 3000);
  });

  withdNoBtnEl.addEventListener("click", () => {
    hideElement(overlayEl);
    hideElement(withdrawMessageBoxEl);
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

function performTransfer()
{
  sendBtnEl.addEventListener("click",()=>{
      if(!destinationUserInptEl.value && !transferAmmountInputEl.value)
        {
          return;
        }
        else if(!destinationUserInptEl.value)
          {
              setError(transferErrorMsgEl, "you should enter the destination user name");
              hideErrorMessage(transferErrorMsgEl);
          //return;

          }
          else if(! transferAmmountInputEl.value)
            {
              setError(transferErrorMsgEl, "you should enter the value you want to send");
              hideErrorMessage(transferErrorMsgEl);
          //return;

            }

       else if(Number.parseFloat(transferAmmountInputEl.value)> Number.parseFloat(balanceEl.textContent))
          {
            setError(transferErrorMsgEl, "the ammount you entered exeeded your current balance");
            hideErrorMessage(transferErrorMsgEl);
          //return;

          }
          else
          {
             let destinationUser;

            GetUserByUserName(destinationUserInptEl.value).then(function(user){
                destinationUser = user;
              
                if(destinationUser == null)
                  {
                    setError(transferErrorMsgEl, "the user name you have entered is not found");
                    hideErrorMessage(transferErrorMsgEl);
                    
                  }
                  else
                  {
                    getAccountByUserId(destinationUser.userId).then(function(acc){
                      destinationAccountId = acc.accountId;
                    });
                    displayElement(overlayEl);
                    displayElement(transferMessageBoxEl);
                  }
            });
          }
         
          
         
       
  });
}

function comfirmTransfer()
{
   tranYesBtnEl.addEventListener("click",()=>{
      AddNewTransaction(new clsTransaction(0,currentAccount.accountId, destinationAccountId ,
         Number.parseFloat(transferAmmountInputEl.value), new Date("2020-01-01"))).then(function(res){

         });

         transMessageBoxMsgEl.textContent =  `${transferAmmountInputEl.value} $ has been transfered successfully`;

         setTimeout(()=>{
            updateBalance();
            renderTransfersList();
            hideElement(overlayEl);
            hideElement(transferMessageBoxEl);
            clearInput(transferAmmountInputEl);
            clearInput(destinationUserInptEl);
         },3000);
   });

   tranNoBtnEl.addEventListener("click",()=>{
    hideElement(overlayEl);
    hideElement(transferMessageBoxEl);
    transMessageBoxMsgEl.textContent =  `do you want to perform this action?`;
    clearInput(transferAmmountInputEl);
    clearInput(destinationUserInptEl);
   });

}

function renderPersonalInfos()
{
    firstNameLblEl.textContent = currentUser.firstName;
    lastNameLblEl.textContent = currentUser.lastName;
    userNameLblEl.textContent = currentUser.userName;
    emailLblEl.textContent = currentUser.email;
    phoneLblEl.textContent = currentUser.phone;
    dateOfBirthLblEl.textContent =formatDate (currentUser.birthDate).slice(0,10);
}
function showHideUpdateUserForms()
{
  updateBtnEl.addEventListener("click",()=>{
    displayElement(overlayEl);
    displayElement(updateInfosFormEl);
  });
  
  updateInfosCloseBtn.addEventListener("click",()=>{
    hideElement(overlayEl);
    hideElement(updateInfosFormEl);
  });
  
  changePassWordBtnEl.addEventListener("click",()=>{
    displayElement(overlayEl);
    displayElement(changePassWordFormEl)
  });
  
  changePassWordCloseBtn.addEventListener("click",()=>{
    hideElement(overlayEl);
    hideElement(changePassWordFormEl)
  });

}



async function isUserNameAlreadyExists(userName)
{
    try
    {
        let response = await fetch(`http://localhost:5104/api/Users/IsUserExistsByUserName?UserName=${userName}`);

        if(!response.ok)
            {
                throw new Error(`${response.statusText}`);
            }

        let data = await response.json();
        return data;
    }
    catch(err)
    {
    }
    return null;
}

async function IsEmailExists(email)
{
  
    try
    {
        let response =await fetch(`http://localhost:5104/api/Users/ExistsByEmail?Email=${email}`);

        if(!response.ok)
            {
                throw new Error(`${response.statusText}`);
            }

        let data = await response.json();
        return data;
    }
    catch(err)
    {

    }
    return null;
}

function CheckFieldsEmpty()
{
    let isEmpty = false;
    updateFields.forEach((field)=>{
       if(!field.value)
        {
            changeInputBackGround(field);
           isEmpty =  true; 
        }
          
    })

        return isEmpty;
}

function resetInputsBackGroundColor()
{
  updateFields.forEach((field)=>{
        if(field.value)
         {
            field.style.backgroundColor = "aliceblue"; 
             field.style.border = "solid 1px gray"
         }
           
     })
   

}

function ValidateEmailField()
{
    updateEmailInputEl.addEventListener("input",()=>{
        if(!updateEmailInputEl.value || updateEmailInputEl.value === currentUser.email)
          return;
        IsEmailExists(updateEmailInputEl.value).then(function(res){
             
            
            if(res)
                {
                    changeInputValueColor(updateEmailInputEl);
                    changeInputBackGround(updateEmailInputEl);
                    setError(updateInfosErrorMsgEl,"Email arlready taken by an other user");
                    hideErrorMessage(updateInfosErrorMsgEl);
                    changeElementEnabledStatus(updateSubmitBtnEl, true);
                   

                }
                else
                {
                    //hideErrorMessage();
                    resetInputBackGround(updateEmailInputEl);
                    resetInputValueColor(updateEmailInputEl); 
                    changeElementEnabledStatus(updateSubmitBtnEl,false);
                }
                
        })
    });
}

function ValidateUserNameInput()
{

    updateUserNameInputEl.addEventListener("input",function(){
        if(!updateUserNameInputEl.value || updateUserNameInputEl.value === currentUser.userName)
            return;
        isUserNameAlreadyExists(updateUserNameInputEl.value).then(function(res){
                if(res)
                {
                
                    setError(updateInfosErrorMsgEl,"User name Already exists");
                    hideErrorMessage(updateInfosErrorMsgEl);
                    changeInputBackGround(updateUserNameInputEl);
                    changeInputValueColor(updateUserNameInputEl);
                    changeElementEnabledStatus(updateSubmitBtnEl, true);
                }
                else
                {
                        
                        resetInputBackGround(updateUserNameInputEl);
                        resetInputValueColor(updateUserNameInputEl); 
                        changeElementEnabledStatus(updateSubmitBtnEl,false);
                }
        })
    })
}
function validateAllFields(fields)
{
  fields.forEach(field =>{

    field.addEventListener("input",()=>{
      if(!field.value)
        {
          changeInputBackGround(field);
        }
        else
        resetInputBackGround(field);
    });
  
  });

}


function changeElementEnabledStatus(el , status)
{
    el.disabled = status;
    if(status)
        {
            el.style.opacity = '0.5';
        }
        else
        el.style.opacity = '1';
}

function changeInputValueColor(field)
{
    field.style.color = "red";
}

function changeInputBackGround(field)
{
    field.style.backgroundColor = "rgba(220, 20, 60, 0.351)";
    field.style.border = "solid 1px red"
}

function resetInputValueColor(field)
{
    field.style.color = "#313030";
}

function resetInputBackGround(field)
{
     field.style.backgroundColor = "aliceblue"; 
     field.style.border = "solid 1px gray" 
}

function clearFields(fields)
{
    fields.forEach(field =>{
        field.value = '';
    });
}

async function updateUserInfos(userId , newUserObject)
{
   try
   {
      let response = await fetch(`http://localhost:5104/api/Users/${userId}`,{
        method:"PUT",
        headers : {
          'content-type':'application/json'
        },
        body:JSON.stringify(newUserObject)
      });

      if(!response.ok)
        {
          throw new Error(`${response.statusText}`);
        }

      let data = await response.json();
      return data;
   }
   catch(err)
   {

   }

   return null;
}

function performUserInfosUpdate()
{

  updateSubmitBtnEl.addEventListener("click",()=>{
      if(CheckFieldsEmpty())
        {
          setError(updateInfosErrorMsgEl,"you must fill all the fields above");
          resetInputsBackGroundColor();
          hideErrorMessage(updateInfosErrorMsgEl);
        
        }
        else
        {
          resetInputsBackGroundColor();
          displayElement(overlayEl);
          displayElement(updateUserMessageBoxEl);
        
        }
  });

}
function comfirmInfosUpdate()
{
  updateUserYesBtnEl.addEventListener("click",()=>{
    updateUserInfos(currentUser.userId , new clsUser(0,updateFirstNameInputEl.value , updateLastNameInputEl.value,
      updateUserNameInputEl.value , "**",updateEmailInputEl.value, updatePhoneInputEl.value, 
      updateBirthDateInputEl.value
    )).then(function(res){
        currentUser  =res;
    });
      updateUserMessageBoxMsgEl.textContent = "your infos have been updated successfully";
    setTimeout(()=>{
        hideElement(updateInfosFormEl);
        hideElement(overlayEl);
        hideElement(updateUserMessageBoxEl);
        clearFields(updateFields);
        renderPersonalInfos();
        loadHeadersData();
    },3000)
  });
  
  updateUserNoBtnEl.addEventListener("click",()=>{
   // hideElement(overlayEl);
    hideElement(updateUserMessageBoxEl);
    //clearFields(updateFields);
    updateUserMessageBoxMsgEl.textContent = "do you want to submit changes?";
  });


}


performVisualEffect();
loadHeadersData();
renderPersonalInfos();
markTabSelected();
navigateThroughSections();
showHideUpdateUserForms();
renderDepositsAndWithdrawsRecords();
renderTransfersList();
performDeposit();
performWithdraw();
comfirmdeposit();
comfirmWithdraw();

performTransfer();
comfirmTransfer();

ValidateEmailField();
ValidateUserNameInput();
validateAllFields(updateFields);

performUserInfosUpdate();
comfirmInfosUpdate();
  
//updateUserInfos(16 , new clsUser(0,"aziza","boulatrous","azzouza" , "1234","azziza@gmail.com","0560221478",new Date("2020-12-12"))).then(res=>console.log(res));

/* updateUserYesBtnEl.addEventListener("click",()=>{
  updateUserInfos(currentUser.userId , new clsUser(0,updateFirstNameInputEl.value , updateLastNameInputEl.value,
    updateUserNameInputEl.value , "**",updateEmailInputEl.value, updatePhoneInputEl.value, 
    updateBirthDateInputEl.value
  )).then(function(res){
      currentUser  =res;
  });
    updateUserMessageBoxMsgEl.textContent = "your infos have been updated successfully";
  setTimeout(()=>{
      hideElement(updateInfosFormEl);
      hideElement(overlayEl);
      hideElement(updateUserMessageBoxEl);
      clearFields(updateFields);
      renderPersonalInfos();
      loadHeadersData();
  },3000)
});

updateUserNoBtnEl.addEventListener("click",()=>{
  hideElement(overlayEl);
  hideElement(updateUserMessageBoxEl);
  //clearFields(updateFields);
  updateUserMessageBoxMsgEl.textContent = "do you want to submit changes?";
}); */