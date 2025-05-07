using System.ComponentModel.DataAnnotations;

namespace maritime.api.Models;

public class Ship
{
    [Key]
    public int ShipPK { get; set; }
    [Required]
    [MaxLength(250)]
    public string Name { get; set; }
    [Required]
    public decimal MaximumSpeed { get; set; }
}