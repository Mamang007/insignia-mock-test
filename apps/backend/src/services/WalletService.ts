import { walletRepository } from '../repositories/WalletRepository';
import { userRepository } from '../repositories/UserRepository';
import { TopupInput, TransferInput } from 'shared';

export const walletService = {
  getBalance: async (userId: string, role: string) => {
    if (role === 'ADMIN') {
      const users = await walletRepository.getAllBalances();
      return users.map(u => ({ id: u.id, username: u.username, balance: u.balance, role: u.role }));
    }
    const user = await walletRepository.getUserBalance(userId);
    return { balance: user?.balance };
  },

  topup: async (userId: string, input: TopupInput) => {
    await walletRepository.topup(userId, input.amount);
  },

  transfer: async (senderId: string, input: TransferInput) => {
    const receiver = await userRepository.findByUsername(input.toUsername);
    if (!receiver) {
      const error: any = new Error('Destination user not found');
      error.status = 404;
      throw error;
    }

    if (receiver.id === senderId) {
      throw new Error('Cannot transfer to yourself');
    }

    const sender = await userRepository.findById(senderId);
    if (!sender || sender.balance.toNumber() < input.amount) {
      throw new Error('Insufficient balance');
    }

    await walletRepository.transfer(senderId, receiver.id, input.amount);
  },

  getTransactions: async (userId: string, role: string) => {
    if (role === 'ADMIN') {
      return walletRepository.getAllTransactions();
    }
    return walletRepository.getTransactionsByUserId(userId);
  },

  checkUser: async (username: string, currentUserId: string) => {
    const user = await userRepository.findByUsername(username);
    if (!user) {
      const error: any = new Error('User not found');
      error.status = 404;
      throw error;
    }

    if (user.id === currentUserId) {
      const error: any = new Error('Cannot search for yourself');
      error.status = 400;
      throw error;
    }

    if (user.role === 'ADMIN') {
      const error: any = new Error("Can't validate admin");
      error.status = 400;
      throw error;
    }

    return {
      exists: true,
      username: user.username,
    };
  }
};
