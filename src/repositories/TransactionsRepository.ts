import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

interface CreateTransactionDTO {
  title: string;
  value: number;
  type: 'income' | 'outcome';
}

class TransactionsRepository {
  private transactions: Transaction[];

  constructor() {
    this.transactions = [];
  }

  public all(): Transaction[] {
    return this.transactions;
  }

  public getBalance(): Balance {
    const incomes = this.transactions
      .filter(transaction => transaction.type === 'income')
      .reduce((sum, { value }) => sum + value, 0);

    const outcomes = this.transactions
      .filter(transaction => transaction.type === 'outcome')
      .reduce((sum, { value }) => sum + value, 0);

    return {
      income: incomes,
      outcome: outcomes,
      total: incomes - outcomes,
    };
  }

  public create({ title, value, type }: CreateTransactionDTO): Transaction {
    const transaction = new Transaction({ title, value, type });

    if (transaction.type === 'outcome') {
      const { total } = this.getBalance();

      if (total < transaction.value) {
        throw Error('You can not make this transaction, insufficient balance');
      }
    }

    this.transactions.push(transaction);

    return transaction;
  }
}

export default TransactionsRepository;
