import mongoose from "mongoose";
import KnowledgeBase from "../models/knowledgeBase.js";


export const getAllKnowledgeBase = async (req, res) => {
  try {
    const kbs = await KnowledgeBase.find();
    res.status(200).json({
      status: 'success',
      data: kbs
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message
    });
  }
};



export const getKnowledgeBaseById = async (req, res) => {
  try {
    const { id } = req.params;
    const kb = await KnowledgeBase.findById(id);
    if (!kb) {
      return res.status(404).json({
        status: 'fail',
        message: 'KnowledgeBase not found'
      });
    }
    res.status(200).json({
      status: 'success',
      data: kb
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message
    });
  }
};


export const deleteKnowledgeBase = async (req, res) => {
  try {
    const { id } = req.params;
    const kb = await KnowledgeBase.findByIdAndDelete(id);
    if (!kb) {
      return res.status(404).json({
        status: 'fail',
        message: 'KnowledgeBase not found'
      });
    }
    res.status(200).json({
      status: 'success',
      message: 'KnowledgeBase deleted successfully'
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message
    });
  }
};


export const createKnowledgeBase = async (req, res) => {
  try {
    const { title, body, tags,status } = req.body;
console.log(title, body, tags )
    if (!title || !body || !tags.length > 0 ) {
      return res.status(400).json({
        status: 'fail',
        message: 'Title, body, tags and adminId are required'
      });
    }

    const newKnowledgeBase = new KnowledgeBase({
      title,
      body,
      tags,
      status
    });

    await newKnowledgeBase.save();

    res.status(201).json({
      status: 'success',
      data: {
        KnowledgeBase: newKnowledgeBase
      }
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message
    });
  }
}



export const updateKnowledgeBase = async (req, res) => {
  try {
    const { id: knowledgeBaseId } = req.params;
    const {  title, body, tags ,status } = req.body;

    if (!title || !body || !tags.length > 0 || !req.user) {
      return res.status(400).json({
        status: 'fail',
        message: 'Title, content, tags and adminId are required'
      });
    }

    const existingKnowledgeBase = await KnowledgeBase.findById({_id:knowledgeBaseId});


    if (!existingKnowledgeBase) {
      return  res.status(400).json({
        status:'notfound',
        message:'KnowledgeBase does not exist Please check knowledgeBaseID'
      })
     }

    const updatedKnowledgeBase = await KnowledgeBase.findOneAndUpdate(
      { _id: knowledgeBaseId },
      { title, body, tags ,status},
      { new: true }
    );

    if (!updatedKnowledgeBase) {
      return res.status(404).json({
      status: 'fail',
      message: 'KnowledgeBase not found or not authorized'
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
      KnowledgeBase: updatedKnowledgeBase
      }
    });

    res.status(201).json({
      status: 'success',
      data: {
        KnowledgeBase: newKnowledgeBase
      }
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message
    });
  }
}



