import { walletRepository } from '../repositories/WalletRepository';
import { userRepository } from '../repositories/UserRepository';
import { TopupInput, TransferInput } from '../../../../modules/shared';

export const walletService = {
  getBalance: async (userId: string, role: string) => {
    if (role === 'ADMIN') {
      return walletRepository.getAllBalances();
    }
    return walletRepository.getUserBalance(userId);
  },

  topup: async (userId: string, input: TopupInput) => {
    return walletRepository.topup(userId, input.amount);
  },

  transfer: async (senderId: string, input: TransferInput) => {
    const receiver = await userRepository.findByUsername(input.toUsername);
    if (!receiver) {
      throw new Error('Recipient not found');
    }

    if (receiver.id === senderId) {
      throw new Error('Cannot transfer to yourself');
    }

    const sender = await userRepository.findById(senderId);
    if (!sender || sender.balance.toNumber() < input.amount) {
      throw new Error('Insufficient balance');
    }

    return walletRepository.transfer(senderId, receiver.id, input.amount);
  },

  getTransactions: async (userId: string, role: string) => {
    if (role === 'ADMIN') {
      return walletRepository.getAllTransactions();
    }
    return walletRepository.getTransactionsByUserId(userId);
  }
};
