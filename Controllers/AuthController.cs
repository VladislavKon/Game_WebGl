using Gamification.Data;
using Gamification.Models.DTO;
using Gamification.Models;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;

namespace Gamification.Controllers
{
    [Route(template: "api/auth")]
    [ApiController]
    [Authorize]
    public class AuthController : ControllerBase
    {
       private readonly IUserRepository _userRepository;
       public AuthController(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        [AllowAnonymous]
        [HttpPost(template: "register")]
        public async Task<IActionResult> Register(UserRegisterDto userDto)
        {
            if(userDto == null)
            {
                return BadRequest();
            }
            var user = new User
            {
                UserName = userDto.UserName,
                Password = BCrypt.Net.BCrypt.HashPassword(userDto.Password)
            };
            return Created("success", await _userRepository.Create(user));
        }
        [AllowAnonymous]
        [HttpPost(template: "login")]
        public async Task<IActionResult> Login(UserRegisterDto userDto)
        {
            var user = _userRepository.GetUserByUserName(userDto.UserName);
            // если нет такого пользователя в базе
            if (user == null)
            {
                return Unauthorized(new { message = "Invalid Credentials" });
            }
            // если пароль не прошел верификацию 
            if (!BCrypt.Net.BCrypt.Verify(userDto.Password, user.Password))
            {
                return Unauthorized(new { message = "Invalid Credentials" });
            }

            await AuthenticateAsync(userDto.UserName);

            return Ok(new { message = "success", username = userDto.UserName });
        }
        
        [HttpPost(template: "logout")]
        public async Task Logout()
        {
            await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
        }

        [AllowAnonymous]
        [HttpGet(template: "user")]
        public IActionResult GetUser()
        {
            if(string.IsNullOrEmpty(User.Identity.Name))
                return Unauthorized(new { message = "Invalid Credentials" });

            return Ok(new {username = User.Identity.Name });

        }

        // Helpers methods
        private async Task AuthenticateAsync(string userName)
        {
            var claims = new List<Claim>
            {
                new Claim(ClaimsIdentity.DefaultNameClaimType,userName)
            };
            ClaimsIdentity id = new ClaimsIdentity(claims, "ApplicationCookie", ClaimsIdentity.DefaultNameClaimType, ClaimsIdentity.DefaultRoleClaimType);
            await HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, new ClaimsPrincipal(id));
        }
    }
}
