// const app = require("../app");
const db = require("../db");


describe("test db connection", () => {
    test("should establish successful connection", async () => {
        expect(async () => {
            const client = await db.connect();
            client.release();
        }).not.toThrow();
    });
});

afterAll(() => {
    db.end();
});