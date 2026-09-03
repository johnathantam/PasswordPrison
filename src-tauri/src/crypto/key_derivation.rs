use argon2::{
    Argon2
};

pub fn derive_key(master_key: &[u8], salt: &[u8]) -> Result<[u8; 32], String> {
    let argon2 = Argon2::default();

    let mut derived_key = [0u8; 32];

    argon2
        .hash_password_into(master_key, salt, &mut derived_key)
        .map_err(|_| "Key derivation failed".to_string())?;

    Ok(derived_key) 
}