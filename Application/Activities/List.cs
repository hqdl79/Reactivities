using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;
using System.Linq;
using System;
using Application.Interfaces;

namespace Application.Activities
{
    public class List
    {
        public class ActivitiesEnvelope
        {
            public List<ActivityDto> Activities { get; set; }
            public int ActivityCount { get; set; }
        }
        public class Query : IRequest<ActivitiesEnvelope>
        {
            public Query(int? limit, int? offset, bool isGoing, bool isHost, DateTime? startDate)
            {
                _limit = limit;
                _offset = offset;
                _isGoing = isGoing;
                _isHost = isHost;
                _startDate = startDate ?? DateTime.Now;

            }
            public int? _limit { get; set; }
            public int? _offset { get; set; }
            public bool _isGoing { get; set; }
            public bool _isHost { get; set; }
            public DateTime? _startDate { get; set; }
        }
        public class Handler : IRequestHandler<Query, ActivitiesEnvelope>
        {
            private readonly Datacontext _context;
            private readonly IMapper _mapper;
            private readonly IUserAccessor _userAccessor;
            public Handler(Datacontext context, IMapper mapper, IUserAccessor userAccessor)
            {
                _userAccessor = userAccessor;
                _mapper = mapper;
                _context = context;
            }
            public async Task<ActivitiesEnvelope> Handle(Query request,
                CancellationToken cancellationToken)
            {
                var queryable = _context.Activities
                .Where(x => x.Date >= request._startDate)
                .OrderBy(x => x.Date)
                .AsQueryable();

                if (request._isGoing && !request._isHost)
                {
                    queryable = queryable.Where(x => x.UserActivities.Any(a => a.AppUser.UserName == _userAccessor.GetCurrentUsername()));
                }

                if (request._isHost && !request._isGoing)
                {
                    queryable = queryable.Where(x => x.UserActivities.Any(a => a.AppUser.UserName == _userAccessor.GetCurrentUsername() && a.IsHost));
                }

                var activities = await queryable.Skip(request._offset ?? 0).Take(request._limit ?? 3)
                     .ToListAsync();
                return new ActivitiesEnvelope
                {
                    Activities = _mapper.Map<List<Activity>, List<ActivityDto>>(activities),
                    ActivityCount = queryable.Count()
                };
            }
        }

    }
}