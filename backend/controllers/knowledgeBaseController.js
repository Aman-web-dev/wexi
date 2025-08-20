import mongoose from "mongoose";
import knowledgeBase from "../models/knowledgeBase";


export const getAllKnowledgeBase = async (req, res) => {
  try {
    const kbs = await knowledgeBase.find({creatorAdminId:req.user._id});
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
    const kb = await knowledgeBase.findById(id);
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
    const kb = await knowledgeBase.findByIdAndDelete(id);
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
    const { title, body, tags } = req.body;

    if (!title || !body || !tags.length > 0 || !req.user || !req.user._id) {
      return res.status(400).json({
        status: 'fail',
        message: 'Title, content, tags and adminId are required'
      });
    }

    const newKnowledgeBase = new knowledgeBase({
      title,
      body,
      tags,
      creatorAdminId: req.user._id
    });

    await newKnowledgeBase.save();

    res.status(201).json({
      status: 'success',
      data: {
        knowledgeBase: newKnowledgeBase
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
    const { knowledgeBaseId, title, body, tags } = req.body;

    if (!title || !body || !tags.length > 0 || !req.user || !req.user._id || !knowledgeBaseId) {
      return res.status(400).json({
        status: 'fail',
        message: 'Title, content, tags and adminId are required'
      });
    }

    const existingKnowledgeBase = await knowledgeBase.findById({_id:knowledgeBaseId, creatorAdminId: req.user._id });


    if (!existingKnowledgeBase) {
      return  res.status(400).json({
        status:'notfound',
        message:'knowledgeBase does not exist Please check knowledgeBaseID'
      })
     }

    const updatedKnowledgeBase = await knowledgeBase.findOneAndUpdate(
      { _id: knowledgeBaseId, creatorAdminId: req.user._id },
      { title, body, tags },
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
      knowledgeBase: updatedKnowledgeBase
      }
    });

    res.status(201).json({
      status: 'success',
      data: {
        knowledgeBase: newKnowledgeBase
      }
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message
    });
  }
}



