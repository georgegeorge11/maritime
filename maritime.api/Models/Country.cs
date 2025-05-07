using System.ComponentModel.DataAnnotations;

namespace maritime.api.Models;

public class Country
{
   [Key]
    public int CountryPK { get; set; }
    [Required]
    [MaxLength(100)]
    public string Name { get; set; }
}