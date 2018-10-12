class TransactionRepository {
    constructor(databaseController) {
        this.databaseController = databaseController;
    }

    async createTransaction(transaction) {
        const query = "INSERT INTO transactions (amount, purpose, state, userId) VALUES (?, ?, ?, ?)";
        const params = [transaction.amount, transaction.purpose, transaction.state, transaction.userId];

        return await this.databaseController.query(query, params);
    }
}