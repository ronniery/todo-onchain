use anchor_lang::prelude::*;

pub mod constants;
pub mod errors;
pub mod states;
use crate::{constants::*, errors::*, states::*};

declare_id!("3frmuBcq8XhKsPCLYNr9cUoSr83y8kdj91bMptsDSaVp");

#[program]
pub mod todo_onchain {
    use super::*;

    pub fn intialize_user(
        ctx: Context<IntializeUser>
    ) -> Result<()> {
        let user_profile = &mut ctx.accounts.user_profile;
        user_profile.authority = ctx.accounts.authority.key();
        user_profile.todo_count = 0;
        user_profile.last_todo = 0;

        Ok(())
    }
    // Initialize User
        // Add a USER_PRofile to the blockchain
        // Add values for the default data 

    // Add TODO
    // Mark TODO completed/uncompleted
    // Delete TODO
    // [plus] Pin TODO
    // [plus] Add memo to TODO
}

#[derive(Accounts)]
#[instruction()]
pub struct IntializeUser<'info> {
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

    pub system_program: Program<'info, System>
}