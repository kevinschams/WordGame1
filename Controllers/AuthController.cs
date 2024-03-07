using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Authorization;
using WordGame.Models;
using System.Text.Json;
namespace UserLoginApp.Namespace
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {        
        private readonly SignInManager<IdentityUser> _signInManager;
        private readonly UserManager<IdentityUser> _userManager;

        public AuthController(
            SignInManager<IdentityUser> signInManager,
            UserManager<IdentityUser> userManager 
        ) {
            _signInManager = signInManager;
            _userManager = userManager;
        }

        [AllowAnonymous]
        [HttpPost("register")]
        public async Task<IActionResult> Register(EmailLoginDetails details){
            
            var user = new IdentityUser {UserName = details.Email, Email = details.Email};

            var result = await _userManager.CreateAsync(user, details.Password).ConfigureAwait(false);

            if(!result.Succeeded) {
                var errors = result.Errors.Select(e => e.Description);                

                return BadRequest(new {errors});
            }

            return Ok(new UserDto {Id = user.Id, UserName = user.UserName});
        }

        [AllowAnonymous]
        [HttpPost("login")]
        public async Task<IActionResult> Login(EmailLoginDetails details) {
            var user = await _userManager.FindByEmailAsync(details.Email);

            if(null == user) {
                return BadRequest();
            }
            Console.WriteLine(JsonSerializer.Serialize(details));
            var result = await _signInManager.PasswordSignInAsync(details.Email, details.Password, false, false)
                                                .ConfigureAwait(false);
                        
        // if I remove the not operator this code works so idk what is going on with this tbh, sumn with the server endpoints probably.
            if(!result.Succeeded) {  
                Console.WriteLine(JsonSerializer.Serialize(result));                           
                return Unauthorized();
            }

            return Ok(new UserDto {Id = user.Id, UserName = user.UserName});
        }

        [HttpPost("logout")]
        public async Task<IActionResult> Logout() {
            await _signInManager.SignOutAsync();

            return Ok(new { message = "You've been logged out successfully." });
        }


    }
}
// [Authorize]
// [ApiController]
// [Route("api/auth")]
// public class AuthController : ControllerBase
// {
//     private readonly UserManager<ApplicationUser> _userManager;
//     private readonly SignInManager<ApplicationUser> _signInManager;

//     public AuthController(UserManager<ApplicationUser> userManager, SignInManager<ApplicationUser> signInManager)
//     {
//         _userManager = userManager;
//         _signInManager = signInManager;
//     }

//     [AllowAnonymous]
//     [HttpPost("register")]
//     public async Task<IActionResult> Register([FromBody] EmailLoginDetails model)
//     {
//         if (ModelState.IsValid)
//         {
//             var user = new ApplicationUser { UserName = model.Email, Email = model.Email };
//             var result = await _userManager.CreateAsync(user, model.Password);
//             if (result.Succeeded)
//             {
//                 await _signInManager.SignInAsync(user, isPersistent: false);
//                 return Ok(new UserDto { Id = user.Id, Email = user.Email, UserName = user.UserName });
//             }
//             foreach (var error in result.Errors)
//             {
//                 ModelState.AddModelError(string.Empty, error.Description);
//             }
//         }
//         return BadRequest(ModelState);
//     }

//     [AllowAnonymous]
//     [HttpPost("login")]
//     public async Task<IActionResult> Login([FromBody] EmailLoginDetails model)
//     {
//         var result = await _signInManager.PasswordSignInAsync(model.Email, model.Password, isPersistent: false, lockoutOnFailure: false);
//         if (result.Succeeded)
//         {
//             var user = await _userManager.FindByEmailAsync(model.Email);
//             return Ok(new UserDto { Id = user.Id, Email = user.Email, UserName = user.UserName });
//         }
//         ModelState.AddModelError(string.Empty, "Invalid login attempt.");
//         return BadRequest(ModelState);
//     }

//     [HttpPost("logout")]
//     public async Task<IActionResult> Logout()
//     {
//         await _signInManager.SignOutAsync();
//         return Ok("User logged out successfully.");
//     }
// }
