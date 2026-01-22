import { createClient } from 'redis';
import { RedisClientType } from 'redis';

const redisClient: RedisClientType = createClient({
    url: 'redis://localhost:6379'
});

redisClient.on('error', (err) => console.error('Redis Client Error', err));

async function connectRedis() {
    await redisClient.connect();
}

async function setCache(key: string, value: string, expirationInSeconds: number) {
    await redisClient.set(key, value, {
        EX: expirationInSeconds,
    });
}

async function getCache(key: string) {
    return await redisClient.get(key);
}

export { connectRedis, setCache, getCache };
