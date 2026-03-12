using System.ComponentModel.DataAnnotations;

namespace BSAD_web.Models
{
    public class ForgotUsernameModel
    {
        [Required(ErrorMessage="You must confirm your first name")]
        public string Firstname{get;set;} = string.Empty;

        [Required(ErrorMessage="You must confirm your last name")]
        public string Lastname{get;set;} = string.Empty;

        [Required(ErrorMessage="You must confirm your last name")]
        [EmailAddress(ErrorMessage="Invalid Email Format")]
        public string Email{get;set;} = string.Empty;

        [Required(ErrorMessage="You must confirm your first name")]
        public string NewUsername{get;set;} = string.Empty;

    }

}
