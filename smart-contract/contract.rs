#![no_std]
use soroban_sdk::{contract, contractimpl, Env, String, Symbol, symbol_short, Address, Map};

#[contract]
pub struct IPRegistry;

#[contractimpl]
impl IPRegistry {
    /// Stores the hash of an idea with its owner and timestamp.
    /// Key is the hash (String), Value is a Map containing owner and timestamp.
    pub fn store(env: Env, hash: String, owner: Address, timestamp: u64) {
        // Create a unique key for the hash
        let key = Symbol::new(&env, "HASH");
        
        // Define the data to store
        // In a real scenario, you might use a more complex data structure or a separate ledger entry per hash.
        // For simplicity, we use the storage function to persist the mapping.
        
        // Check if hash already exists to prevent overwriting
        if env.storage().persistent().has(&hash) {
            panic!("Idea hash already registered");
        }

        // Store: hash -> (owner, timestamp)
        // We use persistent storage because IP records should be permanent
        let mut data = Map::new(&env);
        data.set(symbol_short!("owner"), owner);
        data.set(symbol_short!("time"), timestamp);

        env.storage().persistent().set(&hash, &data);
        
        // Emit an event for tracking
        env.events().publish((symbol_short!("reg"), hash), owner);
    }

    /// Verifies if a hash exists and returns the owner and timestamp.
    pub fn verify(env: Env, hash: String) -> Option<Map<Symbol, soroban_sdk::Val>> {
        if env.storage().persistent().has(&hash) {
            Some(env.storage().persistent().get(&hash).unwrap())
        } else {
            None
        }
    }
}

mod test;
