using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using BSAD_web.Models;

namespace BSAD_web.Controllers;

public class FormsController : Controller
{
    private readonly ILogger<FormsController> _logger;

    public FormsController(ILogger<FormsController> logger)
    {
        _logger = logger;
    }
    // Website Form Pages
    public IActionResult Register() // Renders Registeration Page
    {
        return View();
    }

    public IActionResult Login() // Renders Login Page
    {
        return View();
    }

    public IActionResult ForgotPassword() // Renders Forget Password Prompt
    {
        return View();
    }

    public IActionResult ForgotUsername() // Renders Forget Password Prompt
    {
        return View();
    }
    public IActionResult Application() // Renders Application
    {
        return View();
    }

    [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
    public IActionResult Error()
    {
        return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
    }
}
