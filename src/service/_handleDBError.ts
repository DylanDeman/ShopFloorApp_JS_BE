import ServiceError from '../core/serviceError';

const handleDBError = (error: any) => {
  console.error('Database error occurred:', error); // Log full error details

  const { code = '', message } = error;

  if (code === 'P2002') {
    console.error('Unique constraint violation:', message);
    switch (true) {
      case message.includes('idx_place_name_unique'):
        throw ServiceError.validationFailed(
          'A place with this name already exists',
        );
      case message.includes('idx_user_email_unique'):
        throw ServiceError.validationFailed(
          'There is already a user with this email address',
        );
      default:
        throw ServiceError.validationFailed('This item already exists');
    }
  }

  if (code === 'P2025') {
    console.error('Record not found:', message);
    switch (true) {
      case message.includes('fk_transaction_user'):
        throw ServiceError.notFound('This user does not exist');
      case message.includes('fk_transaction_place'):
        throw ServiceError.notFound('This place does not exist');
      case message.includes('transaction'):
        throw ServiceError.notFound('No transaction with this ID exists');
      case message.includes('place'):
        throw ServiceError.notFound('No place with this ID exists');
      case message.includes('user'):
        throw ServiceError.notFound('No user with this ID exists');
    }
  }

  if (code === 'P2003') {
    console.error('Foreign key constraint violation:', message);
    switch (true) {
      case message.includes('place_id'):
        throw ServiceError.conflict('This place is still linked to transactions');
      case message.includes('user_id'):
        throw ServiceError.conflict('This user is still linked to transactions');
    }
  }

  console.error('Unhandled database error:', error); // Log any unknown errors
  throw error; // Rethrow unknown errors for debugging
};

export default handleDBError;
