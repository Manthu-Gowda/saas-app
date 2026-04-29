import express from 'express';
import multer from 'multer';
import pdfParse from 'pdf-parse';
import { getToolsByIndustry, runTool, getToolBySlug } from '../controllers/toolController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get('/GetTools', protect, getToolsByIndustry);
router.get('/:slug', protect, getToolBySlug);
router.post('/RunTool', protect, runTool);

router.post('/ExtractPdf', protect, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    
    // Parse the PDF buffer
    const data = await pdfParse(req.file.buffer);
    
    // Return extracted text
    res.json({ text: data.text });
  } catch (error) {
    res.status(500).json({ message: 'Failed to parse PDF', error: error.message });
  }
});

export default router;
