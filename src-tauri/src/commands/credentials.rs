use rand::{
    prelude::IteratorRandom,
    prelude::IndexedRandom,
    Rng,
};

#[tauri::command]
pub fn generate_username() -> Result<String, String> {
    const ADJECTIVES: &[&str] = &[
        "quiet",
        "swift",
        "silent",
        "bright",
        "blue",
        "silver",
    ];

    const NOUNS: &[&str] = &[
        "fox",
        "tiger",
        "raven",
        "wolf",
        "eagle",
        "bear",
    ];

    let mut rng = rand::rng();

    let adjective = ADJECTIVES
        .choose(&mut rng)
        .ok_or_else(|| "No adjectives available".to_string())?;

    let noun = NOUNS
        .choose(&mut rng)
        .ok_or_else(|| "No nouns available".to_string())?;

    let number = rng.random_range(0..1000);

    Ok(format!("{}_{}_{:03}", adjective, noun, number))
}

#[tauri::command]
pub fn generate_password(length: usize, uppercase: bool, lowercase: bool, numbers: bool, symbols: bool) -> Result<String, String> {
    let mut character_set = String::new();

    if uppercase {
        character_set.push_str("ABCDEFGHIJKLMNOPQRSTUVWXYZ");
    }

    if lowercase {
        character_set.push_str("abcdefghijklmnopqrstuvwxyz");
    }

    if numbers {
        character_set.push_str("0123456789");
    }

    if symbols {
        character_set.push_str("!@#$%^&*()-_=+[]{};:,.?/");
    }

    if character_set.is_empty() {
        return Err("At least one character type must be selected".to_string());
    }

    if length == 0 {
        return Err("Password length must be greater than zero".to_string());
    }

    let mut rng = rand::rng();
    let password: String = (0..length)
        .map(|_| {
            character_set
                .chars()
                .choose(&mut rng)
                .unwrap()
        })
        .collect();

    Ok(password)
}

#[tauri::command]
pub fn generate_pin(length: usize) -> Result<String, String> {
    if length == 0 {
        return Err("PIN length must be greater than 0".to_string());
    }

    let mut rng = rand::rng();

    let pin: String = (0..length)
        .map(|_| rng.random_range(b'0'..=b'9') as char)
        .collect();

    Ok(pin)
}

