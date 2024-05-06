using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RichardAde.Data;
using RichardAde.Models;
using System.Diagnostics;

namespace RichardAde.Controllers
{


    public class HomeController : Controller
    {
        private readonly RichardContext _context;

        public HomeController(RichardContext context)
        {
            _context = context;
        }

        public async Task<IActionResult> Index([FromQuery] PageParameters pageParams)
        {
            // Get a paginated list of data
            List<Product> products = await _context.Products
                .Skip((pageParams.PageNumber - 1) * pageParams.PageSize)
                .ToListAsync();

            return View(products);
        }

        public IActionResult Privacy()
        {
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}
