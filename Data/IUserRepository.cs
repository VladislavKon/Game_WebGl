using Gamification.Models;

namespace Gamification.Data
{
    public interface IUserRepository
    {
        User Create(User user);
        User GetUserByUserName(string userName);
    }
}
