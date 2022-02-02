using Gamification.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Gamification.Data
{
    public class UserRepository : IUserRepository
    {
        private readonly UserContext db;
        public UserRepository(UserContext context)
        {
           db = context;
        }
        public User Create (User user)
        {
            db.Users.Add(user);
            db.SaveChanges();
            return user;
        }

        public User GetUserByUserName(string userName)
        {
            return db.Users.FirstOrDefault(u=> u.UserName == userName);
        }
    }
}
