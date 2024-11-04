using BankProjectDataAccessLayer;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BankProjectBusinessLayer
{
    public class clsAccount
    {
        public enum enMode { AddNew=0, Update=1}

        public enMode Mode = enMode.AddNew;

        public AccountDTO AccDto { get { return new AccountDTO(this.AccountId, this.UserId, this.CreationDate); } }
        public int AccountId { get; set; }
        public int UserId { get; set; }
        public clsUser UserInfo {  get;}
        public DateTime CreationDate { get; set; }


        public clsAccount( AccountDTO accountDto, enMode mode= enMode.AddNew)
        {
          
            AccountId = accountDto.AccountId;
            UserId = accountDto.UserId;
            UserInfo = clsUser.FindUserById(accountDto.UserId);
            CreationDate = accountDto.CreationDate;
            Mode = mode;
        }

        public static clsAccount FindAccountById(int? accountId) 
        {
            AccountDTO AccDto = clsAccountData.GetAccountById(accountId);

            if (AccDto != null)
            {
                return new clsAccount(AccDto, enMode.Update);
            }
            else
                return null;
        }

        public static clsAccount FindAccountByUserId(int UserId)
        {
            AccountDTO AccDto = clsAccountData.GetAccountByUserId(UserId);

            if (AccDto != null)
            {
                return new clsAccount(AccDto, enMode.Update);
            }
            else
                return null;
        }

        public bool AddNewAccount()
        {
            this.AccountId = clsAccountData.AddNewAccount(this.AccDto);
            return (this.AccountId != -1);
        }

        public static bool DeleteAccountByUserId(int UserId)
        {
            return clsAccountData.DeleteAccountByUserId(UserId);
        }
    }
}
