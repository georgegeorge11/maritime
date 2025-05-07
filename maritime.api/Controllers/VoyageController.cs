using maritime.api.Data;
using maritime.api.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace maritime.api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class VoyageController : ControllerBase
    {
        private readonly MaritimeDBContext _context;

        public VoyageController(MaritimeDBContext context)
        {
            _context = context;
        }
        
        [HttpGet("get-voyages")]
        public async Task<IActionResult> GetVoyages()
        {
            var voyages = await _context.Voyages
                .Include(v => v.Ship)
                .Include(v => v.DeparturePort)
                .Include(v => v.ArrivalPort).ToListAsync();
            return Ok(voyages);
        }

        [HttpGet("get-voyage/{id}")]
        public async Task<IActionResult> GetVoyage(int id)
        {
            var voyage = await _context.Voyages
                .Include(v => v.DeparturePort).ThenInclude(p => p.Country)
                .Include(v => v.ArrivalPort).ThenInclude(p => p.Country)
                .Include(v => v.Ship)
                .FirstOrDefaultAsync(v => v.VoyagePK == id);

            if (voyage == null)
                return NotFound($"Voyage with ID {id} not found.");

            return Ok(voyage);
        }

        [HttpPost("add-voyage")]
        public async Task<IActionResult> AddVoyage([FromBody] Voyage voyage)
        {
            
            _context.Voyages.Add(voyage);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetVoyage), new { id = voyage.VoyagePK }, voyage);
        }
        
        [HttpPut("update-voyage/{id}")]
        public async Task<IActionResult> UpdateVoyage([FromRoute]int id, [FromBody] Voyage voyage)
        {
            var dbVoyage = _context.Voyages.FirstOrDefault(v => v.VoyagePK == id);
            if (dbVoyage == null)
            {
                return NotFound($"Voyage with ID {id} not found.");
            }
            var dbShip = _context.Ships.FirstOrDefault(s => s.ShipPK == voyage.ShipPK);
            var dbDeparturePort = _context.Ports.FirstOrDefault(p => p.PortPK == voyage.DeparturePortPK);
            var dbArrivalPort = _context.Ports.FirstOrDefault(p => p.PortPK == voyage.ArrivalPortPK);
            dbVoyage.Ship = dbShip;
            dbVoyage.DeparturePort = dbDeparturePort;
            dbVoyage.ArrivalPort = dbArrivalPort;
            dbVoyage.VoyageDate = voyage.VoyageDate;
            dbVoyage.VoyageStartDate = voyage.VoyageStartDate;
            dbVoyage.VoyageEndDate = voyage.VoyageEndDate;
            await _context.SaveChangesAsync();
            return Ok();
        }

        [HttpDelete("delete-voyage/{id}")]
        public async Task<IActionResult> DeleteVoyage(int id)
        {
            var voyage = await _context.Voyages.FindAsync(id);
            if (voyage == null)
                return NotFound($"Voyage with ID {id} not found.");

            _context.Voyages.Remove(voyage);
            await _context.SaveChangesAsync();
            return NoContent();
        }

    }
}
