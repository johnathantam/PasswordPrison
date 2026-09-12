use aes_gcm::{
    Aes256Gcm,
    Nonce,
    aead::{Aead, KeyInit},
};

pub fn encrypt_data(plaintext: &[u8], key: &[u8; 32], nonce_bytes: &[u8; 12]) -> Result<Vec<u8>, String> {
    // Create a new AES-GCM cipher instance with the provided key
    let cipher = Aes256Gcm::new_from_slice(key)
        .map_err(|_| "Invalid encryption key".to_string())?;

    // Generaete nonce from nonce_bytes
    let nonce = Nonce::from_slice(nonce_bytes);

    // Now encrypt the plaintext 
    let ciphertext = cipher
        .encrypt(nonce, plaintext)
        .map_err(|_| "Encryption failed".to_string())?;

    Ok(ciphertext)
}