export default {
    jwt: {
        secret: process.env.JWT_SECRET || "default-secret-change-this-in-production",
        expiresIn: "7d"
    }
};
