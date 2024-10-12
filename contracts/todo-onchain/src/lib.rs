use anchor_lang::prelude::*;

pub mod constants;
pub mod errors;
pub mod states;
use crate::{constants::*, errors::*, states::*};

declare_id!("3frmuBcq8XhKsPCLYNr9cUoSr83y8kdj91bMptsDSaVp");

#[program]
pub mod todo_onchain {
    use super::*;

    pub fn initialize_user(ctx: Context<InitializeUser>) -> Result<()> {
        // Initialize User with the default data
        let user_profile = &mut ctx.accounts.user_profile;
        user_profile.authority = ctx.accounts.authority.key();
        user_profile.todo_count = 0;
        user_profile.last_todo = 0;

        Ok(())
    }

    pub fn add_todo(
     ctx: Context<AddTodo>,
     _content: String
    ) -> Result<()> {
        // Add a new todo item for a user profile within the blockchain
        let todo_account = &mut ctx.accounts.todo_account;
        let user_profile = &mut ctx.accounts.user_profile;
        
        // Fill the todo with the given data
        todo_account.authority = ctx.accounts.authority.key();
        todo_account.content = _content;
        todo_account.idx = user_profile.last_todo;
        todo_account.marked = false;

        Ok(())
    }

    pub fn mark_todo {
        
    }

    // Continue: https://youtu.be/3_zoGgffxac?si=IirVvfWJgFrkoZhD&t=6217
    // https://beta.solpg.io/
    // Add values for the default data

    // Add TODO
    // Mark TODO completed/uncompleted
    // Delete TODO
    // [plus] Pin TODO
    // [plus] Add memo to TODO
}

#[derive(Accounts)]
#[instruction()]
pub struct InitializeUser<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,

    #[account(
        init,
        seeds = [USER_TAG, authority.key().as_ref()],
        bump,
        payer = authority,
        space = 8 + std::mem::size_of::<UserProfile>()
    )]
    pub user_profile: Box<Account<'info, UserProfile>>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction()]
pub struct AddTodo<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,

    #[account(
        mut,
        seeds = [USER_TAG, authority.key().as_ref()],
        bump,
        has_one = authority
    )]
    pub user_profile: Box<Account<'info, UserProfile>>,

    #[account(
        init,
        seeds = [TODO_TAG, authority.key().as_ref(), &[user_profile.last_todo as u8].as_ref()],
        bump,
        payer = authority
        space = 8 + std::mem::size_of::<TodoAccount>()
    )]
    pub todo_account: Box<Account<'info, TodoAccount>>,

    pub system_program: Program<'info, System>
}