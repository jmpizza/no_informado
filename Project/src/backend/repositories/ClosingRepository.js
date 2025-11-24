export default class MovementRepository {
  constructor(prismaClient) {
    this.db = prismaClient;
  }
  
}