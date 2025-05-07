using maritime.api.Data;
using maritime.api.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace maritime.api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ShipController : ControllerBase
    {
        private readonly MaritimeDBContext _context;

        public ShipController(MaritimeDBContext context)
        {
            _context = context;
        }
        [HttpGet("get-ships")]
        public async Task<IActionResult> GetShips()
        {
            var ships = await _context.Ships.ToListAsync();
            return Ok(ships);
        }
        
        [HttpGet("get-ship/{id}")]
        public async Task<IActionResult> GetShip(int id)
        {
            var ship = await _context.Ships.FindAsync(id);
            if (ship == null)
                return NotFound($"Ship with ID {id} not found.");

            return Ok(ship);
        }

        [HttpPost("add-ship")]
        public async Task<IActionResult> AddShip([FromBody] Ship ship)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            _context.Ships.Add(ship);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetShip), new { id = ship.ShipPK }, ship);
        }

        [HttpPut("update-ship/{id}")]
        public async Task<IActionResult> UpdateShip([FromRoute] int id,[FromBody] Ship ship)
        {
            var dbShip = _context.Ships.FirstOrDefault(s => s.ShipPK == id);
            if (dbShip == null)
            {
                return NotFound($"Ship with ID {id} not found.");
            }
            dbShip.Name = ship.Name;
            dbShip.MaximumSpeed = ship.MaximumSpeed;
            await _context.SaveChangesAsync();
            return Ok();
        }

        [HttpDelete("delete-ship/{id}")]
        public async Task<IActionResult> DeleteShip(int id)
        {
            var ship = await _context.Ships.FindAsync(id);
            if (ship == null)
                return NotFound($"Ship with ID {id} not found.");

            _context.Ships.Remove(ship);
            await _context.SaveChangesAsync();
            return NoContent();
        }

    }
}
