export default class RoleRepository {
  constructor(prismaClient) {
    this.db = prismaClient;
  }

  async findById(id){
    return await this.db.rol.findUnique({
      where: { id }
    });
  }

  
}
