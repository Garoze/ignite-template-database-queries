import { getRepository, Repository } from 'typeorm';

import { User } from '../../../users/entities/User';
import { Game } from '../../entities/Game';

import { IGamesRepository } from '../IGamesRepository';

export class GamesRepository implements IGamesRepository {
  private repository: Repository<Game>;

  constructor() {
    this.repository = getRepository(Game);
  }

  async findByTitleContaining(param: string): Promise<Game[]> {
    return this.repository
      .createQueryBuilder()
      .select('game')
      .from(Game, 'game')
      .where("game.title ILIKE :title", { title: `%${param}%` })
      .getMany(); // Complete usando query builder
  }

  async countAllGames(): Promise<[{ count: string }]> {
    return this.repository.query(`
      SELECT COUNT(*) FROM games;`
    ); // Complete usando raw query
  }

  async findUsersByGameId(id: string): Promise<User[]> {
    return this.repository
      .createQueryBuilder()
      .select('game')
      .from(Game, 'game')
      .innerJoinAndSelect("game.users", "users")
      .where("game.id = :id", { id })
      .getOne()
      .then((game) => game?.users ?? []);
    //Complete usando query builder
  }
}
