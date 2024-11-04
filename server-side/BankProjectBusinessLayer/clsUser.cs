using BankProjectDataAccessLayer;
using System.Runtime.CompilerServices;

namespace BankProjectBusinessLayer
{
    public class clsUser
    {
        public enum enMode { AddNew=0 , Update=1};

        public  enMode Mode  = enMode.AddNew;

        public UserDTO Userdto { get { return  new UserDTO(this.UserId,this.FirstName,this.LastName,this.UserName,this.Password,
            this.Email,this.Phone,this.BirthDate); } }

        public int UserId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string UserName { get; set; }
        public string Password { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public DateTime BirthDate { get; set; }

        //public clsUser()
        //{
        //    this.UserId = -1;
        //    this.FirstName = "";
        //    this.LastName = "";
        //    this.UserName = "";
        //    this.Password = "";
        //    this.Email = "";
        //    this.Phone = "";
        //    this.BirthDate = new DateOnly();
        //    Mode = enMode.AddNew;
        //}

        public clsUser(UserDTO Udto , enMode mode = enMode.AddNew)
        {
            this.UserId = Udto.UserId;
            this.FirstName = Udto.FirstName;
            this.LastName = Udto.LastName;
            this.UserName = Udto.UserName;
            this.Password = Udto.Password;
            this.Email = Udto.Email;
            this.Phone = Udto.Phone;
            this.BirthDate = Udto.BirthDate;
            Mode = mode;
        }

        public static clsUser FindUserById(int id)
        {
            UserDTO userdto  = clsUserData.GetUserById(id);

            if(userdto != null)
            {
                return new clsUser(userdto ,enMode.Update);
            }
            else
            {
                return null;
            }
        }

        public static clsUser FindUserByUserName(string userName) 
        {
            UserDTO userDTO = clsUserData.GetUserByUserName(userName);

            if(userDTO != null)
            {
                return new clsUser(userDTO ,enMode.Update);
            }
            else
            {
                return null;
            }
        }

        public static clsUser GetUserByEmailAndPassWord(string Email , string PassWord)
        {
            UserDTO User = clsUserData.GetUserByEmailAndPassWord(Email , PassWord);

            if (User != null)
            {
                return new clsUser(new UserDTO(User.UserId, User.FirstName, User.LastName, User.UserName, User.Password,
                    User.Email, User.Phone, User.BirthDate), enMode.Update);
            }
            else
                return null;
        }

        public static bool IsUserExists(string Email, string Password)
        {
            return clsUserData.IsUserExists(Email, Password);
        }

        public static bool IsUserExistsByEmail(string Email)
        {
            return clsUserData.IsUserExistsByEmail(Email);
        }

        public static bool IsUserExistsByUserName(string UserName)
        {
            return clsUserData.IsUserExistsByUserName(UserName);
        }

        private  bool _AddNewUser()
        {
           this.UserId = clsUserData.AddNewUser(this.Userdto);

            return this.UserId != -1;
        }

        private bool _UpdateUser()
        {
            int RowsAffected = clsUserData.UpdateUser(this.Userdto);
            return RowsAffected > 0;
        }

        public bool Save()
        {
            switch(Mode)
            {
                case enMode.AddNew:
                    {
                        if (_AddNewUser())
                        {
                            Mode = enMode.Update;
                            return true;
                        }
                        else
                        {
                            return false;
                        }
                        
                    }
                case enMode.Update:
                    {
                        if(_UpdateUser())
                        {
                            return true;
                        }
                        else
                        {
                            return false;
                        }
                    }

                default: return false;

            }
        }

        public bool ChangePassWord()
        {
            int RowsAffected = clsUserData.ChangePassWord(this.Userdto.UserId , this.Userdto.Password);
            return (RowsAffected > 0);
        }

        public static bool DeleteUser(int UserId)
        {
            int RowsAffected = clsUserData.DeleteUserById(UserId);
            return (RowsAffected > 0);
        }

    }
}
