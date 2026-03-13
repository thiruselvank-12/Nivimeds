// Mock upload middleware until we set up Multer properly
import { Request, Response, NextFunction } from 'express';

const upload = {
  single: (fieldName: string) => {
    return (req: Request, res: Response, next: NextFunction) => {
      // For now, attach a mock file object so the controller doesn't fail
      req.file = {
        fieldname: fieldName,
        originalname: 'mock_prescription.png',
        encoding: '7bit',
        mimetype: 'image/png',
        size: 1024,
        destination: '/uploads/',
        filename: `mock_${Date.now()}.png`,
        path: `/uploads/mock_${Date.now()}.png`,
        buffer: Buffer.from('mock'),
        stream: null as any
      } as Express.Multer.File;
      next();
    };
  }
};

export default upload;
