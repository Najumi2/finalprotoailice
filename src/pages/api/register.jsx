// api/register.js
import { MongoClient } from 'mongodb';

export default async function handler(req, res) {
  const { username, email, password } = req.body;
  const uri = process.env.MONGODB_URI;
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

  try {
    await client.connect();

    const database = client.db('accounts');
    const collection = database.collection('users');

    // Check if the username or email already exists in the database
    const existingUser = await collection.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ error: 'Email or username already exists' });
    }

    // Insert the new user into the database
    const result = await collection.insertOne({
      username,
      email,
      password,
    });

    console.log('User registered successfully');
    console.log('Inserted user ID:', result.insertedId);
    console.log({ message: 'User registered successfully', userId: result.insertedId });
    res.status(201).json({ message: 'User registered successfully', userId: result.insertedId });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    await client.close();
  }
}



























