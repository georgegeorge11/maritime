using maritime.api.Data;
using maritime.api.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace maritime.api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PortController : ControllerBase
    {
        private readonly MaritimeDBContext _context;

        public PortController(MaritimeDBContext context)
        {
            _context = context;
        }

        [HttpGet("get-ports")]
        public async Task<IActionResult> GetPorts()
        {
            var ports = await _context.Ports.Include(p => p.Country).ToListAsync();
            return Ok(ports);
        }
        
        [HttpGet("get-port/{id}")]
        public async Task<IActionResult> GetPort(int id)
        {
            var port = await _context.Ports
                .Include(p => p.Country)
                .FirstOrDefaultAsync(p => p.PortPK == id);

            if (port == null)
                return NotFound($"Port with ID {id} not found.");

            return Ok(port);
        }

        [HttpPost("add-port")]
        public async Task<IActionResult> AddPort([FromBody] Port newPort)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var countryExists = await _context.Countries.AnyAsync(c => c.CountryPK == newPort.CountryPK);
            if (!countryExists)
                return BadRequest("Invalid CountryPK.");

            _context.Ports.Add(newPort);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetPort), new { id = newPort.PortPK }, newPort);
        }

        [HttpPut("update-port/{id}")]
        public async Task<IActionResult> UpdatePort([FromRoute]int id, [FromBody] Port port)
        {
            var dbPort = _context.Ports.FirstOrDefault(p => p.PortPK == id);
            if (dbPort == null)
            {
                return NotFound($"Port with ID {id} not found.");
            }
            var dbCountry = _context.Countries.FirstOrDefault(c => c.CountryPK == port.CountryPK);
           dbPort.Name = port.Name;
           dbPort.Country = dbCountry;
            await _context.SaveChangesAsync();
            return Ok();
        }

        [HttpDelete("delete-port/{id}")]
        public async Task<IActionResult> DeletePort(int id)
        {
            var port = await _context.Ports.FindAsync(id);
            if (port == null)
                return NotFound($"Port with ID {id} not found.");

            _context.Ports.Remove(port);
            await _context.SaveChangesAsync();
            return NoContent();
        }

    }
}
