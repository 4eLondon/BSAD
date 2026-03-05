using System.ComponentModel.DataAnnotations;

namespace BSAD_web.Models
{
    public class ForgotPasswordModel
    {
        [Required(ErrorMessage="First name field is empty")]
        public string Firstname {get;set;} = string.Empty

        [Required(ErrorMessage="Last name field is empty")]
        public string Lastname {get;set;} = string.Empty


        [Required(ErrorMessage="Username field is empty")]
        public string Username {get;set;} = string.Empty

        [Required(ErrorMessage="Confirm your new password")]
        public string NewPassword {get;set;} = string.Empty

        [Required(ErrorMessage="Please confim your password")]
        [Compare("NewPassword",ErrorMessage="Password do not match")]
        public string ConfirmNewPassword {get;set;} = string.Empty


    }
}
