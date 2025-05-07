using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace maritime.api.Models;

public class Voyage
{
    [Key]
    public int VoyagePK { get; set; }
    public DateOnly VoyageDate { get; set; }
    [ForeignKey("ArrivalPort")]
   
    public int ArrivalPortPK { get; set; }
    [DeleteBehavior(DeleteBehavior.NoAction)]
    public virtual Port? ArrivalPort { get; set; }
    [ForeignKey("DeparturePort")]
    
    public int DeparturePortPK { get; set; }
    [DeleteBehavior(DeleteBehavior.NoAction)]
    public virtual Port? DeparturePort { get; set; }
    public DateTime VoyageStartDate { get; set; }
    public DateTime VoyageEndDate { get; set; }
    [ForeignKey("Ship")]
    public int ShipPK { get; set; }
    public virtual Ship? Ship { get; set; }
}