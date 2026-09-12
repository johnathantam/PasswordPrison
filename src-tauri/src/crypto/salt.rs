use rand::{
    RngCore
};

pub fn generate_salt() -> [u8; 16] {
    // Generate 16 bytes initialized with zero
    let mut salt = [0u8; 16];

    // Fill in with random 16 bytes
    rand::rng().fill_bytes(&mut salt);

    salt
}