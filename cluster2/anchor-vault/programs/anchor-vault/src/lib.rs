use anchor_lang::prelude::*;

declare_id!("68HpPyLbmx7QNRN9ygMVWzKVb6MVUbqCPkFJJj56BHQ2");

#[program]
pub mod anchor_vault {
    use anchor_lang::system_program::{transfer, Transfer};

    use super::*;

    pub fn deposit(ctx: Context<Vault>, lamports: u64) -> Result<()> {
        let accounts = Transfer {
            from: ctx.accounts.signer.to_account_info(),
            to: ctx.accounts.vault.to_account_info(),
        };

        let cpi = CpiContext::new(ctx.accounts.system_program.to_account_info(), accounts);

        transfer(cpi, lamports)
    }

    pub fn withdraw(ctx: Context<Vault>, lamports: u64) -> Result<()> {
        let accounts = Transfer {
            from: ctx.accounts.vault.to_account_info(),
            to: ctx.accounts.signer.to_account_info(),
        };

        let signer_seeds: [&[&[u8]]; 1] = [&[
            b"vault",
            &ctx.accounts.signer.to_account_info().key.as_ref(),
            &[ctx.bumps.vault],
        ]];
        let cpi = CpiContext::new_with_signer(
            ctx.accounts.system_program.to_account_info(),
            accounts,
            &signer_seeds,
        );

        transfer(cpi, lamports)
    }

    pub fn close(ctx: Context<Vault>) -> Result<()> {
        let accounts: Transfer<'_> = Transfer {
            to: ctx.accounts.signer.to_account_info(),
            from: ctx.accounts.vault.to_account_info(),
        };

        let binding = ctx.accounts.signer.clone().key();
        let signer_seeds: [&[&[u8]]; 1] = [&[b"vault", &binding.as_ref(), &[ctx.bumps.vault]]];
        // let cpi_ctx =CpiContext::new_with_signer(program:ctx.accounts.system_program.to_account_info(), accounts);

        let cpi_ctx = CpiContext::new_with_signer(
            ctx.accounts.system_program.to_account_info(),
            accounts,
            &signer_seeds,
        );

        transfer(cpi_ctx, ctx.accounts.vault.lamports())
        // Ok(())
    }
}

#[derive(Accounts)]
pub struct Vault<'info> {
    #[account(mut)]
    signer: Signer<'info>,

    #[account(
        mut,
        seeds = [b"vault",signer.key().as_ref()],
        bump
    )]
    vault: SystemAccount<'info>,
    system_program: Program<'info, System>,
}
