use aes_gcm::{
    Aes256Gcm,
    Nonce,
    aead::{Aead, KeyInit},
};

pub fn decrypt_data(ciphertext: &[u8], key: &[u8; 32], nonce_bytes: &[u8; 12]) -> Result<Vec<u8>, String> {
    let cipher = Aes256Gcm::new_from_slice(key)
        .map_err(|_| "Invalid encryption key".to_string())?;

    let nonce = Nonce::from_slice(nonce_bytes);

    let plaintext = cipher
        .decrypt(nonce, ciphertext)
        .map_err(|_| "Decryption failed".to_string())?;

    Ok(plaintext)
}