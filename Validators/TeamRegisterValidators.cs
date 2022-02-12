using FluentValidation;
using Gamification.Models.DTO.Team;

namespace Gamification.Validators
{
    public class TeamRegisterValidators : AbstractValidator<TeamRegisterDto>
    {
        public TeamRegisterValidators()
        {
            RuleFor(x => x.TeamName)
                .NotEmpty()
                .MinimumLength(3)
                .MaximumLength(20)
                .Matches("^[a-zA-Z0-9 ]*$");
        }
    }
}
