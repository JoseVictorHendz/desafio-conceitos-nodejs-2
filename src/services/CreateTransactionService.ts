import TransactionsRepository from '../repositories/TransactionsRepository';
import Transaction from '../models/Transaction';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
}

class CreateTransactionService {
  private transactionsRepository: TransactionsRepository;

  constructor(transactionsRepository: TransactionsRepository) {
    this.transactionsRepository = transactionsRepository;
  }

  public execute({ title, value, type }: Request): Transaction {
    const newTransaction = this.transactionsRepository.create({
      title,
      value,
      type,
    });

    if (
      newTransaction.type === 'outcome' &&
      this.transactionsRepository.getBalance().total - newTransaction.value < 0
    ) {
      throw Error(
        'should not be able to create outcome transaction without a valid balance',
      );
    }

    return newTransaction;
  }
}

export default CreateTransactionService;
