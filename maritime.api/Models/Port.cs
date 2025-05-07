using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace maritime.api.Models;

public class Port
{
    [Key]
    public int PortPK { get; set; }
    [Required]
    [MaxLength(250)]
    public string Name { get; set; }
    [ForeignKey("Country")]
    public int CountryPK { get; set; }
    public virtual Country? Country { get; set; }
}