import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
    const { billId } = req.query;
    const filePath = path.join(process.cwd(), 'public', 'legal-notes', billId.toUpperCase(), 'legal-note.pdf');

    if (fs.existsSync(filePath)) {
        res.setHeader('Content-Type', 'application/pdf');
        fs.createReadStream(filePath).pipe(res);
    } else {
        res.status(404).json({ error: 'Legal note not found' });
    }
}