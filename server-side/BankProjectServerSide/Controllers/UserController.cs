using BankProjectBusinessLayer;
using BankProjectDataAccessLayer;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;

namespace BankProjectServerSide.Controllers
{
    [Route("api/Users")]
    [ApiController]
    public class UserController : ControllerBase
    {
        [HttpGet("{id}", Name = "GetUserByID")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public ActionResult<UserDTO> FindUserById(int id)
        {
            if (id == null || id <= 0)
            {
                return BadRequest("invalid entered data");
            }

            clsUser UserToFind = clsUser.FindUserById(id);
            if (UserToFind == null)
            {
                return NotFound($"user with id : {id} is not found");
            }

            if (UserToFind != null)
            {
                return Ok(UserToFind.Userdto);
            }
            else
            {
                return StatusCode(500, "internal server error");
            }
        }

        [HttpGet("userName",Name ="GetUserByUserName")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType (StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError) ]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        public ActionResult<UserDTO> FindUserByUserName(string userName) 
        {
            if(userName == null || userName.Length == 0)
            {
                return BadRequest("invalid entered data");
            }

            clsUser UserToFind  = clsUser.FindUserByUserName(userName);
            if (UserToFind == null)
            {
                return NotFound($"User with user name {userName} is not found");
               
            }

            return Ok(UserToFind.Userdto);
            
            //else
            //{
            //    return StatusCode(500, "internal server error");
            //}
        }

        [HttpGet("FindUserByEmailPassWord", Name ="GetUserByEmailAndPassWord")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public ActionResult<UserDTO> GetUserByEmailAndPassWord(string Email, string PassWord) 
        {
            if(string.IsNullOrEmpty(Email)|| string.IsNullOrWhiteSpace(PassWord)||
                string.IsNullOrEmpty(Email)||string.IsNullOrWhiteSpace(PassWord))
            {
                return BadRequest("invalid entered data");
            }

            clsUser UserToFind = clsUser.GetUserByEmailAndPassWord(Email, PassWord);

            if (UserToFind == null) 
            {
                return NotFound($"user with email : {Email} and password :{PassWord} is not found");
            }

            return Ok(UserToFind.Userdto);  
        }


        [HttpGet("{Email},{Password}", Name ="IsUserExists")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public ActionResult<bool> IsUserExists(string Email , string Password) 
        {
            if(string.IsNullOrEmpty(Email) || string.IsNullOrEmpty(Email) ||
                string.IsNullOrWhiteSpace(Password) || string.IsNullOrWhiteSpace(Password) )
            {
                return BadRequest("invalid entered data");
            }

            bool LoginResult = clsUser.IsUserExists(Email, Password);
            if (LoginResult != null)
                return Ok(LoginResult);
            else
                return StatusCode(500, "internal server error");

        }


        [HttpGet("ExistsByEmail", Name = "IsUserExistsByEmail")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public ActionResult<bool> IsUserExistsByEmail(string Email)
        {
            if (string.IsNullOrEmpty(Email) || string.IsNullOrEmpty(Email))
                
            {
                return BadRequest("invalid entered data");
            }

            bool FoundResult = clsUser.IsUserExistsByEmail(Email);
            if (FoundResult != null)
                return Ok(FoundResult);
            else
                return StatusCode(500, "internal server error");

        }

        [HttpGet("IsUserExistsByUserName",Name ="IsUserExistsByUserName")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public ActionResult<bool> IsUserExistsByUserName(string UserName)
        {
            if(string.IsNullOrEmpty(UserName) || string.IsNullOrWhiteSpace(UserName))
            {
                return BadRequest("invalid entered data");
            }

            bool FoundResult = clsUser.IsUserExistsByUserName(UserName);
            if (FoundResult != null)
                return Ok(FoundResult);
            else
                return StatusCode(500, "internal server error");
        }

        [HttpPost(Name ="AddNewUser")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]

        public ActionResult<UserDTO> AddNewUser(UserDTO newuserdto)
        {
            if (string.IsNullOrEmpty(newuserdto.FirstName) || string.IsNullOrWhiteSpace(newuserdto.FirstName) ||
                string.IsNullOrEmpty(newuserdto.LastName) || string.IsNullOrWhiteSpace(newuserdto.LastName) ||
                string.IsNullOrEmpty(newuserdto.UserName) || string.IsNullOrWhiteSpace(newuserdto.UserName) ||
                string.IsNullOrEmpty(newuserdto.Password) || string.IsNullOrWhiteSpace(newuserdto.Password) ||
                string.IsNullOrEmpty(newuserdto.Email) || string.IsNullOrWhiteSpace(newuserdto.Email) ||
                string.IsNullOrEmpty(newuserdto.Phone) || string.IsNullOrWhiteSpace(newuserdto.Phone) ||
                newuserdto.BirthDate == null)
            {
                return BadRequest("invalid entered data");
            }

            clsUser NewUser = new clsUser(new UserDTO(newuserdto.UserId , newuserdto.FirstName , newuserdto.LastName , newuserdto.UserName,
                newuserdto.Password , newuserdto.Email , newuserdto.Phone , newuserdto.BirthDate) );
            if(NewUser.Save())
            {
                newuserdto.UserId = NewUser.UserId;

                return CreatedAtRoute("GetUserByID", new { id = newuserdto.UserId }, newuserdto);
            }
            else
            {
                return StatusCode(500, "internal server error");
            }


        }

        [HttpPut("{UserId}",Name ="UpdateUser")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public ActionResult<UserDTO> UpdateUser(int UserId, UserDTO UpdatedUserDto) 
        {
            if (string.IsNullOrEmpty(UpdatedUserDto.FirstName) || string.IsNullOrWhiteSpace(UpdatedUserDto.FirstName) ||
            string.IsNullOrEmpty(UpdatedUserDto.LastName) || string.IsNullOrWhiteSpace(UpdatedUserDto.LastName) ||
            string.IsNullOrEmpty(UpdatedUserDto.UserName) || string.IsNullOrWhiteSpace(UpdatedUserDto.UserName) ||
            string.IsNullOrEmpty(UpdatedUserDto.Email) || string.IsNullOrWhiteSpace(UpdatedUserDto.Email) ||
            string.IsNullOrEmpty(UpdatedUserDto.Phone) || string.IsNullOrWhiteSpace(UpdatedUserDto.Phone) ||
            UpdatedUserDto.BirthDate == null || UserId <=0)
            {
                return BadRequest("invalid entered data");
            }

            clsUser UserToUpdate = clsUser.FindUserById(UserId);
            if(UserToUpdate == null)
            {
                return NotFound($"User with id {UserId} is not found");
            }

            UserToUpdate.FirstName = UpdatedUserDto.FirstName;
            UserToUpdate.LastName = UpdatedUserDto.LastName;
            UserToUpdate.UserName = UpdatedUserDto.UserName;
            UserToUpdate.Email = UpdatedUserDto.Email;
            UserToUpdate.Phone = UpdatedUserDto.Phone;
            UserToUpdate.BirthDate = UpdatedUserDto.BirthDate;

            if(UserToUpdate.Save())
            {
                return Ok(UserToUpdate.Userdto);
            }
            else
            {
                return StatusCode(500, "Internal server error");
            }

        }

        [HttpPut("{UserId},{NewPassWord}",Name ="ChangeUserPassWord")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public ActionResult<UserDTO> ChangePassWord(int UserId , string NewPassWord)
        {
            if (UserId <= 0 || string.IsNullOrEmpty(NewPassWord) || string.IsNullOrWhiteSpace(NewPassWord))
            {
                return BadRequest("invalid entered data");
            }

            clsUser UserToUpdate = clsUser.FindUserById(UserId);
            if (UserToUpdate == null) 
            {
                return NotFound($"User With id {UserId} is not found");
            }

            UserToUpdate.Password = NewPassWord;
            if(UserToUpdate.ChangePassWord())
            {
                return Ok(UserToUpdate.Userdto);
            }
            else
            {
                return StatusCode(500, "internal server error");
            }


        }

        [HttpDelete("{UserId}",Name ="DeleteUser")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public ActionResult DeleteUser(int UserId) 
        {
            if(UserId <=0)
            {
                return BadRequest("invalid entered data");
            }

            clsUser UserToDelete = clsUser.FindUserById(UserId);
            if(UserToDelete == null)
            {
                return NotFound($"user with id {UserId} is not found");
            }

            if (clsUser.DeleteUser(UserId))
            {
                return Ok($"user with id {UserId} has been deleted");
            }
            else
            {
                return StatusCode(500, "internal server error");
            }
        }
    }
}
