import bcrypt from "bcrypt"

async function generateAndTest() {
    const password = 'User123!123';
    const saltRounds = 10;

    // Generate a hash
    const hash = await bcrypt.hash(password, saltRounds);
    console.log('Generated hash:', hash);

    // Test the hash immediately
    const isMatch = await bcrypt.compare(password, hash);
    console.log('Immediate test match:', isMatch);

    // Test against your existing hash
    const oldHash = '$2b$10$AwN8b8TfQoWDIV05.2YmUek/xQhZaTmXbGSsobHVak3DhOmad/Maa';
    const oldMatch = await bcrypt.compare(password, oldHash);
    console.log('Old hash test match:', oldMatch);
}

generateAndTest();