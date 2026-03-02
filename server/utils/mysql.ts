import mysql from 'mysql2/promise'

let pool: mysql.Pool | null = null

export function useMySQL() {
  const config = useRuntimeConfig()

  if (!pool) {
    pool = mysql.createPool({
      host: config.databaseHost as string,
      port: config.databasePort as number,
      user: config.databaseUser as string,
      password: config.databasePassword as string,
      database: config.databaseName as string,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    })
  }

  return pool
}

export async function closeMySQL() {
  if (pool) {
    await pool.end()
    pool = null
  }
}
