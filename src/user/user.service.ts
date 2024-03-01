// user.service.ts
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  async getUserProfile(): Promise<any> {
    // Logique pour récupérer le profil utilisateur
    return {
      id: 1,
      username: 'exampleUser',
      // Autres détails de l'utilisateur
    };
  }
}
