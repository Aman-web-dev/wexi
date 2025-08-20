import jwt from 'jsonwebtoken'
import User from '../models/userModel.js'

const signToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

export const signup = async (req, res) => {
  try {
    const { name,email,password,role } = req.body;
console.log(req.body)
    console.log("Got signup request",email,password,name,role)


    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        status: 'fail',
        message: 'User already exists with this email'
      });
    }

    const newUser = await User.create({
      email,
      password,
      name,
      role
    });

    const token = signToken(newUser._id);

    res.status(200).json({
      status: 'success',
      token,
      data: {
        user: {
          id: newUser._id,
          email: newUser.email,
          role:newUser.role,
        }
      }
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;


    if (!email || !password) {
      return res.status(400).json({
        status: 'fail',
        message: 'Please provide email and password'
      });
    }

   
    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.correctPassword(password, user.password))) {
      return res.status(401).json({
        status: 'fail',
        message: 'Incorrect email or password'
      });
    }

    const token = signToken(user._id);

    res.status(200).json({
      status: 'success',
      token,
      data: {
        user: {
          id: user._id,
          email: user.email,
          name:user.name,
          role:user.role
        }
      }
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message
    });
  }
};