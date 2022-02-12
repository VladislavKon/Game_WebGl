using Gamification.Models;
using System.Threading.Tasks;

namespace Gamification.Data
{
    public interface IUserRepository
    {
        Task<User> Create(User user);
        User  GetUserByUserName(string userName);
    }
}
