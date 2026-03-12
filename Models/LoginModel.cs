using System.ComponentModel.DataAnnotations;

namespace BSAD_web.Models
{
    public class LoginModel
    {
        [Required(ErrorMessage="Please enter a Username")]
        public string Username{get;set;} = string.Empty;

        [DataType(DataType.Password)]
        [StringLength(100, MinimumLength = 6, ErrorMessage = "Password must be at least 6 characters")]
        [Required(ErrorMessage="Password Cannot be Empty")]
        public string Password{get;set;} = string.Empty;

    }
}
