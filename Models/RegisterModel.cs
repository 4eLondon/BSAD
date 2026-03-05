using System.ComponentModel.DataAnnotations;

namespace BSAD_web.Models
{
    public class RegisterModel
    {
        [Required(ErrorMessage="Your first name is required")]
        public string Firstname{get;set;} = string.Empty;

        [Required(ErrorMessage="Your last name is required")]
        public string Lastname{get;set;} = string.Empty;

        [Required(ErrorMessage="Please enter a Username")]
        public string Username{get;set;} = string.Empty;

        [Required(ErrorMessage="Please enter your email address")]
        [EmailAddress(ErrorMessage="Invalid email format")]
        public string Email{get;set;} = string.Empty;

        [DataType(DataType.Password)]
        [StringLength(100, MinimumLength = 6, ErrorMessage = "Password must be at least 6 characters")]
        [Required(ErrorMessage="Password Cannot be Empty")]
        public string Password{get;set;} = string.Empty;

        [DataType(DataType.Password)]
        [Required(ErrorMessage="Please confim your password")]
        [Compare("Password",ErrorMessage="Passwords must match")]
        public string Confirmpassword{get;set;} = string.Empty;

    }
}
