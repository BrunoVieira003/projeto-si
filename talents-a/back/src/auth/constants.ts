export const jwtConstants = {
    secret: process.env.SECRET || 'secret',
    portabilitySecret: process.env.PORTABILITY_SECRET || 'portability_secret'
}