import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';

import { GroupStatus } from './group-status.enum';
import { GroupRepository } from './group.repository';
import { GroupService } from './group.service';
import { MembershipRepository } from '../membership/membership.repository';
import { PizzaRepository } from '../pizza/pizza.repository';
import { User } from '../user/user.entity';

const mockGroupRepository = () => ({
  getGroups: jest.fn(),
  getGroupById: jest.fn(),
  findOne: jest.fn(),
});

const mockMembershipRepository = () => ({
  getMemberships: jest.fn(),
});

const mockPizzaRepository = () => ({
  getPizzas: jest.fn(),
});

const mockUser = {
  id: 1,
  username: 'TestUser',
  name: 'Test User',
  description: 'Test Description',
  avatarUrl: 'Test Avatar URL',
  allergies: ['Test Allergy'],
  memberships: [],
  auth: null,
};

describe('GroupService', () => {
  let groupService;
  let groupRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        GroupService,
        { provide: GroupRepository, useFactory: mockGroupRepository },
        { provide: MembershipRepository, useFactory: mockMembershipRepository },
        { provide: PizzaRepository, useFactory: mockPizzaRepository },
      ],
    }).compile();

    groupService = module.get(GroupService);
    groupRepository = module.get(GroupRepository);
  });

  describe('getGroups', () => {
    it('gets all groups from the repository', async () => {
      groupRepository.getGroups.mockResolvedValue('someValue');
      const result = await groupService.getGroups({}, mockUser as User);
      expect(result).toEqual('someValue');
    });
  });

  describe('getGroupById', () => {
    it('calls groupRepository.getGroupById and returns the result', async () => {
      const mockGroup = {
        id: 1,
        name: 'TestGroup',
        description: 'Test Description',
        dueDate: new Date(),
        createdAt: new Date(),
        memberships: null,
        status: GroupStatus.OPEN,
        backgroundUrl: 'Test Background URL',
        pizzas: null,
        isAdmin: jest.fn(),
      };
      groupRepository.getGroupById.mockResolvedValue(mockGroup);
      const result = await groupService.getGroupById(1, mockUser as User);
      expect(result).toEqual(mockGroup);
    });
    it('calls groupRepository.getGroupById and handles an error', async () => {
      groupRepository.findOne.mockResolvedValue(null);
      await expect(
        groupService.getGroupById(1, mockUser as User),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
