using Microsoft.Data.SqlClient;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static System.Net.Mime.MediaTypeNames;

namespace BankProjectDataAccessLayer
{
    public class UserDTO
    {
        public int UserId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string UserName { get; set; }
        public string Password { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public DateTime BirthDate { get; set; }



        public UserDTO(int UserId, string FirstName, string LastName, string UserName, string PassWord, string Email,
            string Phone, DateTime BirthDate)
        {
            this.UserId = UserId;
            this.FirstName = FirstName;
            this.LastName = LastName;
            this.UserName = UserName;
            this.Password = PassWord;
            this.Email = Email;
            this.Phone = Phone;
            this.BirthDate = BirthDate;
        }
    }
    public class clsUserData
    {
        public static UserDTO GetUserById(int UserId)
        {
            using (SqlConnection SqlConnection = new SqlConnection(BankProjectDataAccessSettings._ConnectionString))
            {
                using (SqlCommand SqlCommand = new SqlCommand("Sp_GetUserById", SqlConnection))
                {
                    SqlCommand.CommandType = CommandType.StoredProcedure;
                    SqlCommand.Parameters.AddWithValue("@Id", UserId);

                    SqlConnection.Open();

                    try
                    {
                        using (SqlDataReader Reader = SqlCommand.ExecuteReader())
                        {


                            if (Reader.Read())
                            {
                                //get the date only part from the birth date in the data base to create a new date only object
                                var year = Reader.GetDateTime(Reader.GetOrdinal("DateOfBirth")).Year;
                                var month = Reader.GetDateTime(Reader.GetOrdinal("DateOfBirth")).Month;
                                var day = Reader.GetDateTime(Reader.GetOrdinal("DateOfBirth")).Day;

                                //initialize a new date only object
                                DateTime BirthDate = new DateTime(year, month, day);

                                UserDTO userdto = new UserDTO
                                (
                                 Reader.GetInt32(Reader.GetOrdinal("UserId")),
                                 Reader.GetString(Reader.GetOrdinal("FirstName")),
                                 Reader.GetString(Reader.GetOrdinal("LastName")),
                                 Reader.GetString(Reader.GetOrdinal("UserName")),
                                 Reader.GetString(Reader.GetOrdinal("PassWord")),
                                 Reader.GetString(Reader.GetOrdinal("Email")),
                                 Reader.GetString(Reader.GetOrdinal("Phone")),
                                 BirthDate
                                );

                                return userdto;
                            }
                        }
                    }
                    catch (Exception ex)
                    {

                    }
                    finally
                    {
                        SqlConnection.Close();
                    }
                }

            }

            return null;
        }

        public static UserDTO GetUserByUserName(string UserName)
        {
            using (SqlConnection SqlConnection = new SqlConnection(BankProjectDataAccessSettings._ConnectionString))
            {
                using (SqlCommand SqlCommand = new SqlCommand("Sp_GetUserByUserName", SqlConnection))
                {
                    SqlCommand.CommandType = CommandType.StoredProcedure;
                    SqlCommand.Parameters.AddWithValue("@UserName", UserName);

                    SqlConnection.Open();

                    try
                    {
                        using (SqlDataReader Reader = SqlCommand.ExecuteReader())
                        {


                            if (Reader.Read())
                            {
                                //get the date only part from the birth date in the data base to create a new date only object
                                int year = Reader.GetDateTime(Reader.GetOrdinal("DateOfBirth")).Year;
                                int month = Reader.GetDateTime(Reader.GetOrdinal("DateOfBirth")).Month;
                                int day = Reader.GetDateTime(Reader.GetOrdinal("DateOfBirth")).Day;

                                //initialize a new date only object
                                DateTime BirthDate = new DateTime(year, month, day);

                                UserDTO userdto = new UserDTO
                                (
                                 Reader.GetInt32(Reader.GetOrdinal("UserId")),
                                 Reader.GetString(Reader.GetOrdinal("FirstName")),
                                 Reader.GetString(Reader.GetOrdinal("LastName")),
                                 Reader.GetString(Reader.GetOrdinal("UserName")),
                                 Reader.GetString(Reader.GetOrdinal("PassWord")),
                                 Reader.GetString(Reader.GetOrdinal("Email")),
                                 Reader.GetString(Reader.GetOrdinal("Phone")),
                                 BirthDate
                                );

                                return userdto;
                            }
                        }
                    }
                    catch (Exception ex)
                    {

                    }
                    finally
                    {
                        SqlConnection.Close();
                    }
                }

            }

            return null;
        }

