using Gamification.Models;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;

namespace Gamification.Data
{
    public class UserRepository : IUserRepository
    {
        private readonly ApplicationContext db;
        public UserRepository(ApplicationContext context)
        {
           db = context;
        }

        public async Task<User> Create (User user)
        {
            db.Users.Add(user);
            await db.SaveChangesAsync();
            return user;
        }

        public User GetUserByUserName(string userName)
        {
            return db.Users.FirstOrDefault(u=> u.UserName == userName);
        }
    }
}
