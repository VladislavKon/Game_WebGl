using Gamification.Data;
using Gamification.DTOs;
using Gamification.Models;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;

namespace Gamification.Controllers
{
    [Route(template: "api")]
    [ApiController]
    [Authorize]
    public class AuthController : ControllerBase
    {
       private readonly IUserRepository _repository;
       public AuthController(IUserRepository repository)
        {
            _repository = repository;
        }
        [AllowAnonymous]
        [HttpPost(template: "register")]
        public IActionResult Register(RegisterDto dto)
        {
            var user = new User
            {
                UserName = dto.UserName,
                Password = BCrypt.Net.BCrypt.HashPassword(dto.Password),
            };
            return Created(uri: "success", value: _repository.Create(user));
        }

        [AllowAnonymous]
        [HttpPost(template: "login")]
        public async Task<IActionResult> Login(LoginDto dto)
        {
            var user = _repository.GetUserByUserName(dto.UserName);
            // если нет такого пользователя в базе
            if (user == null)
            {
                return Unauthorized(new { message = "Invalid Credentials" });
            }
            // если пароль не прошел верификацию 
            if (!BCrypt.Net.BCrypt.Verify(dto.Password, user.Password))
            {
                return Unauthorized(new { message = "Invalid Credentials" });
            }

            await AuthenticateAsync(dto.UserName);

            return Ok(new { message = "success", username = dto.UserName });
        }
        
        [HttpPost(template: "logout")]
        public async Task Logout()
        {
            await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
        }

        // возможно нужно будет подшаманить
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
