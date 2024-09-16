import { Connection, RpcResponseAndContext, SignatureResult } from "@solana/web3.js";

/**
 * Confirms a Solana transaction by its signature.
 * @param connection - The Solana connection object.
 * @param tx - The transaction signature to confirm.
 * @returns A promise that resolves to the confirmation result.
 * @throws Will throw an error if the transaction confirmation fails.
 */
export const confirmTransaction = async (
  connection: Connection,
  tx: string,
): Promise<RpcResponseAndContext<SignatureResult>> => {
  try {
    // Fetch the latest blockhash and its valid height
    const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();

    // Confirm the transaction
    return await connection.confirmTransaction(
      {
        signature: tx,
        blockhash,
        lastValidBlockHeight,
      },
      "confirmed", // You can use "finalized" for a more robust confirmation
    );
  } catch (error) {
    console.error("Error confirming transaction:", error);
    throw new Error("Transaction confirmation failed");
  }
};

/**
 * Computes the step size based on the number of decimal places.
 * @param decimals - The number of decimal places.
 * @returns The computed step size.
 */
export const getStep = (decimals: number): number => {
  if (decimals < 0) {
    throw new Error("Decimals must be a non-negative number.");
  }

  // Compute the step size
  const step = Math.pow(10, -decimals);

  // Round to the correct precision
  return parseFloat(step.toFixed(decimals));
};
