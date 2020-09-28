using System.Linq;
using System.Net;
using System.Threading.Tasks;
using Application.Errors;
using Application.Interfaces;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Profiles
{
    public class ProfileReader : IProfileReader
    {
        private readonly Datacontext _datacontext;
        private readonly IUserAccessor _userAccessor;
        public ProfileReader(Datacontext datacontext, IUserAccessor userAccessor)
        {
            _userAccessor = userAccessor;
            _datacontext = datacontext;
        }

        public async Task<Profile> ReadProfile(string username)
        {
            var user = await _datacontext.Users.FirstOrDefaultAsync(x => x.UserName == username);

            if(user == null)
                throw new RestException(HttpStatusCode.NotFound, new {User = "Not found"});

            var currentUser = await _datacontext.Users.SingleOrDefaultAsync(x => x.UserName == _userAccessor.GetCurrentUsername());

            var profile = new Profile
            {
                DisplayName = user.DisplayName,
                Username = user.UserName,
                Image = user.Photos.FirstOrDefault(x => x.IsMain)?.Url,
                Photos = user.Photos,
                Bio = user.Bio,
                FollowersCount = user.Followers.Count(),
                FollowingCount = user.Followings.Count()
            };
            if (currentUser.Followings.Any(x => x.TargetId == user.Id))
                profile.IsFollowed =true;

                return profile;
        }
    }
}