using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RichardAde.Models
{
    [Table("products")]
    public class Product
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(25, ErrorMessage = "Maximum length for last name is 25 characters")]
        [DisplayName("Product Name")]
        public required string Name { get; set; }

        [Required]
        [MaxLength(100, ErrorMessage = "Maximum length for last description is 100 characters")]
        [DisplayName("Product Description")]
        public required string Description { get; set; }
    }

}
