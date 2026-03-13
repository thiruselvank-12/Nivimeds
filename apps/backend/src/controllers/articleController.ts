import { Request, Response } from 'express';
import Article from '../models/Article';

// Public endpoint
export const getPublishedArticles = async (req: Request, res: Response) => {
  try {
    const articles = await Article.find({ status: 'published' }).sort({ publishedAt: -1 });
    res.json(articles);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Public endpoint
export const getArticleBySlug = async (req: Request, res: Response) => {
  try {
    const article = await Article.findOne({ slug: req.params.slug, status: 'published' });
    if (!article) return res.status(404).json({ message: 'Article not found' });
    res.json(article);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Admin endpoint 
export const getAllArticles = async (req: Request, res: Response) => {
  try {
    const articles = await Article.find().sort({ createdAt: -1 });
    res.json(articles);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const createArticle = async (req: Request, res: Response) => {
  try {
    const article = new Article(req.body);
    if (article.status === 'published' && !article.publishedAt) {
      article.publishedAt = new Date();
    }
    await article.save();
    res.status(201).json(article);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateArticle = async (req: Request, res: Response) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) return res.status(404).json({ message: 'Article not found' });

    Object.assign(article, req.body);
    
    // Auto-set published date if changing from draft -> published
    if (req.body.status === 'published' && !article.publishedAt) {
      article.publishedAt = new Date();
    }

    await article.save();
    res.json(article);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteArticle = async (req: Request, res: Response) => {
  try {
    const article = await Article.findByIdAndDelete(req.params.id);
    if (!article) return res.status(404).json({ message: 'Article not found' });
    res.json({ message: 'Article deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