        public static UserDTO GetUserByEmailAndPassWord(string Email , string PassWord)
        {
            UserDTO userDTO = null;
            using (SqlConnection Connection = new SqlConnection(BankProjectDataAccessSettings._ConnectionString))
            {
                using (SqlCommand Command = new SqlCommand("SP_GetUserByEmailAndPassWord", Connection))
                {
                    Command.CommandType = CommandType.StoredProcedure;
                    Command.Parameters.AddWithValue("@Email", Email);
                    Command.Parameters.AddWithValue("@PassWord", PassWord);

                    Connection.Open();

                    try
                    {
                        using (SqlDataReader Reader = Command.ExecuteReader())
                        {
                            if (Reader.Read())
                            {
                                userDTO = new UserDTO
                                    (
                                        Reader.GetInt32(Reader.GetOrdinal("UserId")),
                                        Reader.GetString(Reader.GetOrdinal("FirstName")),
                                        Reader.GetString(Reader.GetOrdinal("LastName")),
                                        Reader.GetString(Reader.GetOrdinal("UserName")),
                                        Reader.GetString(Reader.GetOrdinal("PassWord")),
                                        Reader.GetString(Reader.GetOrdinal("Email")),
                                        Reader.GetString(Reader.GetOrdinal("Phone")),
                                        Reader.GetDateTime(Reader.GetOrdinal("DateOfBirth"))

                                    );
                            }
                        }
                    }
                    catch (Exception ex)
                    {
                    }
                    finally
                    {
                        Connection.Close();
                    }
                }
            }

            return userDTO;
        }

        public static bool IsUserExists(string Email, string PassWord)
        {
            //  bool IsFound = false;
            int? FoundResult = null;
            using (SqlConnection sqlConnection = new SqlConnection(BankProjectDataAccessSettings._ConnectionString))
            {
                using (SqlCommand sqlCommand = new SqlCommand("Sp_IsUserExists", sqlConnection))
                {
                    sqlCommand.CommandType = CommandType.StoredProcedure;
                    sqlCommand.Parameters.AddWithValue("@Email", Email);
                    sqlCommand.Parameters.AddWithValue("@PassWord", PassWord);

                    sqlConnection.Open();

                    try
                    {
                        object Result = sqlCommand.ExecuteScalar();

                        if (int.TryParse(Result.ToString(), out int found))
                        {
                            FoundResult = found;
                        }
                    }
                    catch (Exception ex)
                    {

                    }
                    finally
                    {
                        sqlConnection.Close();
                    }
                }
            }

            return FoundResult == 1;
        }

        public static bool IsUserExistsByEmail(string Email)
        {
            //  bool IsFound = false;
            int? FoundResult = null;
            using (SqlConnection sqlConnection = new SqlConnection(BankProjectDataAccessSettings._ConnectionString))
            {
                using (SqlCommand sqlCommand = new SqlCommand("SP_IsUserExistsByEmail", sqlConnection))
                {
                    sqlCommand.CommandType = CommandType.StoredProcedure;
                    sqlCommand.Parameters.AddWithValue("@Email", Email);
                    

                    sqlConnection.Open();

                    try
                    {
                        object Result = sqlCommand.ExecuteScalar();

                        if (int.TryParse(Result.ToString(), out int found))
                        {
                            FoundResult = found;
                        }
                    }
                    catch (Exception ex)
                    {

                    }
                    finally
                    {
                        sqlConnection.Close();
                    }
                }
            }

            return FoundResult == 1;
        }

        public static bool IsUserExistsByUserName(string UserName) 
        {
            int? FoundResult = null;

            using (SqlConnection Connection = new SqlConnection(BankProjectDataAccessSettings._ConnectionString))
            {
                using (SqlCommand Command = new SqlCommand("SP_IsUserExistsByUserName",Connection))
                {
                    Command.CommandType = CommandType.StoredProcedure;
                    Command.Parameters.AddWithValue("@UserName", UserName);

                    Connection.Open();

                    try
                    {
                        object Result = Command.ExecuteScalar();

                        if (int.TryParse(Result.ToString(), out int found)) 
                        {
                            FoundResult = found;
                        }

                    }
                    catch (Exception ex)
                    {

                    }
                    finally 
                    {
                        Connection.Close();
                    }
                }
            }

            return FoundResult == 1;
        }

