using maritime.api.Data;
using maritime.api.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace maritime.api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CountryController : ControllerBase
    {
        private readonly MaritimeDBContext _context;

        public CountryController(MaritimeDBContext context)
        {
            _context = context;
        }

        [HttpGet("visited-last-year")]
        public async Task<IActionResult> GetCountriesVisitedLastYear()
        {
            var oneYearAgo = DateTime.UtcNow.AddYears(-1);

            var voyages = await _context.Voyages
                .Where(v => v.VoyageEndDate >= oneYearAgo)
                .Include(v => v.ArrivalPort).ThenInclude(p => p.Country)
                .Include(v => v.DeparturePort).ThenInclude(p => p.Country)
                .ToListAsync();

            var countries = voyages
                .SelectMany(v => new[]
                {
                    v.ArrivalPort?.Country,
                    v.DeparturePort?.Country
                })
                .Where(c => c != null)
                .DistinctBy(c => c!.CountryPK) 
                .Select(c => new
                {
                    c!.CountryPK,
                    c.Name
                })
                .OrderBy(c => c.Name)
                .ToList();

            return Ok(countries);
        }

        [HttpGet("get-countries")]
        public async Task<IActionResult> GetCountries()
        {
            var countries = await _context.Countries.ToListAsync();
            return Ok(countries);
        }
        
       

        // GET: api/country/get-country/5
        [HttpGet("get-country/{id}")]
        public async Task<IActionResult> GetCountry(int id)
        {
            var country = await _context.Countries.FindAsync(id);
            if (country == null)
                return NotFound($"Country with ID {id} not found.");

            return Ok(country);
        }
        
        [HttpPost("add-country")]
        public async Task<IActionResult> AddCountry([FromBody] Country newCountry)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            _context.Countries.Add(newCountry);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetCountry), new { id = newCountry.CountryPK }, newCountry);
        }
        
        [HttpPut("update-country/{id}")]
        public async Task<IActionResult> UpdateCountry(int id, [FromBody] Country updatedCountry)
        {
            var dbCountry = await _context.Countries.FindAsync(id);
            if (dbCountry == null)
                return NotFound($"Country with ID {id} not found.");

            dbCountry.Name = updatedCountry.Name;
            await _context.SaveChangesAsync();

            return Ok(dbCountry);
        }
        
        [HttpDelete("delete-country/{id}")]
        public async Task<IActionResult> DeleteCountry(int id)
        {
            var country = await _context.Countries.FindAsync(id);
            if (country == null)
                return NotFound($"Country with ID {id} not found.");

            _context.Countries.Remove(country);
            await _context.SaveChangesAsync();

            return NoContent();
        }

    }
}
