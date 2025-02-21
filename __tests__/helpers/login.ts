import type supertest from 'supertest';

export const login = async (supertest: supertest.Agent): Promise<string> => {
  const response = await supertest.post('/api/sessions').send({
    email: 'test@example.com', 
    password: 'password123',
  });

  if (response.statusCode !== 200) {
    throw new Error(response.body.message || 'Unknown error occurred');
  }

  return `Bearer ${response.body.token}`;
};

export const loginAdmin = async (supertest: supertest.Agent): Promise<string> => {
  const response = await supertest.post('/api/sessions').send({
    email: 'admin@example.com', 
    password: 'password123',
  });

  if (response.statusCode !== 200) {
    throw new Error(response.body.message || 'Unknown error occurred');
  }

  return `Bearer ${response.body.token}`;
};