        public static int AddNewUser(UserDTO userdto)
        {
            int NewUserId = -1;
            using (SqlConnection sqlConnection = new SqlConnection(BankProjectDataAccessSettings._ConnectionString))
            {
                using (SqlCommand sqlCommand = new SqlCommand("Sp_AddNewUser", sqlConnection))
                {
                    sqlCommand.CommandType = CommandType.StoredProcedure;
                    sqlCommand.Parameters.AddWithValue("@FirstName", userdto.FirstName);
                    sqlCommand.Parameters.AddWithValue("@LastName", userdto.LastName);
                    sqlCommand.Parameters.AddWithValue("@UserName", userdto.UserName);
                    sqlCommand.Parameters.AddWithValue("@PassWord", userdto.Password);
                    sqlCommand.Parameters.AddWithValue("@Email", userdto.Email);
                    sqlCommand.Parameters.AddWithValue("@Phone", userdto.Phone);
                    sqlCommand.Parameters.AddWithValue("@DateOfBirth", userdto.BirthDate);

                    var OutPutParameter = new SqlParameter("@NewUserId", SqlDbType.Int)
                    {
                        Direction = ParameterDirection.Output
                    };

                    sqlCommand.Parameters.Add(OutPutParameter);

                    sqlConnection.Open();

                    try
                    {
                        object Result = sqlCommand.ExecuteNonQuery();

                        if (Result != null && int.TryParse(Result.ToString(), out int rowsAffected))
                        {
                            if (rowsAffected > 0)
                            {
                                NewUserId = (int)OutPutParameter.Value;
                            }
                        }

                    }
                    catch (Exception ex)
                    {

                    }
                    finally
                    {
                        sqlConnection.Close();
                    }
                }
            }
            return NewUserId;
        }

        public static int UpdateUser( UserDTO userdto)
        {
            int Rows = 0;
            using (SqlConnection sqlConnection = new SqlConnection(BankProjectDataAccessSettings._ConnectionString))
            {
                using (SqlCommand sqlCommand = new SqlCommand("SP_UpdateUser", sqlConnection))
                {
                    sqlCommand.CommandType = CommandType.StoredProcedure;
                    sqlCommand.Parameters.AddWithValue("@UserId", userdto.UserId);
                    sqlCommand.Parameters.AddWithValue("@FirstName", userdto.FirstName);
                    sqlCommand.Parameters.AddWithValue("@LastName", userdto.LastName);
                    sqlCommand.Parameters.AddWithValue("@UserName", userdto.UserName);
                    sqlCommand.Parameters.AddWithValue("@Email", userdto.Email);
                    sqlCommand.Parameters.AddWithValue("@Phone", userdto.Phone);
                    sqlCommand.Parameters.AddWithValue("@BirthDate", userdto.BirthDate);

                    sqlConnection.Open();
                    try
                    {
                        object Result = sqlCommand.ExecuteNonQuery();

                        if (Result != null && int.TryParse(Result.ToString(), out int RowsAffected))
                        {
                            Rows = RowsAffected;
                        }
                    }
                    catch (Exception ex)
                    {
                           
                    }
                    finally
                    {
                        sqlConnection.Close();
                    }
                }
            }

            return Rows;
        }

        public static int ChangePassWord(int UserId , string NewPassWord)
        {
            int Rows = 0;
            using (SqlConnection Connection = new SqlConnection(BankProjectDataAccessSettings._ConnectionString))
            {
                using(SqlCommand Command = new SqlCommand("SP_ChangePassword",Connection))
                {
                    Command.CommandType = CommandType.StoredProcedure;
                    Command.Parameters.AddWithValue("@Id", UserId);
                    Command.Parameters.AddWithValue("@NewPassword", NewPassWord);

                    Connection.Open();

                    try
                    {
                        object Result = Command.ExecuteNonQuery();

                        if(Result != null && int.TryParse(Result.ToString(), out int RowsAffected))
                        {
                            Rows = RowsAffected;
                        }
                    }
                    catch (Exception ex)
                    {
                    }
                    finally
                    {
                        Connection.Close();
                    }

                    }
            }

            return Rows;
        }

        public static int DeleteUserById(int UserId) 
        {
            int Rows = 0;
            using (SqlConnection Connection = new SqlConnection(BankProjectDataAccessSettings._ConnectionString))
            {
                using (SqlCommand command = new SqlCommand("SP_DeleteUser", Connection))
                {
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.AddWithValue("@Id", UserId);

                    Connection.Open();

                    try
                    {
                        object Result = command.ExecuteNonQuery();

                        if(Result != null && int.TryParse(Result.ToString() , out int RowsAffected))
                        {
                            Rows = RowsAffected;
                        }
                    }
                    catch (Exception ex)
                    {

                    }
                    finally 
                    {
                        Connection.Close();
                    }
                }
            }

            return Rows;
        }
    }

}
