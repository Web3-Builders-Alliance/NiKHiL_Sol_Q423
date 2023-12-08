use anchor_lang::prelude::*;

declare_id!("9QtNXFDTA12LYCfu6XgYvqrdwb4wiUS2Fa5s7Asc4JxM");

pub mod context;
pub use context::*;

pub mod state;
use state::*;

#[program]
pub mod anchor_escrow {

    use super::*;

    pub fn make(ctx: Context<Make>, seed: u64, deposit: u64, receive: u64) -> Result<()> {
        ctx.accounts.deposit(deposit)?;
        ctx.accounts.save_escrow(seed, receive, &ctx.bumps)
    }

    pub fn refund(ctx: Context<Refund>) -> Result<()> {
        ctx.accounts.refund()?;
        ctx.accounts.close_vault()
    }

    pub fn take(ctx: Context<Take>) -> Result<()> {
        ctx.accounts.deposit()?;
        ctx.accounts.withdraw()?;
        ctx.accounts.close_vault()
    }
}
