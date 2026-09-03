use rand::{
    RngCore
};

pub fn generate_nonce() -> [u8; 12] {
    // Create a empty array of 12 bytes for the nonce
    let mut nonce_bytes = [0u8; 12];

    // Generate and fill the nonce with random bytes
    rand::thread_rng().fill_bytes(&mut nonce_bytes);

    // Return nonce bytes
    nonce_bytes
}