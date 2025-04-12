using Microsoft.AspNetCore.Mvc;

namespace simple_rpg.Controllers;

[Route("api/[controller]")]
public class HomeController : Controller
{
    [HttpGet]
    public IActionResult Get()
    {
        return Ok("ok response");
    }
}