use anchor_lang::prelude::*;

#[account]
#[derive(Default)]
/// The `UserProfile` struct represents a user's profile on the dApp.
/// It stores essential information related to the user's authority and their
/// interactions with the to-do list functionality.
pub struct UserProfile {
    /// The public key (`Pubkey`) of the account's authority,
    /// which represents the wallet or user controlling this profile.
    /// This is typically the owner of the Solana account that created
    /// this profile and has the permission to modify it.
    pub authority: Pubkey,

    /// The index (`u8`) of the last to-do item created by this user.
    /// It acts as a pointer to the most recently added to-do item
    /// and helps with tracking sequential task creation.
    /// This value can be updated whenever a new to-do is added.
    pub last_todo: u8,

    /// The total number (`u8`) of to-do items created by the user.
    /// This counter tracks how many tasks the user has created overall.
    /// It is incremented each time a new to-do item is added,
    /// providing a summary of the user's activity on the to-do list.
    pub todo_count: u8,
}

#[account]
#[derive(Default)]
/// The `TodoAccount` struct represents an individual to-do item for a user.
/// It contains metadata about the to-do item, including content,
/// its index, and whether it has been marked as completed.
pub struct TodoAccount {
    /// The public key (`Pubkey`) of the account's authority,
    /// representing the wallet or user who owns this to-do item.
    /// This ensures that only the user who created the to-do item
    /// can update or modify it.
    pub authority: Pubkey,

    /// The index (`u8`) of the to-do item in relation to other items
    /// created by the same user. This helps uniquely identify the to-do
    /// within the user's profile and provides an ordered list of tasks.
    pub idx: u8,

    /// A string that holds the content of the to-do item.
    /// This is the main task description or detail that the user
    /// wants to track in their to-do list.
    /// Example: "Buy groceries" or "Complete project."
    pub content: String,

    /// A boolean (`bool`) flag indicating whether the to-do item
    /// has been marked as completed.
    /// - `true`: The task is marked as complete.
    /// - `false`: The task is still pending or in progress.
    pub marked: bool,
}
