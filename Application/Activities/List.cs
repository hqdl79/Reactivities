using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;
namespace Application.Activities
{
    public class List
    {
        public class Query : IRequest<List<ActivityDto>> { }
        public class Handler : IRequestHandler<Query, List<ActivityDto>>
        {
            private readonly Datacontext _context;
            private readonly IMapper _mapper;
            public Handler(Datacontext context, IMapper mapper)
            {
                _mapper = mapper;
                _context = context;
            }
            public async Task<List<ActivityDto>> Handle(Query request,
                CancellationToken cancellationToken)
            {
                var activities = await _context.Activities
                     .ToListAsync();
                return _mapper.Map<List<Activity>,List<ActivityDto>>(activities);
            }
        }

    }
}