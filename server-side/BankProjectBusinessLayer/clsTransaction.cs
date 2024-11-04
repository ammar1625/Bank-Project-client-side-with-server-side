using BankProjectDataAccessLayer;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BankProjectBusinessLayer
{
    public class clsTransaction
    {
        public TransactionDTO Transactiondto {get { return new TransactionDTO(this.TransactionId,this.FromAccountId,this.ToAccountId,
            this.TransactionAmmount,this.TransactionDate); } }
        public int TransactionId { get; set; }
        public int? FromAccountId { get; set; }
        public int? ToAccountId { get; set; }

        public clsUser? SenderUserInfo {  get; }
        public clsUser? RecieverUserInfo {  get;  }
        public decimal TransactionAmmount {  get; set; }

        public DateTime TransactionDate { get; set; }

        public clsTransaction(TransactionDTO transactiondto) 
        {
            this.TransactionId = transactiondto.TransactionId;
            this.FromAccountId = transactiondto.FromAccountId;
            this.ToAccountId = transactiondto.ToAccountId;
            if(transactiondto.FromAccountId == null)
            {
                this.SenderUserInfo = null;
            }
            else
            {
                this.SenderUserInfo = clsUser.FindUserById(clsAccount.FindAccountById(transactiondto.FromAccountId).UserId);
            }
            if(this.ToAccountId == null)
            {
                this.RecieverUserInfo = null;
            }
            else
            {
                 this.RecieverUserInfo = clsUser.FindUserById(clsAccount.FindAccountById(transactiondto.ToAccountId).UserId);
            }
           
            this.TransactionAmmount = transactiondto.TransactionAmmount;
            this.TransactionDate = transactiondto.TransactionDate;
        }

        public static clsTransaction GetTransactionById(int TransactionId)
        {
            TransactionDTO Transactiondto = clsTransactionData.GetTransactionById(TransactionId);

            if (Transactiondto != null)
            {
                return new clsTransaction(Transactiondto);
            }
            else
                return null;
        }

        public bool AddNewTransaction()
        {
            this.TransactionId = clsTransactionData.AddNewTransction(this.Transactiondto);
            return this.TransactionId != -1;
        }

        public static decimal GetBalanceByAccountId(int AccountId) 
        {
            return clsTransactionData.GetBalanceByAccountId(AccountId);
        }

        public static List<clsTransaction>GetDepositsAndWithdrawsByAccountId(int AccountId)
        {
            List<clsTransaction>TransactionsList = new List<clsTransaction>();

            foreach(TransactionDTO Trans in clsTransactionData.GetDepositsAndWithdrawsByAccountId(AccountId))
            {
                TransactionsList.Add(new clsTransaction(
                    new TransactionDTO(Trans.TransactionId,Trans.FromAccountId,Trans.ToAccountId,Trans.TransactionAmmount,Trans.TransactionDate
                    )
                    ));
            }

            return TransactionsList;
        }

        public static List<clsTransaction> GetTransfersByAccountId(int AccountId)
        {
            List<clsTransaction> Transactions = new List<clsTransaction>();

            foreach(TransactionDTO Trans in clsTransactionData.GetTransfersByAccountId(AccountId) )
            {
                Transactions.Add(new clsTransaction
                    (
                    new TransactionDTO ( Trans.TransactionId,Trans.FromAccountId,Trans.ToAccountId,Trans.TransactionAmmount,Trans.TransactionDate)
                    ));
            }

            return Transactions;
        }
    }
}
