using System.Collections.Generic;

namespace Gamification.Models.Errors
{
    public class ErrorResponse
    {
        public List<ErrorModel> Errors { get; set; } = new List<ErrorModel>();
    }
}
