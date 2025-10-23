import { getConnection as getTypeORMConnection, Repository, EntityTarget } from "typeorm";

/**
 * Helper para obter repositório da conexão correta
 *
 * @param entity - A entidade do TypeORM
 * @param connectionName - Nome da conexão (vagas, noticias, common)
 * @returns Repository da entidade
 */
export function getConnectionRepository<Entity>(
    entity: EntityTarget<Entity>,
    connectionName: "vagas" | "noticias" | "common" = "vagas"
): Repository<Entity> {
    try {
        const connection = getTypeORMConnection(connectionName);
        return connection.getRepository(entity);
    } catch (error) {
        console.error(`Erro ao obter repositório para conexão '${connectionName}':`, error);
        throw new Error(
            `Não foi possível obter o repositório. Conexão '${connectionName}' não encontrada.`
        );
    }
}
