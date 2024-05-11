import { MongoClient } from 'mongodb';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  const { email, password } = req.body;

  console.log('Received login request with email:', email);

  // Check if JWT_SECRET is defined
  if (!process.env.JWT_SECRET) {
    console.error('JWT_SECRET is not defined');
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }

  // Connect to MongoDB Atlas
  const client = new MongoClient(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  try {
    console.log('Connecting to MongoDB...');
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db('accounts');
    const collection = db.collection('users');

    // Check if user exists with the provided email
    console.log('Checking for user with email:', email);
    const user = await collection.findOne({ email });

    console.log('Received password:', password);

    if (user && user.password === password) {
      // Generate a JWT token with email and username payload
      const tokenPayload = { email: user.email, username: user.username };
      const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, { expiresIn: '1h' });

      // Send the token and redirect URL as a response
      console.log('User authenticated. Sending token.');
      return res.status(200).json({ success: true, token, redirectTo: '/chat' });
    } else {
      // User not found or password incorrect
      console.log('User not found or password incorrect.');
      return res.status(401).json({ success: false, message: 'Email or password incorrect' });
    }
  } catch (error) {
    console.error('Error logging in:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  } finally {
    // Close the MongoDB connection
    console.log('Closing MongoDB connection.');
    await client.close();
  }
}


