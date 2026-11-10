const bcrypt = require('bcrypt');

async function test() {
    try {
        console.log("Before hashing");

        const password = "32423424";

        const hashedPassword = await bcrypt.hash(password, 10);

        console.log("After hashing:", hashedPassword);
    } catch (error) {
        console.log("BCRYPT ERROR:", error);
    }
}

test();