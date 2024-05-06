using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RichardAde.Data;
using RichardAde.Models;
using System.Net;


namespace RichardAde.Controllers
{
    public class AdminController : Controller
    {
        private readonly RichardContext _context;

        public AdminController(RichardContext context)
        {
            _context = context;
        }

        public async Task<ActionResult> Index([FromQuery] PageParameters pageParams)
        {
            // Get a paginated list of data
            List<Product> products = await _context.Products
                .Skip((pageParams.PageNumber - 1) * pageParams.PageSize)
                .ToListAsync();

            return View(products);
        }


        // GET: AdminController/Edit/5
        [HttpGet]
        public async Task <ActionResult> Edit(int? id)
        {
           
            Product? product = await _context.Products.FindAsync(id);

            if (product == null)
            {
                return NotFound();
            }
           
            return View(product);
        }

        // POST: AdminController/Edit/5
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> Edit([Bind(include: "Id,Name,Description")] Product product)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    _context.Entry(product).State = EntityState.Modified;
                    await _context.SaveChangesAsync();
                    return RedirectToAction("Index");
                }
                return View(product);

            }
            catch
            {
                return View(product);
            }
        }
    }
}
