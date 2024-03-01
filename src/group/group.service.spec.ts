import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CreateGroupDto } from './dto/create-group.dto';
import { GroupRepository } from './group.repository';
import { GroupService } from './group.service';
import { AuthRepository } from '../auth/auth.repository';
import { typeOrmConfigTest } from '../config/typeorm.config';

describe('GroupService', () => {
  let groupService: GroupService;
  let groupRepository: GroupRepository;
  let userRepository: AuthRepository;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(typeOrmConfigTest),
        TypeOrmModule.forFeature([GroupRepository, AuthRepository]),
      ],
      providers: [GroupService],
    }).compile();

    groupService = module.get<GroupService>(GroupService);
    groupRepository = module.get<GroupRepository>(GroupRepository);
    userRepository = module.get<AuthRepository>(AuthRepository);
  });

  it('should be defined', () => {
    expect(groupService).toBeDefined();
  });

  it('should create a new group and save it to the database', async () => {
    // Données fictives pour le test
    const user = new user();
    user.id = 1;
    user.username = 'testuser';

    const createGroupDto: CreateGroupDto = {
      name: 'Test Group',
      description: 'This is a test group',
    };

    // Appel de la méthode createGroup
    const group = await groupService.createGroup(createGroupDto, user);

    // Récupérez le groupe depuis la base de données
    const groupFromDatabase = await groupRepository.findOne({
      where: { id: group.id },
    });

    // Vérification si le groupe a été sauvegardé dans la base de données
    expect(groupFromDatabase).toBeDefined();
    expect(groupFromDatabase.name).toBe(createGroupDto.name);
    expect(groupFromDatabase.description).toBe(createGroupDto.description);
    // Vérifiez d'autres propriétés du groupe si nécessaire
  });
});
