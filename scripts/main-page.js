"use strict";

let currentUser =JSON.parse(localStorage.getItem("User"))|| {};

//dom elements
let headerUserNameEl  = document.querySelector(".user");
let balanceEl  = document.querySelector(".ammount");

//navigation side bad elements
let depoAndWithdrawEl = document.querySelector(".depo-withd");
let transactionsEl = document.querySelector(".transactions");
let personalInfosEl = document.querySelector(".personal-infos");
let closeAccoutEl = document.querySelector(".close-acc");
let logoutEl = document.querySelector(".log-out");

let tabs = document.querySelectorAll(".side-btn");


/*tabs sections dom elements*/

let depositWithdrawSectionEl = document.querySelector(".deposits-withdraws-ctr");
let transactionsSectionsEl = document.querySelector(".transactions-ctr");
let personalInfosSectionEl = document.querySelector(".personal-infos-ctr");
let closeAccountSectionEl = document.querySelector(".close-account-ctr");

/*dep and with dom elements*/

let depositsAndWithdrawsHistoryContainerEl = document.querySelector(".dep-history-ctr");
let depWithHistoryRecordEl = document.querySelector(".dep-history-el");
let depMovementTypeEl = document.querySelector(".movement-type");
let depMovementDateEl = document.querySelector(".movement-date");
let depMovementAmmountEl = document.querySelector(".movement-ammount");

function renderDepositsAndWithdrawsRecords()
{
    let html = "";
    getDepositsAndWithdrawsList(currentAccount.accountId).then(function(movRes){

        for(let mov of movRes)
            {
                let action = mov.transactionAmmount <0 ? "withdraw":"deposit";
                
                let html = `
                     <div class="dep-history-el history-el">
                                    <p class="movement-type">${action}</p>
                                    <p class="movement-date">${formatDate(mov.transactionDate)}</p>
                                    <p class="movement-ammount">${formatMoney(mov.transactionAmmount)} $</p>
                                </div>
                `;
             
                depositsAndWithdrawsHistoryContainerEl.insertAdjacentHTML("beforeend",html);
               
            }

    })

}

async function getAccountByUserId(userId)
{
    try
    {
        let accResponse =await fetch(`http://localhost:5104/api/Accounts/UserId?UserId=${userId}`);

        if(!accResponse.ok)
            {
                throw new Error(`${accResponse.statusText}`);
            }
        
        let accData = await accResponse.json();
        return accData;
    }
    catch(err)
    {

    }

    return null;
}

async function getBalanceByAccountId(accountId)
{
    try
    {
        let balanceResponse = await fetch(`http://localhost:5104/api/Transactions/GetBalance?AccountId=${accountId}`);

        if(!balanceResponse.ok)
            {
                throw new Error(`${balanceResponse.statusText}`);
            }
        
        let balanceData =await balanceResponse.json();
        return balanceData;
    }
    catch(err)
    {

    }

    return null;
}

let currentAccount = await getAccountByUserId(currentUser.userId);


function formatMoney(ammount)
{
    return ammount.toFixed(2);
}

function formatDate(date)
{
    return date.replace("T"," / ").slice(0,-3);
}

function updateBalance()
{
    getBalanceByAccountId(currentAccount.accountId).then(function(res){
        balanceEl.textContent =formatMoney(res);
    });
}

function updateUserFirstName()
{
    headerUserNameEl.textContent = currentUser.firstName;
}

function loadHeadersData()
{
    updateBalance();
    updateUserFirstName();
}

function markTabSelected()
{
    tabs.forEach(function(tab){
        tab.addEventListener("click",function(e){

            tabs.forEach((t)=>{
                t.classList.remove("selected");
            })

            e.target.classList.add("selected");
        })
    });


}

function displaySection(section)
{
    section.classList.remove("hidden");
}

function hideSection(section)
{
    section.classList.add("hidden");
}

function navigateThroughSections()
{
    depoAndWithdrawEl.addEventListener("click",()=>{
        displaySection(depositWithdrawSectionEl);

        hideSection(transactionsSectionsEl);
        hideSection(personalInfosSectionEl);
        hideSection(closeAccountSectionEl);

    });

    transactionsEl.addEventListener("click",()=>{
        displaySection(transactionsSectionsEl);

        hideSection(depositWithdrawSectionEl);
        hideSection(personalInfosSectionEl);
        hideSection(closeAccountSectionEl);

    });

    personalInfosEl.addEventListener("click",()=>{
        displaySection(personalInfosSectionEl);

        hideSection(transactionsSectionsEl);
        hideSection(depositWithdrawSectionEl);
        hideSection(closeAccountSectionEl);

    });

    closeAccoutEl.addEventListener("click",()=>{
        displaySection(closeAccountSectionEl);

        hideSection(transactionsSectionsEl);
        hideSection(personalInfosSectionEl);
        hideSection(depositWithdrawSectionEl);

    });
}

async function getDepositsAndWithdrawsList(accountId)
{
    try
    {
        let depWithResponse = await
         fetch(`http://localhost:5104/api/Transactions/GetDepositsAndWithdraws?AccountId=${accountId}`);

         if(!depWithResponse.ok)
            {
                throw new Error(`${depWithResponse.statusText}`);
            }
        let data = depWithResponse.json();

        return data;
    }
    catch(err)
    {

    }

    return null;
}

loadHeadersData();
markTabSelected();
navigateThroughSections();
renderDepositsAndWithdrawsRecords();
/* let trans = await getDepositsAndWithdrawsList(currentAccount.accountId);

for(let tra of trans)
    {
        console.log(tra);
    } */